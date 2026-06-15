"""
ConvertNow.ca Social Media Content Generator
Optimized config: Claude 3 Haiku (text) + Gemini 2.5 Flash Image / Nano Banana (images)
All via OpenRouter — single API key, lowest cost, best quality

Usage:
    python generate_week.py              # Generate 15 posts + images (~$0.65/week)
    python generate_week.py --no-images  # Text only (~$0.01/week)
    python generate_week.py --premium    # Use Claude 3.5 Sonnet for ALL posts (better quality)
"""

import os
import sys
import json
import time
import base64
import urllib.request
import urllib.parse
from datetime import datetime, timedelta
from pathlib import Path
from dotenv import load_dotenv

# Fix Windows console encoding for emojis
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

# Load .env file
load_dotenv()

API_KEY = os.getenv('OPENROUTER_API_KEY')

if not API_KEY:
    print("ERROR: OPENROUTER_API_KEY not found in .env file")
    sys.exit(1)

# === CONFIGURATION ===
TEXT_MODEL = "anthropic/claude-3-haiku"           # ~$0.0005/post (cheapest, works great)
PREMIUM_MODEL = "anthropic/claude-sonnet-4.5"     # ~$0.005/post (for product spotlights)
IMAGE_MODEL = "google/gemini-2.5-flash-image"     # ~$0.04/image (Nano Banana)

OUTPUT_DIR = Path(__file__).parent.parent / "output"
IMAGES_DIR = OUTPUT_DIR / "images"
OUTPUT_DIR.mkdir(exist_ok=True)
IMAGES_DIR.mkdir(exist_ok=True)

# Content distribution for 15 posts/week
CONTENT_PLAN = [
    # (id, day_offset, time, platform, pillar, use_premium_text, post_type)
    (1,  0, "09:00", "both",      "conversion_fact",   False, "infographic"),
    (2,  0, "15:00", "facebook",  "engagement",        False, "question_poll"),
    (3,  1, "10:00", "both",      "product_spotlight", True,  "static_image"),
    (4,  1, "18:00", "instagram", "tip_hack",          False, "static_image"),
    (5,  2, "11:00", "both",      "conversion_fact",   False, "infographic"),
    (6,  2, "16:00", "facebook",  "product_spotlight", True,  "static_image"),
    (7,  3, "09:00", "both",      "tip_hack",          False, "static_image"),
    (8,  3, "19:00", "instagram", "engagement",        False, "question_poll"),
    (9,  4, "10:00", "both",      "product_spotlight", True,  "static_image"),
    (10, 4, "14:00", "facebook",  "tip_hack",          False, "static_image"),
    (11, 5, "11:00", "both",      "engagement",        False, "question_poll"),
    (12, 5, "17:00", "instagram", "conversion_fact",   False, "infographic"),
    (13, 6, "12:00", "both",      "seasonal",          False, "static_image"),
    (14, 6, "16:00", "facebook",  "product_spotlight", True,  "static_image"),
    (15, 6, "20:00", "instagram", "engagement",        False, "static_image"),
]


def call_openrouter(model, system_prompt, user_prompt, max_retries=3):
    """Call OpenRouter API with retry logic"""
    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        "temperature": 0.85,
        "max_tokens": 1500,
    }
    # Only add response_format for models that support it
    # Sonnet 4.5 has its own behavior
    if "haiku" in model.lower() or "gpt" in model.lower():
        payload["response_format"] = {"type": "json_object"}
    
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://www.convertnow.ca",
        "X-Title": "ConvertNow Social Media"
    }
    
    for attempt in range(max_retries):
        try:
            req = urllib.request.Request(
                "https://openrouter.ai/api/v1/chat/completions",
                data=json.dumps(payload).encode(),
                headers=headers
            )
            with urllib.request.urlopen(req, timeout=60) as response:
                data = json.loads(response.read())
                content = data['choices'][0]['message']['content']
                usage = data.get('usage', {})
                return content, usage
        except urllib.error.HTTPError as e:
            error_body = e.read().decode()
            if e.code == 429 and attempt < max_retries - 1:
                wait_time = 5 * (attempt + 1)
                print(f"   Rate limited, waiting {wait_time}s...")
                time.sleep(wait_time)
                continue
            raise Exception(f"API error {e.code}: {error_body}")
        except Exception as e:
            if attempt < max_retries - 1:
                time.sleep(3)
                continue
            raise


def extract_json(text):
    """Extract JSON from text, handling markdown code blocks and other wrapping"""
    if not text or not text.strip():
        return None
    
    text = text.strip()
    
    # Remove markdown code blocks
    if text.startswith('```'):
        # Find the first newline after ``` and last ``` before end
        first_nl = text.find('\n')
        if first_nl > -1:
            text = text[first_nl+1:]
        if text.endswith('```'):
            text = text[:-3].strip()
    
    # Try direct parse first
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass
    
    # Try to find JSON object boundaries
    start = text.find('{')
    end = text.rfind('}')
    if start >= 0 and end > start:
        try:
            return json.loads(text[start:end+1])
        except json.JSONDecodeError:
            pass
    
    return None


