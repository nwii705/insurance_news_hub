-- Insurance News Niche Site Database Schema
-- PostgreSQL Database for Vietnam Insurance Industry News Platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable full-text search extension
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- =============================================
-- TABLE: categories (5 Pillars)
-- =============================================
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert 5 Pillars + Library
INSERT INTO categories (name, slug, description, sort_order) VALUES
('Macro & Legal', 'macro-legal', 'Regulations, policies, and legal framework for insurance industry', 1),
('Commercial Life Insurance', 'commercial-life', 'Life insurance companies, products, and market analysis', 2),
('Commercial Non-Life Insurance', 'commercial-nonlife', 'Non-life insurance companies, products, and market trends', 3),
('Social Security', 'social-security', 'Social insurance, health insurance, and government programs', 4),
('Insights & Analysis', 'insights', 'Market research, trends, and expert opinions', 5),
('Legal Library', 'library', 'Archive of legal documents and regulations', 6);

-- =============================================
-- TABLE: companies (Insurance Companies)
-- =============================================
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    slug VARCHAR(255) NOT NULL UNIQUE,
    type VARCHAR(50) CHECK (type IN ('Life', 'Non-Life', 'Both', 'Other')),
    logo_url TEXT,
    website TEXT,
    description TEXT,
    established_date DATE,
    
    -- Financial data stored as JSONB for flexibility
    financial_reports JSONB DEFAULT '[]'::jsonb,
    -- Example structure:
    -- [
    --   {
    --     "year": 2024,
    --     "quarter": "Q3",
    --     "revenue": 1500000000000,
    --     "profit": 120000000000,
    --     "premium_income": 1400000000000,
    --     "assets": 5000000000000
    --   }
    -- ]
    
    contact_info JSONB DEFAULT '{}'::jsonb,
    -- Example: {"phone": "...", "email": "...", "address": "..."}
    
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for company search
CREATE INDEX idx_companies_name_trgm ON companies USING gin (name gin_trgm_ops);
CREATE INDEX idx_companies_type ON companies (type);

-- =============================================
-- TABLE: legal_docs (Legal Documents from TVPL)
-- =============================================
CREATE TABLE legal_docs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Document identification
    doc_number VARCHAR(100) NOT NULL UNIQUE,  -- Số hiệu (e.g., "52/2024/NĐ-CP")
    doc_type VARCHAR(100),  -- Type: Nghị định, Thông tư, Quyết định, etc.
    title TEXT NOT NULL,
    
    -- Dates
    issue_date DATE NOT NULL,  -- Ngày ban hành
    effective_date DATE,       -- Ngày hiệu lực
    expiry_date DATE,          -- Ngày hết hiệu lực (if any)
    
    -- Authority
    signer VARCHAR(255),       -- Người ký
    issuing_body VARCHAR(255), -- Cơ quan ban hành
    
    -- Content
    content_summary TEXT,      -- AI-generated summary
    content_full TEXT,         -- Full text content
    
    -- Source
    original_link TEXT NOT NULL,  -- Link to TVPL
    pdf_url TEXT,              -- PDF download link
    
    -- Relationships
    replaces_doc_id UUID REFERENCES legal_docs(id), -- Document this replaces
    amended_by JSONB DEFAULT '[]'::jsonb,           -- Array of doc IDs that amend this
    
    -- Categorization
    tags TEXT[] DEFAULT '{}',
    category_id UUID REFERENCES categories(id),
    
    -- Metadata
    view_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    crawled_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for legal_docs
CREATE INDEX idx_legal_docs_doc_number ON legal_docs (doc_number);
CREATE INDEX idx_legal_docs_issue_date ON legal_docs (issue_date DESC);
CREATE INDEX idx_legal_docs_effective_date ON legal_docs (effective_date DESC);
CREATE INDEX idx_legal_docs_category ON legal_docs (category_id);
CREATE INDEX idx_legal_docs_tags ON legal_docs USING gin (tags);
CREATE INDEX idx_legal_docs_title_trgm ON legal_docs USING gin (title gin_trgm_ops);

