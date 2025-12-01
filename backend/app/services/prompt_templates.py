"""
AI Content Engine - Prompt Templates for Insurance Journalism
System prompts and task-specific templates for processing crawled data.
"""

from typing import Dict, Any
from datetime import datetime


class InsuranceJournalistPrompts:
    """
    Prompt templates for AI-powered insurance journalism.
    
    System Role: Veteran Insurance Journalist in Vietnam
    Tone: Objective, analytical, highly professional
    Mission: Clarify complex legal/insurance terms for the general public
    """
    
    # =========================================================================
    # SYSTEM PROMPT - The AI's Core Identity
    # =========================================================================
    
    SYSTEM_PROMPT = """Bạn là một nhà báo bảo hiểm kỳ cựu tại Việt Nam với hơn 15 năm kinh nghiệm.

**Vai trò và Phong cách:**
- Giọng văn: Khách quan, phân tích sâu, chuyên nghiệp cao
- Sứ mệnh: Làm rõ các thuật ngữ pháp lý và bảo hiểm phức tạp cho công chúng
- Ngôn ngữ: Tiếng Việt chuẩn, dễ hiểu nhưng chuyên sâu
- Độ tin cậy: Luôn trích nguồn, đảm bảo tính chính xác

**Nguyên tắc viết:**
1. Ưu tiên sự thật và độ chính xác trên mọi yếu tố khác
2. Giải thích thuật ngữ chuyên ngành bằng ngôn ngữ đời thường
3. Phân tích tác động thực tế đến người dân và doanh nghiệp
4. Luôn cân bằng giữa các bên liên quan (công ty, người tiêu dùng, cơ quan quản lý)
5. Không thiên vị, không quảng cáo ngầm cho bất kỳ công ty nào

**Cấu trúc bài viết chuẩn:**
- Lead rõ ràng (Who, What, When, Where, Why)
- Body phân tích theo tầng (Context -> Impact -> Action)
- Kết luận với góc nhìn tương lai hoặc khuyến nghị

**Chuyên môn của bạn:**
- Luật bảo hiểm Việt Nam (Nghị định, Thông tư)
- Thị trường bảo hiểm nhân thọ và phi nhân thọ
- Tranh chấp, bồi thường bảo hiểm
- Phân tích báo cáo tài chính công ty bảo hiểm
- Xu hướng InsurTech và chuyển đổi số

You are a veteran insurance journalist in Vietnam with 15+ years of experience. Your tone is objective, analytical, and highly professional. You clarify complex legal and insurance terms for the general public."""
    
    # =========================================================================
    # TASK 1: REWRITE NEWS (Commercial/Market News)
    # =========================================================================
    
    @staticmethod
    def get_news_rewrite_prompt(
        original_title: str,
        original_content: str,
        source_name: str,
        published_date: str = None
    ) -> Dict[str, str]:
        """
        Generate prompt for rewriting commercial/market news.
        
        Args:
            original_title: Original article headline
            original_content: Raw scraped content
            source_name: Source website name (e.g., CafeF, VnExpress)
            published_date: Original publication date
            
        Returns:
            Dictionary with system_prompt and user_prompt
        """
        
        user_prompt = f"""**NHIỆM VỤ: VIẾT LẠI BÁO TIN THỊ TRƯỜNG BẢO HIỂM**

**Input - Bài gốc từ {source_name}:**

Tiêu đề gốc: {original_title}

Nội dung gốc:
{original_content}

---

**Yêu cầu đầu ra:**

Viết lại thành một bài báo hoàn toàn mới, độc đáo (qua kiểm tra Plagiarism) với cấu trúc sau:

**1. TIÊU ĐỀ MỚI**
- Phải hấp dẫn, thu hút độc giả NHƯNG không clickbait
- Chứa từ khóa chính về bảo hiểm
- Độ dài: 60-80 ký tự
- Ví dụ tốt: "Thị trường bảo hiểm tăng trưởng 15%: Cơ hội nào cho nhà đầu tư?"
- Ví dụ XẤU (clickbait): "Bí mật KINH HOÀNG về bảo hiểm mà không ai dám nói!"

**2. CẤU TRÚC BÀI VIẾT**

**A. Lead Paragraph (Đoạn mở đầu - 5Ws)**
- Trả lời: Who (ai), What (gì), When (khi nào), Where (đâu), Why (tại sao)
- Độ dài: 2-3 câu
- Phải súc tích, dễ hiểu ngay lập tức

**B. Analysis (Phân tích)**
- Đặt sự kiện vào bối cảnh thị trường
- So sánh với giai đoạn trước (nếu có số liệu)
- Nguyên nhân sâu xa
- Ý kiến chuyên gia (nếu bài gốc có)

**C. Impact on Users (Tác động đến người dùng)**
- Ảnh hưởng đến người mua bảo hiểm như thế nào?
- Ảnh hưởng đến đại lý/môi giới?
- Ảnh hưởng đến công ty bảo hiểm?
- Lời khuyên thực tế cho từng đối tượng

**3. ĐIỀU KHOẢN MIỄN TRỪ TRÁCH NHIỆM (BẮT BUỘC nếu có tranh chấp/lùm xùm)**

Nếu bài viết đề cập đến:
- Tranh chấp bồi thường
- Khiếu nại của khách hàng
- Lùm xùm công ty/sản phẩm
- Nghi vấn lừa đảo

BẮT BUỘC thêm đoạn disclaimer này:

*"📌 Lưu ý: Thông tin trên ghi nhận từ phản ánh ban đầu của các bên liên quan, chưa có kết luận pháp lý cuối cùng từ cơ quan có thẩm quyền. Tòa soạn sẽ cập nhật khi có thông tin chính thức."*

**4. KẾT THÚC BÀI**
- Tóm tắt 1 câu
- Hoặc câu hỏi mở (thought-provoking question)

---

**OUTPUT FORMAT (JSON):**

{{
    "rewritten_title": "Tiêu đề mới đã tối ưu",
    "lead_paragraph": "Đoạn mở đầu (5Ws)",
    "analysis_section": "Phần phân tích (HTML format với <h3>, <p>, <ul>)",
    "impact_section": "Phần tác động đến người dùng (HTML)",
    "disclaimer": "Disclaimer nếu cần (hoặc null nếu không cần)",
    "conclusion": "Câu kết",
    "meta_description": "Mô tả SEO (150-160 ký tự)",
    "tags": ["tag1", "tag2", "tag3"],
    "estimated_reading_time": 5
}}

**LƯU Ý:**
- Viết bằng Tiếng Việt
- Không copy nguyên văn câu từ bài gốc
- Giữ nguyên số liệu, tên công ty, trích dẫn
- Thêm context và phân tích của riêng bạn
"""
        
        return {
            "system_prompt": InsuranceJournalistPrompts.SYSTEM_PROMPT,
            "user_prompt": user_prompt
        }
    
    # =========================================================================
    # TASK 2: SUMMARIZE LEGAL DOCS (From TVPL)
    # =========================================================================
    
    @staticmethod
    def get_legal_summary_prompt(
        doc_number: str,
        doc_type: str,
        doc_title: str,
        doc_content: str,
        issue_date: str,
        effective_date: str = None,
        issuing_body: str = None
    ) -> Dict[str, str]:
        """
        Generate prompt for summarizing legal documents.
        
        Args:
            doc_number: Document number (e.g., "52/2024/NĐ-CP")
            doc_type: Type (Nghị định, Thông tư, Công văn, etc.)
            doc_title: Full official title
            doc_content: Full legal text
            issue_date: Date issued
            effective_date: Date takes effect
            issuing_body: Issuing authority
            
        Returns:
            Dictionary with system_prompt and user_prompt
        """
        
        user_prompt = f"""**NHIỆM VỤ: TÓM TẮT VĂN BẢN PHÁP LUẬT BẢO HIỂM**

**Input - Văn bản pháp luật từ Thư viện Pháp luật:**

📄 **Loại văn bản:** {doc_type}
📋 **Số hiệu:** {doc_number}
📅 **Ngày ban hành:** {issue_date}
⚡ **Ngày có hiệu lực:** {effective_date or "Chưa rõ"}
🏛️ **Cơ quan ban hành:** {issuing_body or "Chưa rõ"}

**Tên văn bản:**
{doc_title}

**Nội dung đầy đủ:**
{doc_content[:8000]}  # Limit to avoid token overflow

---

**Yêu cầu đầu ra: "BẢN TIN CHÍNH SÁCH" (Policy Brief)**

Tạo một bản tin ngắn gọn, dễ hiểu cho độc giả không chuyên pháp luật, theo cấu trúc sau:

**1. TIÊU ĐỀ**
Format: `[Mới] {doc_type} {doc_number}: {Tóm tắt nội dung chính}`

Ví dụ: "[Mới] Thông tư 08/2024/TT-BTC: Quy định hoa hồng bảo hiểm tối đa 30%"

**2. ĐIỂM MỚI NỔI BẬT** (Key Changes)
- Liệt kê 3-5 điểm thay đổi quan trọng nhất
- So sánh với quy định cũ (nếu văn bản này thay thế văn bản trước)
- Dùng bullet points, ngôn ngữ đơn giản
- Tránh thuật ngữ pháp lý khó hiểu - giải thích bằng ví dụ thực tế

**Ví dụ tốt:**
- ✅ "Đại lý được nhận tối đa 30% phí bảo hiểm (trước đây là 35%)"
- ✅ "Công ty bảo hiểm phải công khai tỷ lệ bồi thường trên website hàng quý"

**Ví dụ XẤU:**
- ❌ "Điều 15 khoản 2 quy định tỷ lệ hoa hồng..." (quá kỹ thuật)

**3. ĐỐI TƯỢNG ẢNH HƯỞNG** (Who Should Care?)
Phân loại rõ ràng văn bản này ảnh hưởng đến ai:

- **Người mua bảo hiểm (Khách hàng cá nhân):**
  - Điều gì thay đổi với họ?
  - Quyền lợi tăng hay giảm?
  
- **Đại lý/Môi giới bảo hiểm:**
  - Quy định mới về hoa hồng, chứng chỉ hành nghề?
  - Trách nhiệm pháp lý mới?

- **Công ty bảo hiểm:**
  - Yêu cầu tuân thủ mới?
  - Thời hạn chỉnh sửa quy trình?

- **Nhà đầu tư:**
  - Tác động đến kết quả kinh doanh ngành bảo hiểm?

**4. HÀNH ĐỘNG KHUYẾN NGHỊ** (Recommended Actions)
Cho từng đối tượng, cung cấp lời khuyên cụ thể:

**Nếu bạn là Người mua bảo hiểm:**
- Bước 1: ...
- Bước 2: ...

**Nếu bạn là Đại lý bảo hiểm:**
- Bước 1: Cập nhật kiến thức về...
- Bước 2: Kiểm tra hợp đồng đại lý hiện tại...

**Nếu bạn là Công ty bảo hiểm:**
- Bước 1: Rà soát quy trình nội bộ...
- Thời hạn tuân thủ: [ngày cụ thể]

**5. TIMELINE QUAN TRỌNG**
- Ngày ban hành: [date]
- Ngày có hiệu lực: [date]
- Thời hạn chuyển tiếp (nếu có): [date]

**6. VĂN BẢN LIÊN QUAN**
- Văn bản này thay thế: [số hiệu văn bản cũ]
- Văn bản này hướng dẫn thi hành: [luật/nghị định gốc]
- Tham khảo thêm: [các văn bản liên quan khác nếu biết]

---

**OUTPUT FORMAT (JSON):**

{{
    "policy_brief_title": "[Mới] Tiêu đề bản tin chính sách",
    "key_changes": [
        "Điểm mới 1",
        "Điểm mới 2",
        "Điểm mới 3"
    ],
    "affected_parties": {{
        "consumers": "Ảnh hưởng đến người mua bảo hiểm (plain text)",
        "agents": "Ảnh hưởng đến đại lý (plain text)",
        "insurers": "Ảnh hưởng đến công ty (plain text)",
        "investors": "Ảnh hưởng đến nhà đầu tư (plain text hoặc null)"
    }},
    "recommended_actions": {{
        "for_consumers": ["Hành động 1", "Hành động 2"],
        "for_agents": ["Hành động 1", "Hành động 2"],
        "for_insurers": ["Hành động 1", "Hành động 2"]
    }},
    "timeline": {{
        "issue_date": "{issue_date}",
        "effective_date": "{effective_date}",
        "transition_period": "Mô tả nếu có"
    }},
    "related_docs": {{
        "replaces": "Số hiệu văn bản bị thay thế (hoặc null)",
        "implements": "Số hiệu luật/nghị định gốc (hoặc null)",
        "references": ["Văn bản liên quan 1", "Văn bản liên quan 2"]
    }},
    "executive_summary": "Tóm tắt toàn bộ văn bản trong 2-3 câu",
    "complexity_level": "Đơn giản/Trung bình/Phức tạp",
    "estimated_reading_time": 7
}}

**LƯU Ý QUAN TRỌNG:**
1. **Giải thích thuật ngữ pháp lý bằng ví dụ thực tế**
   - Tránh: "Điều chỉnh hệ số dự phòng theo phương pháp kế toán phù hợp"
   - Nên: "Công ty bảo hiểm phải để dành nhiều tiền hơn để bồi thường trong tương lai"

2. **Luôn làm rõ "Tác động thực tế" chứ không chỉ giải thích luật**
   - Không chỉ nói "Luật quy định gì"
   - Mà nói "Điều này nghĩa là gì với cuộc sống bạn"

3. **Nếu văn bản quá kỹ thuật, phân loại độ phức tạp:**
   - Đơn giản: Mọi người cần biết
   - Trung bình: Người trong ngành cần biết
   - Phức tạp: Chỉ chuyên gia/công ty cần biết chi tiết

4. **Tuyệt đối trung thực:**
   - Không cường điệu hóa tác động
   - Không đưa ra nhận định chính trị
   - Nếu không chắc chắn về diễn giải, ghi chú "Cần xác nhận thêm từ cơ quan ban hành"
"""
        
        return {
            "system_prompt": InsuranceJournalistPrompts.SYSTEM_PROMPT,
            "user_prompt": user_prompt
        }
    
    # =========================================================================
    # ADDITIONAL UTILITY PROMPTS
    # =========================================================================
    
    @staticmethod
    def get_plagiarism_check_prompt(original: str, rewritten: str) -> Dict[str, str]:
        """Quick self-check for plagiarism before publishing."""
        
        user_prompt = f"""**KIỂM TRA ĐỘ TƯƠNG ĐỒNG**

Bài gốc:
{original[:1000]}

Bài viết lại:
{rewritten[:1000]}

Đánh giá xem bài viết lại có đủ khác biệt so với bài gốc không?

Trả về JSON:
{{
    "similarity_score": 15,  # 0-100, càng thấp càng tốt
    "is_unique": true,
    "copied_phrases": ["Cụm từ bị copy nguyên văn nếu có"],
    "recommendation": "Pass/Fail"
}}
"""
        
        return {
            "system_prompt": "You are a plagiarism detection expert.",
            "user_prompt": user_prompt
        }
    
    @staticmethod
    def get_fact_check_prompt(article: str) -> Dict[str, str]:
        """Fact-check an article for obvious errors."""
        
        user_prompt = f"""**FACT-CHECK BÀI VIẾT**

Kiểm tra bài viết sau có sai sót thực tế không:

{article}

Kiểm tra:
1. Số liệu có logic không? (VD: tỷ lệ bồi thường >100% là sai)
2. Tên công ty, tên luật có chính xác không?
3. Ngày tháng có hợp lý không?
4. Có thông tin mâu thuẫn nội bộ không?

Trả về JSON:
{{
    "has_errors": false,
    "errors_found": [],
    "warnings": ["Cảnh báo nếu cần kiểm tra lại"],
    "confidence_score": 95
}}
"""
        
        return {
            "system_prompt": "You are a fact-checking journalist.",
            "user_prompt": user_prompt
        }


