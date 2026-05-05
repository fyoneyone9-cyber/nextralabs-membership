# 🚀 NextraLabs Ultimate Auto-Deploy Script v1.0
# Usage: .\deploy.ps1 "Your commit message"

param (
    [Parameter(Mandatory=$true)]
    [string]$Message
)

$VERCEL_TOKEN = "vcp_7fOOK0MRM13q7oHT4vkHljgJBsSPmHZ2JDwuUw9RHggEqApOEr09hz77"
$PROJECT_ID = "prj_yaUSZdabp1yiMBuVALpqm2rgjV7D"
$TEAM_ID = "team_uNf86EAb0pXvG6V89u8LpS6M" # ログから推測されるID

Write-Host "📦 1/3: GitHubへ変更を送信中..." -ForegroundColor Cyan
git add .
git commit -m $Message
git push origin main

if ($LASTEXITCODE -ne 0) {
    Write-Error "❌ Git Pushに失敗しました。中断します。"
    exit
}

Write-Host "🚀 2/3: Vercelに強制Redeploy命令を送信中..." -ForegroundColor Yellow

# Vercel API Call for Redeploy
$apiUrl = "https://api.vercel.com/v13/deployments?projectId=$PROJECT_ID"
$headers = @{
    "Authorization" = "Bearer $VERCEL_TOKEN"
    "Content-Type" = "application/json"
}
$body = @{
    name = "membership-site"
    gitSource = @{
        type = "github"
        repoId = "897368812" # nextralabs-membershipのリポジトリID
        ref = "main"
    }
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri $apiUrl -Headers $headers -Method Post -Body $body
    Write-Host "✅ 3/3: デプロイ成功！Vercelが最新の環境変数でビルドを開始しました。" -ForegroundColor Green
    Write-Host "🔗 URL: https://vercel.com/nextralabos/membership-site/deployments" -ForegroundColor Blue
} catch {
    Write-Error "❌ Vercel API通信エラー: $_"
}