-- Full-text search on content
CREATE INDEX idx_legal_docs_content_search ON legal_docs USING gin (
    to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(content_summary, ''))
);

-- =============================================
-- TABLE: articles (News Articles)
-- =============================================
CREATE TABLE articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Content
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) NOT NULL UNIQUE,
    summary TEXT,  -- Meta description, AI-generated
    content_html TEXT NOT NULL,  -- Main article content (HTML)
    
    -- Source information
    source_url TEXT,  -- Original article URL
    source_name VARCHAR(255),  -- e.g., "VnExpress", "Cafef"
    original_author VARCHAR(255),
    
    -- Author type and disclaimer
    author_type VARCHAR(20) DEFAULT 'Bot' CHECK (author_type IN ('Bot', 'Human')),
    disclaimer_level VARCHAR(20) DEFAULT 'Low' CHECK (disclaimer_level IN ('Low', 'Medium', 'High')),
    -- Disclaimer levels:
    -- Low: Factual news, official announcements
    -- Medium: Analysis, opinions
    -- High: Predictions, speculative content
    
    -- Categorization
    category_id UUID REFERENCES categories(id),
    tags TEXT[] DEFAULT '{}',
    
    -- Related entities
    related_companies UUID[] DEFAULT '{}',  -- Array of company IDs
    related_legal_docs UUID[] DEFAULT '{}', -- Array of legal_doc IDs
    
    -- SEO and metadata
    meta_title VARCHAR(255),
    meta_description TEXT,
    featured_image_url TEXT,
    featured_image_alt TEXT,
    
    -- Publishing
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    published_at TIMESTAMP WITH TIME ZONE,
    scheduled_for TIMESTAMP WITH TIME ZONE,
    
    -- Engagement metrics
    view_count INTEGER DEFAULT 0,
    share_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    is_trending BOOLEAN DEFAULT false,
    
    -- Timestamps
    crawled_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP WITH TIME ZONE,  -- When LLM processing completed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for articles
CREATE INDEX idx_articles_slug ON articles (slug);
CREATE INDEX idx_articles_category ON articles (category_id);
CREATE INDEX idx_articles_published_at ON articles (published_at DESC NULLS LAST);
CREATE INDEX idx_articles_status ON articles (status);
CREATE INDEX idx_articles_author_type ON articles (author_type);
CREATE INDEX idx_articles_tags ON articles USING gin (tags);
CREATE INDEX idx_articles_featured ON articles (is_featured) WHERE is_featured = true;
CREATE INDEX idx_articles_trending ON articles (is_trending) WHERE is_trending = true;
CREATE INDEX idx_articles_related_companies ON articles USING gin (related_companies);
CREATE INDEX idx_articles_related_legal_docs ON articles USING gin (related_legal_docs);

-- Full-text search on articles
CREATE INDEX idx_articles_content_search ON articles USING gin (
    to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(summary, '') || ' ' || coalesce(content_html, ''))
);

-- =============================================
-- TABLE: crawl_logs (Track Crawling Activity)
-- =============================================
CREATE TABLE crawl_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source VARCHAR(255) NOT NULL,  -- 'TVPL', 'VnExpress', etc.
    crawl_type VARCHAR(50),  -- 'legal_docs', 'news_articles'
    status VARCHAR(50) CHECK (status IN ('started', 'completed', 'failed')),
    items_found INTEGER DEFAULT 0,
    items_processed INTEGER DEFAULT 0,
    error_message TEXT,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX idx_crawl_logs_source ON crawl_logs (source);
CREATE INDEX idx_crawl_logs_started_at ON crawl_logs (started_at DESC);

-- =============================================
-- TABLE: article_versions (Version Control)
-- =============================================
CREATE TABLE article_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    title VARCHAR(500),
    content_html TEXT,
    summary TEXT,
    edited_by VARCHAR(100),  -- 'Bot' or human editor name
    change_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (article_id, version_number)
);

