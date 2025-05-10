from langchain_text_splitters import RecursiveCharacterTextSplitter
from sentence_transformers import SentenceTransformer
from dbconnection import DBconnection
import os
import logging

#Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

embedder_model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

#file processor
def process_documents(directory_path):
    # Ensure directory exists
    if not os.path.isdir(directory_path):
        print(f"Error: Directory '{directory_path}' not found")
        return
    
    db_conn = DBconnection()
    collection = db_conn.get_collection()

    # Debug: Print connection info
    print(f"\nConnection Details:")
    print(f"- MongoDB Address: {db_conn.client.address}")
    print(f"- Database: {collection.database.name}")
    print(f"- Collection: {collection.name}")
    print(f"- Current document count: {collection.count_documents({})}\n")

    # List all `.txt` files in the directory
    for filename in os.listdir(directory_path):
        file_path = os.path.join(directory_path, filename)

        if file_path.endswith(".txt"):
            print(f"\nProcessing file: {file_path}")

            with open(file_path, "r", encoding="utf-8") as file:
                text = file.read()

            # Split text into chunks
            text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
            docs = text_splitter.create_documents([text])

            # Convert to MongoDB format with embeddings
            documents_to_insert = []
            for doc in docs:
                # Generate embedding for each chunk
                embedding = embedder_model.encode(doc.page_content)
                
                documents_to_insert.append({
                    "content": doc.page_content,
                    "source_file": os.path.basename(file_path),
                    "embedding": embedding.tolist()  # Convert numpy array to list
                })

            # Store in MongoDB
            print(f"Preparing to insert {len(documents_to_insert)} chunks with embeddings...")
            try:
                result = collection.insert_many(documents_to_insert)
                print(f"Successfully inserted {len(result.inserted_ids)} documents with embeddings")
                print(f"New total count: {collection.count_documents({})}")
                
                # Verify insertion
                recent_doc = collection.find_one(sort=[('_id', -1)])
                print("Most recent document sample:")
                print(recent_doc['content'][:100] + "...")
                print(f"From file: {recent_doc['source_file']}")
                print(f"Embedding length: {len(recent_doc['embedding'])}")  # Should be 384 for all-MiniLM-L6-v2
            except Exception as e:
                print(f"Error inserting documents: {e}")
                raise

# Call the function with your specific path
books_path = r"C:\Users\ajibo\iwe\GenerativeAI\books"
process_documents(books_path)





        



        
        









