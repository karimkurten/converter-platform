#!/usr/bin/env python3
"""
ConvertNow.ca Social Media Content Generator
Uses OpenRouter for cost-effective AI model access
"""

import os
import json
import asyncio
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
from dataclasses import dataclass, asdict
from enum import Enum
import aiohttp


class ModelTier(Enum):
    """Model tiers for different quality/cost needs"""
    PREMIUM = "premium"      # Best quality, higher cost
    BALANCED = "balanced"    # Good quality, moderate cost
    ECONOMY = "economy"      # Acceptable quality, lowest cost


@dataclass
class ModelConfig:
    """Configuration for an OpenRouter model"""
    id: str
    name: str
    tier: ModelTier
    input_price_per_1k: float    # USD per 1K input tokens
    output_price_per_1k: float   # USD per 1K output tokens
    context_length: int
    strengths: List[str]


# OpenRouter Model Catalog (prices as of 2024)
OPENROUTER_MODELS = {
    # PREMIUM TIER - Best quality for important posts
    "anthropic/claude-3.5-sonnet": ModelConfig(
        id="anthropic/claude-3.5-sonnet",
        name="Claude 3.5 Sonnet",
        tier=ModelTier.PREMIUM,
        input_price_per_1k=0.003,
        output_price_per_1k=0.015,
        context_length=200000,
        strengths=["creative writing", "long context", "nuanced content"]
    ),
    "openai/gpt-4o": ModelConfig(
        id="openai/gpt-4o",
        name="GPT-4o",
        tier=ModelTier.PREMIUM,
        input_price_per_1k=0.005,
        output_price_per_1k=0.015,
        context_length=128000,
        strengths=["general purpose", "reliable", "good at instructions"]
    ),
    
    # BALANCED TIER - Good quality, reasonable cost
    "anthropic/claude-3-haiku": ModelConfig(
        id="anthropic/claude-3-haiku",
        name="Claude 3 Haiku",
        tier=ModelTier.BALANCED,
        input_price_per_1k=0.00025,
        output_price_per_1k=0.00125,
        context_length=200000,
        strengths=["fast", "cost-effective", "good for social posts"]
    ),
    "google/gemini-pro": ModelConfig(
        id="google/gemini-pro",
        name="Gemini Pro",
        tier=ModelTier.BALANCED,
        input_price_per_1k=0.0005,
        output_price_per_1k=0.0015,
        context_length=128000,
        strengths=["multilingual", "good at summaries"]
    ),
    "meta-llama/llama-3.1-70b-instruct": ModelConfig(
        id="meta-llama/llama-3.1-70b-instruct",
        name="Llama 3.1 70B",
        tier=ModelTier.BALANCED,
        input_price_per_1k=0.0004,
        output_price_per_1k=0.0004,
        context_length=128000,
        strengths=["open source", "good performance", "low cost"]
    ),
    
    # ECONOMY TIER - Lowest cost, acceptable quality
    "google/gemini-flash-1.5": ModelConfig(
        id="google/gemini-flash-1.5",
        name="Gemini Flash 1.5",
        tier=ModelTier.ECONOMY,
        input_price_per_1k=0.000075,
        output_price_per_1k=0.0003,
        context_length=1000000,
        strengths=["very fast", "very cheap", "good for drafts"]
    ),
    "nousresearch/hermes-3-llama-3.1-405b": ModelConfig(
        id="nousresearch/hermes-3-llama-3.1-405b",
        name="Hermes 3 405B",
        tier=ModelTier.ECONOMY,
        input_price_per_1k=0.0002,
        output_price_per_1k=0.0002,
        context_length=128000,
        strengths=["large model", "cheap", "decent quality"]
    ),
    "mistralai/mistral-nemo": ModelConfig(
        id="mistralai/mistral-nemo",
        name="Mistral Nemo",
        tier=ModelTier.ECONOMY,
        input_price_per_1k=0.00013,
        output_price_per_1k=0.00013,
        context_length=128000,
        strengths=["fast", "cheap", "good for simple tasks"]
    ),
}


