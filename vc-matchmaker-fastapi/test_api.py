"""
Test script to verify the refactored API endpoints
"""
import requests
import json

BASE_URL = "http://127.0.0.1:8001"

def test_endpoint(name, url, method="GET", data=None):
    """Test a single endpoint"""
    try:
        if method == "GET":
            response = requests.get(url)
        elif method == "POST":
            response = requests.post(url, json=data)
        
        print(f"\n{'='*60}")
        print(f"Testing: {name}")
        print(f"URL: {url}")
        print(f"Status: {response.status_code}")
        
        if response.ok:
            result = response.json()
            print(f"Response: {json.dumps(result, indent=2)[:200]}...")
            return True
        else:
            print(f"Error: {response.text}")
            return False
    except Exception as e:
        print(f"Exception: {str(e)}")
        return False

# Test endpoints
print("Testing Modular FastAPI Backend")
print("="*60)

# Test health check
test_endpoint("Health Check", f"{BASE_URL}/health")

# Test root
test_endpoint("Root Endpoint", f"{BASE_URL}/")

# Test auth login
test_endpoint(
    "Auth Login (VC)", 
    f"{BASE_URL}/api/auth/login",
    "POST",
    {"username": "admin", "password": "auth"}
)

# Test VC dashboard
test_endpoint("VC Dashboard", f"{BASE_URL}/api/vc/dashboard")

# Test VC metrics
test_endpoint("VC Metrics", f"{BASE_URL}/api/vc/metrics")

# Test Founder dashboard
test_endpoint("Founder Dashboard", f"{BASE_URL}/api/founder/dashboard")

# Test Categories
test_endpoint("Categories", f"{BASE_URL}/api/categories/all")

print("\n" + "="*60)
print("Testing Complete!")
