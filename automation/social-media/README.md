# ConvertNow.ca Social Media Automation

## Quick Start (OpenRouter - Cost Optimized)

```bash
# 1. Install dependencies
pip install -r scripts/requirements.txt

# 2. Set environment variables
cp scripts/env.example scripts/.env
# Edit scripts/.env - add OPENROUTER_API_KEY (get at openrouter.ai)

# 3. Generate weekly content (choose tier)
python scripts/content_generator_openrouter.py balanced    # $12/month ⭐
python scripts/content_generator_openrouter.py premium     # $35/month
python scripts/content_generator_openrouter.py economy     # $3/month

# 4. Generate images (cost-optimized)
python scripts/image_generator_optimized.py content_week_YYYYMMDD.json

# 5. Schedule posts
python scripts/poster.py --daily
```

## Cost-Optimized Options

| Tier | Monthly Cost | Text Model | Images | Best For |
|------|--------------|------------|--------|----------|
| **Balanced** ⭐ | **$12** | Claude Haiku | DALL-E + Leonardo | Most users |
| Budget | $3 | Gemini Flash | Pollinations (free) | Testing |
| Premium | $35 | Claude 3.5 Sonnet | DALL-E 3 | Established brands |

**Savings vs OpenAI direct: 40-85%**

## Why OpenRouter?

- **Lower costs** - Volume discounts on 100+ models
- **One API key** - Access GPT-4, Claude, Llama, Gemini
- **Smart fallback** - Auto-switch if provider down
- **No minimums** - Pay only for what you use
- **Free tier** - Test without spending

## Project Structure

```
automation/social-media/
├── ARCHITECTURE.md              # System design
├── SETUP_GUIDE.md               # Setup instructions
├── OPENROUTER_GUIDE.md          # Cost comparison ⭐
├── CONTENT_PROMPT.md            # AI prompt template
├── make-scenarios.json          # Make.com scenarios
├── google-sheets-template.json  # Sheets structure
├── google-apps-script/
│   └── Code.gs
└── scripts/
    ├── content_generator_openrouter.py  # ⭐ Main
    ├── image_generator_optimized.py     # ⭐ Images
    ├── poster.py                        # Buffer posting
    ├── requirements.txt
    └── env.example
```

## API Keys

### Required (Free to set up)
- **OpenRouter**: https://openrouter.ai/ - One key for all text models
- **Buffer**: https://buffer.com/developers - For posting
- **Google Sheets**: https://console.cloud.google.com/ - Content calendar

### Optional (Image providers)
- **OpenAI**: DALL-E 3 (best quality, $0.04/image)
- **Leonardo AI**: Cheap images ($0.008/image)
- **Together AI**: Very cheap ($0.004/image)
- **Pollinations**: FREE tier available

## Workflow

1. **Sunday 9am**: Generate 15 posts (~$0.50)
2. **Daily 6am**: Generate images (~$0.20/day)
3. **3x Daily**: Post via Buffer

**Weekly cost: ~$3 (vs $5 with OpenAI direct)**

## Smart Model Selection

System auto-picks best model per post:

| Content Type | Model | Cost |
|--------------|-------|------|
| Product Spotlight | Claude 3.5 Sonnet | $0.003 |
| Standard Posts | Claude 3 Haiku | $0.0005 |
| Quick Drafts | Gemini Flash | $0.0001 |

## Image Provider Selection

| Post Type | Provider | Cost |
|-----------|----------|------|
| Product Images | DALL-E 3 | $0.040 |
| Engagement | Leonardo AI | $0.008 |
| Quick Visuals | Pollinations | **FREE** |
| Fallback | Together AI | $0.004 |

## Documentation

- **OpenRouter Setup**: `OPENROUTER_GUIDE.md`
- **Full Setup**: `SETUP_GUIDE.md`
- **Architecture**: `ARCHITECTURE.md`

## Next Steps

1. Get OpenRouter key (free): https://openrouter.ai/
2. Run: `python scripts/content_generator_openrouter.py balanced`
3. Review content, generate images, start posting!
