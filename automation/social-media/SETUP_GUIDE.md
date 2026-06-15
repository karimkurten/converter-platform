# ConvertNow.ca Social Media Automation - Setup Guide

## Overview
This system automates social media content creation and posting for ConvertNow.ca, generating 15 high-quality posts per week across Facebook and Instagram.

## Architecture
- **Content Generation**: OpenAI GPT-4
- **Image Creation**: DALL-E 3
- **Content Database**: Google Sheets
- **Scheduling**: Buffer API
- **Orchestration**: Make.com (or Python scripts)

---

## Phase 1: API Setup (30 minutes)

### 1.1 OpenAI API Key
1. Visit https://platform.openai.com/
2. Sign up/login with your account
3. Go to **API Keys** → **Create new secret key**
4. Copy the key (starts with `sk-`)
5. **Cost**: ~$0.50-1.00/week for 15 posts + images

### 1.2 Buffer API Access
1. Visit https://buffer.com/developers
2. Create a new app:
   - App Name: "ConvertNow Automation"
   - Website: https://www.convertnow.ca
3. Get **Access Token** from app settings
4. Note your **Profile IDs** (found in Buffer settings)

### 1.3 Google Sheets API
1. Go to https://console.cloud.google.com/
2. Create new project: "ConvertNow Social"
3. Enable APIs:
   - Google Sheets API
   - Google Drive API
4. Create credentials → Service Account
5. Download JSON key file
6. Share your Google Sheet with the service account email

### 1.4 Cloud Storage (for images)
Option A - AWS S3:
- Create S3 bucket
- Set up IAM user with S3 access
- Note Access Key + Secret

Option B - Cloudflare R2:
- Create R2 bucket
- Generate API tokens
- Note Endpoint URL

---

## Phase 2: Google Sheets Setup (20 minutes)

### 2.1 Create the Spreadsheet
1. Go to https://sheets.new
2. Name: "ConvertNow Social Media Calendar"
3. Create 3 sheets:
   - **Content Calendar** (main)
   - **Analytics** (tracking)
   - **Settings** (configuration)

### 2.2 Content Calendar Columns
| Column | Header | Format |
|--------|--------|--------|
| A | ID | Text (CNW001) |
| B | Date | Date |
| C | Platform | Dropdown: Facebook, Instagram, Both |
| D | Content Pillar | Dropdown: Conversion Fact, Product Spotlight, Tip/Hack, Engagement, Seasonal |
| E | Hook | Text |
| F | Caption | Long text |
| G | Content Format | Dropdown: Static Image, Carousel, Reel, Text Graphic, Infographic, Question/Poll |
| H | Image Prompt | Long text |
| I | Image URL | URL |
| J | CTA Type | Dropdown: Website Visit, Shop Visit, Engagement, Share |
| K | CTA URL | URL |
| L | Optimal Time | Time (HH:MM) |
| M | Post Status | Dropdown: Draft, Image Pending, Ready to Post, Scheduled, Posted, Error |
| N | Buffer ID | Text |
| O | Posted URL | URL |
| P | Engagement | Text |
| Q | Notes | Long text |

### 2.3 Settings Sheet
Add these rows:
```
Setting | Value | Description
OpenAI API Key | [hidden] | For content generation
Buffer Access Token | [hidden] | For posting
Sheet ID | [auto] | This sheet's ID
Make Webhook URL | [your webhook] | For automation
Content Gen Day | Sunday | Weekly generation day
Content Gen Time | 09:00 | Generation time
FB Page ID | [your ID] | Facebook page
IG Business ID | [your ID] | Instagram account
Weekly Post Target | 15 | Posts per week
Image Size | 1024x1024 | DALL-E dimensions
```

### 2.4 Add Google Apps Script
1. Extensions → Apps Script
2. Delete default code
3. Copy content from `google-apps-script/Code.gs`
4. Save (Ctrl+S)
5. Refresh the sheet - new menu appears

---

## Phase 3: Make.com Setup (45 minutes)

### 3.1 Create Account
1. Visit https://www.make.com/
2. Sign up for free account (10,000 ops/month)
3. Create new scenario

### 3.2 Scenario 1: Weekly Content Generation
**Trigger**: Schedule (Every Sunday 9:00 AM)

**Modules**:
1. **Google Sheets** → Get Settings
2. **OpenAI** → Generate Content
   - Model: GPT-4
   - Prompt: Use system prompt from CONTENT_PROMPT.md
3. **JSON Parser** → Parse response
4. **Iterator** → Process each post
5. **Google Sheets** → Add Row (for each post)

### 3.3 Scenario 2: Daily Image Generation
**Trigger**: Schedule (Daily 6:00 AM)

