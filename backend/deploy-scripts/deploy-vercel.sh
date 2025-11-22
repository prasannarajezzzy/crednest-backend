#!/bin/bash

# CredNest Backend - Vercel Deployment Script
# This script helps you deploy to Vercel

echo "▲ CredNest Backend - Vercel Deployment"
echo "======================================"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
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
    git commit -m "Deploy to Vercel - $(date)"
fi

echo "✅ Code is ready for deployment"
echo ""
echo "🔐 Please login to Vercel:"
vercel login

echo ""
echo "📋 Deploying to Vercel..."
vercel --prod

echo ""
echo "🔧 Setting environment variables..."
echo "Run these commands to set environment variables:"
echo ""
echo "vercel env add NODE_ENV"
echo "# Enter: production"
echo ""
echo "vercel env add MONGODB_URI"
echo "# Enter your MongoDB connection string"
echo ""
echo "vercel env add JWT_SECRET"
echo "# Enter a strong secret key"
echo ""
echo "vercel env add ADMIN_EMAIL"
echo "# Enter: admin@crednest.com"
echo ""
echo "vercel env add ADMIN_PASSWORD"
echo "# Enter a secure password"
echo ""
echo "After setting variables, redeploy:"
echo "vercel --prod"
