# Quick Start - Advanced Crawler Testing

## Step 1: Install Dependencies
```powershell
cd d:\insurance\backend
.\venv\Scripts\Activate.ps1
python install_crawler_deps.py
```

Or manually:
```powershell
pip install playwright beautifulsoup4 lxml
playwright install chromium
```

## Step 2: Test Individual Crawlers

### Test TVPL Legal Watchdog
```powershell
# Dry run (no database)
python -m app.crawlers.tvpl_crawler_advanced

# Expected output:
# - Searches 6 different queries
# - Extracts Nghị định, Thông tư, Công văn
# - Shows status (Còn hiệu lực / Hết hiệu lực)
# - Displays document numbers, dates, abstracts
```

### Test News Aggregator
```powershell
# Dry run (no database)
python -m app.crawlers.news_crawler_advanced

# Expected output:
# - Crawls CafeF, VnExpress, company sites
# - Filters by keywords (Bảo hiểm, etc.)
# - Shows article titles and sources
```

## Step 3: Run Full Pipeline

### Quick Test (Small batch)
```powershell
python run_crawlers.py --module full --legal-pages 2 --news-max 5
```

### Production Run (Full batch)
```powershell
python run_crawlers.py --module full --legal-pages 10 --news-max 20
```

### Run Only One Module
```powershell
# Legal only
python run_crawlers.py --module legal --legal-pages 5

# News only
python run_crawlers.py --module news --news-max 15
```

## Step 4: Verify Results

### Check Logs
```powershell
Get-Content crawler.log -Tail 100
```

### Check Database
```sql
-- Count crawled documents
SELECT COUNT(*) FROM legal_docs;

-- Count crawled articles
SELECT COUNT(*) FROM articles;

-- View recent crawl logs
SELECT * FROM crawl_logs ORDER BY created_at DESC LIMIT 10;
```

## Troubleshooting

### Issue: Playwright not found
```powershell
# Reinstall
pip uninstall playwright
pip install playwright
playwright install chromium
```

### Issue: Sites blocking requests
```powershell
# Add proxies to .env
echo "PROXY_LIST=http://proxy1.com:8080,http://proxy2.com:8080" >> .env

# Or disable Playwright (use requests)
python run_crawlers.py --module full --no-playwright
```

### Issue: No articles match keywords
Check `news_crawler_advanced.py` line 48:
```python
REQUIRED_KEYWORDS = [
    "bảo hiểm",  # Insurance
    # Add more keywords if needed
]
```

### Issue: Selectors not working
Websites change. Update selectors in crawler files:
- `NEWS_SOURCES` dict in `news_crawler_advanced.py`
- Selector strings in extraction methods

## Performance Tips

1. **Use Playwright for JavaScript sites**
   - VnExpress, CafeF load content via JS
   - Playwright renders JavaScript
   - Slower but more reliable

2. **Use requests for static sites**
   - TVPL has mostly static HTML
   - Faster but may miss dynamic content
   - Use `--no-playwright` flag

3. **Optimize batch sizes**
   - Legal: 5-10 pages per run
   - News: 10-20 articles per source
   - Adjust based on your needs

4. **Schedule crawls**
   - Legal: Every 6-12 hours (updates infrequent)
   - News: Every 1-2 hours (updates frequent)
   - Use Windows Task Scheduler or Celery

## Next Steps

1. **Verify data quality**
   - Check database for duplicates
   - Verify content extraction accuracy
   - Test AI rewriting (if enabled)

2. **Configure AI processing**
   - Set `AI_REWRITE_ENABLED=true` in .env
   - Add OpenAI or Anthropic API keys
   - Test content rewriting

3. **Set up automation**
   - Create scheduled tasks
   - Monitor crawl logs
   - Set up alerts for failures

4. **Build frontend**
   - Display articles on website
   - Show legal documents
   - Add search functionality