**Modules**:
1. **Google Sheets** → Search Rows
   - Filter: Status = "Draft", Date within 3 days
2. **Iterator** → For each pending post
3. **OpenAI** → Generate Image (DALL-E 3)
4. **HTTP** → Upload to cloud storage
5. **Google Sheets** → Update Row (set Image URL, Status = "Ready")

### 3.4 Scenario 3: Post to Buffer
**Trigger**: Schedule (3x daily: 9am, 12pm, 6pm)

**Modules**:
1. **Google Sheets** → Search Rows
   - Filter: Status = "Ready to Post", Date = Today
2. **Router** → Check platform
3. **Buffer** → Create Post (for each platform)
4. **Google Sheets** → Update Row (Status = "Scheduled")

### 3.5 Webhook Setup
1. Create webhook in Make.com
2. Copy webhook URL
3. Add to Google Sheets → Settings
4. Use for: Image generation triggers, status updates

---

## Phase 4: Python Alternative (Optional)

If you prefer local execution over Make.com:

### 4.1 Install Dependencies
```bash
cd automation/social-media/scripts
pip install -r requirements.txt
```

### 4.2 Set Environment Variables
Create `.env` file:
```
OPENAI_API_KEY=sk-...
BUFFER_ACCESS_TOKEN=...
BUFFER_FB_PROFILE_ID=...
BUFFER_IG_PROFILE_ID=...
GOOGLE_SHEET_ID=...
GOOGLE_API_KEY=...
STORAGE_BUCKET=...
STORAGE_ACCESS_KEY=...
STORAGE_SECRET_KEY=...
```

### 4.3 Run Scripts
```bash
# Generate weekly content
python content_generator.py

# Generate images
python image_generator.py content_week_20240115.json

# Post to Buffer
python poster.py --daily
```

### 4.4 Schedule with Cron
```bash
# Edit crontab
crontab -e

# Add lines:
0 9 * * 0 cd /path/to/scripts && python content_generator.py
0 6 * * * cd /path/to/scripts && python image_generator.py
0 9,12,18 * * * cd /path/to/scripts && python poster.py --daily
```

---

## Phase 5: Testing (30 minutes)

### 5.1 Test Content Generation
1. In Google Sheets: 🚀 ConvertNow Social → Generate Weekly Content
2. Check that 15 rows are added
3. Verify content quality

### 5.2 Test Image Generation
1. Select a post with "Draft" status
2. Run: Generate Images for Pending
3. Verify image appears in Image URL column

### 5.3 Test Posting
1. Set a post to "Ready to Post"
2. Run: Post Ready Items
3. Check Buffer queue for scheduled post

### 5.4 End-to-End Test
1. Generate 1 test post for today
2. Generate image
3. Schedule post
4. Verify it publishes correctly

---

## Phase 6: Go Live

### 6.1 First Week
- Monitor daily for errors
- Review and approve all content before posting
- Adjust image prompts if needed

### 6.2 Ongoing Monitoring
- Check Google Sheets weekly
- Review Analytics tab monthly
- Update prompts based on performance

### 6.3 Optimization
- A/B test different hooks
- Adjust posting times based on engagement
- Refine image prompts for better quality

---

## Troubleshooting

### Common Issues

**OpenAI API errors**
- Check API key is valid
- Verify billing is set up
- Check rate limits

**Buffer posting fails**
- Verify profile IDs are correct
- Check image URLs are publicly accessible
- Ensure Buffer account has posting permissions

**Images not generating**
- Check DALL-E 3 availability
- Verify image prompts don't violate content policy
- Check cloud storage credentials

**Google Sheets not updating**
- Verify service account has edit permissions
- Check API quotas
- Review Apps Script execution logs

---

## Cost Breakdown (Monthly)

| Service | Cost |
|---------|------|
| OpenAI GPT-4 | ~$4 (60 posts) |
| OpenAI DALL-E 3 | ~$15 (60 images) |
| Make.com | Free (10,000 ops) |
| Buffer | Free (3 accounts) |
| Cloud Storage | ~$1 (image hosting) |
| **Total** | **~$20/month** |

---

## Support & Resources

- **OpenAI Docs**: https://platform.openai.com/docs
- **Buffer API**: https://buffer.com/developers
- **Make.com Help**: https://www.make.com/en/help
- **Google Apps Script**: https://developers.google.com/apps-script

---

## Next Steps

1. ✅ Complete API setup
2. ✅ Configure Google Sheets
3. ✅ Build Make.com scenarios
4. ✅ Test end-to-end
5. ✅ Schedule first week
6. 📊 Monitor and optimize

**Questions?** Check the ARCHITECTURE.md and individual script documentation.
