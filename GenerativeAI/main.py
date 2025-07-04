from dbconnection import DBconnection
from book import get_books_in_directory
from book import read_book
from book import display_books
from query import execute_query
from model import handle_translation_flow
from typing import Dict, Any
from sentence_transformers import SentenceTransformer
from scipy.spatial.distance import cosine
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

evaluate_model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

#calculate cosine similarity between LLM output and reference
def response_evaluation(llm_output, reference):
    #encode texts into embeddings
    embedding_output = evaluate_model.encode(llm_output)
    embedding_ref = evaluate_model.encode(reference)

    #calculate similarity (1 = identical, 0 = unrelated)
    similarity = 1 - cosine(embedding_output, embedding_ref)
    return similarity


#executes the program
async def main():
    """
    execute program
    """
    books_directory = r"C:\Users\ajibo\iwe\GenerativeAI\books"
    books = get_books_in_directory(books_directory)
    if books is None:
        logger.info("directory not found")
        return
    
    display_books(books)

    try:
        choice = int(input("\nEnter the number of the book you want to read: "))
        selected_book = books[choice - 1]
        logger.info(f"\nDisplaying contents of {selected_book.name}:\n")
        book_content = read_book(str(selected_book))
        logger.info(book_content)

    except (ValueError, IndexError):
        logger.info("invalid selection. please try again.")

    #initialise db connection
    dbconnection = DBconnection()
    if dbconnection.get_collection() is None:
        logger.error("failed to connect to database(no collection found)")
        return

    while True:
        user_query = input("\nEnter question or 'translate-yoruba'/'quit: ").strip()
        if user_query.lower() in ('quit', 'exit'):
            break
        elif user_query == 'translate':
            await handle_translation_flow(book_content)
            continue
        try:
            #execute query
            result = execute_query(user_query)
            llm_response = result["response"]

            #display answer
            logger.info(f"\nANSWER:\n{'-'*40}")
            logger.info(llm_response)
            logger.info('-'*40)

            #evaluate llm outputs
            similarity_score = response_evaluation(llm_response)
            logger.info(f"similarity score (vs reference): {similarity_score:.2f}")

        except Exception as e:
            logger.error(f"error processing query: {str(e)}")

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
