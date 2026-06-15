# 🚀 ConvertNow Social Media Automation - Quick Start Checklist

Print this and check off as you go. **Total time: ~60 minutes one-time setup**.

---

## ⏱️ Phase 1: Get API Keys & Accounts (15 min)

### Buffer Account
- [ ] Sign up at https://buffer.com (free plan)
- [ ] Connect Facebook Page (ConvertNow.ca)
- [ ] Connect Instagram Business account
- [ ] Get access token: https://buffer.com/developers/api
- [ ] Get profile IDs from `/profiles.json` API call
- [ ] **Save**: Buffer access token → 📋 _____________
- [ ] **Save**: FB Profile ID → 📋 _____________
- [ ] **Save**: IG Profile ID → 📋 _____________

### Google Cloud Setup
- [ ] Create project at https://console.cloud.google.com/
- [ ] Enable **Google Sheets API**
- [ ] Enable **Google Drive API**
- [ ] Create service account → download JSON key
- [ ] **Save**: Service account email → 📋 _____________

### Google Sheet & Drive
- [ ] Create sheet "ConvertNow Social Media Calendar"
- [ ] Rename Sheet1 → "Content Calendar"
- [ ] Share sheet with service account email (Editor)
- [ ] **Save**: Sheet ID (from URL) → 📋 _____________
- [ ] Create Drive folder "ConvertNow Social Images"
- [ ] Share folder with service account email (Editor)
- [ ] Set folder to "Anyone with link"
- [ ] **Save**: Folder ID (from URL) → 📋 _____________

### Make.com Account
- [ ] Sign up at https://www.make.com (free plan = 1,000 ops/mo)
- [ ] Verify email

---

## ⏱️ Phase 2: GitHub Actions Setup (15 min)

### Push Code
- [ ] Open terminal in `C:\Users\karim\.verdent\verdent-projects\review-and-enhance`
- [ ] Run: `git add automation/ .github/`
- [ ] Run: `git commit -m "feat: add social media automation"`
- [ ] Run: `git push origin main`

### Add GitHub Secrets
Go to your repo → Settings → Secrets and variables → Actions → New repository secret

- [ ] Add `OPENROUTER_API_KEY` = your OpenRouter key
- [ ] Add `GOOGLE_SHEET_ID` = sheet ID from Phase 1
- [ ] Add `GOOGLE_DRIVE_FOLDER_ID` = folder ID from Phase 1
- [ ] Add `GOOGLE_SERVICE_ACCOUNT_JSON` = paste **entire contents** of JSON file

### Test the Workflow
- [ ] Go to Actions tab → "Generate Weekly Social Media Content"
- [ ] Click "Run workflow" (top right)
- [ ] Wait ~5 min — check logs for success
- [ ] Open your Google Sheet — confirm 15 new rows appeared
- [ ] Click an image URL — confirm it loads in browser

---

## ⏱️ Phase 3: Make.com Scenario 1 (Buffer Scheduler) (20 min)

Open Make.com → Create new scenario.

### Module 1: Schedule Trigger
- [ ] Add "Schedule" module
- [ ] Set: Run every 60 minutes
- [ ] Save

### Module 2: Google Sheets — Search Rows (Advanced)
- [ ] Add module → search "Google Sheets"
- [ ] Connect your Google account
- [ ] Configure:
  - Spreadsheet: ConvertNow Social Media Calendar
  - Sheet: Content Calendar
  - Headers: Yes
  - Filter: `Post Status` equals `ready_to_post`
  - AND: `Date` ≤ `{{formatDate(now; "YYYY-MM-DD")}}`
  - Limit: 5

### Module 3: Router
- [ ] Add Router module
- [ ] Two paths will appear

### Module 4 (Top Path): Buffer — Create Update for Facebook
- [ ] Add Buffer module on upper path
- [ ] Connect Buffer (paste access token)
- [ ] Filter on path: Platform matches `^(facebook|both)$`
- [ ] Profiles: select Facebook Page
- [ ] Text: `{{2.Caption}}`
- [ ] Photo: `` {{2.`Image URL`}} ``

### Module 5 (Bottom Path): Buffer — Create Update for Instagram
- [ ] Add Buffer module on lower path
- [ ] Filter on path: Platform matches `^(instagram|both)$`
- [ ] Profiles: select Instagram Business
- [ ] Text: `{{2.Caption}}`
- [ ] Photo: `` {{2.`Image URL`}} ``

### Module 6: Google Sheets — Update a Row
- [ ] Add after both router paths
- [ ] Drag both router lines into this module
- [ ] Configure:
  - Spreadsheet: same as Module 2
  - Row Number: `{{2.__ROW_NUMBER__}}`
  - Post Status: `scheduled`
  - Buffer ID: `{{ifempty(4.id; 5.id)}}`
  - Notes: `Posted {{formatDate(now; "YYYY-MM-DD HH:mm")}}`

### Test & Activate
- [ ] Click "Run once" button
- [ ] Verify posts appeared in Buffer queue
- [ ] Verify sheet status changed to `scheduled`
- [ ] Toggle scenario ON (top right)
- [ ] Save

---

## ⏱️ Phase 4: Verify End-to-End (10 min)

### Full Workflow Test
- [ ] Trigger GitHub Actions: Run workflow manually
- [ ] Wait 5 min — confirm sheet has new rows
- [ ] Wait up to 1 hour for Make.com to run
- [ ] OR: Click "Run once" in Make.com
- [ ] Open https://buffer.com/queue/
- [ ] Confirm posts are scheduled at correct times
- [ ] Check sheet — all rows should be `scheduled`

### Production Schedule Confirmation
- [ ] GitHub Actions cron: `0 9 * * 0` (Sundays 9 AM UTC)
- [ ] Make.com schedule: Every 60 minutes
- [ ] Buffer queue is set up with correct posting times

---

## 🎉 You're Done!

The system is now **fully automated**. From now on:

| Day | What happens automatically |
|-----|----------------------------|
| Sun 9AM UTC | GitHub Actions generates 15 posts + images |
| Sun 9:05 AM | Posts pushed to Google Sheet |
| Sun 10:00+ AM | Make.com starts scheduling them to Buffer |
| All week | Buffer publishes at the times in the sheet |

---

## 📊 Monthly Maintenance (5 min)

### Check on the 1st of every month:
- [ ] OpenRouter balance: https://openrouter.ai/credits (top up if < $5)
- [ ] Make.com ops used: https://www.make.com/en/scenarios (should be < 200/mo)
- [ ] GitHub Actions usage: Settings → Billing → Actions (should be < 30 min)
- [ ] Buffer queue: https://buffer.com/queue/ (should have posts queued)
- [ ] Google Sheet: scan for any `error` status rows

---

## 🆘 Need Help?

If something breaks:
1. **GitHub Actions failed**: Check Actions tab logs → most common: bad secret
2. **Make.com errored**: Click red X on module → see error details
3. **No posts appearing**: Check sheet status column — should be `ready_to_post`
4. **Image broken in Buffer**: Open Drive image URL in incognito browser
5. **Buffer rate limit**: Free plan = 10 posts/day per channel (we send 15-20/wk = fine)

See `MAKE_SETUP_GUIDE.md` for detailed troubleshooting.

---

## 📝 Your Configuration Reference

Fill these in once setup is complete:

```
Sheet ID:              ___________________________________
Drive Folder ID:       ___________________________________
Service Account Email: ___________________________________
Buffer FB ID:          ___________________________________
Buffer IG ID:          ___________________________________
GitHub Repo:           ___________________________________
Make.com Scenario URL: ___________________________________
```

Keep this doc safe — it has everything you need to maintain the system.