@dataclass
class SocialPost:
    id: str
    date_offset: int
    platform: str
    content_pillar: str
    hook: str
    caption: str
    content_format: str
    image_prompt: str
    cta_type: str
    cta_url: str
    optimal_time: str
    model_used: str = ""  # Track which model generated this
    generation_cost: float = 0.0  # Track cost


class OpenRouterContentGenerator:
    """Content generator using OpenRouter API with smart model selection"""
    
    def __init__(self, api_key: str = None, default_tier: ModelTier = ModelTier.BALANCED):
        self.api_key = api_key or os.getenv('OPENROUTER_API_KEY')
        self.base_url = "https://openrouter.ai/api/v1"
        self.default_tier = default_tier
        self.session_cost = 0.0
        
    def select_model(self, content_type: str = "standard") -> ModelConfig:
        """Select best model based on content type and tier preference"""
        
        # For high-engagement posts (product spotlights, viral potential), use premium
        if content_type in ["product_spotlight", "viral_hook"]:
            return OPENROUTER_MODELS["anthropic/claude-3.5-sonnet"]
        
        # For standard posts, use the best model in the selected tier
        tier_models = [m for m in OPENROUTER_MODELS.values() if m.tier == self.default_tier]
        
        # Prefer Claude Haiku for social media (fast, good at short content)
        if self.default_tier == ModelTier.BALANCED:
            return OPENROUTER_MODELS["anthropic/claude-3-haiku"]
        
        # For economy, use Gemini Flash (cheapest)
        if self.default_tier == ModelTier.ECONOMY:
            return OPENROUTER_MODELS["google/gemini-flash-1.5"]
        
        return tier_models[0] if tier_models else OPENROUTER_MODELS["anthropic/claude-3-haiku"]
    
    def estimate_cost(self, model: ModelConfig, input_tokens: int = 2000, output_tokens: int = 1500) -> float:
        """Estimate cost for a generation request"""
        input_cost = (input_tokens / 1000) * model.input_price_per_1k
        output_cost = (output_tokens / 1000) * model.output_price_per_1k
        return input_cost + output_cost
    
    async def generate_single_post(
        self,
        post_number: int,
        content_pillar: str,
        model: ModelConfig = None
    ) -> SocialPost:
        """Generate a single social media post"""
        
        if model is None:
            model = self.select_model(content_pillar)
        
        system_prompt = self._load_system_prompt()
        
        user_prompt = f"""Generate ONE social media post for ConvertNow.ca.

Content Pillar: {content_pillar}
Post Number: {post_number} of 15

Return ONLY valid JSON:
{{
  "id": "CNW{post_number:03d}",
  "date_offset": 0,
  "platform": "both",
  "content_pillar": "{content_pillar}",
  "hook": "Attention-grabbing hook here",
  "caption": "Full caption with emojis and hashtags...",
  "content_format": "static_image",
  "image_prompt": "Detailed image generation prompt...",
  "cta_type": "website_visit",
  "cta_url": "https://www.convertnow.ca",
  "optimal_time": "09:00"
}}

Requirements:
- Hook: Under 100 characters, attention-grabbing
- Caption: 150-400 characters with emojis
- 8-12 relevant hashtags
- Include clear CTA to convertnow.ca
- Image prompt: Detailed for AI image generation
- Platform: "facebook", "instagram", or "both"
- Time: Choose from 09:00, 12:00, 15:00, 18:00"""

        async with aiohttp.ClientSession() as session:
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
                "HTTP-Referer": "https://www.convertnow.ca",  # Required by OpenRouter
                "X-Title": "ConvertNow Social Media Automation"
            }
            
            payload = {
                "model": model.id,
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                "temperature": 0.8,
                "max_tokens": 2000
            }
            
            async with session.post(
                f"{self.base_url}/chat/completions",
                headers=headers,
                json=payload
            ) as response:
                if response.status != 200:
                    error_text = await response.text()
                    raise Exception(f"OpenRouter API error: {error_text}")
                
                data = await response.json()
                
                # Track actual usage and cost
                usage = data.get('usage', {})
                actual_cost = self.estimate_cost(
                    model,
                    usage.get('prompt_tokens', 2000),
                    usage.get('completion_tokens', 1500)
                )
                self.session_cost += actual_cost
                
                content = data['choices'][0]['message']['content']
                
                # Parse JSON response
                try:
                    parsed = json.loads(content)
                    return SocialPost(
                        **parsed,
                        model_used=model.name,
                        generation_cost=actual_cost
                    )
                except json.JSONDecodeError as e:
                    print(f"Failed to parse JSON: {content}")
                    raise e
    
    async def generate_weekly_content(
        self,
        week_start: datetime = None,
        tier: ModelTier = None
    ) -> List[SocialPost]:
        """Generate 15 posts for the week with smart model distribution"""
        
        if week_start is None:
            week_start = datetime.now()
        
        if tier:
            self.default_tier = tier
        
        # Content distribution strategy
        content_plan = [
            # (post_number, content_pillar, use_premium)
            (1, "product_spotlight", True),   # Premium for product posts
            (2, "conversion_fact", False),
            (3, "tip_hack", False),
            (4, "engagement", False),
            (5, "product_spotlight", True),   # Premium for product posts
            (6, "conversion_fact", False),
            (7, "seasonal", False),
            (8, "engagement", False),
            (9, "product_spotlight", True),   # Premium for product posts
            (10, "tip_hack", False),
            (11, "conversion_fact", False),
            (12, "engagement", False),
            (13, "product_spotlight", False),
            (14, "tip_hack", False),
            (15, "seasonal", False),
        ]
        
        posts = []
        
        print(f"🚀 Generating 15 posts using OpenRouter...")
        print(f"   Default tier: {self.default_tier.value}")
        print()
        
        for post_num, pillar, use_premium in content_plan:
            # Select model based on content importance
            if use_premium:
                model = OPENROUTER_MODELS["anthropic/claude-3.5-sonnet"]
            else:
                model = self.select_model(pillar)
            
            estimated_cost = self.estimate_cost(model)
            print(f"   Post {post_num} ({pillar}): {model.name} (~${estimated_cost:.4f})")
            
            try:
                post = await self.generate_single_post(post_num, pillar, model)
                posts.append(post)
                
                # Small delay to respect rate limits
                await asyncio.sleep(0.5)
                
            except Exception as e:
                print(f"   ❌ Error on post {post_num}: {e}")
                # Fallback to economy model
                fallback_model = OPENROUTER_MODELS["google/gemini-flash-1.5"]
                print(f"   🔄 Retrying with {fallback_model.name}...")
                post = await self.generate_single_post(post_num, pillar, fallback_model)
                posts.append(post)
        
        return posts
    
    def _load_system_prompt(self) -> str:
        """Load the content generation system prompt"""
        return """You are an expert social media content strategist for ConvertNow.ca, a free online unit converter website with 500+ conversions and a curated shop.

BRAND VOICE:
- Tone: Helpful, friendly, knowledgeable but accessible
- Style: Conversational, punchy, emoji-friendly (3-5 per post)
- Always include clear CTAs to convertnow.ca or convertnow.ca/shop

CONTENT PILLARS:
1. Conversion Facts - "Did you know?" measurement trivia
2. Product Spotlights - Shop items with real use cases (link to /shop)
3. Tips & Hacks - Getting the most from converters
4. Engagement Posts - Questions, polls, interactive content
5. Seasonal/Trending - Current events, holidays, trends

REQUIREMENTS:
- Hook: Under 100 characters, attention-grabbing
- Caption: 150-400 characters with natural emoji use
- Include 8-12 relevant hashtags
- CTA must link to convertnow.ca
- Image prompt: Detailed for DALL-E/AI generation (50-100 words)
- Content format: static_image, carousel, infographic, question_poll

EXAMPLE:
{
  "id": "CNW001",
  "date_offset": 0,
  "platform": "both",
  "content_pillar": "conversion_fact",
  "hook": "Stop guessing in the kitchen! 🍳",
  "caption": "Ever ruined a recipe because of measurement confusion?\\n\\n1 cup ≠ 250ml everywhere! Here's the breakdown:\\n🇺🇸 US Cup = 236.6ml\\n🇬🇧 UK Cup = 284ml\\n🇦🇺 Metric Cup = 250ml\\n\\nUse our Volume Converter to get it right every time! 👇\\n\\n🔗 https://www.convertnow.ca/volume\\n\\n#CookingTips #KitchenHacks #MeasurementMatters #ConvertNow",
  "content_format": "infographic",
  "image_prompt": "Clean infographic showing three measuring cups side by side with different liquid levels, labeled US Cup 236ml, UK Cup 284ml, Metric Cup 250ml, modern flat design, bright blue and white colors, ConvertNow branding",
  "cta_type": "website_visit",
  "cta_url": "https://www.convertnow.ca/volume",
  "optimal_time": "09:00"
}

Generate engaging, high-quality content that drives traffic to ConvertNow.ca!"""

    def print_cost_summary(self):
        """Print cost breakdown for the session"""
        print("\n" + "="*50)
        print("💰 COST SUMMARY")
        print("="*50)
        print(f"Total session cost: ${self.session_cost:.4f}")
        print(f"Average cost per post: ${self.session_cost/15:.4f}")
        print(f"Estimated monthly cost (60 posts): ${self.session_cost * 4:.2f}")
        print()
        print("Model Pricing Reference:")
        for model_id, config in OPENROUTER_MODELS.items():
            avg_cost = (config.input_price_per_1k + config.output_price_per_1k) / 2
            print(f"  {config.name}: ~${avg_cost:.4f}/1K tokens ({config.tier.value})")


