# Make.com Automation Setup Guide

Complete hands-off social media automation for ConvertNow.ca.

## Architecture

```
SUNDAY 9AM (GitHub Actions, FREE)
  └─► Python script runs
      ├─► Generates 15 posts (Claude 3 Haiku + Sonnet 4.5)
      ├─► Generates 15 images (Gemini 2.5 Flash Image)
      ├─► Uploads images to Google Drive
      └─► Writes 15 rows to Google Sheets

EVERY HOUR (Make.com Scenario 1, ~150 ops/month)
  └─► Reads "ready_to_post" rows where Date <= today
      ├─► Posts to Buffer (Facebook + Instagram)
      └─► Updates row status to "scheduled"

DAILY 8AM (Make.com Scenario 2, ~30 ops/month)
  └─► Checks for any "error" rows
      └─► Emails you a summary if any need attention
```

**Total monthly cost**: ~$2.65 (OpenRouter only - everything else is free)

---

## Phase 1: Prerequisites (15 min)

### 1.1 Create Buffer Account
1. Go to https://buffer.com → Sign up (free plan = 3 channels)
2. Connect your **Facebook Page** (ConvertNow.ca)
3. Connect your **Instagram Business** account
4. Note: Instagram needs a **Business Account** linked to a Facebook Page

### 1.2 Get Buffer Profile IDs
1. Go to https://buffer.com/developers/api
2. Click **Get Access Token** → copy it (looks like `1/abc123...`)
3. Visit this URL (replace with your token):
   ```
   https://api.bufferapp.com/1/profiles.json?access_token=YOUR_TOKEN
   ```
