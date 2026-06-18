@echo off
cd /d "C:\Users\karim\.verdent\verdent-projects\review-and-enhance"
git add -A
git status
git commit -m "fix(adsense): hide ad placeholders, add blog section, noindex fix"
git push origin main
