# Deploy to Vercel via webhook
# Replace YOUR_DEPLOY_HOOK_URL with the actual URL from Vercel

$webhookUrl = "YOUR_DEPLOY_HOOK_URL"

Write-Host "🚀 Triggering Vercel deployment..." -ForegroundColor Cyan

try {
    $response = Invoke-WebRequest -Uri $webhookUrl -Method Post
    Write-Host "✅ Deployment triggered successfully!" -ForegroundColor Green
    Write-Host "   Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "   Go to Vercel dashboard to watch the build" -ForegroundColor Yellow
} catch {
    Write-Host "❌ Failed to trigger deployment" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}
