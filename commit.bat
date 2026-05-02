@echo off
cd /d "C:\Users\fyone\Desktop\membership-site-fix"
git add src/components/tools/OfficePoliticsGraph.tsx src/components/tools/MovingChecker.tsx src/components/tools/SnsAutoPoster.tsx src/components/tools/AiReportGenerator.tsx
git commit -m "fix: update affiliate link to amzn.to/4ejfQ5J (Amazon.co.jp top)"
git push origin main
