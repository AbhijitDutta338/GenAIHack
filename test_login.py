import requests
import json

# Test login
url = "http://127.0.0.1:8000/api/auth/login"

print("Testing Founder Login...")
response = requests.post(url, json={"username": "founder", "password": "founder"})
print(f"Status: {response.status_code}")
print(f"Response: {json.dumps(response.json(), indent=2)}")

print("\n" + "="*60 + "\n")

print("Testing VC Login...")
response = requests.post(url, json={"username": "admin", "password": "auth"})
print(f"Status: {response.status_code}")
print(f"Response: {json.dumps(response.json(), indent=2)}")