CREATE INDEX idx_article_versions_article_id ON article_versions (article_id);

-- =============================================
-- TABLE: seo_metadata (SEO Tracking)
-- =============================================
CREATE TABLE seo_metadata (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_type VARCHAR(50) CHECK (content_type IN ('article', 'legal_doc', 'category')),
    content_id UUID NOT NULL,
    
    -- SEO metrics
    target_keywords TEXT[],
    search_ranking JSONB DEFAULT '{}'::jsonb,  -- {"keyword": "insurance law", "position": 3, "date": "2024-01-01"}
    backlinks INTEGER DEFAULT 0,
    
    -- Social metrics
    facebook_shares INTEGER DEFAULT 0,
    twitter_shares INTEGER DEFAULT 0,
    linkedin_shares INTEGER DEFAULT 0,
    
    last_checked_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_seo_metadata_content ON seo_metadata (content_type, content_id);

-- =============================================
-- FUNCTIONS AND TRIGGERS
-- =============================================

-- Update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_legal_docs_updated_at BEFORE UPDATE ON legal_docs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_seo_metadata_updated_at BEFORE UPDATE ON seo_metadata
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- VIEWS FOR COMMON QUERIES
-- =============================================

-- View: Recently published articles with category info
CREATE VIEW v_recent_articles AS
SELECT 
    a.id,
    a.title,
    a.slug,
    a.summary,
    a.featured_image_url,
    a.author_type,
    a.published_at,
    a.view_count,
    c.name as category_name,
    c.slug as category_slug
FROM articles a
LEFT JOIN categories c ON a.category_id = c.id
WHERE a.status = 'published'
ORDER BY a.published_at DESC;

-- View: Legal documents with effective status
CREATE VIEW v_effective_legal_docs AS
SELECT 
    ld.*,
    c.name as category_name,
    CASE 
        WHEN ld.effective_date <= CURRENT_DATE AND (ld.expiry_date IS NULL OR ld.expiry_date > CURRENT_DATE)
        THEN 'Active'
        WHEN ld.effective_date > CURRENT_DATE
        THEN 'Pending'
        ELSE 'Expired'
    END as status
FROM legal_docs ld
LEFT JOIN categories c ON ld.category_id = c.id;

-- View: Company statistics
CREATE VIEW v_company_stats AS
SELECT 
    c.id,
    c.name,
    c.type,
    COUNT(DISTINCT a.id) as article_count,
    MAX(a.published_at) as last_article_date
FROM companies c
LEFT JOIN articles a ON c.id = ANY(a.related_companies)
WHERE a.status = 'published'
GROUP BY c.id, c.name, c.type;

-- =============================================
-- SAMPLE DATA (Optional)
-- =============================================

-- Insert sample companies
INSERT INTO companies (name, slug, type, description) VALUES
('Bảo hiểm Xã hội Việt Nam', 'bhxh-vn', 'Other', 'Vietnam Social Security'),
('Bảo Việt Nhân Thọ', 'baoviet-life', 'Life', 'Leading life insurance company in Vietnam'),
('Bảo hiểm PVI', 'pvi-insurance', 'Non-Life', 'Leading non-life insurance provider'),
('Manulife Việt Nam', 'manulife-vn', 'Life', 'International life insurance company'),
('Bảo Minh', 'bao-minh', 'Both', 'Comprehensive insurance services');

-- Grant permissions (adjust as needed for your setup)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_app_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_app_user;

COMMENT ON TABLE categories IS '5 content pillars for the insurance news site';
COMMENT ON TABLE companies IS 'Insurance companies operating in Vietnam';
COMMENT ON TABLE legal_docs IS 'Legal documents crawled from Thu Vien Phap Luat';
COMMENT ON TABLE articles IS 'News articles crawled and processed by AI';
COMMENT ON TABLE crawl_logs IS 'Track all crawling activities for monitoring';
COMMENT ON TABLE article_versions IS 'Version history for content auditing';
COMMENT ON TABLE seo_metadata IS 'SEO tracking and social media metrics';
