@echo off
echo ========================================
echo   Restaurant Management System
echo ========================================
echo.

echo Stopping any existing containers...
docker-compose down

echo.
echo Starting all services...
docker-compose up -d

echo.
echo Waiting for services to initialize...
timeout /t 15 /nobreak > nul

echo.
echo ========================================
echo   Application Started Successfully!
echo ========================================
echo.
echo Access the application:
echo   Frontend: http://YOUR_IP:3000
echo   Backend:  http://YOUR_IP:8000
echo.
echo To find your IP address, run: ipconfig
echo.
echo View logs:    docker-compose logs -f
echo Stop app:     docker-compose down
echo.
pause
