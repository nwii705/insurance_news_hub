# 🏢 Insurance News Vietnam Platform

> **Complete end-to-end insurance journalism platform for Vietnam**  
> Database → Crawlers → AI Editor → Magazine Frontend → SEO & Legal Safety

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104-green)](https://fastapi.tiangolo.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.11-yellow)](https://www.python.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-green)](https://www.mongodb.com/)

---

## 🎯 Project Overview

**Insurance News Vietnam** is a comprehensive platform for insurance journalism in Vietnam, featuring automated content aggregation, AI-powered editing, magazine-style presentation, and comprehensive SEO optimization with legal safety measures.

### Key Features

✅ **Database & API**: MongoDB Atlas with Beanie ODM, FastAPI REST API  
✅ **Advanced Crawlers**: Proxy rotation, user-agent spoofing, keyword filtering  
✅ **AI Content Engine**: Claude/Gemini/Mistral-powered rewriting and content processing  
✅ **Magazine Frontend**: Trustworthy Blue theme, 5 Pillars navigation, data visualizations  
✅ **SEO Optimization**: Schema.org NewsArticle & Legislation schemas, trending keywords  
✅ **Legal Safety**: Automated disclaimers, source attribution, dispute warnings

---

## 📋 Parts Completed

### ✅ Part 1: Database & API Foundation

- MongoDB Atlas with Beanie ODM (articles, legal_docs, companies, resources)
- Document models with references
- FastAPI REST API with async CRUD operations
- Basic crawlers for news and legal docs

📖 **Documentation**: [PART1_DATABASE_API.md](./PART1_DATABASE_API.md)

### ✅ Part 2: Advanced Crawler Engine

- **Legal Watchdog**: TVPL crawler with proxy rotation, status tracking
- **News Aggregator**: Multi-source crawling with keyword filtering
- Retry mechanisms, duplicate detection

📖 **Documentation**: [PART2_ADVANCED_CRAWLERS.md](./PART2_ADVANCED_CRAWLERS.md)

### ✅ Part 3: AI Content Engine

- System Prompt: "Veteran Insurance Journalist in Vietnam"
- Task 1: Rewrite news with 5Ws structure + dispute disclaimers
- Task 2: Summarize legal docs as "Bản tin chính sách"

📖 **Documentation**: [PART3_AI_CONTENT_ENGINE.md](./PART3_AI_CONTENT_ENGINE.md)

### ✅ Part 4: Frontend UI/UX (Magazine Style)

- Global Design System (Trustworthy Blue, Merriweather serif)
- 5 Pillars navigation (Vĩ mô, Thương mại, Xã hội, Tranh luận, Thư viện)
- Homepage sections: Hero, Tabs, Social Grid, Market Data Widget
- Library page with hospitals, garages, forms

📖 **Documentation**: [PART4_FRONTEND_MAGAZINE.md](./PART4_FRONTEND_MAGAZINE.md)

### ✅ Part 5: SEO & Legal Safety Strategy

- Schema.org: NewsArticle, Legislation, BreadcrumbList, FAQPage
- Trending keywords auto-injection (Google Trends)
- Global DisclaimerFooter component
- Article-specific disclaimers (legal, product, opinion, dispute, AI)

📖 **Documentation**: [PART5_SEO_LEGAL_SAFETY.md](./PART5_SEO_LEGAL_SAFETY.md)

---

## 🏗️ Architecture

```
insurance/
├── backend/                       # FastAPI backend
│   ├── app/
│   │   ├── models/               # Beanie ODM documents
│   │   ├── schemas/              # Pydantic validation
│   │   ├── api/                  # REST endpoints
│   │   ├── crawlers/             # News & legal crawlers
│   │   │   ├── tvpl_crawler_advanced.py
│   │   │   └── news_crawler_advanced.py
│   │   ├── services/             # AI content processing
│   │   │   ├── prompt_templates.py
│   │   │   └── llm_service.py
│   │   └── database.py           # MongoDB connection
│
├── frontend/                      # Next.js 14 App Router
│   ├── app/
│   │   ├── articles/[slug]/      # Article detail
│   │   ├── legal-docs/[docNumber]/ # Legal doc detail
│   │   └── thu-vien/             # Library page
│   ├── components/
│   │   ├── layout/
│   │   │   ├── header.tsx        # 5 Pillars nav
│   │   │   └── footer.tsx
│   │   ├── home/                 # Homepage sections
│   │   └── shared/
│   │       └── disclaimer-footer.tsx
│   └── lib/
│       └── seo/
│           ├── schema.ts         # Schema.org generators
│           └── metadata.ts       # Next.js metadata utils
│
└── database/
    └── schema.sql                # Legacy SQL schema (not used with MongoDB)
```

---

## 🛠️ Technologies

### Backend

- **Framework**: FastAPI 0.104+
- **Database**: MongoDB Atlas 7.0+
- **ODM**: Beanie (Motor async driver)
- **AI**: Claude API, Google Gemini, Mistral AI
- **Crawlers**: BeautifulSoup4, httpx
- **Validation**: Pydantic v2

### Frontend

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS + Shadcn/ui
- **Fonts**: Merriweather (serif), Inter (sans-serif)
- **Charts**: Recharts
- **Icons**: Lucide React

---

## 🚀 Installation

### Prerequisites

- Node.js 18+
- Python 3.11+
- MongoDB Atlas account (free tier)
- AI API Keys (Claude, Gemini, or Mistral)

### 1. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Configure .env
cp .env.example .env
# Edit MONGODB_URI, AI API keys (GEMINI_API_KEY, MISTRAL_API_KEY, ANTHROPIC_API_KEY)

# Start server (MongoDB connection auto-initializes)
python main.py
# Or: uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm install recharts

# Configure .env.local
cp .env.local.example .env.local
# Edit NEXT_PUBLIC_API_URL

# Start dev server
npm run dev
```

### 3. Database Setup

**MongoDB Atlas** (Recommended):

1. Tạo tài khoản miễn phí tại [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Tạo cluster mới (chọn Free tier M0)
3. Tạo database user và password
4. Whitelist IP: `0.0.0.0/0` (cho development)
5. Lấy connection string:
   ```
   mongodb+srv://<username>:<password>@cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Cập nhật vào `.env`:
   ```bash
   MONGODB_URI=mongodb+srv://your-username:your-password@cluster.xxxxx.mongodb.net/
   MONGODB_DB_NAME=insurance_vietnam_db
   ```

**Hoặc dùng MongoDB local**:

```bash
# Install MongoDB Community
# https://www.mongodb.com/try/download/community

# Start MongoDB
mongod --dbpath /data/db

# Update .env
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=insurance_vietnam_db
```

---

## 📖 Usage

### Running Crawlers

```bash
# News crawler
cd backend
python -m app.crawlers.news_crawler_advanced

# Legal document crawler
python -m app.crawlers.tvpl_crawler_advanced
```

### AI Content Processing

```bash
# Process articles with AI
python run_crawlers_async.py  # Crawls and processes articles

# Check processed content
python check_database.py
```

### API Endpoints

**Base URL**: `http://localhost:8000`

```bash
# Health check
GET /health

# Articles
GET /api/articles?limit=10&category=commercial
GET /api/articles/{id}
GET /api/articles/slug/{slug}

# Legal documents
GET /api/legal-docs?status=active&limit=5
GET /api/legal-docs/{doc_number}

# Companies
GET /api/companies

# Resources (Library)
GET /api/resources?type=hospital
GET /api/resources?type=garage
GET /api/resources?type=form
```

**Swagger UI**: http://localhost:8000/docs

---

## 🌐 Deployment

### Frontend (Vercel)

```bash
cd frontend
vercel --prod
```

**Environment**:

- `NEXT_PUBLIC_API_URL`: https://api.insurancenews.vn
- `NEXT_PUBLIC_SITE_URL`: https://insurancenews.vn

### Backend (Railway/Render)

```bash
cd backend
railway up  # or render deploy
```

**Environment**:

- `MONGODB_URI`: MongoDB Atlas connection string
- `MONGODB_DB_NAME`: Database name
- `GEMINI_API_KEY`: Google Gemini API key
- `MISTRAL_API_KEY`: Mistral AI API key
- `ALLOWED_ORIGINS`: Frontend URL

---

## 📊 SEO Features

### Schema.org Implementation

**NewsArticle** (Articles):

```json
{
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  "headline": "Article title",
  "author": { "@type": "Person", "name": "Author" },
  "publisher": { "@type": "Organization", "name": "Insurance Vietnam" },
  "datePublished": "2025-12-01",
  "image": "featured-image.jpg"
}
```

**Legislation** (Legal Docs):

```json
{
  "@context": "https://schema.org",
  "@type": "Legislation",
  "legislationType": "Thông tư",
  "identifier": "50/2017/TT-BTC",
  "legislationLegalForce": "InForce",
  "publisher": { "@type": "GovernmentOrganization" }
}
```

### Trending Keywords

- bảo hiểm lừa đảo
- lãi suất manulife
- rút bhxh 1 lần
- tra cứu bhyt
- quy trình bồi thường

---

## 🔒 Legal Safety

### Disclaimer System

**Global Footer** (all pages):

> Thông tin trên website chỉ mang tính chất tham khảo và tổng hợp. Chúng tôi không phải là đơn vị tư vấn luật chính thức.

**Inline Badges**:

- `<DisclaimerBadge type="legal" />` - Legal docs
- `<DisclaimerBadge type="product" />` - Product reviews
- `<DisclaimerBadge type="opinion" />` - Opinion articles

**Special Disclaimers**:

- `<DisputeDisclaimer />` - Controversial content
- `<AIContentDisclaimer />` - AI-rewritten articles
- `<SourceAttribution />` - Original source links

---

## 🔍 Kiểm tra hệ thống

### Kiểm tra Database

```bash
cd backend
python check_database.py
```

### Kiểm tra API

- **Swagger UI**: http://localhost:8000/docs
- **API Health**: http://localhost:8000/health

### SEO Validation

- **Google Rich Results Test**: https://search.google.com/test/rich-results
- **Schema Validator**: https://validator.schema.org/

---

## 📞 Contact

- **Website**: https://insurancenews.vn
- **Email**: contact@insurancevn.com
- **Phone**: +84 28 1234 5678
- **Location**: Hanoi & Ho Chi Minh City, Vietnam

---

## 📄 License

MIT License - See [LICENSE](./LICENSE) for details

---

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

---

## 🎓 Acknowledgments

- **Thư Viện Pháp Luật** (TVPL) for legal documents
- **Vietnamese news sources** for content
- **Anthropic** for Claude AI API
- **Next.js** and **FastAPI** communities

---

**Built with ❤️ for the Vietnamese insurance industry**

📚 **Complete Documentation**: See individual PART\*.md files for detailed implementation guides
