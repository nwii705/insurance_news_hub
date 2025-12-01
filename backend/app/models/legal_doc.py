"""
LegalDocument model - MongoDB document for legal docs from TVPL.
"""

from beanie import Document
from pydantic import Field
from datetime import datetime, date
from typing import Optional, List, Dict, Any
from bson import ObjectId


class LegalDocument(Document):
    """Legal documents crawled from Thư Viện Pháp Luật."""
    
    # Document identification
    doc_number: str = Field(..., max_length=100, description="Document number (e.g., '45/2024/NĐ-CP')")
    doc_type: str = Field(..., max_length=100, description="Type: 'Nghị định', 'Thông tư', etc.")
    title: str = Field(..., description="Document title")
    
    # Dates
    issue_date: date = Field(..., description="Date document was issued")
    effective_date: Optional[date] = Field(default=None, description="Date document becomes effective")
    expiry_date: Optional[date] = Field(default=None, description="Date document expires")
    
    # Authority
    signer: Optional[str] = Field(default=None, max_length=255, description="Person who signed")
    issuing_body: Optional[str] = Field(default=None, max_length=255, description="Issuing authority")
    
    # Content
    content_summary: Optional[str] = Field(default=None, description="Summary of content")
    content_full: Optional[str] = Field(default=None, description="Full text content")
    
    # Source
    original_link: str = Field(..., description="Link to TVPL source")
    pdf_url: Optional[str] = Field(default=None, description="PDF download link")
    
    # Relationships
    replaces_doc_id: Optional[ObjectId] = Field(default=None, description="ID of document this replaces")
    amended_by: List[Dict[str, Any]] = Field(default_factory=list, description="Documents that amend this one")
    
    # Categorization
    tags: List[str] = Field(default_factory=list, description="Tags for categorization")
    category_id: Optional[ObjectId] = Field(default=None, description="Category ID")
    
    # Metadata
    view_count: int = Field(default=0, description="Number of views")
    is_featured: bool = Field(default=False, description="Featured status")
    crawled_at: datetime = Field(default_factory=datetime.utcnow, description="When crawled")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "legal_documents"
        indexes = [
            "doc_number",
            "doc_type",
            "issue_date",
            "effective_date",
            "is_featured",
            "created_at",
        ]
    
    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
    
    def __repr__(self):
        return f"<LegalDocument {self.doc_number}: {self.title[:50]}>"
