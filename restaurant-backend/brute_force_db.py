import psycopg2
import sys

# Passwords to try
passwords = [
    "wpB6^i=&",
    "admin123",
    "postgres",
    "password",
    "root",
    "123456",
    "restaurant",
    "admin",
    ""
]

user = "postgres"
host = "localhost"
port = "5432"
dbname = "restaurant_db"

print(f"Testing passwords for user={user} on {host}:{port}/{dbname}")

success = False
for pwd in passwords:
    print(f"Testing password: '{pwd}' ... ", end="")
    try:
        conn = psycopg2.connect(
            dbname=dbname,
            user=user,
            password=pwd,
            host=host,
            port=port
        )
        print("SUCCESS! This is the correct password.")
        conn.close()
        success = True
        break
    except Exception as e:
        print("Failed.")

if not success:
    print("All passwords failed.")
