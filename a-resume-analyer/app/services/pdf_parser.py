# app/services/pdf_parser.py
import io
from typing import Optional
import PyPDF2
import pdfplumber
import logging

logger = logging.getLogger(__name__)


class PDFParser:
    """
    PDF parser with multiple extraction strategies.
    Tries pdfplumber first (better formatting), falls back to PyPDF2.
    """
    
    @staticmethod
    def extract_text_from_bytes(pdf_bytes: bytes) -> str:
        """
        Extract text from PDF bytes using multiple strategies.
        
        Args:
            pdf_bytes: Raw PDF file bytes
            
        Returns:
            Extracted text as string
            
        Raises:
            ValueError: If PDF cannot be parsed or is empty
        """
        if not pdf_bytes:
            raise ValueError("Empty PDF file")
        
        # Try pdfplumber first (better text extraction)
        try:
            text = PDFParser._extract_with_pdfplumber(pdf_bytes)
            if text and text.strip():
                logger.info(f"Extracted {len(text)} characters using pdfplumber")
                return text
        except Exception as e:
            logger.warning(f"pdfplumber extraction failed: {e}")
        
        # Fall back to PyPDF2
        try:
            text = PDFParser._extract_with_pypdf2(pdf_bytes)
            if text and text.strip():
                logger.info(f"Extracted {len(text)} characters using PyPDF2")
                return text
        except Exception as e:
            logger.error(f"PyPDF2 extraction failed: {e}")
            raise ValueError(f"Failed to extract text from PDF: {e}")
        
        raise ValueError("PDF appears to be empty or unreadable")
    
    @staticmethod
    def _extract_with_pdfplumber(pdf_bytes: bytes) -> str:
        """Extract text using pdfplumber (better formatting)"""
        text_parts = []
        
        with io.BytesIO(pdf_bytes) as pdf_file:
            with pdfplumber.open(pdf_file) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text_parts.append(page_text)
        
        return "\n\n".join(text_parts)
    
    @staticmethod
    def _extract_with_pypdf2(pdf_bytes: bytes) -> str:
        """Extract text using PyPDF2 (fallback)"""
        text_parts = []
        
        with io.BytesIO(pdf_bytes) as pdf_file:
            reader = PyPDF2.PdfReader(pdf_file)
            
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text_parts.append(page_text)
        
        return "\n\n".join(text_parts)
    
    @staticmethod
    def extract_metadata(pdf_bytes: bytes) -> dict:
        """
        Extract PDF metadata.
        
        Args:
            pdf_bytes: Raw PDF file bytes
            
        Returns:
            Dictionary with metadata (title, author, pages, etc.)
        """
        metadata = {
            "num_pages": 0,
            "title": None,
            "author": None,
            "creator": None,
            "producer": None
        }
        
        try:
            with io.BytesIO(pdf_bytes) as pdf_file:
                reader = PyPDF2.PdfReader(pdf_file)
                metadata["num_pages"] = len(reader.pages)
                
                if reader.metadata:
                    metadata["title"] = reader.metadata.get("/Title")
                    metadata["author"] = reader.metadata.get("/Author")
                    metadata["creator"] = reader.metadata.get("/Creator")
                    metadata["producer"] = reader.metadata.get("/Producer")
        except Exception as e:
            logger.warning(f"Failed to extract metadata: {e}")
        
        return metadata


def parse_resume_pdf(pdf_bytes: bytes) -> tuple[str, dict]:
    """
    Parse resume PDF and return text + metadata.
    
    Args:
        pdf_bytes: Raw PDF file bytes
        
    Returns:
        Tuple of (extracted_text, metadata_dict)
    """
    parser = PDFParser()
    text = parser.extract_text_from_bytes(pdf_bytes)
    metadata = parser.extract_metadata(pdf_bytes)
    
    return text, metadata
