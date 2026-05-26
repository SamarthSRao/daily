import urllib.request
import json
import os

url_base = "https://delicate-corgi-77067.upstash.io"
token = "gQAAAAAAAS0LAAIncDI0MTU4ZTdiOGFkYjI0NmE1OWY0NjQwMWY4NDMzNGJkYnAyNzcwNjc"

req = urllib.request.Request(f"{url_base}/get/properrr-panic-deadlines-v2")
req.add_header("Authorization", f"Bearer {token}")
try:
    with urllib.request.urlopen(req) as response:
        res_data = json.loads(response.read())
        result_str = res_data.get("result", "")
        if result_str:
            deadlines = json.loads(result_str)
            if isinstance(deadlines, str):
                deadlines = json.loads(deadlines)
        else:
            deadlines = []
            
    filtered = [d for d in deadlines if not d.get("id", "").startswith("daily-panic-") and not d.get("id", "").startswith("daily-")]
    print(f"Original count: {len(deadlines)}, Filtered count: {len(filtered)}")
    
    # Store back
    req2 = urllib.request.Request(f"{url_base}/set/properrr-panic-deadlines-v2", method="POST")
    req2.add_header("Authorization", f"Bearer {token}")
    req2.add_header("Content-Type", "application/json")
    # Upstash REST: the body for /set/:key should be the value.
    # Wait, the best way is POST / with ["SET", "key", "val"]
    req3 = urllib.request.Request(url_base, method="POST")
    req3.add_header("Authorization", f"Bearer {token}")
    req3.add_header("Content-Type", "application/json")
    body = json.dumps(["SET", "properrr-panic-deadlines-v2", json.dumps(filtered)])
    
    with urllib.request.urlopen(req3, data=body.encode('utf-8')) as response2:
        print("Updated Redis!", response2.read().decode('utf-8'))
except Exception as e:
    print("Error:", e)
