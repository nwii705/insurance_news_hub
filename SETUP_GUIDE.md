/**
 * INSURANCE NEWS VIETNAM - COMPLETE SETUP GUIDE
 * =============================================
 */

## PART 1: BACKEND SETUP (Python/FastAPI)

### Step 1: Create Virtual Environment
```powershell
cd d:\insurance\backend
python -m venv venv
.\venv\Scripts\Activate.ps1
```

### Step 2: Install Dependencies
```powershell
pip install -r requirements.txt
```

### Step 3: Configure Environment
```powershell
# Copy example env file
Copy-Item .env.example .env

# Edit .env and configure:
# - DATABASE_URL (PostgreSQL connection string)
# - OPENAI_API_KEY or ANTHROPIC_API_KEY
# - Other settings as needed
```

### Step 4: Setup Database

#### Option A: Using PostgreSQL Locally
```powershell
# Create database
psql -U postgres
CREATE DATABASE insurance_db;
\q

# Run schema
psql -U postgres -d insurance_db -f ../database/schema.sql
```

#### Option B: Using Supabase (Recommended)
1. Go to https://supabase.com
2. Create new project
3. Copy connection string to DATABASE_URL in .env
4. Run schema.sql in Supabase SQL Editor

### Step 5: Initialize Alembic (Migrations)
```powershell
# Initialize Alembic
alembic init alembic

# Create first migration
alembic revision --autogenerate -m "Initial migration"

# Apply migrations
alembic upgrade head
```

### Step 6: Run Backend Server
```powershell
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at: http://localhost:8000
API Documentation: http://localhost:8000/docs

---

## PART 2: FRONTEND SETUP (Next.js)

### Step 1: Install Dependencies
```powershell
cd d:\insurance\frontend
npm install
```

### Step 2: Configure Environment
```powershell
# Copy example env file
Copy-Item .env.local.example .env.local

# Edit .env.local:
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Step 3: Run Development Server
```powershell
npm run dev
```

Frontend will be available at: http://localhost:3000

---

## PART 3: INITIAL DATA & TESTING

### Populate Sample Data

#### Create Categories (Already in schema.sql)
```sql
-- Categories are auto-inserted via schema.sql
SELECT * FROM categories;
```

#### Add Sample Companies
```sql
INSERT INTO companies (name, slug, type, description) VALUES
('Bảo Việt Nhân Thọ', 'baoviet-life', 'Life', 'Leading life insurance'),
('Bảo hiểm PVI', 'pvi-insurance', 'Non-Life', 'Leading non-life insurance');
```

#### Test Crawlers

**Crawl Legal Documents:**
```powershell
# Via API
curl -X POST http://localhost:8000/api/v1/admin/crawl/legal-docs?max_pages=2

# Or run directly
python -m app.crawlers.tvpl_crawler
```

**Crawl News Articles:**
```powershell
# Via API
curl -X POST http://localhost:8000/api/v1/admin/crawl/news

# Or run directly
python -m app.crawlers.news_crawler
```

---

## PART 4: KEY API ENDPOINTS

### Articles
```
GET  /api/v1/articles                    # List all articles
GET  /api/v1/articles/{slug}             # Get article by slug
GET  /api/v1/articles/featured/list      # Featured articles
GET  /api/v1/articles/trending/list      # Trending articles
POST /api/v1/articles                    # Create article (manual)
```

### Legal Documents
```
GET  /api/v1/legal-docs                  # List legal docs
GET  /api/v1/legal-docs/{doc_number}     # Get by doc number
GET  /api/v1/legal-docs/recent/list      # Recent docs
```

### Companies
```
GET  /api/v1/companies                   # List companies
GET  /api/v1/companies/{slug}            # Get company by slug
```

### Categories
```
GET  /api/v1/categories                  # List all categories
GET  /api/v1/categories/{slug}           # Get category by slug
```

### Admin (Crawling)
```
POST /api/v1/admin/crawl/legal-docs      # Trigger legal doc crawl
POST /api/v1/admin/crawl/news            # Trigger news crawl
GET  /api/v1/admin/crawl/logs            # View crawl logs
GET  /api/v1/admin/stats                 # System statistics
```

---

## PART 5: AUTOMATED CRAWLING (Production)

### Option A: Using Celery (Recommended)

**Install Celery:**
```powershell
pip install celery redis
```

**Create celery_app.py:**
```python
from celery import Celery
from app.core.config import settings

celery_app = Celery(
    'insurance_crawler',
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND
)

@celery_app.task
def crawl_legal_docs():
    # Crawl logic here
    pass

@celery_app.task
def crawl_news():
    # Crawl logic here
    pass
```

