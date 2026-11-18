@echo off
title StaffHub - Backend API
color 0B
echo Starting ASP.NET Core Backend Web API...
cd /d "%~dp0backend\EmployeeManagement.API"
set ASPNETCORE_URLS=http://localhost:5000
set ASPNETCORE_ENVIRONMENT=Development
dotnet run
pause
