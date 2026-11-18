@echo off
title Employee Management System - Launcher
color 0A
cd /d "%~dp0"

echo ================================================================
echo        EMPLOYEE MANAGEMENT SYSTEM (STAFFHUB ENTERPRISE)
echo ================================================================
echo.
echo Starting Full-Stack Application...
echo.

:: 1. Start Backend Web API
echo [1/3] Starting ASP.NET Core Backend Web API on http://localhost:5000 ...
start "StaffHub - Backend API" cmd /k "cd /d "%~dp0backend\EmployeeManagement.API" && set ASPNETCORE_URLS=http://localhost:5000 && set ASPNETCORE_ENVIRONMENT=Development && dotnet run"

:: 2. Wait 3 seconds
timeout /t 3 /nobreak >nul

:: 3. Start Angular Frontend App
echo [2/3] Starting Angular Frontend UI on http://localhost:4200 ...
start "StaffHub - Frontend App" cmd /k "cd /d "%~dp0frontend" && npm start"

:: 4. Open Browser
echo [3/3] Opening Web App in your default browser...
timeout /t 5 /nobreak >nul
start http://localhost:4200

echo.
echo ================================================================
echo Application is running!
echo Frontend: http://localhost:4200
echo Backend API / Swagger: http://localhost:5000/swagger
echo.
echo Default Login:
echo Username: admin
echo Password: Admin@123
echo ================================================================
echo.
pause
