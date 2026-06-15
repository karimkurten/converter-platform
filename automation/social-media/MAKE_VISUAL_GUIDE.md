# Make.com Scenario - Quick Visual Reference

## Scenario 1: Buffer Scheduler (runs every hour)

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────┐
│  ⏰ Schedule    │────►│ 📊 Google Sheets │────►│  🔀 Router  │
│  Every 60 min   │     │  Search Rows     │     │             │
└─────────────────┘     └──────────────────┘     └──────┬──────┘
                        Filter:                          │
                        Status = ready_to_post           │
                        Date <= today                    │
                                          ┌──────────────┴──────────────┐
                                          │                             │
                                          ▼                             ▼
                        ┌─────────────────────┐           ┌─────────────────────┐
                        │  📘 Buffer (FB)     │           │  📷 Buffer (IG)     │
                        │  Filter: Platform   │           │  Filter: Platform   │
                        │  is "facebook" or   │           │  is "instagram" or  │
                        │  "both"             │           │  "both"             │
                        └──────────┬──────────┘           └──────────┬──────────┘
                                   │                                  │
                                   └──────────────┬───────────────────┘
                                                  ▼
                                   ┌──────────────────────────┐
                                   │ 📊 Google Sheets         │
                                   │ Update Row Status        │
                                   │ Status = "scheduled"     │
                                   └──────────────────────────┘
```

## Module-by-Module Configuration

### Module 1: Schedule Trigger
| Setting | Value |
|---------|-------|
| Run scenario | At regular intervals |
| Minutes | 60 |
| Advanced scheduling | (leave default) |

### Module 2: Google Sheets - Search Rows (Advanced)
| Setting | Value |
|---------|-------|
| Connection | Your Google account |
| Choose a Drive | My Drive |
| Spreadsheet ID | `ConvertNow Social Media Calendar` |
| Sheet Name | `Content Calendar` |
| Table contains headers | Yes |
| Filter (1st row) | `Post Status` → text equal → `ready_to_post` |
| Filter (2nd row, AND) | `Date` → date less or equal → `{{formatDate(now; "YYYY-MM-DD")}}` |
| Sort by | `Date` |
| Sort direction | Ascending |
| Maximum number of rows | 5 |

### Module 3: Router
- Just adds itself, no config needed
- Drag two routes coming out

### Module 4 (Top Path): Buffer - Create an Update
**Filter on this path** (click wrench between Router and module):
- Label: `Facebook Posts`
- Condition: `{{2.Platform}}` → text matches pattern → `^(facebook|both)$`

**Module configuration**:
| Setting | Value |
|---------|-------|
| Connection | Buffer (paste access token) |
| Profiles | Select your Facebook Page |
| Text | `{{2.Caption}}` |
| Photo URL | `{{2.`Image URL`}}` (note: backticks around column name with space) |
| Schedule | At top of queue |

### Module 5 (Bottom Path): Buffer - Create an Update (Instagram)
**Filter on this path**:
- Label: `Instagram Posts`
- Condition: `{{2.Platform}}` → text matches pattern → `^(instagram|both)$`

**Module configuration**:
| Setting | Value |
|---------|-------|
| Connection | Buffer (same connection) |
| Profiles | Select your Instagram Business |
| Text | `{{2.Caption}}` |
| Photo URL | `{{2.`Image URL`}}` |
| Schedule | At top of queue |

### Module 6: Google Sheets - Update a Row
After both router paths converge (drag both into this module):
| Setting | Value |
|---------|-------|
| Spreadsheet | Same as Module 2 |
| Sheet Name | `Content Calendar` |
| Row Number | `{{2.__ROW_NUMBER__}}` |
| Values: Post Status | `scheduled` |
| Values: Buffer ID | `{{ifempty(4.id; 5.id)}}` |
| Values: Notes | `Posted via Make.com on {{formatDate(now; "YYYY-MM-DD HH:mm")}}` |

---

## Common Mapping Variables Cheat Sheet

When mapping fields, you'll see these in the data picker:

| Variable | Description | Example value |
|----------|-------------|---------------|
| `{{1.ID}}` | Post ID | `CNW001` |
| `{{1.Date}}` | Posting date | `2026-06-15` |
| `{{1.Time}}` | Posting time | `09:00` |
| `{{1.Platform}}` | Target platform | `both` / `facebook` / `instagram` |
| `{{1.Hook}}` | First line | `🤯 Did you know...` |
| `{{1.Caption}}` | Full caption text | (full text) |
| `{{1.`Image URL`}}` | Drive image URL | (URL) |
| `{{1.`CTA URL`}}` | Link to website | (URL) |
| `{{1.__ROW_NUMBER__}}` | Sheet row number | `5` |

**Important**: Column names with spaces need backticks: `` `Image URL` ``

---

## Filter Conditions Reference

### "Date is today or earlier"
```
Field: {{2.Date}}
Operator: Date - less than or equal to
Value: {{formatDate(now; "YYYY-MM-DD")}}
```

### "Time is now or earlier"
```
Field: {{2.Time}}
Operator: Text - less than or equal to
Value: {{formatDate(now; "HH:mm")}}
```

### "Platform is Facebook"
```
Field: {{2.Platform}}
Operator: Text - matches pattern
Value: ^(facebook|both)$
```

---

## Testing Each Module Step-by-Step

### Step 1: Test Google Sheets Search
1. Right-click Module 2 → Run this module only
2. You should see "Bundle 1, 2, 3..." in output
3. Each bundle = one row from the sheet

**If empty**: Check filter dates, status values, and sheet permissions.

### Step 2: Test Router with Filter
1. Right-click Module 4 (FB) → Run this module only
2. Should fire only for posts where Platform is `facebook` or `both`

**If wrong path fires**: Re-check filter pattern matching.

### Step 3: Test Buffer Posting
1. Run scenario with **just one row** in `ready_to_post` status
2. Check buffer.com → Queue
3. The post should appear scheduled

**If image broken**: Verify Drive image URL works in incognito browser.

### Step 4: Test Status Update
1. After Buffer post succeeds, check the sheet
2. Status should change `ready_to_post` → `scheduled`
3. Buffer ID should be populated

---

## Performance Tips

### Reduce Operations (Make.com Free Tier = 1,000/mo)

If you're worried about ops budget:

1. **Run less frequently**: Change schedule from 60min → 180min (every 3 hours)
   - Operations: 720/mo → 240/mo
   
2. **Batch updates**: Use "Update Multiple Rows" instead of single updates
   - Reduces final-step ops by 80%

3. **Limit search results**: Set max rows to 1 instead of 5
   - One post per scenario run

### Increase Reliability

1. **Add error handlers**:
   - Right-click module → Add error handler → Resume/Rollback/Break
   - Recommended: Resume next module on error

2. **Set scenario settings**:
   - Settings → Max errors before stop: 3
   - Settings → Sequential processing: ON
   - This ensures one failure doesn't stop everything

---

## Cost Calculator

Free tier limits:
- Make.com: 1,000 operations/month
- GitHub Actions: 2,000 minutes/month
- Buffer: 10 posts/day per channel
- OpenRouter: Pay-as-you-go (no free tier)

**Our usage estimate**:
- Make.com Scenario 1: ~150 ops/month (5 ops × 30 days)
- Make.com Scenario 2: ~30 ops/month (1 op × 30 days)
- GitHub Actions: ~20 min/month (5 min × 4 weeks)
- Buffer: 60 posts/month (well under limit)
- OpenRouter: $2.65/month

**Total: $2.65/month, all within free tiers**
