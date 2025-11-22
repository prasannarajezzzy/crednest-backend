#!/bin/bash

# CredNest Backend - Render Deployment Script
# This script helps you deploy to Render

echo "🚀 CredNest Backend - Render Deployment"
echo "======================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found. Please initialize git first:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    exit 1
fi

# Check if there are uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  You have uncommitted changes. Committing them now..."
    git add .
    git commit -m "Deploy to Render - $(date)"
fi

echo "✅ Code is ready for deployment"
echo ""
echo "📋 Next steps:"
echo "1. Go to https://render.com"
echo "2. Sign up/Login with GitHub"
echo "3. Click 'New +' → 'Web Service'"
echo "4. Connect this repository"
echo "5. Use these settings:"
echo "   - Name: crednest-backend"
echo "   - Environment: Node"
echo "   - Build Command: npm install"
echo "   - Start Command: npm start"
echo "   - Instance Type: Free"
echo ""
echo "6. Add these environment variables:"
echo "   NODE_ENV=production"
echo "   MONGODB_URI=<your-mongodb-connection-string>"
echo "   JWT_SECRET=<generate-a-strong-secret>"
echo "   ADMIN_EMAIL=admin@crednest.com"
echo "   ADMIN_PASSWORD=<change-this-password>"
echo ""
echo "🔗 Your app will be available at: https://crednest-backend.onrender.com"
