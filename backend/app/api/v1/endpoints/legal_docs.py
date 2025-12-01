"""
Legal documents API endpoints - MongoDB version.
"""

from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query
from bson import ObjectId
from datetime import datetime

from app.models.legal_doc import LegalDocument
from app.schemas.legal_doc import LegalDocResponse, LegalDocListResponse

router = APIRouter()


@router.get("/", response_model=LegalDocListResponse)
async def list_legal_docs(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    category_id: Optional[str] = None,
    doc_type: Optional[str] = None,
    search: Optional[str] = None,
    year: Optional[int] = None,
    limit: Optional[int] = None,
    sort: Optional[str] = "-issue_date"
):
    """
    List legal documents with pagination and filters.
    
    Args:
        page: Page number
        page_size: Items per page
        category_id: Filter by category
        doc_type: Filter by document type
        search: Search in title and doc_number
        year: Filter by issue year
        limit: Limit results
        sort: Sort field (prefix with - for descending)
    """
    query_filter = {}
    
    if category_id:
        try:
            query_filter["category_id"] = ObjectId(category_id)
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid category_id format")
    
    if doc_type:
        query_filter["doc_type"] = doc_type
    
    if year:
        # Filter by year in issue_date
        start_date = datetime(year, 1, 1)
        end_date = datetime(year, 12, 31, 23, 59, 59)
        query_filter["issue_date"] = {"$gte": start_date, "$lte": end_date}
    
    if search:
        query_filter["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"doc_number": {"$regex": search, "$options": "i"}}
        ]
    
    # If limit is provided, return limited results
    if limit:
        docs = await LegalDocument.find(query_filter)\
            .sort(sort)\
            .limit(limit)\
            .to_list()
        
        return LegalDocListResponse(
            items=[LegalDocResponse(**doc.dict()) for doc in docs],
            total=len(docs),
            page=1,
            page_size=limit,
            pages=1
        )
    
    # Count total
    total = await LegalDocument.find(query_filter).count()
    
    # Apply pagination and sorting
    docs = await LegalDocument.find(query_filter)\
        .sort(sort)\
        .skip((page - 1) * page_size)\
        .limit(page_size)\
        .to_list()
    
    return LegalDocListResponse(
        items=[LegalDocResponse(**doc.dict()) for doc in docs],
        total=total,
        page=page,
        page_size=page_size,
        pages=(total + page_size - 1) // page_size if total > 0 else 0
    )


@router.get("/{doc_number}", response_model=LegalDocResponse)
async def get_legal_doc(doc_number: str):
    """Get legal document by document number."""
    doc = await LegalDocument.find_one(LegalDocument.doc_number == doc_number)
    
    if not doc:
        raise HTTPException(status_code=404, detail="Legal document not found")
    
    # Increment view count
    # doc.view_count += 1
    # await doc.save()
    await doc.set({
        "view_count": doc.view_count + 1,
        "updated_at": datetime.utcnow()
    })
    
    return LegalDocResponse(**doc.dict())


@router.get("/id/{doc_id}", response_model=LegalDocResponse)
async def get_legal_doc_by_id(doc_id: str):
    """Get legal document by ID."""
    try:
        obj_id = ObjectId(doc_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid doc_id format")
    
    doc = await LegalDocument.get(obj_id)
    
    if not doc:
        raise HTTPException(status_code=404, detail="Legal document not found")
    
    return LegalDocResponse(**doc.dict())


@router.get("/featured/list", response_model=List[LegalDocResponse])
async def get_featured_legal_docs(
    limit: int = Query(5, ge=1, le=20)
):
    """Get featured legal documents."""
    docs = await LegalDocument.find(
        LegalDocument.is_featured == True
    ).sort("-issue_date").limit(limit).to_list()
    
    return [LegalDocResponse(**doc.dict()) for doc in docs]


@router.get("/recent/list", response_model=List[LegalDocResponse])
async def get_recent_legal_docs(
    limit: int = Query(10, ge=1, le=50)
):
    """Get recently issued legal documents."""
    docs = await LegalDocument.find().sort("-issue_date").limit(limit).to_list()
    
    return [LegalDocResponse(**doc.dict()) for doc in docs]


@router.get("/type/{doc_type}", response_model=List[LegalDocResponse])
async def get_legal_docs_by_type(
    doc_type: str,
    limit: int = Query(10, ge=1, le=50)
):
    """Get legal documents by type (e.g., 'Nghị định', 'Thông tư')."""
    docs = await LegalDocument.find(
        LegalDocument.doc_type == doc_type
    ).sort("-issue_date").limit(limit).to_list()
    
    return [LegalDocResponse(**doc.dict()) for doc in docs]
