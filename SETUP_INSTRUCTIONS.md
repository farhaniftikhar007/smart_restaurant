# Restaurant Management System - Setup Guide

## Prerequisites
- Docker Desktop installed and running
- Docker Compose (included with Docker Desktop)

## Quick Start

### Windows Users:
1. Double-click `start.bat`
2. Wait for services to start
3. Find your IP: Open CMD and type `ipconfig`
4. Open browser: `http://YOUR_IP:3000`

### Linux/Mac Users:
1. Open terminal in project folder
2. Run: `chmod +x start.sh && ./start.sh`
3. Find your IP: `ip addr` (Linux) or `ifconfig` (Mac)
4. Open browser: `http://YOUR_IP:3000`

### Manual Method (All OS):
```bash
docker-compose up -d
```

## Accessing the Application

**From Same Computer:**
- `http://localhost:3000`

**From Other Devices (Mobile, Tablets, Other PCs):**
1. Find your computer's IP address:
   - **Windows**: Open CMD → type `ipconfig` → look for "IPv4 Address"
   - **Linux**: `ip addr show` → look for "inet"
   - **Mac**: `ifconfig` → look for "inet"
   
2. Make sure all devices are on the **same WiFi network**

3. Open browser on any device:
   - `http://YOUR_IP:3000` (example: `http://192.168.1.100:3000`)

## Default Login Credentials

**Admin Login:**
```
Email: admin@restaurant.com
Password: admin123
```

**Customer Login:**
```
Email: customer@test.com
Password: customer123
```

## Features

### 📱 Guest Ordering (No Login Required)
1. Admin generates QR codes for tables
2. Customers scan QR code with phone
3. Browse menu and add items to cart
4. Place order without creating account
5. Track order status in real-time

### 👤 Customer Features (With Login)
- View all past orders
- Track order status
- Make table reservations
- Manage profile

### 👨‍💼 Admin Features
- **Dashboard**: View statistics (total orders, revenue, reservations)
- **Orders**: Manage all orders, update status
- **Reservations**: Accept/reject table reservations
- **Tables**: Generate and print QR codes
- **Menu**: Add/edit menu items with images

## How to Use QR Code Ordering

1. **Admin Setup:**
   - Login as admin
   - Go to "Table Management"
   - Click "View QR" on any table
   - Print or display QR code on physical table

2. **Customer Usage:**
   - Scan QR code with phone camera
   - Opens guest ordering page
   - Add items to cart
   - Place order
   - Track order status automatically

## Stopping the Application

**Windows:** Double-click `stop.bat`

**Linux/Mac:** 
```bash
docker-compose down
```

**Or manually:**
```bash
docker-compose down
```

## Troubleshooting

### ❌ Can't access from mobile/other devices?

**Solutions:**
1. Make sure all devices are on **same WiFi**
2. Use your **actual IP address**, not "localhost"
3. **Disable firewall** temporarily:
   - Windows: Windows Defender Firewall → Turn off
   - Linux: `sudo systemctl stop firewalld` or `sudo ufw disable`
4. **Restart Docker:**
```bash
   docker-compose down
   docker-compose up -d
```

### ❌ Port already in use?

Edit `docker-compose.yml` and change ports:
```yaml
ports:
  - "3001:3000"  # Change 3000 to 3001
```

### ❌ Database connection errors?

Wait 30 seconds for database to initialize, then refresh page.

### ❌ Docker not starting?

Make sure Docker Desktop is running:
- Windows: Check system tray for Docker icon
- Linux: `sudo systemctl start docker`
- Mac: Open Docker Desktop app

## Viewing Logs
```bash
docker-compose logs -f
```

Press `Ctrl+C` to exit logs.

## Fresh Start (Reset Everything)
```bash
docker-compose down -v
docker-compose up -d
```

**Warning:** This deletes all data including orders, menu items, and users!

## Project Architecture
```
├── Frontend (React)         → Port 3000
├── Backend (FastAPI)        → Port 8000
└── Database (PostgreSQL)    → Port 5432
```

## System Requirements

- **RAM:** 4GB minimum
- **Disk:** 2GB free space
- **OS:** Windows 10+, Ubuntu 20.04+, macOS 10.15+
- **Network:** WiFi or Ethernet

## Support

Check logs if something goes wrong:
```bash
docker-compose logs -f
```

## Important Notes

⚠️ **For Production Use:**
1. Change database password in `docker-compose.yml`
2. Change `SECRET_KEY` in backend environment
3. Use HTTPS with SSL certificate
4. Set up proper backup system
5. Change default admin password

📱 **Network Access:**
- QR codes automatically use your IP address
- Access admin panel using IP (not localhost) to generate correct QR codes
- Example: `http://192.168.1.100:3000/admin/tables`

🔐 **Security:**
- Change all default passwords before deployment
- Use environment variables for sensitive data
- Enable firewall in production
- Regular database backups

