# Test production YouTube verification endpoint
$body = @{
    youtubeUsername = "TestUser123"
    discordUsername = "TestDiscord#1234"
    email = "test@proton.me"
} | ConvertTo-Json

Write-Host "🧪 Testing production YouTube verification endpoint..." -ForegroundColor Cyan
Write-Host ""

try {
    $response = Invoke-WebRequest -Uri "https://jesseonfire.vercel.app/api/youtube-verify" `
        -Method POST `
        -ContentType "application/json" `
        -Body $body `
        -UseBasicParsing

    Write-Host "✅ SUCCESS!" -ForegroundColor Green
    Write-Host "Status Code: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor White
    Write-Host ""
    Write-Host "📱 Check your Discord #youtube-members channel for 2 messages:" -ForegroundColor Yellow
    Write-Host "   1. FUNCTION CALLED - Processing verification for TestUser123" -ForegroundColor White
    Write-Host "   2. New YouTube Member Verification [full embed]" -ForegroundColor White
    
} catch {
    Write-Host "❌ FAILED!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.Value__)" -ForegroundColor Red
    
    # Try to get response body
    $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
    $responseBody = $reader.ReadToEnd()
    Write-Host "Response: $responseBody" -ForegroundColor Red
}
