import psycopg2
import sys

# Database connection parameters
DB_PARAMS = {
    "dbname": "restaurant_db",
    "user": "postgres",
    "password": "12345678",  # From previous context
    "host": "127.0.0.1",
    "port": "5432"
}

def add_column():
    conn = None
    try:
        print("Connecting to the database...")
        conn = psycopg2.connect(**DB_PARAMS)
        cur = conn.cursor()

        print("Checking if column exists...")
        # Check if column already exists
        cur.execute("SELECT column_name FROM information_schema.columns WHERE table_name='reservations' AND column_name='table_number';")
        if cur.fetchone():
            print("Column 'table_number' already exists.")
        else:
            print("Adding 'table_number' column to 'reservations' table...")
            cur.execute("ALTER TABLE reservations ADD COLUMN table_number VARCHAR;")
            conn.commit()
            print("Column added successfully!")

        cur.close()
    except (Exception, psycopg2.DatabaseError) as error:
        print(f"Error: {error}")
    finally:
        if conn is not None:
            conn.close()
            print("Database connection closed.")

if __name__ == "__main__":
    add_column()
