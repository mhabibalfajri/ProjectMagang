@echo off
echo 🚀 Starting SNMP Backend Server Setup...

cd backend

echo 📦 Installing dependencies...
npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ Dependencies installed successfully

echo 🧪 Testing SNMP connection...
node test-snmp.js

echo 🚀 Starting SNMP Backend Server...
node server.js

pause
