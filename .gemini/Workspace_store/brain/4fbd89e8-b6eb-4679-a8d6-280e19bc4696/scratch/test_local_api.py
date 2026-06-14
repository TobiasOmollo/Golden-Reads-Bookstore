import urllib.request
import urllib.error
import json
import time

def test_endpoint(url, data=None, method='GET'):
    print(f"Testing {method} {url}...")
    headers = {}
    req_data = None
    if data is not None:
        req_data = json.dumps(data).encode('utf-8')
        headers['Content-Type'] = 'application/json'
        
    req = urllib.request.Request(
        url,
        data=req_data,
        headers=headers,
        method=method
    )
    try:
        with urllib.request.urlopen(req) as response:
            res_data = response.read().decode()
            print(f"  Success (Code {response.status})")
            # Print a snippet of response
            print(f"  Response: {res_data[:200]}...")
            return json.loads(res_data)
    except urllib.error.HTTPError as e:
        print(f"  HTTP Error {e.code}: {e.read().decode()}")
        return None
    except Exception as e:
        print(f"  Error: {e}")
        return None

def main():
    # Wait for server to be ready
    time.sleep(2)
    
    # 1. Health check
    test_endpoint("http://127.0.0.1:8000/health")
    
    # 2. Books Search (should fetch from seeded DB)
    test_endpoint("http://127.0.0.1:8000/books/search?q=Pride")
    
    # 3. Audio Search (should fetch from seeded DB)
    test_endpoint("http://127.0.0.1:8000/audio/search?q=Huckleberry")
    
    # 4. Auth Signup
    signup_data = {
        "email": "test_user_sqlalchemy@golden.com",
        "password": "securepassword123",
        "name": "SQLAlchemy Test User",
        "profileDetails": {
            "name": "SQLAlchemy Test User",
            "readingGoal": 15,
            "genres": ["Fiction", "Mystery"],
            "preferredFormats": ["epub"]
        }
    }
    res = test_endpoint("http://127.0.0.1:8000/auth/signup", data=signup_data, method='POST')
    
    # 5. Auth Login
    login_data = {
        "email": "test_user_sqlalchemy@golden.com",
        "password": "securepassword123"
    }
    test_endpoint("http://127.0.0.1:8000/auth/login", data=login_data, method='POST')

if __name__ == "__main__":
    main()
