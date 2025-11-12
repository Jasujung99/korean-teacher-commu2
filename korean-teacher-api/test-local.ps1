# Local API Test Script for Korean Teacher API
# Run this script to test all endpoints locally
# Make sure the dev server is running: npm run dev

$BASE_URL = "http://localhost:8787"
$TOKEN = ""
$ADMIN_TOKEN = ""

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Korean Teacher API Local Tests" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Health Check
Write-Host "Test 1: Health Check" -ForegroundColor Yellow
Write-Host "GET $BASE_URL/api/health" -ForegroundColor Gray
try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/api/health" -Method Get
    Write-Host "✓ Health check passed" -ForegroundColor Green
    Write-Host ($response | ConvertTo-Json -Depth 3) -ForegroundColor Gray
} catch {
    Write-Host "✗ Health check failed: $_" -ForegroundColor Red
}
Write-Host ""

# Test 2: Get Resources (Public)
Write-Host "Test 2: Get Resources (Public)" -ForegroundColor Yellow
Write-Host "GET $BASE_URL/api/resources" -ForegroundColor Gray
try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/api/resources" -Method Get
    Write-Host "✓ Get resources passed" -ForegroundColor Green
    Write-Host "Found $($response.resources.Count) resources" -ForegroundColor Gray
} catch {
    Write-Host "✗ Get resources failed: $_" -ForegroundColor Red
}
Write-Host ""

# Test 3: Get Resources with Filters
Write-Host "Test 3: Get Resources with Filters" -ForegroundColor Yellow
Write-Host "GET $BASE_URL/api/resources?category=문법&level=초급" -ForegroundColor Gray
try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/api/resources?category=문법&level=초급" -Method Get
    Write-Host "✓ Get filtered resources passed" -ForegroundColor Green
} catch {
    Write-Host "✗ Get filtered resources failed: $_" -ForegroundColor Red
}
Write-Host ""

# Test 4: Authentication Flow (Mock)
Write-Host "Test 4: Authentication Flow" -ForegroundColor Yellow
Write-Host "Note: This requires a valid GitHub OAuth code" -ForegroundColor Gray
Write-Host "Skipping actual auth test - use manual GitHub OAuth flow" -ForegroundColor Gray
Write-Host ""

# For manual testing, set tokens here:
# $TOKEN = "your-jwt-token-here"
# $ADMIN_TOKEN = "your-admin-jwt-token-here"

if ($TOKEN -eq "") {
    Write-Host "⚠ No user token set. Skipping authenticated tests." -ForegroundColor Yellow
    Write-Host "To test authenticated endpoints, set `$TOKEN variable with a valid JWT" -ForegroundColor Gray
    Write-Host ""
} else {
    # Test 5: Get Current User
    Write-Host "Test 5: Get Current User" -ForegroundColor Yellow
    Write-Host "GET $BASE_URL/api/auth/me" -ForegroundColor Gray
    try {
        $headers = @{ "Authorization" = "Bearer $TOKEN" }
        $response = Invoke-RestMethod -Uri "$BASE_URL/api/auth/me" -Method Get -Headers $headers
        Write-Host "✓ Get current user passed" -ForegroundColor Green
        Write-Host ($response | ConvertTo-Json -Depth 2) -ForegroundColor Gray
    } catch {
        Write-Host "✗ Get current user failed: $_" -ForegroundColor Red
    }
    Write-Host ""

    # Test 6: Get User Mileage
    Write-Host "Test 6: Get User Mileage" -ForegroundColor Yellow
    Write-Host "GET $BASE_URL/api/users/me/mileage" -ForegroundColor Gray
    try {
        $headers = @{ "Authorization" = "Bearer $TOKEN" }
        $response = Invoke-RestMethod -Uri "$BASE_URL/api/users/me/mileage" -Method Get -Headers $headers
        Write-Host "✓ Get mileage passed" -ForegroundColor Green
        Write-Host "Balance: $($response.balance)" -ForegroundColor Gray
        Write-Host "Transactions: $($response.transactions.Count)" -ForegroundColor Gray
    } catch {
        Write-Host "✗ Get mileage failed: $_" -ForegroundColor Red
    }
    Write-Host ""

    # Test 7: Download Resource
    Write-Host "Test 7: Download Resource" -ForegroundColor Yellow
    Write-Host "POST $BASE_URL/api/resources/notion-page-001/download" -ForegroundColor Gray
    try {
        $headers = @{ "Authorization" = "Bearer $TOKEN" }
        $response = Invoke-RestMethod -Uri "$BASE_URL/api/resources/notion-page-001/download" -Method Post -Headers $headers
        Write-Host "✓ Download resource passed" -ForegroundColor Green
        Write-Host "Download URL: $($response.downloadUrl)" -ForegroundColor Gray
    } catch {
        Write-Host "✗ Download resource failed: $_" -ForegroundColor Red
    }
    Write-Host ""

    # Test 8: Upload Resource
    Write-Host "Test 8: Upload Resource" -ForegroundColor Yellow
    Write-Host "POST $BASE_URL/api/resources/upload" -ForegroundColor Gray
    Write-Host "Note: This requires a multipart form upload with file" -ForegroundColor Gray
    Write-Host "Skipping automated test - use manual file upload" -ForegroundColor Gray
    Write-Host ""
}

