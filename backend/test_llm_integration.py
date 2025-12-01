"""
Full Integration Test - AI Content Engine with actual LLM calls.
Tests the complete pipeline from raw data to processed articles.
"""

import sys
import json
import os
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.services.llm_service import LLMService, LLMProvider
from app.services.prompt_templates import AIContentEngineConfig


def check_api_keys():
    """Check if API keys are configured."""
    
    print("🔑 Checking API Keys...")
    print("-" * 80)
    
    has_openai = bool(os.getenv("OPENAI_API_KEY"))
    has_anthropic = bool(os.getenv("ANTHROPIC_API_KEY"))
    
    print(f"OpenAI API Key: {'✅ Configured' if has_openai else '❌ Not found'}")
    print(f"Anthropic API Key: {'✅ Configured' if has_anthropic else '❌ Not found'}")
    print()
    
    if not (has_openai or has_anthropic):
        print("⚠️  WARNING: No API keys found!")
        print()
        print("To test with actual LLM, add to your .env file:")
        print("  OPENAI_API_KEY=sk-...")
        print("  or")
        print("  ANTHROPIC_API_KEY=sk-ant-...")
        print()
        return None
    
    if has_openai:
        print("Using OpenAI GPT-4")
        return LLMProvider.OPENAI
    else:
        print("Using Anthropic Claude")
        return LLMProvider.ANTHROPIC


def test_news_rewriting_real(provider: LLMProvider):
    """Test news article rewriting with real LLM."""
    
    print("=" * 80)
    print("TEST 1: NEWS ARTICLE REWRITING (REAL LLM CALL)")
    print("=" * 80)
    print()
    
    # Sample news article with dispute (should trigger disclaimer)
    original_title = "Bảo hiểm Prudential từ chối bồi thường 500 triệu cho khách hàng"
    original_content = """
    Ông Trần Văn B, 45 tuổi, ở TP.HCM cho biết đã mua hợp đồng bảo hiểm sức khỏe 
    của Prudential từ năm 2020 với số tiền bảo hiểm 500 triệu đồng. Tháng 10/2024, 
    ông nhập viện điều trị bệnh tim mạch và yêu cầu bồi thường.
    
    Tuy nhiên, Prudential từ chối bồi thường với lý do "bệnh lý đã tồn tại trước khi 
    mua bảo hiểm" mặc dù ông B khẳng định không hề biết mình có bệnh tim. Ông B đã 
    gửi đơn khiếu nại lên Hiệp hội Bảo hiểm Việt Nam.
    
    Đại diện Prudential cho biết quyết định từ chối bồi thường là đúng quy định hợp đồng, 
    và công ty có đầy đủ hồ sơ y tế chứng minh bệnh nhân đã có dấu hiệu bệnh lý từ trước.
    
    Chuyên gia bảo hiểm Nguyễn Thị C nhận xét: "Đây là trường hợp tranh chấp phổ biến. 
    Người mua bảo hiểm cần đọc kỹ điều khoản và khai báo sức khỏe trung thực."
    """
    
    print("📰 Original Article (from VnExpress):")
    print(f"Title: {original_title}")
    print(f"Content Length: {len(original_content)} chars")
    print()
    print(original_content[:300] + "...")
    print()
    print("-" * 80)
    print()
    
    try:
        # Initialize LLM service
        llm = LLMService(provider=provider)
        
        print("🤖 Processing with AI Content Engine...")
        print(f"Model: {llm.model}")
        print(f"Temperature: {AIContentEngineConfig.TEMPERATURE_NEWS}")
        print()
        
        # Rewrite article
        result = llm.rewrite_article(
            original_text=original_content,
            title=original_title,
            source="VnExpress",
            published_date="2024-11-20"
        )
        
        print("✅ AI Processing Complete!")
        print()
        print("=" * 80)
        print("RESULT: REWRITTEN ARTICLE")
        print("=" * 80)
        print()
        
        print(f"📌 New Title: {result['title']}")
        print()
        print(f"📝 Summary (Meta Description):")
        print(result['summary'])
        print()
        print(f"⏱️  Reading Time: {result['reading_time']} minutes")
        print()
        print(f"⚠️  Has Disclaimer: {'YES ✅' if result['has_disclaimer'] else 'NO'}")
        print()
        print(f"🏷️  Tags: {', '.join(result.get('tags', []))}")
        print()
        print("-" * 80)
        print("📄 Full Content (HTML):")
        print("-" * 80)
        print(result['content_html'][:800] + "...")
        print()
        
        # Validate disclaimer presence
        if "tranh chấp" in original_content.lower() or "khiếu nại" in original_content.lower():
            if result['has_disclaimer']:
                print("✅ PASS: Disclaimer correctly added for dispute article")
            else:
                print("❌ FAIL: Disclaimer missing for dispute article!")
        
        return result
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return None


