#!/bin/bash

# CredNest Backend - Railway Deployment Script
# This script helps you deploy to Railway

echo "🚂 CredNest Backend - Railway Deployment"
echo "========================================"

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Installing..."
    npm install -g @railway/cli
fi

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
    git commit -m "Deploy to Railway - $(date)"
fi

echo "✅ Code is ready for deployment"
echo ""
echo "🔐 Please login to Railway:"
railway login

echo ""
echo "📋 Deploying to Railway..."
railway up

echo ""
echo "🔧 Setting environment variables..."
echo "Please set these variables in Railway dashboard:"
echo "   NODE_ENV=production"
echo "   MONGODB_URI=<your-mongodb-connection-string>"
echo "   JWT_SECRET=<generate-a-strong-secret>"
echo "   ADMIN_EMAIL=admin@crednest.com"
echo "   ADMIN_PASSWORD=<change-this-password>"
echo ""
echo "🔗 Your app will be available at the URL provided by Railway"

