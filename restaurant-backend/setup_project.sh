#!/bin/bash

echo "🔧 Setting up project structure..."

# Create __init__.py files
echo "Creating __init__.py files..."
touch app/__init__.py
touch app/routers/__init__.py
touch app/utils/__init__.py
touch tests/__init__.py

# Verify structure
echo ""
echo "✅ Created package files. Structure:"
ls -la app/
ls -la app/routers/
ls -la app/utils/

echo ""
echo "✅ Setup complete! Now run:"
echo "   python seed_data.py"
