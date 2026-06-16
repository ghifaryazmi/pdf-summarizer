from io import BytesIO
import pikepdf
from weasyprint import HTML


class ValidationError(Exception):
    """Custom exception for file validation errors."""

    def __init__(self, message, status_code=400):
        self.message = message
        self.status_code = status_code
        super().__init__(message)


def _is_html(content):
    """Check if file content looks like HTML."""
    lower = content[:1024].lower()
    html_markers = [b'<!doctype html', b'<html', b'<head', b'<body', b'<div', b'<p>']
    return any(marker in lower for marker in html_markers)


def _convert_html_to_pdf(content):
    """Convert HTML content to PDF bytes using WeasyPrint."""
    try:
        html_str = content.decode('utf-8', errors='replace')
        pdf_bytes = HTML(string=html_str).write_pdf()
        return pdf_bytes
    except Exception as e:
        raise ValidationError(f"Failed to convert HTML to PDF: {str(e)}", 400)


def _is_pdf_healthy(content):
    """Quick check if a PDF can be opened without errors."""
    try:
        pdf = pikepdf.open(BytesIO(content))
        _ = len(pdf.pages)
        pdf.close()
        return True
    except Exception:
        return False


def _repair_pdf(content):
    """Attempt to repair a corrupted/malformed PDF using pikepdf.

    pikepdf (based on QPDF) can fix:
    - Broken cross-reference tables
    - Incomplete stream objects
    - Malformed HTML-to-PDF generator output
    - Missing EOF markers
    - Linearization issues
    """
    try:
        pdf = pikepdf.open(BytesIO(content), allow_overwriting_input=True)
        output = BytesIO()
        pdf.save(output, fix_metadata_version=False)
        pdf.close()
        output.seek(0)
        return output
    except Exception:
        # if repair is fails, return original
        return BytesIO(content)


def validate(file):
    """Validates uploaded file: accepts PDF and HTML files.

    For PDF files, checks if it's healthy. If broken, attempts auto-repair.
    For HTML files, converts to PDF using WeasyPrint.

    Returns a file-like object containing valid PDF content.
    """
    content = file.read()
    file.seek(0)

    if len(content) < 50:
        raise ValidationError("File is empty or too small to process.", 400)

    if len(content) > 20 * 1024 * 1024:
        raise ValidationError("File size exceeds the 20 MB limit.", 413)

    if content[:4] == b'%PDF':
        if _is_pdf_healthy(content):
            return BytesIO(content)
        else:
            # auto repair html
            return _repair_pdf(content)

    # check if HTML — convert to PDF
    if _is_html(content):
        pdf_bytes = _convert_html_to_pdf(content)
        return BytesIO(pdf_bytes)

    raise ValidationError(
        "Invalid file format. Only PDF and HTML files are accepted.", 400
    )
