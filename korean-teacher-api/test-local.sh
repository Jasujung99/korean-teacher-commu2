#!/bin/bash

# Local API Test Script for Korean Teacher API
# Run this script to test all endpoints locally
# Make sure the dev server is running: npm run dev

BASE_URL="http://localhost:8787"
TOKEN=""
ADMIN_TOKEN=""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
GRAY='\033[0;37m'
NC='\033[0m' # No Color

echo -e "${CYAN}================================${NC}"
echo -e "${CYAN}Korean Teacher API Local Tests${NC}"
echo -e "${CYAN}================================${NC}"
echo ""

# Test 1: Health Check
echo -e "${YELLOW}Test 1: Health Check${NC}"
echo -e "${GRAY}GET $BASE_URL/api/health${NC}"
response=$(curl -s -w "\n%{http_code}" "$BASE_URL/api/health")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [ "$http_code" = "200" ]; then
    echo -e "${GREEN}✓ Health check passed${NC}"
    echo -e "${GRAY}$body${NC}"
else
    echo -e "${RED}✗ Health check failed (HTTP $http_code)${NC}"
fi
echo ""

# Test 2: Get Resources (Public)
echo -e "${YELLOW}Test 2: Get Resources (Public)${NC}"
echo -e "${GRAY}GET $BASE_URL/api/resources${NC}"
response=$(curl -s -w "\n%{http_code}" "$BASE_URL/api/resources")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [ "$http_code" = "200" ]; then
    echo -e "${GREEN}✓ Get resources passed${NC}"
    echo -e "${GRAY}Response: $body${NC}"
else
    echo -e "${RED}✗ Get resources failed (HTTP $http_code)${NC}"
fi
echo ""

# Test 3: Get Resources with Filters
echo -e "${YELLOW}Test 3: Get Resources with Filters${NC}"
echo -e "${GRAY}GET $BASE_URL/api/resources?category=문법&level=초급${NC}"
response=$(curl -s -w "\n%{http_code}" "$BASE_URL/api/resources?category=%EB%AC%B8%EB%B2%95&level=%EC%B4%88%EA%B8%89")
http_code=$(echo "$response" | tail -n1)

if [ "$http_code" = "200" ]; then
    echo -e "${GREEN}✓ Get filtered resources passed${NC}"
else
    echo -e "${RED}✗ Get filtered resources failed (HTTP $http_code)${NC}"
fi
echo ""

# Test 4: Authentication Flow
echo -e "${YELLOW}Test 4: Authentication Flow${NC}"
echo -e "${GRAY}Note: This requires a valid GitHub OAuth code${NC}"
echo -e "${GRAY}Skipping actual auth test - use manual GitHub OAuth flow${NC}"
echo ""

# For manual testing, set tokens here:
# TOKEN="your-jwt-token-here"
# ADMIN_TOKEN="your-admin-jwt-token-here"

if [ -z "$TOKEN" ]; then
    echo -e "${YELLOW}⚠ No user token set. Skipping authenticated tests.${NC}"
    echo -e "${GRAY}To test authenticated endpoints, set TOKEN variable with a valid JWT${NC}"
    echo ""