def generate_post(post_config, week_start):
    """Generate a single post"""
    post_id, day_offset, time_str, platform, pillar, use_premium, post_type = post_config
    post_date = week_start + timedelta(days=day_offset)
    
    model = PREMIUM_MODEL if use_premium else TEXT_MODEL
    
    system_prompt = """You are an expert social media content strategist for ConvertNow.ca, a free online unit converter website with 500+ conversions and a curated shop for measurement tools.

BRAND VOICE:
- Helpful, friendly, knowledgeable
- Conversational with natural emoji use (3-5 per post)
- Always include clear CTA to convertnow.ca

REQUIREMENTS:
- Hook: Under 100 characters, attention-grabbing
- Caption: 150-400 characters with emojis
- Include 8-12 relevant hashtags
- CTA must link to convertnow.ca
- Image prompt: 50-100 words, detailed for AI image generation

Return ONLY valid JSON, no markdown."""

    cta_url = "https://www.convertnow.ca/shop" if pillar == "product_spotlight" else "https://www.convertnow.ca"
    
    user_prompt = f"""Generate ONE social media post for ConvertNow.ca.

Post specs:
- Pillar: {pillar}
- Platform: {platform}
- Format: {post_type}
- CTA URL: {cta_url}

Return this exact JSON structure:
{{
  "hook": "Attention-grabbing first line under 100 chars",
  "caption": "Full caption with emojis, 8-12 hashtags, ending with CTA link",
  "image_prompt": "Detailed image generation prompt 50-100 words. Style: clean modern flat design, bright colors, blue (#0c8ee7) and white, social media optimized, no text in image"
}}

Pillar guidance:
- conversion_fact: Surprising "did you know" facts about measurements
- product_spotlight: Highlight a specific shop product (kitchen scale, thermometer, GPS watch, etc.) with use case
- tip_hack: Practical tips for using converters or measurements
- engagement: Question, poll, or "this or that" to spark comments
- seasonal: Tie to current season/trend (cooking, travel, fitness, etc.)"""

    print(f"  CNW{post_id:03d} [{pillar:18}] -> {model.split('/')[-1]}")
    
    try:
        content, usage = call_openrouter(model, system_prompt, user_prompt)
        post_data = extract_json(content)
        
        if not post_data:
            print(f"     ERROR: Could not extract JSON from response")
            print(f"     Raw response (first 200 chars): {content[:200]}")
            return None
        
        return {
            "id": f"CNW{post_id:03d}",
            "date": post_date.strftime("%Y-%m-%d"),
            "time": time_str,
            "platform": platform,
            "content_pillar": pillar,
            "content_format": post_type,
            "hook": post_data.get("hook", ""),
            "caption": post_data.get("caption", ""),
            "image_prompt": post_data.get("image_prompt", ""),
            "cta_url": cta_url,
            "image_url": "",
            "image_path": "",
            "image_provider": "",
            "post_status": "draft",
            "model_used": model,
            "tokens_in": usage.get('prompt_tokens', 0),
            "tokens_out": usage.get('completion_tokens', 0),
        }
    except Exception as e:
        print(f"     ERROR: {e}")
        return None


def generate_image_nano_banana(prompt, output_path):
    """Generate image via Google Gemini 2.5 Flash Image (Nano Banana) through OpenRouter
    
    Cost: ~$0.04 per image
    Quality: State-of-the-art
    """
    enhanced_prompt = f"""Create a professional social media image: {prompt}

Style requirements:
- Clean modern flat design
- Bright vibrant colors  
- Blue (#0c8ee7) and white color scheme
- Professional social media aesthetic
- Square 1024x1024 format
- No text or watermarks in the image
- High contrast for mobile viewing"""
    
    payload = {
        "model": IMAGE_MODEL,
        "messages": [
            {"role": "user", "content": enhanced_prompt}
        ],
        "modalities": ["image", "text"]
    }
    
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://www.convertnow.ca",
        "X-Title": "ConvertNow Social Media"
    }
    
    try:
        req = urllib.request.Request(
            "https://openrouter.ai/api/v1/chat/completions",
            data=json.dumps(payload).encode(),
            headers=headers
        )
        with urllib.request.urlopen(req, timeout=180) as response:
            data = json.loads(response.read())
            
            # Extract cost from response
            cost = data.get('usage', {}).get('cost', 0.04)
            
            msg = data['choices'][0]['message']
            
            if 'images' in msg and msg['images']:
                img_data = msg['images'][0].get('image_url', {})
                if isinstance(img_data, dict) and 'url' in img_data:
                    url = img_data['url']
                    if url.startswith('data:image'):
                        # base64 encoded image
                        b64 = url.split(',')[1]
                        with open(output_path, 'wb') as f:
                            f.write(base64.b64decode(b64))
                        return True, cost
            
            print(f"     No image in response. Keys: {list(msg.keys())}")
            return False, 0
            
    except urllib.error.HTTPError as e:
        print(f"     API error {e.code}: {e.read().decode()[:200]}")
        return False, 0
    except Exception as e:
        print(f"     Error: {e}")
        return False, 0


