@echo off
cd /d "C:\Users\fyone\Desktop\membership-site-fix"
git add src/app/products/page.tsx
git commit -m "fix: remove hanbaichu badge, use NEW for all subscription tools"
git push origin main
