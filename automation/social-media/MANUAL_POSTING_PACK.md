# ConvertNow.ca Manual Posting Pack

This workflow generates a weekly content pack for manual posting to Facebook and Instagram.

## What it creates

- 15 post ideas per week
- captions with hashtags and CTAs
- AI-generated images
- a Google Sheets-ready calendar
- a simple review/post checklist

## Recommended folder structure

```text
automation/social-media/
  weekly-pack/
    2026-06-15/
      posts.json
      posts.csv
      posts.xlsx
      images/
        CNW001.png
        CNW002.png
```

## Sheet columns

- Date
- Platform
- Hook
- Caption
- Hashtags
- Content Format
- Image Prompt
- Image File
- CTA URL
- Status
- Notes

## Weekly flow

1. Generate the pack on Sunday.
2. Review captions and images.
3. Post manually to Facebook and Instagram.
4. Mark rows as Posted.

## Copy-ready posting checklist

Use this every week:

- [ ] Open the weekly pack folder
- [ ] Review all 15 captions for tone and accuracy
- [ ] Confirm each image matches its caption
- [ ] Open the first scheduled post in the sheet
- [ ] Copy the caption into Facebook / Instagram
- [ ] Upload the matching image
- [ ] Add the CTA link if needed
- [ ] Publish the post
- [ ] Mark the row as `Posted`
- [ ] Repeat for the next scheduled item

## Copy-ready table view

| Date | Platform | Hook | Status | Image File |
|------|----------|------|--------|------------|
| 2026-06-15 | Facebook | Example hook | Ready to Post | CNW001.png |
| 2026-06-16 | Instagram | Example hook | Ready to Post | CNW002.png |

You can paste the CSV into Google Sheets and sort by Date.

## Suggested statuses

- Draft
- Ready to Post
- Posted
- Needs Review
