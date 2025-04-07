import os
import fitz  # PyMuPDF
from datetime import datetime

class PDFExtractor:
    def __init__(self, pdf_path, output_file="wives_of_the_leopard.txt"):
        """
        Initialize the PDFExtractor class.

        :param pdf_path: Local PDF file path.
        :param output_file: Text file where extracted content will be saved.
        :param image_dir: Directory where extracted images will be stored.
        """
        if not os.path.exists(pdf_path):
            raise FileNotFoundError(f"PDF file not found: {pdf_path}")
        
        self.pdf_path = pdf_path
        self.output_file = output_file

    def extract_content(self):
        """Extract text from the PDF and save to a .txt file."""
        doc = fitz.open(self.pdf_path)
        
        with open(self.output_file, "w", encoding="utf-8") as txt_file:
            extracted_data = f"Extracted from: {self.pdf_path}\n"
            extracted_data += f"Extracted on: {str(datetime.now())}\n\n"

            for page_num in range(len(doc)):
                page = doc[page_num]
                text = page.get_text("text")  # Extract text

                #Write the extracted text to the .txt file
                extracted_data += f"--- Page {page_num + 1} ---\n"
                extracted_data += text.strip() + "\n\n"  # Append page text

            txt_file.write(extracted_data)
            
        print(f"Extraction complete! Data saved in {self.output_file}")

#extract text from pdf
pdf_path = r"C:\Users\ajibo\Downloads\Wives-of-the-Leopard-Gender-Politics-and-Culture-in-the-Kingdom-of-Dahomey-by-Edna-G.-Bay-z-lib.org-3.pdf"  # Change this to your actual PDF file path
extractor = PDFExtractor(pdf_path)
extractor.extract_content() 

