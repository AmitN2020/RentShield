import io
import logging
from typing import Tuple, List
import pypdf

logger = logging.getLogger("pdf_parser")

def extract_text_from_pdf(pdf_bytes: bytes) -> Tuple[str, List[dict], str]:
    """
    Extracts text from a PDF file using pypdf for native digital text.
    If text density is below threshold (indicating a scanned PDF),
    attempts OCR fallback via pdf2image and pytesseract.
    
    Returns:
        (full_text, pages_metadata, extraction_method)
    """
    pdf_file = io.BytesIO(pdf_bytes)
    reader = pypdf.PdfReader(pdf_file)
    total_pages = len(reader.pages)
    
    pages_metadata = []
    text_chunks = []
    
    for idx, page in enumerate(reader.pages):
        page_text = page.extract_text() or ""
        pages_metadata.append({
            "page_number": idx + 1,
            "char_count": len(page_text.strip()),
            "text": page_text
        })
        text_chunks.append(page_text)
        
    full_text = "\n\n".join(text_chunks).strip()
    total_chars = len(full_text)
    
    # Heuristic: average < 100 characters per page suggests scanned/image PDF
    is_scanned_likely = total_pages > 0 and (total_chars / total_pages < 100 or total_chars < 150)
    
    if not is_scanned_likely and total_chars > 50:
        return full_text, pages_metadata, "digital_pypdf"
    
    logger.info("PDF character density is low. Attempting OCR fallback via pdf2image and pytesseract...")
    try:
        from pdf2image import convert_from_bytes
        import pytesseract
        
        images = convert_from_bytes(pdf_bytes)
        ocr_pages_metadata = []
        ocr_chunks = []
        
        for idx, img in enumerate(images):
            ocr_text = pytesseract.image_to_string(img)
            ocr_pages_metadata.append({
                "page_number": idx + 1,
                "char_count": len(ocr_text.strip()),
                "text": ocr_text
            })
            ocr_chunks.append(ocr_text)
            
        ocr_full_text = "\n\n".join(ocr_chunks).strip()
        if len(ocr_full_text) > len(full_text):
            return ocr_full_text, ocr_pages_metadata, "ocr_tesseract"
    except Exception as e:
        logger.warning(f"OCR fallback could not run (Tesseract binary may not be installed on host system): {e}")
        # If native text had at least some content, return it
        if total_chars > 0:
            return full_text, pages_metadata, "digital_pypdf_low_density"
            
    # Return whatever we got
    return full_text, pages_metadata, "digital_pypdf"
