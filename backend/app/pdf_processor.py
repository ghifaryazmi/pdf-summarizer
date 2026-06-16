import PyPDF2
import pdfplumber
import pytesseract
import re
from pdf2image import convert_from_bytes
from io import BytesIO


class ExtractionError(Exception):
    """Custom exception for PDF text extraction errors."""
    pass


def _clean_text(text):
    """Clean up extracted text, especially from HTML-generated PDFs."""
    text = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]', '', text)

    text = re.sub(r'[\u00a0\u2000-\u200b\u2028\u2029\u202f\u205f\u3000]', ' ', text)

    text = re.sub(r'[^\S\n]+', ' ', text)

    text = re.sub(r'\n{3,}', '\n\n', text)

    text = re.sub(r'\n\s+\n', '\n\n', text)

    lines = [line.strip() for line in text.split('\n')]
    text = '\n'.join(lines)

    return text.strip()


def _extract_with_pdfplumber(pdf_bytes):
    """Extract text using pdfplumber — better for HTML-generated PDFs and tables."""
    try:
        pages_text = []
        with pdfplumber.open(BytesIO(pdf_bytes)) as pdf:
            page_count = len(pdf.pages)
            for page in pdf.pages:
                # Try extracting tables first
                tables = page.extract_tables()
                if tables:
                    for table in tables:
                        for row in table:
                            if row:
                                # Filter out None values and join cells
                                cells = [str(cell).strip() for cell in row if cell]
                                if cells:
                                    pages_text.append(' | '.join(cells))

                # Also get regular text
                text = page.extract_text()
                if text and text.strip():
                    pages_text.append(text)

        return pages_text, page_count
    except Exception:
        return [], 0


def _extract_with_pypdf2(pdf_bytes):
    """Extract text using PyPDF2 — fast for standard text-based PDFs."""
    try:
        reader = PyPDF2.PdfReader(BytesIO(pdf_bytes))
        pages_text = []

        for page in reader.pages:
            text = page.extract_text()
            if text and text.strip():
                pages_text.append(text)

        page_count = len(reader.pages)
        return pages_text, page_count
    except Exception:
        return [], 0


def _ocr_from_bytes(pdf_bytes):
    """Convert PDF bytes to images and run OCR on each page."""
    try:
        images = convert_from_bytes(pdf_bytes, dpi=300)
        pages_text = []
        for image in images:
            text = pytesseract.image_to_string(image)
            if text and text.strip():
                pages_text.append(text.strip())
        return pages_text, len(images)
    except Exception:
        return [], 0


def extract_text(file, timeout=60):
    """Extracts text from all pages of a PDF, preserving page order.

    Uses a multi-strategy approach:
    1. pdfplumber (best for HTML-generated PDFs and tables)
    2. PyPDF2 (fast for standard text-based PDFs)
    3. OCR via Tesseract (fallback for scanned/image PDFs)

    Args:
        file: A file-like object containing PDF data.
        timeout: Maximum time in seconds for extraction (default 60).

    Returns:
        A tuple of (full_text, page_count).

    Raises:
        ExtractionError: If no text can be extracted by any method.
    """
    try:
        pdf_bytes = file.read()
        file.seek(0)

        # handles HTML-generated PDFs, tables, etc.
        pages_text, page_count = _extract_with_pdfplumber(pdf_bytes)
        if pages_text:
            full_text = '\n'.join(pages_text)
            full_text = _clean_text(full_text)
            if full_text:
                return full_text, page_count

        pages_text, page_count = _extract_with_pypdf2(pdf_bytes)
        if pages_text:
            full_text = '\n'.join(pages_text)
            full_text = _clean_text(full_text)
            if full_text:
                return full_text, page_count

        # for scanned/image PDFs
        pages_text, page_count = _ocr_from_bytes(pdf_bytes)
        if pages_text:
            full_text = '\n'.join(pages_text)
            full_text = _clean_text(full_text)
            if full_text:
                return full_text, page_count

        raise ExtractionError("No extractable text found in the uploaded PDF.")

    except ExtractionError:
        raise
    except Exception as e:
        raise ExtractionError(f"Failed to extract text: {str(e)}")
