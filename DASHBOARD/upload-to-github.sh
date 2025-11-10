#!/bin/bash

echo "🚀 Ethics Matrix Dashboard - GitHub Upload Script"
echo "=================================================="
echo ""

# Check if repository URL is provided
if [ -z "$1" ]; then
    echo "❌ Error: Please provide your GitHub repository URL"
    echo ""
    echo "Usage:"
    echo "  ./upload-to-github.sh https://github.com/YOUR_USERNAME/ethics-matrix-dashboard.git"
    echo ""
    echo "Or with SSH:"
    echo "  ./upload-to-github.sh git@github.com:YOUR_USERNAME/ethics-matrix-dashboard.git"
    echo ""
    echo "📝 Steps:"
    echo "1. Go to https://github.com/new"
    echo "2. Create a repository named 'ethics-matrix-dashboard'"
    echo "3. Copy the repository URL"
    echo "4. Run this script with the URL"
    exit 1
fi

REPO_URL=$1

echo "📦 Adding remote repository..."
git remote add origin "$REPO_URL" 2>/dev/null || git remote set-url origin "$REPO_URL"

echo "🔄 Pushing to GitHub..."
git branch -M main
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Success! Your dashboard is now on GitHub!"
    echo ""
    echo "🌐 Next steps:"
    echo "1. View your repository: ${REPO_URL%.git}"
    echo "2. Enable GitHub Pages for free hosting:"
    echo "   - Go to Settings → Pages"
    echo "   - Source: main branch, / (root)"
    echo "   - Your site will be live at: https://YOUR_USERNAME.github.io/ethics-matrix-dashboard/index.html"
    echo ""
else
    echo ""
    echo "❌ Upload failed. Please check:"
    echo "1. You're logged into GitHub"
    echo "2. The repository exists and you have access"
    echo "3. Your repository URL is correct"
    echo ""
    echo "💡 Try running: git push -u origin main"
fi
