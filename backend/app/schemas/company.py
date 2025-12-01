"""
Company schemas.
"""

from typing import List, Optional
from datetime import date, datetime
from pydantic import BaseModel
from uuid import UUID


class CompanyBase(BaseModel):
    """Base company schema."""
    name: str
    slug: str
    type: Optional[str] = None
    logo_url: Optional[str] = None
    website: Optional[str] = None
    description: Optional[str] = None
    established_date: Optional[date] = None


class CompanyResponse(CompanyBase):
    """Schema for company response."""
    id: UUID
    financial_reports: List[dict] = []
    contact_info: dict = {}
    is_active: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class CompanyListResponse(BaseModel):
    """Schema for paginated company list."""
    items: List[CompanyResponse]
    total: int
    page: int
    page_size: int
    pages: int
