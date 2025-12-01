# MongoDB Migration Complete

## ✅ Chuyển đổi hoàn tất

Dự án đã được chuyển đổi **hoàn toàn sang MongoDB** với Beanie ODM (async).

## 📁 Files mới

### 1. `run_crawlers_async.py` (file chính)
Crawler engine async với MongoDB support đầy đủ:
- Async database operations
- Tự động lưu vào MongoDB
- Beanie ODM integration

### 2. `app/services/content_processor_async.py`
Content processor async version:
- `process_legal_documents_from_data()` - async
- `process_news_articles_from_data()` - async
- Tích hợp MongoDB với Beanie

### 3. `run_crawlers.py` (deprecated)
File cũ giữ lại để backward compatibility, tự động redirect sang async version.

## 🚀 Cách sử dụng

### Chạy full pipeline (mặc định)
```bash
python run_crawlers_async.py
```

### Chỉ crawl legal documents
```bash
python run_crawlers_async.py --module legal --legal-pages 10
```

### Chỉ crawl news articles
```bash
python run_crawlers_async.py --module news --news-max 20
```

### Tắt Playwright (dùng requests only)
```bash
python run_crawlers_async.py --no-playwright
```

## 📊 Database Structure

### MongoDB Collections:
- **articles** - News articles
- **legal_documents** - Legal docs from TVPL
- **crawl_logs** - Tracking logs
- **categories** - Content categories
- **companies** - Insurance companies
- **seo_metadata** - SEO data

### Models (Beanie Documents):
```python
from app.models.article import Article
from app.models.legal_doc import LegalDocument
from app.models.crawl_log import CrawlLog
```

## 🔧 Database Configuration

File `.env`:
```env
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=insurance_vietnam_db
```

## 🎯 Quy trình hoạt động

1. **Initialize** - Kết nối MongoDB + khởi tạo crawlers
2. **Crawl** - Thu thập dữ liệu (sync operation)
3. **Process** - Xử lý AI (optional)
4. **Save** - Lưu vào MongoDB (async)
5. **Cleanup** - Đóng connections

## ⚡ Performance

- **Async I/O** - Database operations không block
- **Batch insert** - Hiệu quả hơn
- **Connection pooling** - Motor handles automatically

## 🔄 Migration từ SQL

Nếu bạn có data cũ từ PostgreSQL/SQLite:

```python
# TODO: Tạo migration script nếu cần
# Chuyển từ SQLAlchemy models sang Beanie documents
```

## ✨ Next Steps

1. ✅ MongoDB async hoàn tất
2. ⏳ API endpoints update (FastAPI đã async sẵn)
3. ⏳ Frontend integration (không thay đổi)
4. ⏳ Deployment với MongoDB Atlas (production)

## 🐛 Known Issues

- Type hints trong Beanie có thể hiện warnings (không ảnh hưởng runtime)
- `insert()` và `save()` là async methods của Beanie

## 📝 Notes

- File `content_processor.py` cũ (SQLAlchemy) vẫn tồn tại cho reference
- Tất cả models đã là Beanie Documents
- Database connection tự động đóng khi script kết thúc
