"""
Test the AI Content Engine with sample data.
Demonstrates news rewriting and legal document summarization.
"""

import sys
import json
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.services.prompt_templates import (
    InsuranceJournalistPrompts,
    PromptExamples,
    AIContentEngineConfig
)


def test_news_rewrite_prompt():
    """Test the news article rewriting prompt generation."""
    
    print("=" * 80)
    print("TEST 1: NEWS ARTICLE REWRITING PROMPT")
    print("=" * 80)
    print()
    
    # Sample news article
    original_title = "Bảo Việt đạt lợi nhuận 1.200 tỷ trong quý 3, tăng 20% so với cùng kỳ"
    original_content = """
    Công ty Cổ phần Bảo Việt (BVH: HOSE) vừa công bố báo cáo tài chính quý 3/2024 
    với những con số ấn tượng. Lợi nhuận sau thuế đạt 1.200 tỷ đồng, tăng 20% so với 
    cùng kỳ năm ngoái. Tổng doanh thu phí bảo hiểm đạt 8.500 tỷ đồng.
    
    Theo ông Nguyễn Văn A, Tổng Giám đốc Bảo Việt, kết quả này đến từ chiến lược 
    tập trung vào bảo hiểm nhân thọ và mở rộng kênh phân phối số. Tỷ lệ bồi thường 
    giảm xuống còn 68%, thấp hơn mức 72% của quý 2.
    
    Tuy nhiên, một số khách hàng phản ánh quy trình bồi thường còn chậm, đặc biệt 
    với các trường hợp tranh chấp phức tạp. Bảo Việt cho biết đang cải thiện quy trình 
    xử lý hồ sơ để rút ngắn thời gian.
    """
    
    prompts = InsuranceJournalistPrompts.get_news_rewrite_prompt(
        original_title=original_title,
        original_content=original_content,
        source_name="CafeF",
        published_date="2024-11-15"
    )
    
    print("📰 Original Article:")
    print(f"Title: {original_title}")
    print(f"Content: {original_content[:200]}...")
    print()
    print("-" * 80)
    print()
    print("🤖 SYSTEM PROMPT (AI's Identity):")
    print(prompts["system_prompt"][:500] + "...")
    print()
    print("-" * 80)
    print()
    print("📋 USER PROMPT (Task Instructions):")
    print(prompts["user_prompt"][:1000] + "...")
    print()
    print("✅ Expected Output Structure:")
    print("""
    {
        "rewritten_title": "New engaging title",
        "lead_paragraph": "5Ws paragraph",
        "analysis_section": "Analysis with context",
        "impact_section": "Impact on stakeholders",
        "disclaimer": "Disclaimer if dispute mentioned",
        "conclusion": "Closing statement",
        "meta_description": "SEO description",
        "tags": ["tag1", "tag2"],
        "estimated_reading_time": 5
    }
    """)
    print()
    print("🔔 NOTE: This article mentions disputes, so disclaimer MUST be added!")
    print()