else
    # Test 5: Get Current User
    echo -e "${YELLOW}Test 5: Get Current User${NC}"
    echo -e "${GRAY}GET $BASE_URL/api/auth/me${NC}"
    response=$(curl -s -w "\n%{http_code}" -H "Authorization: Bearer $TOKEN" "$BASE_URL/api/auth/me")
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')

    if [ "$http_code" = "200" ]; then
        echo -e "${GREEN}✓ Get current user passed${NC}"
        echo -e "${GRAY}$body${NC}"
    else
        echo -e "${RED}✗ Get current user failed (HTTP $http_code)${NC}"
    fi
    echo ""

    # Test 6: Get User Mileage
    echo -e "${YELLOW}Test 6: Get User Mileage${NC}"
    echo -e "${GRAY}GET $BASE_URL/api/users/me/mileage${NC}"
    response=$(curl -s -w "\n%{http_code}" -H "Authorization: Bearer $TOKEN" "$BASE_URL/api/users/me/mileage")
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')

    if [ "$http_code" = "200" ]; then
        echo -e "${GREEN}✓ Get mileage passed${NC}"
        echo -e "${GRAY}$body${NC}"
    else
        echo -e "${RED}✗ Get mileage failed (HTTP $http_code)${NC}"
    fi
    echo ""

    # Test 7: Download Resource
    echo -e "${YELLOW}Test 7: Download Resource${NC}"
    echo -e "${GRAY}POST $BASE_URL/api/resources/notion-page-001/download${NC}"
    response=$(curl -s -w "\n%{http_code}" -X POST -H "Authorization: Bearer $TOKEN" "$BASE_URL/api/resources/notion-page-001/download")
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')

    if [ "$http_code" = "200" ]; then
        echo -e "${GREEN}✓ Download resource passed${NC}"
        echo -e "${GRAY}$body${NC}"
    else
        echo -e "${RED}✗ Download resource failed (HTTP $http_code)${NC}"
    fi
    echo ""

    # Test 8: Upload Resource
    echo -e "${YELLOW}Test 8: Upload Resource${NC}"
    echo -e "${GRAY}POST $BASE_URL/api/resources/upload${NC}"
    echo -e "${GRAY}Note: This requires a multipart form upload with file${NC}"
    echo -e "${GRAY}Skipping automated test - use manual file upload${NC}"
    echo ""
fi

if [ -z "$ADMIN_TOKEN" ]; then
    echo -e "${YELLOW}⚠ No admin token set. Skipping admin tests.${NC}"
    echo -e "${GRAY}To test admin endpoints, set ADMIN_TOKEN variable with a valid admin JWT${NC}"
    echo ""
else
    # Test 9: Get Pending Resources (Admin)
    echo -e "${YELLOW}Test 9: Get Pending Resources (Admin)${NC}"
    echo -e "${GRAY}GET $BASE_URL/api/admin/resources/pending${NC}"
    response=$(curl -s -w "\n%{http_code}" -H "Authorization: Bearer $ADMIN_TOKEN" "$BASE_URL/api/admin/resources/pending")
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')

    if [ "$http_code" = "200" ]; then
        echo -e "${GREEN}✓ Get pending resources passed${NC}"
        echo -e "${GRAY}$body${NC}"
    else
        echo -e "${RED}✗ Get pending resources failed (HTTP $http_code)${NC}"
    fi
    echo ""

    # Test 10: Approve Resource (Admin)
    echo -e "${YELLOW}Test 10: Approve Resource (Admin)${NC}"
    echo -e "${GRAY}POST $BASE_URL/api/admin/resources/notion-page-001/approve${NC}"
    response=$(curl -s -w "\n%{http_code}" -X POST -H "Authorization: Bearer $ADMIN_TOKEN" "$BASE_URL/api/admin/resources/notion-page-001/approve")
    http_code=$(echo "$response" | tail -n1)

    if [ "$http_code" = "200" ]; then
        echo -e "${GREEN}✓ Approve resource passed${NC}"
    else
        echo -e "${RED}✗ Approve resource failed (HTTP $http_code)${NC}"
    fi
    echo ""

    # Test 11: Reject Resource (Admin)
    echo -e "${YELLOW}Test 11: Reject Resource (Admin)${NC}"
    echo -e "${GRAY}POST $BASE_URL/api/admin/resources/notion-page-002/reject${NC}"
    response=$(curl -s -w "\n%{http_code}" -X POST \
        -H "Authorization: Bearer $ADMIN_TOKEN" \
        -H "Content-Type: application/json" \
        -d '{"reason":"Test rejection reason"}' \
        "$BASE_URL/api/admin/resources/notion-page-002/reject")
    http_code=$(echo "$response" | tail -n1)

    if [ "$http_code" = "200" ]; then
        echo -e "${GREEN}✓ Reject resource passed${NC}"
    else
        echo -e "${RED}✗ Reject resource failed (HTTP $http_code)${NC}"
    fi
    echo ""
fi

echo -e "${CYAN}================================${NC}"
echo -e "${CYAN}Tests Complete${NC}"
echo -e "${CYAN}================================${NC}"
