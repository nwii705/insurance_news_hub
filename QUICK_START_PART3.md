# Quick Start - AI Content Engine (Part 3)

## 1. Install & Configure (5 minutes)

### Install Dependencies
```powershell
cd d:\insurance\backend
.\venv\Scripts\Activate.ps1
pip install openai anthropic  # Already in requirements.txt
```

### Configure API Key
Add to `backend/.env`:

**Option A: OpenAI (Recommended)**
```env
OPENAI_API_KEY=sk-proj-your-key-here
OPENAI_MODEL=gpt-4o
AI_REWRITE_ENABLED=true
```

**Option B: Anthropic**
```env
ANTHROPIC_API_KEY=sk-ant-your-key-here
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022
AI_REWRITE_ENABLED=true
```

## 2. Test Prompts (No API calls - Free)

```powershell
python test_prompt_templates.py
```

**What it shows:**
- ✅ System prompt (AI journalist persona)
- ✅ News rewriting instructions
- ✅ Legal summarization instructions
- ✅ Expected output structure

**Time**: 2 minutes  
**Cost**: Free (no API calls)

## 3. Test Real LLM Processing (Uses API credits)

```powershell
python test_llm_integration.py
```

**What it tests:**
- ✅ News article rewriting (full example)
- ✅ Legal document policy brief (full example)
- ✅ Automatic disclaimer insertion
- ✅ JSON structure validation

**Time**: 3-5 minutes  
**Cost**: ~$0.12 (2 API calls)

## 4. Expected Results

### Test 1: News Rewriting
**Input**: Raw article about insurance dispute
```
Title: "Bảo hiểm Prudential từ chối bồi thường 500 triệu..."
Content: Customer complaint about claim rejection...
```

**Output**:
```json
{
  "rewritten_title": "New catchy title",
  "lead_paragraph": "5Ws opening",
  "analysis_section": "Context and analysis",
  "impact_section": "What it means for readers",
  "disclaimer": "⚠️ Auto-added because article mentions dispute",
  "meta_description": "SEO-optimized summary",
  "tags": ["bảo hiểm", "tranh chấp"],
  "reading_time": 5
}
```

### Test 2: Legal Summarization
**Input**: Government decree about insurance commissions
```
Document: Thông tư 08/2024/TT-BTC
Content: Full legal text with articles...
```

**Output**:
```json
{
  "policy_brief_title": "[Mới] Thông tư 08/2024/TT-BTC: Hoa hồng tối đa 30%",
  "key_changes": [
    "Hoa hồng giảm từ 35% xuống 30%",
    "Bắt buộc công khai tỷ lệ bồi thường",
    "..."
  ],
  "affected_parties": {
    "consumers": "Impact explanation",
    "agents": "New commission rules",
    "insurers": "Compliance requirements"
  },
  "recommended_actions": {
    "for_agents": ["Update contracts", "Review licenses"],
    "for_insurers": ["Adjust processes", "Meet deadline"]
  }
}
```

## 5. Integrate with Crawler (Full Pipeline)

### Update .env
```env
AI_REWRITE_ENABLED=true
AUTO_PUBLISH_ENABLED=false  # Review before publishing
```

### Run Full Pipeline
```powershell
python run_crawlers.py --module full
```

**What happens:**
1. Crawls news from CafeF, VnExpress
2. Crawls legal docs from TVPL
3. **AI rewrites all content automatically**
4. Saves to database with status='draft'
5. Admin reviews before publishing

## 6. Use in Your Code

### Rewrite Single Article
```python
from app.services.llm_service import LLMService

llm = LLMService(provider="openai")

result = llm.rewrite_article(
    original_text="Your scraped content...",
    title="Original title",
    source="CafeF"
)

print(result["title"])
print(result["content_html"])
print(result["has_disclaimer"])  # Auto-detects disputes
```