def test_legal_summary_prompt():
    """Test the legal document summarization prompt generation."""
    
    print("=" * 80)
    print("TEST 2: LEGAL DOCUMENT POLICY BRIEF")
    print("=" * 80)
    print()
    
    # Sample legal document
    doc_number = "52/2024/NĐ-CP"
    doc_type = "Nghị định"
    doc_title = "Nghị định về kinh doanh bảo hiểm và bảo hiểm bắt buộc"
    doc_content = """
    CHÍNH PHỦ
    
    Căn cứ Luật Tổ chức Chính phủ ngày 19 tháng 6 năm 2015;
    Căn cứ Luật Kinh doanh bảo hiểm ngày 16 tháng 6 năm 2000;
    Theo đề nghị của Bộ trưởng Bộ Tài chính,
    
    NGHỊ ĐỊNH:
    
    Chương I
    QUY ĐỊNH CHUNG
    
    Điều 1. Phạm vi điều chỉnh
    Nghị định này quy định chi tiết về:
    1. Điều kiện kinh doanh bảo hiểm
    2. Hoạt động đại lý, môi giới bảo hiểm
    3. Hoa hồng và chi phí quản lý
    4. Dự phòng nghiệp vụ
    
    Điều 2. Về hoa hồng đại lý
    1. Hoa hồng tối đa cho đại lý bảo hiểm nhân thọ: 30% phí bảo hiểm năm đầu
    2. Hoa hồng tối đa cho đại lý bảo hiểm phi nhân thọ: 20% phí bảo hiểm
    3. Công ty phải công khai tỷ lệ hoa hồng trên website
    
    Điều 3. Về công khai thông tin
    1. Công ty bảo hiểm phải công bố tỷ lệ bồi thường hàng quý
    2. Công bố báo cáo tài chính đã kiểm toán
    3. Công khai danh sách đại lý chính thức
    
    Điều 15. Hiệu lực thi hành
    Nghị định này có hiệu lực từ ngày 15 tháng 01 năm 2025.
    Nghị định số 45/2020/NĐ-CP hết hiệu lực kể từ ngày Nghị định này có hiệu lực.
    """
    
    prompts = InsuranceJournalistPrompts.get_legal_summary_prompt(
        doc_number=doc_number,
        doc_type=doc_type,
        doc_title=doc_title,
        doc_content=doc_content,
        issue_date="2024-12-01",
        effective_date="2025-01-15",
        issuing_body="Chính phủ"
    )
    
    print("📜 Legal Document:")
    print(f"Type: {doc_type}")
    print(f"Number: {doc_number}")
    print(f"Title: {doc_title}")
    print(f"Issue Date: 2024-12-01")
    print(f"Effective Date: 2025-01-15")
    print()
    print("-" * 80)
    print()
    print("🤖 SYSTEM PROMPT:")
    print(prompts["system_prompt"][:500] + "...")
    print()
    print("-" * 80)
    print()
    print("📋 USER PROMPT (Task Instructions):")
    print(prompts["user_prompt"][:1500] + "...")
    print()
    print("✅ Expected Output Structure:")
    print("""
    {
        "policy_brief_title": "[Mới] Nghị định 52/2024/NĐ-CP: ...",
        "key_changes": [
            "Hoa hồng đại lý giảm từ 35% xuống 30%",
            "Bắt buộc công khai tỷ lệ bồi thường hàng quý",
            "..."
        ],
        "affected_parties": {
            "consumers": "Impact on consumers",
            "agents": "Impact on agents",
            "insurers": "Impact on companies"
        },
        "recommended_actions": {
            "for_consumers": ["Action 1", "Action 2"],
            "for_agents": ["Action 1", "Action 2"],
            "for_insurers": ["Action 1", "Action 2"]
        },
        "timeline": {
            "issue_date": "2024-12-01",
            "effective_date": "2025-01-15"
        }
    }
    """)
    print()


def show_configuration():
    """Display AI Content Engine configuration."""
    
    print("=" * 80)
    print("AI CONTENT ENGINE CONFIGURATION")
    print("=" * 80)
    print()
    
    print("📊 Model Settings:")
    print(f"  Default Model: {AIContentEngineConfig.DEFAULT_MODEL}")
    print(f"  Fallback Model: {AIContentEngineConfig.FALLBACK_MODEL}")
    print()
    
    print("🎛️  Temperature Settings:")
    print(f"  News Rewriting: {AIContentEngineConfig.TEMPERATURE_NEWS} (more creative)")
    print(f"  Legal Docs: {AIContentEngineConfig.TEMPERATURE_LEGAL} (more conservative)")
    print()
    
    print("📏 Token Limits:")
    print(f"  Max Input: {AIContentEngineConfig.MAX_INPUT_TOKENS}")
    print(f"  Max Output: {AIContentEngineConfig.MAX_OUTPUT_TOKENS}")
    print()
    
    print("✅ Quality Thresholds:")
    print(f"  Min Uniqueness Score: {AIContentEngineConfig.MIN_UNIQUENESS_SCORE}/100")
    print(f"  Min Fact-Check Confidence: {AIContentEngineConfig.MIN_FACT_CHECK_CONFIDENCE}/100")
    print()
    
    print("⚠️  Disclaimer Keywords (auto-trigger):")
    for keyword in AIContentEngineConfig.DISCLAIMER_KEYWORDS:
        print(f"  - {keyword}")
    print()


