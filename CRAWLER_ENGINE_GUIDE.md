# Insurance News Crawler Engine - Part 2 Complete

## Overview
Enhanced crawler system with two specialized modules:

### Module A: Legal Watchdog (`tvpl_crawler_advanced.py`)
**Target**: thuvienphapluat.vn

**Search Queries**:
- "Bảo hiểm" (Insurance)
- "Kinh doanh bảo hiểm" (Insurance Business)
- "Bộ Tài chính bảo hiểm" (Ministry of Finance Insurance)
- "Bảo hiểm xã hội" (Social Insurance)
- "Nghị định bảo hiểm" (Insurance Decrees)
- "Thông tư bảo hiểm" (Insurance Circulars)

**Focus Documents**:
- Nghị định (Decrees)
- Thông tư (Circulars)
- Công văn (Official Dispatches)
- Quyết định (Decisions)

**Extraction Fields**:
- Số hiệu văn bản (Document Number)
- Ngày ban hành (Issue Date)
- Trích yếu (Abstract/Summary)
- Link toàn văn (Full Document Link)
- Status: Còn hiệu lực / Hết hiệu lực (Active/Expired)

**Features**:
✅ Playwright support for JavaScript rendering
✅ Proxy rotation support (configurable)
✅ User-agent spoofing
✅ Anti-bot detection measures
✅ Status checking (Hiệu lực)
✅ Duplicate filtering
✅ Multiple search queries

### Module B: News Aggregator (`news_crawler_advanced.py`)
**Targets**:
- CafeF (Tài chính bucket)
- VnExpress (Kinh doanh)
- Bao Viet Press Releases
- Manulife Vietnam News
- Prudential Vietnam Newsroom

**Keyword Filtering** (Only accept articles containing):
- "Bảo hiểm" (Insurance)
- "Bồi thường" (Compensation/Claims)
- "Lợi nhuận bảo hiểm" (Insurance Profits)
- "Phí bảo hiểm" (Insurance Premiums)
- "Doanh thu bảo hiểm" (Insurance Revenue)
- "Thị trường bảo hiểm" (Insurance Market)

**Features**:
✅ Multi-source crawling
✅ Keyword filtering
✅ Company press release tracking
✅ Content relevance scoring
✅ Duplicate detection

## Installation

### 1. Install Python Dependencies
```powershell
cd d:\insurance\backend
.\venv\Scripts\Activate.ps1
pip install playwright beautifulsoup4 lxml
```

### 2. Install Playwright Browsers
```powershell
playwright install chromium
```

## Usage

### Method 1: Run Full Pipeline
```powershell
# Run both modules
python run_crawlers.py --module full

# Custom parameters
python run_crawlers.py --module full --legal-pages 10 --news-max 20
```

### Method 2: Run Individual Modules
```powershell
# Legal Watchdog only
python run_crawlers.py --module legal --legal-pages 5

# News Aggregator only
python run_crawlers.py --module news --news-max 15
```

### Method 3: Without Playwright (Fallback)
```powershell
# Use requests library instead
python run_crawlers.py --module full --no-playwright
```

### Method 4: Direct Import
```python
from app.crawlers.tvpl_crawler_advanced import TVPLAdvancedCrawler
from app.crawlers.news_crawler_advanced import NewsAggregatorAdvanced

# Legal documents
tvpl = TVPLAdvancedCrawler(use_playwright=True)
docs = tvpl.crawl(max_pages=5)
print(f"Found {len(docs)} legal documents")

# News articles
news = NewsAggregatorAdvanced(use_playwright=True)
articles = news.crawl(
    sources=['cafef', 'vnexpress', 'baoviet'],
    max_articles_per_source=10
)
print(f"Found {len(articles)} relevant articles")
```

## Configuration

### Proxy Setup
Add proxies in `backend/.env`:
```env
PROXY_LIST=http://proxy1.com:8080,http://proxy2.com:8080
```

Or directly in crawler code:
```python
def _load_proxies(self) -> List[str]:
    return [
        'http://proxy1.example.com:8080',
        'http://proxy2.example.com:8080',
    ]
```

### Customize Search Queries
Edit `tvpl_crawler_advanced.py`:
```python
SEARCH_QUERIES = [
    "Your custom query 1",
    "Your custom query 2",
]
```

