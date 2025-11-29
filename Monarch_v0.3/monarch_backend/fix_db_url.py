import urllib.parse

def encode_db_password():
    print("--- Database Password Encoder ---")
    print("This script will URL-encode your password so it can be safely used in the DATABASE_URL.")
    
    password = input("Enter your plain database password: ")
    
    if not password:
        print("No password entered.")
        return

    # quote_plus encodes spaces as + and special chars as %XX
    encoded_password = urllib.parse.quote_plus(password)
    
    print("\nHere is your URL-encoded password:")
    print(f"{encoded_password}")
    print("\n-----------------------------------")
    print("Now update your .env file:")
    print(f"DATABASE_URL=postgresql://USER:{encoded_password}@HOST:PORT/DB_NAME")
    print("-----------------------------------")

if __name__ == "__main__":
    encode_db_password()
