import os
from pathlib import Path
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


#retrieve books in the directory
def get_books_in_directory(directory_path: str):
    books = []
    directory_path = r"C:\Users\ajibo\iwe\GenerativeAI\books"
    path = Path(directory_path)
    if not path.exists():
        return None
    
    #retrieve all .txt files
    for txt_file in path.glob("*.txt"):
        books.append(txt_file)
        return books
    
def read_book(file_path: str):
    file_path = r"C:\Users\ajibo\iwe\GenerativeAI\books\wives_of_the_leopard.txt"
    path = Path(file_path)
    if not path.exists():
        return "**error**: file does not exist"
        
    if path.suffix.lower() != '.txt':
        return "**error**: not a text file"
        
    with open(file_path, 'r', encoding='utf-8') as f:
         content = f.read()
    return content

def display_books(books):
    if not books:
        logger.info("no books available")
        return
    
    logger.info("available books:")
    for i, book in enumerate(books, 1):
        print(f"{i}. {book.name}")