def test_legal_summarization_real(provider: LLMProvider):
    """Test legal document summarization with real LLM."""
    
    print("=" * 80)
    print("TEST 2: LEGAL DOCUMENT POLICY BRIEF (REAL LLM CALL)")
    print("=" * 80)
    print()
    
    # Sample legal document
    doc_number = "08/2024/TT-BTC"
    doc_type = "Thông tư"
    doc_title = "Thông tư quy định về hoa hồng và chi phí quản lý trong kinh doanh bảo hiểm"
    doc_content = """
    BỘ TÀI CHÍNH
    -------
    
    Căn cứ Nghị định số 46/2023/NĐ-CP về kinh doanh bảo hiểm;
    Theo đề nghị của Cục trưởng Cục Quản lý, giám sát bảo hiểm,
    
    BỘ TRƯỞNG BỘ TÀI CHÍNH BAN HÀNH THÔNG TƯ
    
    Điều 1. Phạm vi điều chỉnh
    Thông tư này quy định về tỷ lệ hoa hồng tối đa và chi phí quản lý trong 
    kinh doanh bảo hiểm nhân thọ và bảo hiểm phi nhân thọ tại Việt Nam.
    
    Điều 2. Tỷ lệ hoa hồng tối đa
    1. Đối với bảo hiểm nhân thọ:
       a) Năm hợp đồng đầu tiên: Không quá 30% phí bảo hiểm năm đầu
       b) Từ năm thứ 2 trở đi: Không quá 10% phí bảo hiểm hàng năm
       c) Hoa hồng duy trì: Không quá 5% phí bảo hiểm từ năm thứ 6
    
    2. Đối với bảo hiểm phi nhân thọ:
       a) Bảo hiểm xe cơ giới: Không quá 20% phí bảo hiểm
       b) Bảo hiểm tài sản: Không quá 25% phí bảo hiểm
       c) Bảo hiểm trách nhiệm: Không quá 18% phí bảo hiểm
    
    Điều 3. Chi phí quản lý
    1. Tổng chi phí quản lý không vượt quá 30% tổng doanh thu phí
    2. Chi phí marketing: Tối đa 5% tổng doanh thu phí
    3. Chi phí công nghệ: Không giới hạn (khuyến khích số hóa)
    
    Điều 4. Công khai thông tin
    1. Công ty bảo hiểm phải công khai trên website chính thức:
       - Tỷ lệ hoa hồng thực tế cho từng sản phẩm
       - Bảng phí chuẩn
       - Tỷ lệ bồi thường theo quý
    
    2. Thời hạn công khai: Trong vòng 15 ngày kể từ khi có thay đổi
    
    Điều 5. Xử phạt vi phạm
    1. Vi phạm về tỷ lệ hoa hồng: Phạt từ 50-100 triệu đồng
    2. Không công khai thông tin: Phạt từ 30-50 triệu đồng
    3. Vi phạm nghiêm trọng: Thu hồi giấy phép kinh doanh
    
    Điều 6. Thời gian chuyển tiếp
    1. Các hợp đồng đại lý đã ký trước ngày Thông tư có hiệu lực: 
       Được tiếp tục thực hiện đến hết thời hạn hợp đồng nhưng không quá 6 tháng
    
    2. Các công ty phải rà soát và điều chỉnh quy chế hoa hồng trong vòng 90 ngày
    
    Điều 7. Hiệu lực thi hành
    Thông tư này có hiệu lực kể từ ngày 01 tháng 02 năm 2025.
    Thông tư số 05/2020/TT-BTC hết hiệu lực kể từ ngày Thông tư này có hiệu lực.
    """
    
    print("📜 Legal Document:")
    print(f"Type: {doc_type}")
    print(f"Number: {doc_number}")
    print(f"Title: {doc_title}")
    print(f"Content Length: {len(doc_content)} chars")
    print()
    print(doc_content[:400] + "...")
    print()
    print("-" * 80)
    print()
    
    try:
        # Initialize LLM service
        llm = LLMService(provider=provider)
        
        print("🤖 Processing with AI Content Engine...")
        print(f"Model: {llm.model}")
        print(f"Temperature: {AIContentEngineConfig.TEMPERATURE_LEGAL}")
        print()
        
        # Summarize legal doc
        result = llm.summarize_legal_doc(
            doc_title=doc_title,
            doc_content=doc_content,
            doc_number=doc_number,
            doc_type=doc_type,
            issue_date="2024-12-01",
            effective_date="2025-02-01",
            issuing_body="Bộ Tài chính"
        )
        
        print("✅ AI Processing Complete!")
        print()
        print("=" * 80)
        print("RESULT: POLICY BRIEF (BẢN TIN CHÍNH SÁCH)")
        print("=" * 80)
        print()
        
        print(f"📌 Title: {result['policy_brief_title']}")
        print()
        print(f"📝 Executive Summary:")
        print(result['executive_summary'])
        print()
        print(f"🔸 Key Changes:")
        for i, change in enumerate(result.get('key_changes', []), 1):
            print(f"  {i}. {change}")
        print()
        print(f"👥 Affected Parties:")
        for party, impact in result.get('affected_parties', {}).items():
            if impact:
                print(f"  - {party.upper()}: {impact[:100]}...")
        print()
        print(f"✅ Recommended Actions:")
        for audience, actions in result.get('recommended_actions', {}).items():
            print(f"  {audience.upper()}:")
            for action in actions[:2]:
                print(f"    - {action}")
        print()
        print(f"📅 Timeline:")
        timeline = result.get('timeline', {})
        print(f"  Issue Date: {timeline.get('issue_date', 'N/A')}")
        print(f"  Effective Date: {timeline.get('effective_date', 'N/A')}")
        print()
        print(f"📊 Complexity Level: {result.get('complexity_level', 'N/A')}")
        print(f"⏱️  Reading Time: {result.get('estimated_reading_time', 'N/A')} minutes")
        print()
        
        return result
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return None


