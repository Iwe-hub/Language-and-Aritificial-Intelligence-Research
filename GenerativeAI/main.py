from dbconnection import DBconnection
from book import get_books_in_directory
from book import read_book
from query import execute_query
from typing import Dict, Any
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)



def display_books(books):
    if not books:
        logger.info("no books available")
        return
    
    logger.info("available books:")
    for i, book in enumerate(books, 1):
        print(f"{i}. {book.name}")



def main():
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
        user_query = input("\nEnter your question about the book (or 'quit'): ").strip()
        if user_query.lower() in ('quit', 'exit'):
            break

        try:
            #execute query
            result = execute_query(user_query)

            #display answer
            logger.info(f"\nANSWER:\n{'-'*40}")
            logger.info(result["response"])

            #display sources
            logger.info('-'*40)
        except Exception as e:
            logger.error(f"error processing query: {str(e)}")

if __name__ == "__main__":
    main()