**Start Celery Worker:**
```powershell
celery -A celery_app worker --loglevel=info
```

**Start Celery Beat (Scheduler):**
```powershell
celery -A celery_app beat --loglevel=info
```

### Option B: Using Windows Task Scheduler

**Create PowerShell script: crawl_legal.ps1**
```powershell
cd d:\insurance\backend
.\venv\Scripts\Activate.ps1
python -c "from app.services.content_processor import ContentProcessor; from app.database import SyncSessionLocal; db=next(SyncSessionLocal()); ContentProcessor(db).process_legal_documents()"
```

**Schedule in Task Scheduler:**
- Trigger: Every 6 hours
- Action: Run PowerShell script
- Same for news crawl (every 2 hours)

---

## PART 6: DEPLOYMENT

### Backend Deployment (Railway/Render/Heroku)

1. Create Procfile:
```
web: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

2. Set environment variables in platform dashboard

3. Connect PostgreSQL database

### Frontend Deployment (Vercel/Netlify)

1. Connect GitHub repository

2. Set environment variables:
```
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

3. Deploy!

---

## PART 7: FEATURES IMPLEMENTED

### Backend Features ✅
- ✅ PostgreSQL database with full schema
- ✅ SQLAlchemy models for all entities
- ✅ FastAPI REST API with async support
- ✅ TVPL legal document crawler
- ✅ Multi-source news crawler (VnExpress, Cafef, etc.)
- ✅ OpenAI/Anthropic integration for content rewriting
- ✅ Automatic content summarization
- ✅ SEO metadata generation
- ✅ Named entity extraction
- ✅ Crawl logging and monitoring
- ✅ Background task support
- ✅ Version control for articles
- ✅ Full-text search capabilities

### Frontend Features ✅
- ✅ Next.js 14 with App Router
- ✅ Magazine-style responsive layout
- ✅ Tailwind CSS styling
- ✅ Shadcn/ui component library ready
- ✅ Dark mode support
- ✅ SEO optimized
- ✅ Vietnamese language support
- ✅ API integration layer
- ✅ Type-safe with TypeScript

### Content Categories (5 Pillars) ✅
1. **Macro & Legal** - Regulations and policies
2. **Commercial Life Insurance** - Life insurance news
3. **Commercial Non-Life Insurance** - Non-life insurance news
4. **Social Security** - Government programs
5. **Insights & Analysis** - Market research
6. **Legal Library** - Document archive

---

## PART 8: NEXT STEPS

### Essential Components to Add:

1. **Frontend Components** (Create these in `components/`):
   - Header with navigation
   - Footer
   - Article card component
   - Hero section
   - Featured articles grid
   - Latest news list
   - Legal updates sidebar
   - Categories grid
   - Search component
   - Pagination

2. **Article Pages**:
   - Create `app/articles/[slug]/page.tsx`
   - Create `app/categories/[slug]/page.tsx`
   - Create `app/legal-docs/[docNumber]/page.tsx`
   - Create `app/companies/[slug]/page.tsx`

3. **Advanced Features**:
   - Search functionality
   - Related articles algorithm
   - Social sharing buttons
   - Comments system (optional)
   - Newsletter subscription
   - RSS feed generation

---

## TROUBLESHOOTING

### Common Issues:

**1. Database Connection Error**
```
Solution: Check DATABASE_URL format
postgresql://username:password@host:port/database
```

**2. Import Errors (Module not found)**
```
Solution: Activate virtual environment
.\venv\Scripts\Activate.ps1
```

**3. CORS Errors in Frontend**
```
Solution: Check ALLOWED_ORIGINS in backend .env includes http://localhost:3000
```

**4. Crawler Not Working**
```
Solution: Check website structure may have changed. Update selectors in crawler code.
```

---

## MONITORING & MAINTENANCE

### View Crawl Logs
```sql
SELECT * FROM crawl_logs ORDER BY started_at DESC LIMIT 20;
```

### Check Article Count
```sql
SELECT status, COUNT(*) FROM articles GROUP BY status;
```

### View Recent Content
```sql
SELECT title, published_at FROM articles 
WHERE status = 'published' 
ORDER BY published_at DESC LIMIT 10;
```

---

## CONTACT & SUPPORT

For questions or issues:
- Check API docs: http://localhost:8000/docs
- Review logs in `logs/app.log`
- Check database for data integrity

---

**🎉 Your Insurance News Platform is Ready!**

The system is now configured for:
- ✅ Automated content crawling
- ✅ AI-powered content rewriting
- ✅ SEO optimization
- ✅ Magazine-style presentation
- ✅ Vietnamese market focus