### Summarize Legal Doc
```python
result = llm.summarize_legal_doc(
    doc_title="Nghị định về...",
    doc_content="Full legal text...",
    doc_number="52/2024/NĐ-CP",
    doc_type="Nghị định"
)

print(result["policy_brief_title"])
print(result["key_changes"])
print(result["recommended_actions"])
```

## 7. Key Features

✅ **Plagiarism Prevention**
- Completely rewrites content
- Changes sentence structure
- Maintains facts, changes presentation
- Target: >80% uniqueness

✅ **Automatic Disclaimers**
- Detects keywords: "tranh chấp", "khiếu nại", "lừa đảo"
- Auto-adds legal disclaimer
- Protects platform from liability

✅ **Professional Structure**
- News: Lead (5Ws) → Analysis → Impact → Conclusion
- Legal: Title → Key Changes → Who's Affected → Actions → Timeline

✅ **SEO Optimization**
- Title: 60-80 characters
- Meta description: 150-160 characters
- Proper HTML structure
- Reading time estimation

## 8. Cost & Performance

### OpenAI GPT-4o
- **Per article**: $0.06
- **100 articles/day**: $6/day = $180/month
- **Processing time**: 5-10 seconds/article

### Anthropic Claude 3.5
- **Per article**: $0.072
- **100 articles/day**: $7.20/day = $216/month
- **Processing time**: 5-10 seconds/article

## 9. Quality Checks

### Before Publishing
```python
from app.services.prompt_templates import InsuranceJournalistPrompts

# Check plagiarism
prompts = InsuranceJournalistPrompts.get_plagiarism_check_prompt(
    original="...",
    rewritten="..."
)
# Run through LLM, expect similarity_score < 20

# Check facts
prompts = InsuranceJournalistPrompts.get_fact_check_prompt(
    article="..."
)
# Verify no obvious errors
```

## 10. Troubleshooting

### ❌ "API key not found"
```powershell
# Check .env file
Get-Content .env | Select-String "OPENAI_API_KEY"

# Or set manually
$env:OPENAI_API_KEY = "sk-proj-..."
```

### ❌ "JSON parsing failed"
- Check model supports JSON mode
- Lower temperature (use 0.3 for legal docs)
- Review prompt for clarity

### ❌ "Disclaimer not added"
- Check if article contains keywords
- Keywords: tranh chấp, khiếu nại, lừa đảo, từ chối bồi thường
- Manually verify content

### ❌ "Output too generic"
- Increase temperature slightly (0.7-0.8 for news)
- Add more context in prompt
- Include specific numbers/quotes

## 11. Files Reference

```
d:\insurance\backend\
├── app\services\
│   ├── prompt_templates.py     # All prompt templates
│   └── llm_service.py          # LLM integration
├── test_prompt_templates.py    # Test prompts (no API)
└── test_llm_integration.py     # Test real LLM calls
```

## 12. Next Steps

1. ✅ Test prompts: `python test_prompt_templates.py`
2. ✅ Configure API key in .env
3. ✅ Test real LLM: `python test_llm_integration.py`
4. ✅ Enable in config: `AI_REWRITE_ENABLED=true`
5. ✅ Run full pipeline: `python run_crawlers.py --module full`
6. 📋 Review generated content in database
7. 📋 Fine-tune prompts based on results
8. 📋 Build frontend to display articles (Part 4)

## Support

- **Full Guide**: `PART3_AI_CONTENT_ENGINE.md`
- **Crawler Guide**: `CRAWLER_ENGINE_GUIDE.md`
- **Setup Guide**: `SETUP_GUIDE.md`

## Summary

**Part 3 delivers:**
- 🤖 Professional AI journalist persona
- ✍️ News rewriting (passes plagiarism checks)
- 📜 Legal policy briefs (easy to understand)
- ⚠️ Auto disclaimer insertion
- 🎯 SEO optimization
- 💰 Cost-effective processing (~$0.06/article)

**Ready to process thousands of articles automatically!** 🚀
