#!/usr/bin/env python3
"""Test red flags generation for all deal flow startups"""

import requests
import json

BASE_URL = "http://localhost:8000"

# Test startups from deal flow
test_startups = ["s8", "s2", "s5", "s1", "s3", "s4", "s6", "s7"]

print("=" * 80)
print("Testing Red Flags Generation for Deal Flow Startups")
print("=" * 80)

for startup_id in test_startups:
    print(f"\n{'=' * 40}")
    print(f"Startup: {startup_id}")
    print(f"{'=' * 40}")
    
    try:
        response = requests.get(f"{BASE_URL}/api/vc/dealflow/startup/{startup_id}")
        data = response.json()
        
        if "error" in data:
            print(f"❌ Error: {data['error']}")
            continue
        
        startup = data.get("startup", {})
        red_flags = data.get("red_flags", [])
        
        print(f"\nStartup: {startup.get('title', startup.get('name', 'N/A'))}")
        print(f"Scores: Fit={startup.get('fit', 'N/A')}, Team={startup.get('team', 'N/A')}, Market={startup.get('market', 'N/A')}")
        
        print(f"\nRed Flags ({len(red_flags)}):")
        for flag in red_flags:
            severity = flag.get('severity', 'unknown')
            emoji = {"high": "🔴", "medium": "🟡", "low": "🔵"}.get(severity, "⚪")
            print(f"  {emoji} [{severity.upper()}] {flag.get('flag')}")
            print(f"     → {flag.get('detail')}")
        
    except Exception as e:
        print(f"❌ Exception: {str(e)}")

print("\n" + "=" * 80)
print("✅ Red Flags Test Complete!")
print("=" * 80)
