import requests

URL = "http://localhost:8000/api/auth/login"
CREDENTIALS = {
    "email": "admin@restaurant.com",
    "password": "admin123"
}

try:
    print(f"Attempting login to {URL}...")
    response = requests.post(URL, json=CREDENTIALS)
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 200:
        print("LOGIN SUCCESSFUL!")
    else:
        print("LOGIN FAILED!")

except Exception as e:
    print(f"Error: {e}")
