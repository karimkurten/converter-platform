# ConvertNow.ca Social Media Automation System

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CONVERTNOW.CA SOCIAL MEDIA AUTOMATION                    │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   WEEKLY CRON   │────▶│  CONTENT GEN    │────▶│  GOOGLE SHEETS  │
│  (Sundays 9am)  │     │  (OpenAI GPT-4) │     │  (Content DB)   │
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                         │
                              ┌──────────────────────────┘
                              ▼
                    ┌─────────────────┐
                    │  DAILY CRON     │
                    │ (6am, 12pm, 6pm)│
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
     ┌────────────────┐ ┌────────┐ ┌────────────────┐
     │ IMAGE GEN      │ │ BUFFER │ │ STATUS UPDATE  │
     │ (DALL-E 3)     │ │ API    │ │ (Sheets)       │
     └───────┬────────┘ └───┬────┘ └────────────────┘
             │              │
             └──────────────┘
                            │
                            ▼
                   ┌─────────────────┐
                   │  FACEBOOK       │
                   │  INSTAGRAM      │
                   └─────────────────┘
```

## Components

### 1. Content Generation Engine (OpenAI GPT-4)
- Generates 15-20 post ideas weekly
- Includes hooks, captions, hashtags, CTAs
- Diverse content types: facts, tips, products, engagement

### 2. Image Generation (DALL-E 3)
- Creates custom visuals for each post
- Aspect ratios: 4:5 (vertical), 1:1 (square)
- Branded style consistency

### 3. Google Sheets (Content Calendar)
- Central database for all posts
- Tracks status, URLs, scheduling
- Make.com integration hub

### 4. Make.com Automation
- Orchestrates entire workflow
- Weekly content generation trigger
- Daily posting schedule
- Error handling and retries

### 5. Buffer API
- Posts to Facebook Page
- Posts to Instagram Business
- Optimal timing distribution

## Posting Schedule (15 posts/week)

| Day | Time | Platform | Content Type |
|-----|------|----------|--------------|
| Mon | 9am  | FB + IG  | Conversion Fact |
| Mon | 3pm  | FB       | Engagement Question |
| Tue | 10am | FB + IG  | Product Highlight |
| Tue | 6pm  | IG       | Tip/Hack |
| Wed | 11am | FB + IG  | Infographic |
| Wed | 4pm  | FB       | Shop Promo |
| Thu | 9am  | FB + IG  | Conversion Fact |
| Thu | 7pm  | IG       | Behind the Scenes |
| Fri | 10am | FB + IG  | Product Highlight |
| Fri | 2pm  | FB       | Weekend Prep Tip |
| Sat | 11am | FB + IG  | Interactive Poll |
| Sat | 5pm  | IG       | User Feature |
| Sun | 12pm | FB + IG  | Weekly Roundup |
| Sun | 4pm  | FB       | Coming Soon Teaser |
| Sun | 8pm  | IG       | Motivational |

## Content Pillars (20% each)
1. **Conversion Facts** - Interesting unit conversion trivia
2. **Product Highlights** - Shop items with benefits
3. **Tips & Hacks** - How to use converters effectively
4. **Engagement** - Questions, polls, interactive content
5. **Brand Story** - Mission, values, behind-the-scenes
