# Simple PowerShell script to capture the tutorial HTML as a GIF using ffmpeg
# This creates a screen recording of the tutorial page

Write-Host "🎬 Opening tutorial in browser..." -ForegroundColor Cyan

# Open tutorial in default browser
$tutorialPath = "$PSScriptRoot\..\public\tutorial.html"
Start-Process $tutorialPath

Write-Host ""
Write-Host "📺 The tutorial is now playing in your browser!" -ForegroundColor Green
Write-Host ""
Write-Host "The animated tutorial shows all 5 steps automatically:" -ForegroundColor Yellow
Write-Host "  1. Click Settings gear icon" -ForegroundColor White
Write-Host "  2. Click Connections" -ForegroundColor White
Write-Host "  3. Click YouTube" -ForegroundColor White
Write-Host "  4. Click Allow" -ForegroundColor White
Write-Host "  5. Role Assigned!" -ForegroundColor White
Write-Host ""
Write-Host "This HTML file IS your tutorial!" -ForegroundColor Cyan
Write-Host "It auto-plays and loops every 20 seconds." -ForegroundColor Cyan
Write-Host ""
Write-Host "To use it on your site:" -ForegroundColor Green
Write-Host "  Option 1: Embed as iframe" -ForegroundColor White
Write-Host "  Option 2: Record as GIF (see instructions below)" -ForegroundColor White
Write-Host ""

# Instructions to convert to GIF if needed
Write-Host "════════════════════════════════════════════════" -ForegroundColor DarkGray
Write-Host "To convert this to a GIF file:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Download ScreenToGif: https://www.screentogif.com/" -ForegroundColor White
Write-Host "2. Open ScreenToGif → Click 'Recorder'" -ForegroundColor White
Write-Host "3. Position frame over the browser window" -ForegroundColor White
Write-Host "4. Click 'Record' → Wait 20 seconds → Click 'Stop'" -ForegroundColor White
Write-Host "5. Click 'Save As' → Save as 'youtube-discord-tutorial.gif'" -ForegroundColor White
Write-Host "6. Move GIF to: public\youtube-discord-tutorial.gif" -ForegroundColor White
Write-Host ""
Write-Host "OR use the iframe embed (no GIF needed!):" -ForegroundColor Yellow
Write-Host ""
Write-Host '<iframe src="/tutorial.html" width="100%" height="450" frameborder="0"></iframe>' -ForegroundColor Cyan
Write-Host ""
Write-Host "════════════════════════════════════════════════" -ForegroundColor DarkGray

pause
