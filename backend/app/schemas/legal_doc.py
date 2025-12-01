"""
Legal document schemas.
"""

from typing import List, Optional
from datetime import date, datetime
from pydantic import BaseModel
from uuid import UUID


class LegalDocBase(BaseModel):
    """Base legal document schema."""
    doc_number: str
    doc_type: Optional[str] = None
    title: str
    issue_date: date
    effective_date: Optional[date] = None
    expiry_date: Optional[date] = None
    signer: Optional[str] = None
    issuing_body: Optional[str] = None
    content_summary: Optional[str] = None
    original_link: str
    pdf_url: Optional[str] = None
    tags: List[str] = []


class LegalDocResponse(LegalDocBase):
    """Schema for legal document response."""
    id: UUID
    content_full: Optional[str] = None
    category_id: Optional[UUID] = None
    replaces_doc_id: Optional[UUID] = None
    amended_by: List[dict] = []
    view_count: int
    is_featured: bool
    crawled_at: datetime
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class LegalDocListResponse(BaseModel):
    """Schema for paginated legal document list."""
    items: List[LegalDocResponse]
    total: int
    page: int
    page_size: int
    pages: int
