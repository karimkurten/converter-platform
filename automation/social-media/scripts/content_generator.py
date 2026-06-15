#!/usr/bin/env python3
"""
ConvertNow.ca Social Media Content Generator
Generates 15 weekly posts using OpenAI GPT-4
"""

import os
import json
import asyncio
from datetime import datetime, timedelta
from typing import List, Dict, Any
from dataclasses import dataclass, asdict
import aiohttp


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


class ContentGenerator:
    def __init__(self, api_key: str = None):
        self.api_key = api_key or os.getenv('OPENAI_API_KEY')
        self.base_url = "https://api.openai.com/v1"
        
    async def generate_weekly_content(self, week_start: datetime = None) -> List[SocialPost]:
        """Generate 15 posts for the week"""
        if week_start is None:
            week_start = datetime.now()
            
        system_prompt = self._load_system_prompt()
        user_prompt = f"""Generate 15 unique social media posts for ConvertNow.ca for the week starting {week_start.strftime('%Y-%m-%d')}.

Return ONLY valid JSON in this exact format:
{{
  "posts": [
    {{
      "id": "CNW001",
      "date_offset": 0,
      "platform": "both",
      "content_pillar": "conversion_fact",
      "hook": "Attention-grabbing hook here",
      "caption": "Full caption with emojis and hashtags...",
      "content_format": "static_image",
      "image_prompt": "Detailed DALL-E 3 prompt...",
      "cta_type": "website_visit",
      "cta_url": "https://www.convertnow.ca/...",
      "optimal_time": "09:00"
    }}
  ]
}}

Requirements:
- Generate EXACTLY 15 posts
- date_offset: 0-6 (Monday=0, Sunday=6)
- platform: "facebook", "instagram", or "both"
- content_pillar: "conversion_fact", "product_spotlight", "tip_hack", "engagement", or "seasonal"
- 5 posts must link to /shop
- Vary optimal_time between 09:00, 12:00, 15:00, 18:00
- Include emojis naturally (3-5 per post)
- 8-12 hashtags per post
- Hooks under 100 characters"""

        async with aiohttp.ClientSession() as session:
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            
            payload = {
                "model": "gpt-4",
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                "temperature": 0.8,
                "max_tokens": 4000
            }
            
            async with session.post(
                f"{self.base_url}/chat/completions",
                headers=headers,
                json=payload
            ) as response:
                if response.status != 200:
                    error_text = await response.text()
                    raise Exception(f"OpenAI API error: {error_text}")
                
                data = await response.json()
                content = data['choices'][0]['message']['content']
                
                # Parse JSON response
                try:
                    parsed = json.loads(content)
                    posts = []
                    for post_data in parsed['posts']:
                        posts.append(SocialPost(**post_data))
                    return posts
                except json.JSONDecodeError as e:
                    print(f"Failed to parse JSON: {content}")
                    raise e
    
    def _load_system_prompt(self) -> str:
        """Load the content generation system prompt"""
        return """You are an expert social media content strategist for ConvertNow.ca, a free online unit converter website.

BRAND VOICE:
- Tone: Helpful, friendly, knowledgeable but accessible
- Style: Conversational, punchy, emoji-friendly but not overdone
- Always include clear CTAs to convertnow.ca

CONTENT PILLARS (distribute evenly):
1. Conversion Facts - "Did you know?" measurement trivia
2. Product Spotlights - Shop items with real use cases
3. Tips & Hacks - Getting the most from converters
4. Engagement Posts - Questions, polls, interactive
5. Seasonal/Trending - Current events, holidays

EXAMPLE POSTS:

Conversion Fact:
{
  "id": "CNW001",
  "date_offset": 0,
  "platform": "both",
  "content_pillar": "conversion_fact",
  "hook": "Stop guessing in the kitchen! 🍳",
  "caption": "Ever ruined a recipe because of measurement confusion?\n\n1 cup ≠ 250ml everywhere! Here's the breakdown:\n🇺🇸 US Cup = 236.6ml\n🇬🇧 UK Cup = 284ml\n🇦🇺 Metric Cup = 250ml\n\nUse our Volume Converter to get it right every time! 👇\n\n🔗 https://www.convertnow.ca/volume\n\n#CookingTips #KitchenHacks #MeasurementMatters #ConvertNow",
  "content_format": "infographic",
  "image_prompt": "Clean infographic showing three measuring cups side by side with different liquid levels, labeled US Cup 236ml, UK Cup 284ml, Metric Cup 250ml, modern flat design, bright blue and white colors, ConvertNow branding",
  "cta_type": "website_visit",
  "cta_url": "https://www.convertnow.ca/volume",
  "optimal_time": "09:00"
}

Product Spotlight:
{
  "id": "CNW002",
  "date_offset": 0,
  "platform": "instagram",
  "content_pillar": "product_spotlight",
  "hook": "Baking fail? This $25 gadget fixes everything ⚖️",
  "caption": "Tired of guessing with measuring cups?\n\nA digital kitchen scale is the #1 tool every home baker needs:\n\n✅ Perfect measurements every time\n✅ Convert between grams, ounces, ml instantly\n✅ Less cleanup (measure directly in the bowl!)\n✅ Professional results guaranteed\n\nWe found the best-rated scales on Amazon starting at $24.99 👇\n\n🔗 https://www.convertnow.ca/shop\n\n#BakingTools #KitchenGadgets #HomeBaking #ConvertNowShop #BakingEssentials",
  "content_format": "static_image",
  "image_prompt": "Sleek digital kitchen scale on marble countertop with flour and baking ingredients, warm lighting, professional product photography style, Instagram aesthetic, soft shadows",
  "cta_type": "shop_visit",
  "cta_url": "https://www.convertnow.ca/shop",
  "optimal_time": "15:00"
}

Engagement Post:
{
  "id": "CNW003",
  "date_offset": 1,
  "platform": "facebook",
  "content_pillar": "engagement",
  "hook": "Quick poll: Which conversion confuses you most? 🤔",
  "caption": "Be honest...\n\n🌡️ Celsius ↔ Fahrenheit?\n📏 Kilometers ↔ Miles?\n⚖️ Kilograms ↔ Pounds?\n💧 Liters ↔ Gallons?\n\nComment below with your answer! We'll create a quick guide for the most confusing one 👇\n\nAnd if you need help RIGHT NOW, our free converter has you covered:\n🔗 https://www.convertnow.ca\n\n#Poll #QuestionOfTheDay #MeasurementHelp #ConvertNow",
  "content_format": "question_poll",
  "image_prompt": "Colorful poll graphic with four measurement icons (thermometer, ruler, scale, water drop), question mark in center, social media poll style, bright engaging colors, modern flat design",
  "cta_type": "engagement",
  "cta_url": "https://www.convertnow.ca",
  "optimal_time": "18:00"
}

Generate diverse, engaging content that drives traffic to ConvertNow.ca!"""


async def main():
    """CLI entry point"""
    generator = ContentGenerator()
    
    print("🚀 Generating weekly content for ConvertNow.ca...")
    posts = await generator.generate_weekly_content()
    
    # Save to JSON
    output_file = f"content_week_{datetime.now().strftime('%Y%m%d')}.json"
    with open(output_file, 'w') as f:
        json.dump([asdict(post) for post in posts], f, indent=2)
    
    print(f"✅ Generated {len(posts)} posts")
    print(f"💾 Saved to {output_file}")
    
    # Print summary
    platforms = {}
    pillars = {}
    for post in posts:
        platforms[post.platform] = platforms.get(post.platform, 0) + 1
        pillars[post.content_pillar] = pillars.get(post.content_pillar, 0) + 1
    
    print("\n📊 Content Distribution:")
    print(f"   Platforms: {platforms}")
    print(f"   Pillars: {pillars}")


if __name__ == "__main__":
    asyncio.run(main())