# =============================================================================
# USAGE EXAMPLES
# =============================================================================

class PromptExamples:
    """Example usage of prompt templates."""
    
    @staticmethod
    def example_news_rewrite():
        """Example of rewriting a news article."""
        
        prompts = InsuranceJournalistPrompts.get_news_rewrite_prompt(
            original_title="Lợi nhuận Bảo Việt tăng 20% trong quý 3",
            original_content="""
            Công ty Cổ phần Bảo Việt (BVH) vừa công bố báo cáo tài chính quý 3/2024
            với lợi nhuận sau thuế đạt 1.200 tỷ đồng, tăng 20% so với cùng kỳ năm ngoái.
            Tổng doanh thu phí bảo hiểm đạt 8.500 tỷ đồng...
            """,
            source_name="CafeF",
            published_date="2024-11-01"
        )
        
        return prompts
    
    @staticmethod
    def example_legal_summary():
        """Example of summarizing a legal document."""
        
        prompts = InsuranceJournalistPrompts.get_legal_summary_prompt(
            doc_number="52/2024/NĐ-CP",
            doc_type="Nghị định",
            doc_title="Nghị định về kinh doanh bảo hiểm và bảo hiểm bắt buộc",
            doc_content="""
            Chính phủ ban hành Nghị định số 52/2024/NĐ-CP...
            Điều 1. Phạm vi điều chỉnh...
            Điều 2. Giải thích từ ngữ...
            """,
            issue_date="2024-12-01",
            effective_date="2025-01-15",
            issuing_body="Chính phủ"
        )
        
        return prompts


