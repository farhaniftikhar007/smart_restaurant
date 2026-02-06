#!/bin/bash

echo "🚀 Starting Restaurant Management System..."
echo ""

# Stop any existing containers
docker-compose down

# Start services
docker-compose up -d

echo ""
echo "⏳ Waiting for services to start..."
sleep 10

echo ""
echo "✅ Application started successfully!"
echo ""
echo "📱 Access the application:"
echo "   Frontend: http://YOUR_IP:3000"
echo "   Backend:  http://YOUR_IP:8000"
echo ""
echo "🔍 To find your IP:"
echo "   Windows: ipconfig"
echo "   Linux:   ip addr"
echo "   Mac:     ifconfig"
echo ""
echo "📋 View logs: docker-compose logs -f"
echo "🛑 Stop app:  docker-compose down"
