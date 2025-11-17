# PowerShell script to deploy the forensic dashboard to Netlify
# This creates a NEW site, separate from your main reaperlabs-analytics site

Write-Host "🔒 Deploying Secret Forensic Dashboard to Netlify" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""

# Check if netlify CLI is installed
$netlifyInstalled = Get-Command netlify -ErrorAction SilentlyContinue
if (-not $netlifyInstalled) {
    Write-Host "⚠️ Netlify CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g netlify-cli
}

# Current directory check
$currentDir = Get-Location
Write-Host "📁 Current directory: $currentDir" -ForegroundColor Cyan
Write-Host ""

# Confirm deployment
Write-Host "This will deploy a NEW, SEPARATE site from your main reaperlabs-analytics.netlify.app" -ForegroundColor Yellow
Write-Host "Your main site will NOT be affected." -ForegroundColor Green
Write-Host ""
$confirm = Read-Host "Do you want to continue? (Y/N)"

if ($confirm -eq "Y" -or $confirm -eq "y") {
    Write-Host ""
    Write-Host "🚀 Starting deployment..." -ForegroundColor Green
    Write-Host "When prompted, choose 'Create & configure a new site'" -ForegroundColor Yellow
    Write-Host ""
    
    # Deploy to production
    netlify deploy --prod --dir=.
    
    Write-Host ""
    Write-Host "✅ Deployment complete!" -ForegroundColor Green
    Write-Host ""
    Write-Host "IMPORTANT:" -ForegroundColor Yellow
    Write-Host "1. Save the URL privately (don't share publicly)" -ForegroundColor White
    Write-Host "2. Your main site is unchanged at reaperlabs-analytics.netlify.app" -ForegroundColor White
    Write-Host "3. This dashboard is completely separate and secret" -ForegroundColor White
} else {
    Write-Host "❌ Deployment cancelled" -ForegroundColor Red
}

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
