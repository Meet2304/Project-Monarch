import os
import sys
from urllib.parse import urlparse
from dotenv import load_dotenv
import psycopg2

# Load .env file
load_dotenv()

url = os.getenv("DATABASE_URL")

if not url:
    print("Error: DATABASE_URL not found in .env")
    sys.exit(1)

print(f"--- Debugging Connection ---")
# Parse the URL to see how Python interprets it
try:
    parsed = urlparse(url)
    print(f"Scheme:   {parsed.scheme}")
    print(f"User:     {parsed.username}")
    print(f"Password: {'******' if parsed.password else 'None'}")
    print(f"Host:     {parsed.hostname}")
    print(f"Port:     {parsed.port}")
    print(f"Path:     {parsed.path}")
    
    print("\nAttempting to connect...")
    conn = psycopg2.connect(url)
    print("SUCCESS! Connected to database.")
    conn.close()
    
except Exception as e:
    print(f"\nCONNECTION FAILED: {e}")
    print("\nTroubleshooting:")
    if "could not translate host name" in str(e):
        print("1. The HOSTNAME is incorrect. Check Supabase -> Settings -> Database -> Host.")
        print("2. The project might be PAUSED in Supabase.")
    elif "password authentication failed" in str(e):
        print("1. The PASSWORD is incorrect.")
        print("2. You might need to re-encode special characters.")