def generate_images(posts):
    """Generate images for all posts using Nano Banana"""
    print("\n=== Generating Images (Gemini 2.5 Flash Image / Nano Banana) ===")
    
    total_image_cost = 0.0
    
    for post in posts:
        if not post:
            continue
        
        image_path = IMAGES_DIR / f"{post['id']}.png"
        
        print(f"  {post['id']} [{post['content_pillar']:18}]", end=" ", flush=True)
        
        success, cost = generate_image_nano_banana(post['image_prompt'], image_path)
        
        if success:
            post['image_path'] = str(image_path)
            post['image_provider'] = 'gemini-2.5-flash-image'
            post['image_cost'] = cost
            post['post_status'] = 'ready_to_post'
            total_image_cost += cost
            print(f"OK  ${cost:.4f}")
        else:
            post['post_status'] = 'image_error'
            print(f"FAILED")
        
        # Small delay to avoid rate limits
        time.sleep(1.5)
    
    return posts, total_image_cost


def calculate_text_cost(posts):
    """Calculate text generation cost from token usage"""
    text_cost = 0
    for post in posts:
        if not post:
            continue
        model = post['model_used']
        tokens_in = post.get('tokens_in', 0)
        tokens_out = post.get('tokens_out', 0)
        
        if 'sonnet' in model.lower():
            # Claude Sonnet 4.5: $3/M input, $15/M output
            text_cost += (tokens_in / 1_000_000) * 3.0 + (tokens_out / 1_000_000) * 15.0
        else:
            # Claude 3 Haiku: $0.25/M input, $1.25/M output
            text_cost += (tokens_in / 1_000_000) * 0.25 + (tokens_out / 1_000_000) * 1.25
    
    return text_cost


def main():
    args = sys.argv[1:]
    skip_images = '--no-images' in args
    use_premium_for_all = '--premium' in args
    
    # If premium mode, use Sonnet for all posts
    if use_premium_for_all:
        for i in range(len(CONTENT_PLAN)):
            cfg = list(CONTENT_PLAN[i])
            cfg[5] = True  # use_premium_text
            CONTENT_PLAN[i] = tuple(cfg)
    
    week_start = datetime.now()
    days_until_monday = (7 - week_start.weekday()) % 7
    if days_until_monday == 0:
        days_until_monday = 7
    week_start = week_start + timedelta(days=days_until_monday)
    
    print("=" * 60)
    print("ConvertNow.ca Social Media Generator")
    print("=" * 60)
    print(f"Week starting: {week_start.strftime('%Y-%m-%d')}")
    print(f"Text model:    {TEXT_MODEL}")
    print(f"Premium model: {PREMIUM_MODEL} (for product posts)")
    print(f"Image model:   {IMAGE_MODEL}")
    print(f"Mode:          {'Premium (all Sonnet)' if use_premium_for_all else 'Balanced (Haiku + Sonnet for products)'}")
    print(f"Images:        {'SKIPPED' if skip_images else 'Nano Banana via OpenRouter'}")
    print()
    
    # Generate text content
    print("=== Generating Posts ===")
    posts = []
    for config in CONTENT_PLAN:
        post = generate_post(config, week_start)
        if post:
            posts.append(post)
        time.sleep(0.5)  # Rate limit safety
    
    success_count = len(posts)
    print(f"\nGenerated {success_count}/15 posts successfully")
    
    # Generate images
    image_cost = 0.0
    if not skip_images and posts:
        posts, image_cost = generate_images(posts)
    
    # Save output
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_file = OUTPUT_DIR / f"week_{week_start.strftime('%Y%m%d')}_{timestamp}.json"
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump({
            "generated_at": datetime.now().isoformat(),
            "week_start": week_start.strftime('%Y-%m-%d'),
            "posts": posts
        }, f, indent=2, ensure_ascii=False)
    
    # Calculate costs
    text_cost = calculate_text_cost(posts)
    total = text_cost + image_cost
    
    # Summary
    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    print(f"Posts generated:     {success_count}/15")
    print(f"Images generated:    {sum(1 for p in posts if p.get('image_path'))}/{success_count}")
    print()
    print(f"Text cost:           ${text_cost:.4f}")
    print(f"Image cost:          ${image_cost:.4f}")
    print(f"Total this run:      ${total:.4f}")
    print(f"Monthly estimate:    ${total * 4.33:.2f} (4.33 weeks)")
    print()
    print(f"Output JSON:         {output_file}")
    print(f"Images directory:    {IMAGES_DIR}")
    print()
    print("Next steps:")
    print("  1. Review the JSON output and images")
    print("  2. Import to Google Sheets / Buffer for scheduling")
    print("  3. Or run: python poster.py --daily")


if __name__ == "__main__":
    main()
