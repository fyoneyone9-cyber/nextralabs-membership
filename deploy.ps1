# 🚀 NextraLabs Ultimate Auto-Deploy Script v1.1
# Usage: powershell -ExecutionPolicy Bypass -File .\deploy.ps1 "Your message"

param ([string]$Message = "auto update")

$VERCEL_TOKEN = "vcp_7fOOK0MRM13q7oHT4vkHljgJBsSPmHZ2JDwuUw9RHggEqApOEr09hz77"
$PROJECT_ID = "prj_yaUSZdabp1yiMBuVALpqm2rgjV7D"

Write-Host "📦 1/2: GitHubへ送信中..." -ForegroundColor Cyan
git add .
git commit -m $Message
git push origin main

Write-Host "🚀 2/2: Vercelに強制Redeploy命令中..." -ForegroundColor Yellow

# Vercel API Call (Simple direct method)
$apiUrl = "https://api.vercel.com/v13/deployments?projectId=$PROJECT_ID"
$headers = @{ "Authorization" = "Bearer $VERCEL_TOKEN"; "Content-Type" = "application/json" }
$body = "{ `"name\": `"membership-site\" }"

$res = Invoke-RestMethod -Uri $apiUrl -Headers $headers -Method Post -Body $body

if ($res.id) {
    Write-Host "✅ 完了！Vercelがビルドを開始しました。" -ForegroundColor Green
    Write-Host "🔗 https://vercel.com/nextralabos/membership-site/deployments" -ForegroundColor Blue
} else {
    Write-Host "❌ デプロイ信号の送信に失敗しました。" -ForegroundColor Red
}