4. Save the `id` for each profile (you'll need them later)

### 1.3 Create Google Sheet
1. Go to https://sheets.new
2. Name it: **"ConvertNow Social Media Calendar"**
3. Rename Sheet1 to: **"Content Calendar"**
4. Note the Sheet ID from URL: `docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit`

### 1.4 Create Google Drive Folder for Images
1. Go to https://drive.google.com → New → Folder
2. Name it: **"ConvertNow Social Images"**
3. Right-click → Share → Set to "Anyone with the link"
4. Copy folder ID from URL: `drive.google.com/drive/folders/FOLDER_ID_HERE`

### 1.5 Create Google Service Account (for automation)
1. Go to https://console.cloud.google.com/
2. Create new project: **"ConvertNow Social"**
3. Enable APIs: **Google Sheets API** + **Google Drive API**
4. Go to **IAM & Admin** → **Service Accounts** → **Create**
   - Name: `convertnow-automation`
   - Role: Editor
5. Click on the service account → **Keys** → **Add Key** → **JSON**
6. Save the JSON file (keep it secret!)
7. Note the email like: `convertnow-automation@your-project.iam.gserviceaccount.com`

### 1.6 Share Google Resources with Service Account
1. **Google Sheet**: Share → paste service account email → Editor access
2. **Drive Folder**: Share → paste service account email → Editor access

---

## Phase 2: GitHub Actions Setup (15 min)

This runs your Python script automatically every Sunday for FREE.

### 2.1 Push Code to GitHub
Your code is already in a Git repo. Just need to push:

```bash
cd C:\Users\karim\.verdent\verdent-projects\review-and-enhance
git add automation/social-media/ .github/
git commit -m "feat: add automated social media generation workflow"
git push origin main
```

### 2.2 Add GitHub Secrets
1. Go to your repo on GitHub
2. **Settings** → **Secrets and variables** → **Actions** → **New repository secret**
3. Add these 4 secrets:

| Secret Name | Value |
|-------------|-------|
| `OPENROUTER_API_KEY` | Your OpenRouter key (`sk-or-v1-...`) |
| `GOOGLE_SHEET_ID` | The Sheet ID from step 1.3 |
| `GOOGLE_DRIVE_FOLDER_ID` | The Drive Folder ID from step 1.4 |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | **Entire contents** of the JSON file from step 1.5 |

### 2.3 Test the Workflow
1. Go to **Actions** tab in GitHub
2. Click **"Generate Weekly Social Media Content"**
3. Click **"Run workflow"** → **Run workflow** (manual trigger)
4. Wait ~5 minutes — should generate 15 posts and write to Google Sheets
5. **Verify**: Open your Google Sheet — you should see 15 new rows!

If it fails, check the logs and verify your secrets are correct.

---

## Phase 3: Make.com Setup (30 min)

### 3.1 Create Make.com Account
1. Go to https://www.make.com/en/register
2. Sign up (free tier = 1,000 operations/month — plenty for us)
3. Verify email

### 3.2 Create Scenario 1: Buffer Scheduler

This is the main scenario that posts content from Sheets to Buffer.

#### Step 1: Create New Scenario
1. Click **"+ Create a new scenario"**
2. Click the **"+"** in the canvas

#### Step 2: Add Schedule Trigger
1. Search for **"Schedule"** module → Click it
2. Configure:
   - **Run scenario**: At regular intervals
   - **Minutes**: 60 (runs every hour)
   - Click **OK**

#### Step 3: Add Google Sheets - Search Rows
1. Click **+** to add next module
2. Search **"Google Sheets"** → Select **"Search Rows (Advanced)"**
3. Click **"Add"** to create connection:
   - Sign in with your Google account
   - Allow permissions
4. Configure:
   - **Spreadsheet**: Select "ConvertNow Social Media Calendar"
   - **Sheet Name**: Content Calendar
   - **Table contains headers**: Yes
   - **Filter**:
     - Add filter: `Post Status` = `ready_to_post`
     - Add another (AND): `Date` ≤ `{{formatDate(now; "YYYY-MM-DD")}}`
   - **Sort**: Date ascending
   - **Maximum number of rows**: 5
5. Click **OK**

#### Step 4: Add Router (to handle FB + IG separately)
1. Click **+** → Search **"Flow Control"** → Select **"Router"**
2. Two paths will be created automatically

#### Step 5: Configure Path 1 - Facebook Posts
1. On the **upper path**, click **+** → Search **"Buffer"** → Select **"Create an Update"**
2. Click **"Add"** to connect Buffer:
   - Paste your Buffer Access Token from step 1.2
3. Configure:
   - **Profiles**: Select your Facebook Page
   - **Text**: `{{1.Caption}}` (drag from previous module)
   - **Photo URL**: `{{1.Image URL}}`
   - **Schedule**: Now (or "Add to top of queue")
4. **Filter on this path**:
   - Click the wrench/spanner icon between Router and Buffer
   - Add filter: 
     - Label: "Facebook posts only"
     - Condition: `{{1.Platform}}` matches one of (`facebook`, `both`)
   - Click **OK**

#### Step 6: Configure Path 2 - Instagram Posts
1. On the **lower path**, click **+** → Search **"Buffer"** → Select **"Create an Update"**
2. Use the same Buffer connection
3. Configure:
   - **Profiles**: Select your Instagram account
   - **Text**: `{{1.Caption}}`
   - **Photo URL**: `{{1.Image URL}}`
4. **Filter on this path**:
   - Label: "Instagram posts only"  
   - Condition: `{{1.Platform}}` matches one of (`instagram`, `both`)

#### Step 7: Update Row Status
1. After the router paths converge, click **+**
2. Search **"Google Sheets"** → Select **"Update a Row"**
3. Configure:
   - **Spreadsheet**: Same sheet
   - **Sheet**: Content Calendar
   - **Row Number**: `{{1.__ROW_NUMBER__}}`
   - **Values to update**:
     - `Post Status`: `scheduled`
     - `Buffer ID`: `{{ifempty(3.id; 4.id)}}`
     - `Notes`: `Posted on {{formatDate(now; "YYYY-MM-DD HH:mm")}}`

#### Step 8: Save & Activate
1. Click **Save** (bottom of screen)
2. Toggle the scenario **ON** (top right)
3. Make sure it shows **"Scheduled"** status

### 3.3 Test Scenario 1
1. Click **"Run once"** in Make.com
2. If your sheet has rows with `Post Status = ready_to_post`, they should:
   - Post to Buffer (check buffer.com queue)
   - Update status to `scheduled` in the sheet
3. If errors, check each module's output bundles

### 3.4 Create Scenario 2: Error Monitor (Optional)

Sends you an email if any posts have errors.

1. **Create new scenario**
2. **Schedule trigger**: Daily at 8:00 AM
3. **Google Sheets - Search Rows**:
   - Filter: `Post Status` = `error`
   - Limit: 20
4. **Tools - Aggregator**:
   - Source module: Google Sheets
   - Aggregated Value: `{{1.ID}} - {{1.Notes}}`
5. **Email - Send Email**:
   - To: your email
   - Subject: `ConvertNow Social: {{2.array.length}} posts need attention`
   - Filter: Only if `{{2.array.length}} > 0`

---

## Phase 4: Verify End-to-End (10 min)

### 4.1 Run Full Test
1. **GitHub Actions**: Manually trigger "Generate Weekly Content"
2. **Wait 5 min** → check Google Sheets has 15 new rows
3. **Make.com Scenario 1**: Click "Run once"
4. **Check Buffer queue**: Posts should appear scheduled
5. **Check Google Sheet**: Status changes from `ready_to_post` to `scheduled`

### 4.2 Verify Schedule
- GitHub Actions runs **Sunday 9AM UTC** automatically
- Make.com Scenario 1 runs **every hour** automatically
- Make.com Scenario 2 runs **daily at 8AM** automatically

You should never need to touch this again unless:
- API keys expire/rotate (just update secrets)
- You want to change posting schedule (edit Sheet "Time" column)
- You want to pause posting (toggle Make.com scenario OFF)

---

## Phase 5: Daily Operations

### Adding Manual Posts
Just add a row to the Google Sheet with:
- `Post Status` = `ready_to_post`
- All required columns filled
- Within 1 hour, Make.com will post it

### Pausing Automation
- **GitHub Actions**: Settings → Actions → Disable workflows
- **Make.com**: Toggle scenario OFF
- **Single post**: Change `Post Status` to anything except `ready_to_post`

### Checking Costs
- **OpenRouter**: https://openrouter.ai/credits — should drop ~$0.65/week
- **Make.com**: Scenarios tab — shows operations used
- **GitHub Actions**: Settings → Billing → Actions — should be $0 (within free 2,000 min/month)

### Adjusting Posting Times
Edit the `Time` column in Google Sheet. Make.com posts when current time >= Date+Time and date <= today.

---

## Troubleshooting

### "GitHub Actions failed"
- Check **Actions** tab logs
- Most common: bad secret value (re-paste, no extra whitespace)
- Try manual run with **"Run workflow"** button to test

### "Make.com scenario errored"
- Click the error bundle to see details
- Common issues:
  - **Invalid Image URL**: Check Drive folder is shared "Anyone with link"
  - **Buffer rate limit**: Free Buffer plan = 10 posts/day per channel
  - **Sheet permissions**: Re-share with service account

### "Image not appearing in Buffer"
- Drive URLs need to be public. Verify by opening the URL in incognito
- If Buffer rejects, the format might need to be:
  ```
  https://drive.google.com/uc?id=FILE_ID&export=download
  ```

### "Costs are higher than expected"
- Check OpenRouter dashboard for actual usage
- Most likely culprit: running script too often
- Solution: Adjust GitHub Actions cron to weekly only

---

## Files Reference

```
automation/social-media/
├── MAKE_SETUP_GUIDE.md           # ← This file
├── make_blueprints/
│   ├── 01_buffer_scheduler.json  # Importable Make.com blueprint
│   └── 02_error_monitor.json     # Optional error notifier
├── scripts/
│   ├── generate_week.py          # Generates content (Python)
│   ├── push_to_sheets.py         # Uploads to Google Sheets
│   └── preview.py                # View latest output
└── output/                       # Generated content (gitignored)

.github/workflows/
└── weekly-content.yml            # GitHub Actions schedule
```

## Next Steps

1. ✅ Complete Phase 1 (Prerequisites)
2. ✅ Complete Phase 2 (GitHub Actions)
3. ✅ Complete Phase 3 (Make.com)
4. ✅ Run Phase 4 (Verification)
5. 🎉 Done! It's now fully automated.

**Estimated total setup time**: 1 hour
**Time saved per week**: 5-10 hours of manual content creation
**Monthly cost**: ~$2.65
