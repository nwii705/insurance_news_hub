"""
Categories API endpoints - MongoDB version.
"""

from typing import List
from fastapi import APIRouter, HTTPException
from bson import ObjectId

from app.models.category import Category

router = APIRouter()


@router.get("/", response_model=List[dict])
async def list_categories():
    """Get all active categories."""
    categories = await Category.find(
        Category.is_active == True
    ).sort("sort_order").to_list()
    
    return [cat.dict() for cat in categories]


@router.get("/{slug}", response_model=dict)
async def get_category(slug: str):
    """Get category by slug."""
    category = await Category.find_one(Category.slug == slug)
    
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    return category.dict()


@router.get("/id/{category_id}", response_model=dict)
async def get_category_by_id(category_id: str):
    """Get category by ID."""
    try:
        obj_id = ObjectId(category_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid category_id format")
    
    category = await Category.get(obj_id)
    
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    return category.dict()