def main():
    """Run all integration tests."""
    
    print("\n")
    print("╔" + "=" * 78 + "╗")
    print("║" + " " * 10 + "AI CONTENT ENGINE - FULL INTEGRATION TEST" + " " * 26 + "║")
    print("║" + " " * 15 + "Real LLM Calls with OpenAI/Anthropic" + " " * 26 + "║")
    print("╚" + "=" * 78 + "╝")
    print("\n")
    
    # Check API keys
    provider = check_api_keys()
    
    if not provider:
        print("❌ Cannot proceed without API keys. Please configure them first.")
        print()
        print("Add to backend/.env:")
        print("  OPENAI_API_KEY=sk-...")
        print("  OPENAI_MODEL=gpt-4o")
        print()
        print("Or:")
        print("  ANTHROPIC_API_KEY=sk-ant-...")
        print("  ANTHROPIC_MODEL=claude-3-5-sonnet-20241022")
        return
    
    print()
    input("Press Enter to start Test 1: News Rewriting...")
    print("\n")
    
    # Test 1: News rewriting
    news_result = test_news_rewriting_real(provider)
    
    print()
    input("Press Enter to start Test 2: Legal Summarization...")
    print("\n")
    
    # Test 2: Legal summarization
    legal_result = test_legal_summarization_real(provider)
    
    print()
    print("=" * 80)
    print("✅ ALL INTEGRATION TESTS COMPLETE")
    print("=" * 80)
    print()
    
    if news_result and legal_result:
        print("Summary:")
        print(f"  ✅ News rewriting: SUCCESS")
        print(f"  ✅ Legal summarization: SUCCESS")
        print()
        print("The AI Content Engine is working correctly!")
        print()
        print("Next steps:")
        print("  1. Integrate with crawler pipeline (run_crawlers.py)")
        print("  2. Enable AI_REWRITE_ENABLED=true in .env")
        print("  3. Run full automated content processing")
    else:
        print("⚠️  Some tests failed. Check the errors above.")
    
    print()


if __name__ == "__main__":
    main()
