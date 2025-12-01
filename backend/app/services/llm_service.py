"""
LLM Service - integrates with OpenAI and Anthropic APIs.
"""

import logging
from typing import Optional, Dict, Any
from enum import Enum
from datetime import datetime

from app.core.config import settings
from app.services.prompt_templates import (
    InsuranceJournalistPrompts,
    AIContentEngineConfig
)

logger = logging.getLogger(__name__)


class LLMProvider(str, Enum):
    """Supported LLM providers."""
    OPENAI = "openai"
    ANTHROPIC = "anthropic"


class LLMService:
    """Service for interacting with LLM APIs."""
    
    def __init__(self, provider: LLMProvider = LLMProvider.OPENAI):
        """
        Initialize LLM service.
        
        Args:
            provider: LLM provider to use (openai or anthropic)
        """
        self.provider = provider
        
        if provider == LLMProvider.OPENAI:
            import openai
            self.client = openai.OpenAI(api_key=settings.OPENAI_API_KEY)
            self.model = settings.OPENAI_MODEL
        elif provider == LLMProvider.ANTHROPIC:
            import anthropic
            self.client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)
            self.model = settings.ANTHROPIC_MODEL
        else:
            raise ValueError(f"Unsupported provider: {provider}")
    
    def generate_completion(
        self,
        prompt: str,
        system_message: Optional[str] = None,
        max_tokens: int = 4000,
        temperature: float = 0.7
    ) -> str:
        """
        Generate text completion using the selected LLM.
        
        Args:
            prompt: User prompt
            system_message: System message for context
            max_tokens: Maximum tokens to generate
            temperature: Sampling temperature (0-1)
            
        Returns:
            Generated text
        """
        try:
            if self.provider == LLMProvider.OPENAI:
                return self._openai_completion(prompt, system_message, max_tokens, temperature)
            elif self.provider == LLMProvider.ANTHROPIC:
                return self._anthropic_completion(prompt, system_message, max_tokens, temperature)
        except Exception as e:
            logger.error(f"Error generating completion: {e}")
            raise
    
    def _openai_completion(
        self,
        prompt: str,
        system_message: Optional[str],
        max_tokens: int,
        temperature: float
    ) -> str:
        """Generate completion using OpenAI."""
        messages = []
        
        if system_message:
            messages.append({"role": "system", "content": system_message})
        
        messages.append({"role": "user", "content": prompt})
        
        response = self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            max_tokens=max_tokens,
            temperature=temperature
        )
        
        return response.choices[0].message.content.strip()
    
    def _anthropic_completion(
        self,
        prompt: str,
        system_message: Optional[str],
        max_tokens: int,
        temperature: float
    ) -> str:
        """Generate completion using Anthropic."""
        response = self.client.messages.create(
            model=self.model,
            max_tokens=max_tokens,
            temperature=temperature,
            system=system_message or "",
            messages=[{"role": "user", "content": prompt}]
        )
        
        return response.content[0].text.strip()
    
    def rewrite_article(
        self,
        original_text: str,
        title: str,
        source: str,
        published_date: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Rewrite an article using professional insurance journalism templates.
        
        Args:
            original_text: Original article text
            title: Article title
            source: Source name
            published_date: Original publication date
            
        Returns:
            Dictionary with rewritten content following journalist standards
        """
        # Generate prompts using the professional template
        prompts = InsuranceJournalistPrompts.get_news_rewrite_prompt(
            original_title=title,
            original_content=original_text,
            source_name=source,
            published_date=published_date or datetime.now().strftime("%Y-%m-%d")
        )
        
        # Generate completion with professional journalist persona
        response = self.generate_completion(
            prompt=prompts["user_prompt"],
            system_message=prompts["system_prompt"],
            max_tokens=AIContentEngineConfig.MAX_OUTPUT_TOKENS,
            temperature=AIContentEngineConfig.TEMPERATURE_NEWS
        )
        
        # Parse JSON response
        import json
        try:
            result = json.loads(response)
            
            # Construct full HTML article from structured parts
            content_html = f"""
<div class="article-content">
    <div class="lead">
        <p class="lead-paragraph">{result.get('lead_paragraph', '')}</p>
    </div>
    
    <div class="analysis">
        <h2>Phân tích</h2>
        {result.get('analysis_section', '')}
    </div>
    
    <div class="impact">
        <h2>Tác động</h2>
        {result.get('impact_section', '')}
    </div>
    
    {'<div class="disclaimer alert">' + result.get('disclaimer', '') + '</div>' if result.get('disclaimer') else ''}
    
    <div class="conclusion">
        <p><strong>{result.get('conclusion', '')}</strong></p>
    </div>
</div>
            """
            
            return {
                "title": result.get("rewritten_title", title),
                "content_html": content_html,
                "summary": result.get("meta_description", ""),
                "key_points": result.get("tags", []),
                "tags": result.get("tags", []),
                "reading_time": result.get("estimated_reading_time", 5),
                "has_disclaimer": result.get("disclaimer") is not None
            }
        except json.JSONDecodeError:
            # Fallback if JSON parsing fails
            logger.warning("Failed to parse JSON response, returning raw text")
            return {
                "title": title,
                "content_html": f"<p>{response}</p>",
                "summary": response[:160],
                "key_points": [],
                "tags": [],
                "reading_time": 5,
                "has_disclaimer": False
            }
    
    def summarize_legal_doc(
        self,
        doc_title: str,
        doc_content: str,
        doc_number: str,
        doc_type: str = "Văn bản",
        issue_date: Optional[str] = None,
        effective_date: Optional[str] = None,
        issuing_body: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Summarize a legal document into a Policy Brief.
        
        Args:
            doc_title: Document title
            doc_content: Full document content
            doc_number: Document number (e.g., "52/2024/NĐ-CP")
            doc_type: Document type (Nghị định, Thông tư, etc.)
            issue_date: Date issued
            effective_date: Date takes effect
            issuing_body: Issuing authority
            
        Returns:
            Dictionary with policy brief in structured format
        """
        # Generate prompts using the professional legal template
        prompts = InsuranceJournalistPrompts.get_legal_summary_prompt(
            doc_number=doc_number,
            doc_type=doc_type,
            doc_title=doc_title,
            doc_content=doc_content,
            issue_date=issue_date or datetime.now().strftime("%Y-%m-%d"),
            effective_date=effective_date or "Chưa rõ",
            issuing_body=issuing_body or "Chưa rõ"
        )
        
        # Generate completion with lower temperature for legal accuracy
        response = self.generate_completion(
            prompt=prompts["user_prompt"],
            system_message=prompts["system_prompt"],
            max_tokens=AIContentEngineConfig.MAX_OUTPUT_TOKENS,
            temperature=AIContentEngineConfig.TEMPERATURE_LEGAL
        )
        
        import json
        try:
            result = json.loads(response)
            
            # Build comprehensive policy brief
            return {
                "policy_brief_title": result.get("policy_brief_title", f"[Mới] {doc_type} {doc_number}"),
                "executive_summary": result.get("executive_summary", ""),
                "key_changes": result.get("key_changes", []),
                "affected_parties": result.get("affected_parties", {}),
                "recommended_actions": result.get("recommended_actions", {}),
                "timeline": result.get("timeline", {}),
                "related_docs": result.get("related_docs", {}),
                "complexity_level": result.get("complexity_level", "Trung bình"),
                "estimated_reading_time": result.get("estimated_reading_time", 7),
                
                # Legacy fields for backward compatibility
                "key_provisions": result.get("key_changes", []),
                "impact_on_industry": result.get("affected_parties", {}).get("insurers", ""),
                "compliance_requirements": result.get("recommended_actions", {}).get("for_insurers", [])
            }
        except json.JSONDecodeError:
            logger.warning("Failed to parse JSON response for legal doc")
            return {
                "policy_brief_title": f"[Mới] {doc_type} {doc_number}",
                "executive_summary": response[:500],
                "key_changes": [],
                "affected_parties": {},
                "recommended_actions": {},
                "timeline": {},
                "related_docs": {},
                "complexity_level": "Trung bình",
                "estimated_reading_time": 7,
                "key_provisions": [],
                "impact_on_industry": "",
                "compliance_requirements": []
            }
    
    def extract_entities(self, text: str) -> Dict[str, Any]:
        """
        Extract named entities (companies, people, dates) from text.
        
        Args:
            text: Text to analyze
            
        Returns:
            Dictionary with extracted entities
        """
        system_message = """You are an NLP expert. Extract named entities from insurance-related text in Vietnam.
Focus on: insurance companies, executives, dates, monetary amounts, and regulations."""
        
        prompt = f"""Extract all relevant entities from this text:

{text}

Return JSON:
{{
    "companies": ["Company 1", "Company 2"],
    "people": ["Person 1", "Person 2"],
    "dates": ["2024-01-01", "2024-12-31"],
    "amounts": ["1000 billion VND", "50 million USD"],
    "regulations": ["Decree 52/2024/ND-CP"]
}}
"""
        
        response = self.generate_completion(prompt, system_message, max_tokens=1000, temperature=0.3)
        
        import json
        try:
            return json.loads(response)
        except json.JSONDecodeError:
            return {
                "companies": [],
                "people": [],
                "dates": [],
                "amounts": [],
                "regulations": []
            }
    
    def generate_seo_metadata(
        self,
        title: str,
        content: str
    ) -> Dict[str, Any]:
        """
        Generate SEO-optimized metadata.
        
        Args:
            title: Content title
            content: Content body
            
        Returns:
            Dictionary with SEO metadata
        """
        system_message = """You are an SEO expert for Vietnamese content. Generate optimal metadata."""
        
        prompt = f"""Generate SEO metadata for this insurance article:

Title: {title}
Content: {content[:1000]}

Return JSON:
{{
    "meta_title": "SEO-optimized title (55-60 characters)",
    "meta_description": "Compelling description (150-160 characters)",
    "keywords": ["keyword1", "keyword2", "keyword3"],
    "og_title": "Social media title",
    "og_description": "Social media description"
}}
"""
        
        response = self.generate_completion(prompt, system_message, max_tokens=500, temperature=0.5)
        
        import json
        try:
            return json.loads(response)
        except json.JSONDecodeError:
            return {
                "meta_title": title[:60],
                "meta_description": content[:160],
                "keywords": [],
                "og_title": title,
                "og_description": content[:160]
            }
