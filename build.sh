#!/bin/bash

# Eventsphere Production Build Script
# This script builds the application for production deployment

# Exit on error
set -e

echo "🚀 Starting Eventsphere production build..."

# Check if .env file exists
if [ ! -f .env ]; then
  echo "⚠️ .env file not found. Creating from .env.example..."
  cp .env.example .env
  echo "⚠️ Please update the .env file with your production values before deploying."
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build frontend
echo "🏗️ Building frontend..."
npm run build

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
pip install -r requirements.txt
cd ..

# Create production build directory
echo "📁 Creating production build directory..."
mkdir -p dist
cp -r backend dist/
cp -r build/* dist/

# Create a simple server for serving the frontend and backend
echo "📝 Creating server file..."
cat > dist/server.js << 'EOL'
const express = require('express');
const path = require('path');
const { spawn } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the React app
app.use(express.static(path.join(__dirname)));

// Start Flask backend
const flaskProcess = spawn('python', ['backend/app.py'], {
  stdio: 'inherit'
});

flaskProcess.on('close', (code) => {
  console.log(`Flask process exited with code ${code}`);
  process.exit(code);
});

// Handle any requests that don't match the above
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Eventsphere server is running on port ${PORT}`);
});

// Handle process termination
process.on('SIGINT', () => {
  flaskProcess.kill();
  process.exit();
});
EOL

# Create package.json for the production build
echo "📝 Creating package.json for production..."
cat > dist/package.json << 'EOL'
{
  "name": "eventsphere-production",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  },
  "engines": {
    "node": ">=14.0.0"
  }
}
EOL

echo "📝 Creating .gitignore for production..."
cat > dist/.gitignore << 'EOL'
# Logs
logs
*.log
npm-debug.log*

# Dependencies
node_modules/

# Environment variables
.env

# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
env/
venv/
.venv/

# Firebase
firebase-debug.log
serviceAccountKey.json
EOL

echo "✅ Production build completed successfully!"
echo "📂 The production build is available in the 'dist' directory."
echo "🚀 To deploy, copy the 'dist' directory to your production server."
echo "🔧 Run 'npm install && npm start' in the 'dist' directory to start the application."