### Customize News Sources
Edit `news_crawler_advanced.py`:
```python
NEWS_SOURCES = {
    'custom_source': {
        'name': 'Custom Source',
        'url': 'https://example.com',
        'selectors': {...}
    }
}
```

## Features & Anti-Bot Measures

### 1. Playwright Support
- JavaScript rendering
- Network idle detection
- Anti-automation detection bypass

### 2. Proxy Rotation
- Random proxy selection
- Configurable proxy list
- Automatic failover

### 3. User-Agent Spoofing
- Rotates between multiple user agents
- Mimics real browsers
- Random selection

### 4. Rate Limiting
- Random delays between requests (2-6 seconds)
- Configurable delays
- Human-like behavior

### 5. Error Handling
- Automatic retries
- Graceful degradation
- Comprehensive logging

## Output Format

### Legal Documents
```python
{
    'doc_number': '52/2024/NĐ-CP',
    'title': 'Nghị định về kinh doanh bảo hiểm...',
    'doc_type': 'Nghị định',
    'status': 'Active',  # or 'Expired', 'Pending'
    'issue_date': datetime(2024, 12, 1),
    'effective_date': datetime(2025, 1, 1),
    'issuing_body': 'Chính phủ',
    'signer': 'Thủ tướng',
    'abstract': 'Trích yếu văn bản...',
    'content_full': '<p>Nội dung đầy đủ...</p>',
    'original_link': 'https://thuvienphapluat.vn/...',
    'pdf_url': 'https://thuvienphapluat.vn/...pdf',
    'tags': ['bảo hiểm', 'kinh doanh'],
    'crawled_at': datetime.now()
}
```

### News Articles
```python
{
    'source_name': 'cafef',
    'source_display_name': 'CafeF',
    'source_url': 'https://cafef.vn/...',
    'title': 'Thị trường bảo hiểm tăng trưởng 15%...',
    'summary': 'Tóm tắt bài viết...',
    'featured_image_url': 'https://...',
    'is_company_source': False,
    'crawled_at': datetime.now()
}
```

## Scheduling (Production)

### Option 1: Windows Task Scheduler
Create `crawl_legal.ps1`:
```powershell
cd d:\insurance\backend
.\venv\Scripts\Activate.ps1
python run_crawlers.py --module legal
```

Schedule in Task Scheduler:
- Legal: Every 6 hours
- News: Every 2 hours

### Option 2: Celery Beat
```python
from celery import Celery
from celery.schedules import crontab

app = Celery('insurance_crawler')

@app.task
def crawl_legal_docs():
    # Run legal watchdog
    pass

@app.task
def crawl_news():
    # Run news aggregator
    pass

app.conf.beat_schedule = {
    'crawl-legal-every-6-hours': {
        'task': 'crawl_legal_docs',
        'schedule': crontab(minute=0, hour='*/6'),
    },
    'crawl-news-every-2-hours': {
        'task': 'crawl_news',
        'schedule': crontab(minute=0, hour='*/2'),
    },
}
```

## Troubleshooting

### Issue: Playwright not found
```powershell
pip install playwright
playwright install chromium
```

### Issue: TVPL blocks requests
- Enable Playwright mode: `use_playwright=True`
- Add proxies in configuration
- Increase delay between requests

### Issue: No articles match keywords
- Check keyword list in `REQUIRED_KEYWORDS`
- Verify website selectors are correct
- Try without keyword filtering first

### Issue: Selectors not working
- Websites change their HTML structure
- Inspect target site and update selectors
- Use browser DevTools to find correct selectors

## Logs
Crawler logs are saved to:
- `crawler.log` (file)
- Console output

View logs:
```powershell
Get-Content crawler.log -Tail 50
```

## Performance
Estimated crawl times (with Playwright):
- Legal Watchdog (5 pages): ~3-5 minutes
- News Aggregator (5 sources): ~2-4 minutes
- Full Pipeline: ~5-10 minutes

## Next Steps
1. Test crawlers with actual websites
2. Adjust selectors based on real site structures
3. Add more news sources
4. Integrate with AI rewriting pipeline
5. Set up automated scheduling
