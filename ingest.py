import fitz # PyMuPDF
import io
from PIL import Image
import pytesseract
from pdf2image import convert_from_path
import os

def extract_text_from_pdf(pdf_path):

    text = ""
    try:
        doc = fitz.open(pdf_path)
        for page in doc:
            text += page.get_text()
        if len(text.strip()) > 100:
            print("Extracted text using PyMuPDF. From {pdf_path}")
            return text
        else:
            raise ValueError("Minimal text /or Insufficient text extracted, falling back to OCR.")
        
    except Exception as e:
        print(f"PyMuPDF extraction failed: {e}. Falling back to OCR.")
        images = convert_from_path(pdf_path)
        for image in images:
            text += pytesseract.image_to_string(image)
        print(f"Extracted text using OCR. From {pdf_path}")
        return text
    except Exception as  ocr_error:
        print(f"OCR extraction failed for {pdf_path}: {ocr_error}. No text could be extracted.")
        return ""
    
# --- MAIN INGESTION LOOP ---
pdf_folder = "/home/yasmim/Documentos/prog/research_agent/data/raw_pdfs"
output_folder = "/home/yasmim/Documentos/prog/research_agent/data/processed_text"


for filename in os.listdir(pdf_folder):
    if filename.endswith(".pdf"):
        pdf_path = os.path.join(pdf_folder, filename)
        print(f"Processing: {filename}")
        text = extract_text_from_pdf(pdf_path)

        # Salvando os arquivos extraídos para .txt
        output_filename = filename.replace(".pdf", ".txt")
        output_path = os.path.join(output_folder, output_filename)
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(text)
        print(f"Saved text to: {output_path}\n")

print("Ingestion complete! Check the 'data/processed_text' folder.")


        