if ($ADMIN_TOKEN -eq "") {
    Write-Host "⚠ No admin token set. Skipping admin tests." -ForegroundColor Yellow
    Write-Host "To test admin endpoints, set `$ADMIN_TOKEN variable with a valid admin JWT" -ForegroundColor Gray
    Write-Host ""
} else {
    # Test 9: Get Pending Resources (Admin)
    Write-Host "Test 9: Get Pending Resources (Admin)" -ForegroundColor Yellow
    Write-Host "GET $BASE_URL/api/admin/resources/pending" -ForegroundColor Gray
    try {
        $headers = @{ "Authorization" = "Bearer $ADMIN_TOKEN" }
        $response = Invoke-RestMethod -Uri "$BASE_URL/api/admin/resources/pending" -Method Get -Headers $headers
        Write-Host "✓ Get pending resources passed" -ForegroundColor Green
        Write-Host "Pending: $($response.resources.Count)" -ForegroundColor Gray
    } catch {
        Write-Host "✗ Get pending resources failed: $_" -ForegroundColor Red
    }
    Write-Host ""

    # Test 10: Approve Resource (Admin)
    Write-Host "Test 10: Approve Resource (Admin)" -ForegroundColor Yellow
    Write-Host "POST $BASE_URL/api/admin/resources/notion-page-001/approve" -ForegroundColor Gray
    try {
        $headers = @{ "Authorization" = "Bearer $ADMIN_TOKEN" }
        $response = Invoke-RestMethod -Uri "$BASE_URL/api/admin/resources/notion-page-001/approve" -Method Post -Headers $headers
        Write-Host "✓ Approve resource passed" -ForegroundColor Green
    } catch {
        Write-Host "✗ Approve resource failed: $_" -ForegroundColor Red
    }
    Write-Host ""

    # Test 11: Reject Resource (Admin)
    Write-Host "Test 11: Reject Resource (Admin)" -ForegroundColor Yellow
    Write-Host "POST $BASE_URL/api/admin/resources/notion-page-002/reject" -ForegroundColor Gray
    try {
        $headers = @{ 
            "Authorization" = "Bearer $ADMIN_TOKEN"
            "Content-Type" = "application/json"
        }
        $body = @{ reason = "Test rejection reason" } | ConvertTo-Json
        $response = Invoke-RestMethod -Uri "$BASE_URL/api/admin/resources/notion-page-002/reject" -Method Post -Headers $headers -Body $body
        Write-Host "✓ Reject resource passed" -ForegroundColor Green
    } catch {
        Write-Host "✗ Reject resource failed: $_" -ForegroundColor Red
    }
    Write-Host ""
}

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Tests Complete" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
