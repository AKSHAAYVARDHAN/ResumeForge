import PyPDF2
import io


def parse_pdf(file_bytes: bytes) -> str:
    """Extract text content from a PDF file given as bytes."""
    try:
        reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
        text_parts = []
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text_parts.append(page_text)
        full_text = "\n".join(text_parts).strip()
        if not full_text:
            raise ValueError("No readable text found in the PDF. The file may be image-based or protected.")
        return full_text
    except Exception as e:
        raise RuntimeError(f"PDF parsing failed: {str(e)}")
