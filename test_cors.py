import requests

# Test CORS headers
print("Testing CORS configuration...")
try:
    response = requests.post(
        "http://localhost:8000/api/auth/login",
        json={"username": "founder", "password": "founder"},
        headers={"Origin": "http://localhost:3000"}
    )
    
    print(f"Status: {response.status_code}")
    print(f"\nCORS Headers:")
    for header, value in response.headers.items():
        if 'access-control' in header.lower():
            print(f"  {header}: {value}")
    
    print(f"\nResponse body:")
    print(response.json())
    
except Exception as e:
    print(f"Error: {e}")