async def main():
    """CLI entry point with tier selection"""
    import sys
    
    # Parse arguments
    tier = ModelTier.BALANCED
    if len(sys.argv) > 1:
        tier_arg = sys.argv[1].lower()
        if tier_arg == "premium":
            tier = ModelTier.PREMIUM
        elif tier_arg == "economy":
            tier = ModelTier.ECONOMY
    
    generator = OpenRouterContentGenerator(default_tier=tier)
    
    print(f"🚀 Generating weekly content for ConvertNow.ca...")
    print(f"   Using OpenRouter API with {tier.value} tier")
    print()
    
    posts = await generator.generate_weekly_content()
    
    # Save to JSON
    output_file = f"content_week_{datetime.now().strftime('%Y%m%d')}_{tier.value}.json"
    with open(output_file, 'w') as f:
        json.dump([asdict(post) for post in posts], f, indent=2)
    
    print(f"\n✅ Generated {len(posts)} posts")
    print(f"💾 Saved to {output_file}")
    
    # Print content summary
    platforms = {}
    pillars = {}
    models_used = {}
    total_cost = 0.0
    
    for post in posts:
        platforms[post.platform] = platforms.get(post.platform, 0) + 1
        pillars[post.content_pillar] = pillars.get(post.content_pillar, 0) + 1
        models_used[post.model_used] = models_used.get(post.model_used, 0) + 1
        total_cost += post.generation_cost
    
    print("\n📊 Content Distribution:")
    print(f"   Platforms: {platforms}")
    print(f"   Pillars: {pillars}")
    print(f"   Models: {models_used}")
    
    generator.print_cost_summary()


if __name__ == "__main__":
    asyncio.run(main())
