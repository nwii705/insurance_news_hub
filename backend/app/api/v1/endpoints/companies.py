"""
Companies API endpoints - MongoDB version.
"""

from typing import List
from fastapi import APIRouter, HTTPException, Query
from bson import ObjectId

from app.models.company import Company

router = APIRouter()


@router.get("/", response_model=List[dict])
async def list_companies(
    company_type: str = Query(None, description="Filter by type: 'Life', 'Non-Life', 'Both'"),
    is_active: bool = Query(True, description="Filter active companies")
):
    """Get all companies."""
    query_filter: dict = {"is_active": is_active}
    
    if company_type:
        query_filter["type"] = company_type
    
    companies = await Company.find(query_filter).sort("name").to_list()
    
    return [company.dict() for company in companies]


@router.get("/{slug}", response_model=dict)
async def get_company(slug: str):
    """Get company by slug."""
    company = await Company.find_one(Company.slug == slug)
    
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    return company.dict()


@router.get("/id/{company_id}", response_model=dict)
async def get_company_by_id(company_id: str):
    """Get company by ID."""
    try:
        obj_id = ObjectId(company_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid company_id format")
    
    company = await Company.get(obj_id)
    
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    return company.dict()
