import os
from pathlib import Path

print("🔍 Diagnosing project structure...\n")

# Check current directory
print(f"Current directory: {os.getcwd()}")
print()

# Check if app directory exists
app_dir = Path("app")
print(f"app/ directory exists: {app_dir.exists()}")

if app_dir.exists():
    print(f"\n📁 Files in app/:")
    for item in sorted(app_dir.iterdir()):
        print(f"  {'📁' if item.is_dir() else '📄'} {item.name}")
    
    # Check for required files
    required_files = [
        "app/__init__.py",
        "app/config.py",
        "app/database.py",
        "app/models.py",
        "app/schemas.py",
        "app/routers/__init__.py",
        "app/utils/__init__.py",
        "app/utils/auth.py"
    ]
    
    print(f"\n✅ Required files check:")
    for file in required_files:
        exists = Path(file).exists()
        symbol = "✅" if exists else "❌"
        print(f"  {symbol} {file}")
else:
    print("❌ app/ directory not found!")

print("\n" + "="*50)
print("🔧 To fix missing files, run:")
print("="*50)

if not Path("app/__init__.py").exists():
    print("\ntouch app/__init__.py")
if not Path("app/routers/__init__.py").exists():
    print("mkdir -p app/routers && touch app/routers/__init__.py")
if not Path("app/utils/__init__.py").exists():
    print("mkdir -p app/utils && touch app/utils/__init__.py")
