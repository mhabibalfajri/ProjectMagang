#!/bin/bash

echo "🚀 Starting SNMP Backend Server Setup..."

cd backend

echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

echo "🧪 Testing SNMP connection..."
node test-snmp.js

echo "🚀 Starting SNMP Backend Server..."
node server.js
