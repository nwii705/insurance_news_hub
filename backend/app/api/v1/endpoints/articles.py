"""
Articles API endpoints - MongoDB version.
"""

from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query
from datetime import datetime
from bson import ObjectId

from app.models.article import Article
from app.schemas.article import ArticleResponse, ArticleListResponse, ArticleCreate

router = APIRouter()


@router.get("/", response_model=ArticleListResponse)
async def list_articles(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    category_id: Optional[str] = None,
    status: Optional[str] = "published",
    is_featured: Optional[bool] = None,
    search: Optional[str] = None,
    featured: Optional[bool] = None,
    limit: Optional[int] = None
):
    """
    List articles with pagination and filters.
    
    Args:
        page: Page number
        page_size: Items per page
        category_id: Filter by category
        status: Filter by status (published, draft, archived)
        is_featured: Filter featured articles
        search: Search in title and summary
        featured: Alias for is_featured
        limit: Limit number of results (overrides pagination)
    """
    # Build MongoDB query
    query_filter = {}
    
    if status:
        query_filter["status"] = status
    
    if category_id:
        try:
            query_filter["category_id"] = ObjectId(category_id)
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid category_id format")
    
    if is_featured is not None:
        query_filter["is_featured"] = is_featured
    elif featured is not None:
        query_filter["is_featured"] = featured
    
    if search:
        # MongoDB text search using $regex
        query_filter["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"summary": {"$regex": search, "$options": "i"}}
        ]
    
    # If limit is provided, return limited results without pagination
    if limit:
        articles = await Article.find(query_filter)\
            .sort("-published_at")\
            .limit(limit)\
            .to_list()
        
        return ArticleListResponse(
            items=[ArticleResponse(**article.dict()) for article in articles],
            total=len(articles),
            page=1,
            page_size=limit,
            pages=1
        )
    
    # Count total
    total = await Article.find(query_filter).count()
    
    # Apply pagination and sorting
    articles = await Article.find(query_filter)\
        .sort("-published_at")\
        .skip((page - 1) * page_size)\
        .limit(page_size)\
        .to_list()
    
    return ArticleListResponse(
        items=[ArticleResponse(**article.dict()) for article in articles],
        total=total,
        page=page,
        page_size=page_size,
        pages=(total + page_size - 1) // page_size if total > 0 else 0
    )


@router.get("/{slug}", response_model=ArticleResponse)
async def get_article(slug: str):
    """
    Get article by slug.
    
    Args:
        slug: Article slug
    """
    article = await Article.find_one(Article.slug == slug)
    
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    # Increment view count and update timestamp using Beanie's set method
    await article.set({
        "view_count": article.view_count + 1,
        "updated_at": datetime.utcnow()
    })
    
    return ArticleResponse(**article.dict())


@router.get("/id/{article_id}", response_model=ArticleResponse)
async def get_article_by_id(article_id: str):
    """Get article by ID."""
    try:
        obj_id = ObjectId(article_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid article_id format")
    
    article = await Article.get(obj_id)
    
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    return ArticleResponse(**article.dict())


@router.get("/featured/list", response_model=List[ArticleResponse])
async def get_featured_articles(
    limit: int = Query(5, ge=1, le=20)
):
    """Get featured articles."""
    articles = await Article.find(
        Article.is_featured == True,
        Article.status == "published"
    ).sort("-published_at").limit(limit).to_list()
    
    return [ArticleResponse(**article.dict()) for article in articles]


@router.get("/trending/list", response_model=List[ArticleResponse])
async def get_trending_articles(
    limit: int = Query(5, ge=1, le=20)
):
    """Get trending articles."""
    articles = await Article.find(
        Article.is_trending == True,
        Article.status == "published"
    ).sort("-view_count").limit(limit).to_list()
    
    return [ArticleResponse(**article.dict()) for article in articles]


@router.post("/", response_model=ArticleResponse)
async def create_article(article_data: ArticleCreate):
    """Create a new article (manual entry)."""
    from slugify import slugify
    
    # Handle category_id conversion
    cat_id = None
    if article_data.category_id:
        try:
            cat_id = ObjectId(str(article_data.category_id))
        except:
            pass
    
    article = Article(
        title=article_data.title,
        slug=slugify(article_data.title),
        summary=article_data.summary,
        content_html=article_data.content_html,
        author_type="Human",
        status=article_data.status or "draft",
        category_id=cat_id,
        tags=article_data.tags or [],
        featured_image_url=article_data.featured_image_url,
        published_at=datetime.utcnow() if article_data.status == "published" else None
    )
    
    await article.create()
    
    return ArticleResponse(**article.dict())
