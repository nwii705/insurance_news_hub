"""
Category schemas.
"""

from typing import Optional
from datetime import datetime
from pydantic import BaseModel
from uuid import UUID


class CategoryBase(BaseModel):
    """Base category schema."""
    name: str
    slug: str
    description: Optional[str] = None
    sort_order: int = 0


class CategoryResponse(CategoryBase):
    """Schema for category response."""
    id: UUID
    is_active: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