def show_usage_examples():
    """Show how to use the prompts in real code."""
    
    print("=" * 80)
    print("USAGE EXAMPLES IN CODE")
    print("=" * 80)
    print()
    
    print("🔧 Example 1: Rewrite News Article")
    print("-" * 80)
    print("""
from app.services.llm_service import LLMService
from app.services.prompt_templates import InsuranceJournalistPrompts

# Initialize LLM service
llm = LLMService(provider="openai")

# Rewrite article
result = llm.rewrite_article(
    original_text="Raw scraped content...",
    title="Original title",
    source="CafeF",
    published_date="2024-11-15"
)

# Access structured output
print(result["title"])           # New title
print(result["content_html"])    # Full HTML article
print(result["summary"])         # SEO description
print(result["has_disclaimer"])  # True if dispute mentioned
print(result["reading_time"])    # Estimated minutes
    """)
    print()
    
    print("🔧 Example 2: Summarize Legal Document")
    print("-" * 80)
    print("""
from app.services.llm_service import LLMService

# Initialize LLM service
llm = LLMService(provider="openai")

# Summarize legal doc
result = llm.summarize_legal_doc(
    doc_title="Nghị định về...",
    doc_content="Full legal text...",
    doc_number="52/2024/NĐ-CP",
    doc_type="Nghị định",
    issue_date="2024-12-01",
    effective_date="2025-01-15",
    issuing_body="Chính phủ"
)

# Access policy brief
print(result["policy_brief_title"])        # [Mới] Title
print(result["key_changes"])               # List of changes
print(result["affected_parties"])          # Who is impacted
print(result["recommended_actions"])       # What to do
print(result["complexity_level"])          # Đơn giản/Trung bình/Phức tạp
    """)
    print()
    
    print("🔧 Example 3: Integration with Content Processor")
    print("-" * 80)
    print("""
from app.services.content_processor import ContentProcessor
from app.database import SyncSessionLocal

# Initialize
db = SyncSessionLocal()
processor = ContentProcessor(db, llm_provider="openai")

# Process crawled news (automatic AI rewriting)
result = processor.process_news_articles(
    sources=['cafef', 'vnexpress'],
    max_articles_per_source=10
)

# Process crawled legal docs (automatic policy brief generation)
result = processor.process_legal_documents(max_pages=5)

print(f"Processed {result['items_processed']} items")
    """)
    print()


def main():
    """Run all tests."""
    
    print("\\n")
    print("╔" + "=" * 78 + "╗")
    print("║" + " " * 15 + "AI CONTENT ENGINE - PROMPT TEMPLATES TEST" + " " * 21 + "║")
    print("║" + " " * 20 + "Insurance News Platform - Part 3" + " " * 25 + "║")
    print("╚" + "=" * 78 + "╝")
    print()
    
    # Show configuration
    show_configuration()
    input("Press Enter to continue...")
    print("\\n")
    
    # Test news rewriting
    test_news_rewrite_prompt()
    input("Press Enter to continue...")
    print("\\n")
    
    # Test legal summarization
    test_legal_summary_prompt()
    input("Press Enter to continue...")
    print("\\n")
    
    # Show usage examples
    show_usage_examples()
    
    print()
    print("=" * 80)
    print("✅ ALL TESTS COMPLETE")
    print("=" * 80)
    print()
    print("Next Steps:")
    print("1. Configure OpenAI/Anthropic API key in .env")
    print("2. Run actual LLM processing: python -m app.services.test_llm_integration")
    print("3. Integrate with crawler pipeline for automated processing")
    print()


if __name__ == "__main__":
    main()
