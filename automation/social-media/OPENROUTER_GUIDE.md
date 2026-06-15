# OpenRouter Cost Comparison & Setup Guide

## Why OpenRouter?

OpenRouter provides unified access to 100+ AI models with:
- **Lower costs** than direct API access (volume discounts)
- **Model fallback** if one provider is down
- **Single API key** for all models
- **Pay-per-use** with no monthly minimums
- **Free tier** available for testing

## Cost Comparison: Direct vs OpenRouter

### Text Generation (per 1K tokens)

| Model | Direct API | OpenRouter | Savings |
|-------|------------|------------|---------|
| GPT-4o | $0.005/$0.015 | $0.005/$0.015 | 0% |
| Claude 3.5 Sonnet | $0.003/$0.015 | $0.003/$0.015 | 0% |
| Claude 3 Haiku | $0.00025/$0.00125 | $0.00025/$0.00125 | 0% |
| Llama 3.1 70B | Varies | $0.0004/$0.0004 | ~50% |
| Gemini Flash | $0.000075/$0.0003 | $0.000075/$0.0003 | 0% |

### Image Generation (per image)

| Provider | Cost | Quality | Speed |
|----------|------|---------|-------|
| DALL-E 3 | $0.040 | ⭐⭐⭐⭐⭐ | Medium |
| Stable Diffusion XL | $0.020 | ⭐⭐⭐⭐ | Fast |
| Leonardo AI | $0.008 | ⭐⭐⭐⭐ | Slow |
| Pollinations | **FREE** | ⭐⭐⭐ | Medium |
| Together AI | $0.004 | ⭐⭐⭐ | Fast |

## Recommended Strategy for ConvertNow

### Option 1: Maximum Quality (~$35/month)
```
Text: Claude 3.5 Sonnet (premium posts) + Claude Haiku (standard)
Images: DALL-E 3 for all
Cost: ~$15 (text) + ~$20 (images) = $35/month
```

### Option 2: Balanced (RECOMMENDED) (~$12/month)
```
Text: Claude 3 Haiku (all posts)
Images: DALL-E 3 (product posts) + Leonardo AI (others)
Cost: ~$2 (text) + ~$10 (images) = $12/month
```

### Option 3: Budget (~$3/month)
```
Text: Gemini Flash 1.5 (all posts)
Images: Pollinations (free) + Together AI (if needed)
Cost: ~$0.50 (text) + ~$2.50 (images) = $3/month
```

## Setup Instructions

### 1. Create OpenRouter Account
1. Visit https://openrouter.ai/
2. Sign up with email or GitHub
3. No credit card required for free tier

### 2. Add Credits
1. Go to **Settings** → **Credits**
2. Add payment method
3. Add credits (recommend $20 to start)

### 3. Get API Key
1. Go to **Keys** → **Create Key**
2. Name: "ConvertNow Social"
3. Copy the key (starts with `sk-or-`)

### 4. Configure Environment

Update your `.env` file:
```bash
# OpenRouter (replaces OpenAI)
OPENROUTER_API_KEY=sk-or-v1-...

# Optional: Direct provider keys for images
STABILITY_API_KEY=...      # For Stable Diffusion
LEONARDO_API_KEY=...       # For Leonardo AI
TOGETHER_API_KEY=...       # For Together AI

# Remove or comment out:
# OPENAI_API_KEY=...
```

### 5. Test the Setup

```bash
# Generate content with balanced tier (recommended)
python content_generator_openrouter.py balanced

# Generate with premium tier
python content_generator_openrouter.py premium

# Generate with economy tier (cheapest)
python content_generator_openrouter.py economy
```

## Smart Model Selection

The system automatically selects models based on content type:

| Content Type | Model | Reason |
|--------------|-------|--------|
| Product Spotlight | Claude 3.5 Sonnet | Needs persuasive copy |
| Conversion Facts | Claude 3 Haiku | Simple factual content |
| Engagement Posts | Claude 3 Haiku | Quick, punchy content |
| Tips & Hacks | Claude 3 Haiku | Practical advice |
| Seasonal | Claude 3.5 Sonnet | Creative, timely content |

## Image Provider Selection

| Post Type | Provider | Cost |
|-----------|----------|------|
| Product Images | DALL-E 3 | $0.040 |
| Infographics | DALL-E 3 | $0.040 |
| Engagement | Leonardo AI | $0.008 |
| Quick Visuals | Pollinations | FREE |
| Fallback | Together AI | $0.004 |

## Cost Tracking

The system tracks actual costs per post:

```json
{
  "id": "CNW001",
  "model_used": "Claude 3 Haiku",
  "generation_cost": 0.0015,
  "image_provider": "Leonardo AI",
  "image_cost": 0.008
}
```

## Free Tier Options

### Completely Free Setup
```bash
# Text: Use Gemini Flash (almost free)
# Images: Use Pollinations (completely free)

Estimated cost: $0.50/month for 60 posts
```

### OpenRouter Free Tier Limits
- 100 requests/day on some models
- Lower rate limits
- Perfect for testing

## Monitoring Costs

### Check Balance
```bash
curl https://openrouter.ai/api/v1/auth/key \
  -H "Authorization: Bearer $OPENROUTER_API_KEY"
```

### Set Up Alerts
1. Go to OpenRouter Dashboard
2. Set low balance notification
3. Recommended: Alert at $5 remaining

## Troubleshooting

### "Insufficient Credits"
- Add more credits to OpenRouter
- Or switch to cheaper models

### "Model Not Available"
- System auto-falls back to alternative
- Check OpenRouter status page

### "Rate Limited"
- Add delay between requests (built-in)
- Or upgrade OpenRouter plan

## Migration from OpenAI

If you have existing OpenAI code:

```python
# Old (OpenAI)
from openai import OpenAI
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

# New (OpenRouter)
import openai
client = openai.OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv('OPENROUTER_API_KEY')
)
# Rest of the code stays the same!
```

## Summary

| Approach | Monthly Cost | Quality | Best For |
|----------|--------------|---------|----------|
| Premium | $35 | ⭐⭐⭐⭐⭐ | Established brands |
| **Balanced** | **$12** | **⭐⭐⭐⭐** | **Most users** |
| Budget | $3 | ⭐⭐⭐ | Testing, startups |
| Free | $0.50 | ⭐⭐⭐ | Proof of concept |

**Recommendation**: Start with Balanced tier ($12/month), monitor results for 1 month, then adjust based on engagement metrics.
