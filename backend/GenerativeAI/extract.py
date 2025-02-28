import os
import json
import fitz  # PyMuPDF
from datetime import datetime

class PDFExtractor:
    def __init__(self, pdf_path, output_file="extracted_data.txt", image_dir="extracted_images"):
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
        self.image_dir = image_dir

        # Ensure the image directory exists
        os.makedirs(self.image_dir, exist_ok=True)

    def extract_content(self):
        """Extract text and images from the PDF and save to a .txt file."""
        doc = fitz.open(self.pdf_path)
        
        with open(self.output_file, "w", encoding="utf-8") as txt_file:
            extracted_data = f"Extracted from: {self.pdf_path}\n"
            extracted_data += f"Extracted on: {str(datetime.now())}\n\n"

            for page_num in range(len(doc)):
                page = doc[page_num]
                text = page.get_text("text")  # Extract text
                images = []

                # Write the extracted text to the .txt file
                extracted_data += f"--- Page {page_num + 1} ---\n"
                extracted_data += text.strip() + "\n\n"  # Append page text

                for img_index, img in enumerate(page.get_images(full=True)):
                    xref = img[0]
                    base_image = doc.extract_image(xref)
                    image_bytes = base_image["image"]
                    image_ext = base_image["ext"]
                    image_filename = f"{self.image_dir}/page_{page_num + 1}_image_{img_index + 1}.{image_ext}"

                    # Save image
                    with open(image_filename, "wb") as img_file:
                        img_file.write(image_bytes)

                    images.append({
                        "filename": image_filename,
                        "size": len(image_bytes)
                    })

                # Include information about images
                if images:
                    extracted_data += f"Images extracted: {len(images)}\n"
                    for img in images:
                        extracted_data += f" - {img['filename']} ({img['size']} bytes)\n"
                extracted_data += "\n"  # Add space after page

            txt_file.write(extracted_data)

        print(f"Extraction complete! Data saved in {self.output_file}")
        print(f"Extracted images are stored in {self.image_dir}/")

# Example Usage
pdf_path = r"C:\Users\ajibo\Downloads\Wives-of-the-Leopard-Gender-Politics-and-Culture-in-the-Kingdom-of-Dahomey-by-Edna-G.-Bay-z-lib.org-3.pdf"  # Change this to your actual PDF file path
extractor = PDFExtractor(pdf_path)
extractor.extract_content() 

