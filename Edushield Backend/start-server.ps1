# ============================================================
# Start Script for education-copy-3 (with Email Notifications)
# ============================================================
# Run this from: P:\CapStone Project\backend copy\education-copy-3

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  Child Insurance Backend - education-copy-3" -ForegroundColor Cyan
Write-Host "  Email Notifications ENABLED" -ForegroundColor Green
Write-Host "=========================================`n" -ForegroundColor Cyan

# Optional: Override email credentials via environment variables
# $env:MAIL_USERNAME = "your-gmail@gmail.com"
# $env:MAIL_PASSWORD = "your-app-password"

Write-Host "Starting Spring Boot application..." -ForegroundColor Yellow
Write-Host "Server will be available at: http://localhost:8080" -ForegroundColor White
Write-Host "Swagger UI: http://localhost:8080/swagger-ui.html`n" -ForegroundColor White

.\mvnw.cmd spring-boot:run