# =============================================================================
# CONFIGURATION
# =============================================================================

class AIContentEngineConfig:
    """Configuration for AI content processing."""
    
    # Model settings
    DEFAULT_MODEL = "gpt-4o"  # or "claude-3-5-sonnet-20241022"
    FALLBACK_MODEL = "gpt-4o-mini"
    
    # Token limits
    MAX_INPUT_TOKENS = 8000
    MAX_OUTPUT_TOKENS = 4000
    
    # Temperature settings (0-1)
    TEMPERATURE_NEWS = 0.7  # More creative for news
    TEMPERATURE_LEGAL = 0.3  # More conservative for legal docs
    
    # Quality thresholds
    MIN_UNIQUENESS_SCORE = 80  # Out of 100
    MIN_FACT_CHECK_CONFIDENCE = 90  # Out of 100
    
    # Processing flags
    ENABLE_PLAGIARISM_CHECK = True
    ENABLE_FACT_CHECK = True
    AUTO_ADD_DISCLAIMER = True  # Auto-add disclaimer for disputes
    
    # Content rules
    MIN_ARTICLE_LENGTH = 500  # Characters
    MAX_ARTICLE_LENGTH = 5000
    MIN_SUMMARY_LENGTH = 200
    MAX_SUMMARY_LENGTH = 800
    
    # Disclaimer triggers
    DISCLAIMER_KEYWORDS = [
        "tranh chấp",
        "khiếu nại",
        "lùm xùm",
        "lừa đảo",
        "từ chối bồi thường",
        "phản ánh",
        "tố cáo"
    ]
