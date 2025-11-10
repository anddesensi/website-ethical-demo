# Ethics Matrix Dashboard - Deployment Guide

## Quick Deploy Options

### Option 1: Deploy Static Version (Fastest - No Build Required)
The `interactive-preview.html` file is a complete, standalone application that works immediately.

**Deploy to Netlify (Drag & Drop):**
1. Go to https://app.netlify.com/drop
2. Drag the `interactive-preview.html` file
3. Your site will be live instantly!

**Deploy to Vercel:**
1. Go to https://vercel.com/new
2. Upload the `interactive-preview.html` file
3. Deploy!

### Option 2: Deploy Full Next.js Application

**Prerequisites:**
```bash
# Install dependencies first
npm install
```

**Deploy with Netlify CLI:**
```bash
# Install Netlify CLI (one-time)
npm install netlify-cli --save-dev

# Login to Netlify
npx netlify login

# Deploy
npx netlify deploy --prod
```

**Deploy with Vercel:**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

**Deploy via Git (Recommended):**
1. Push code to GitHub/GitLab
2. Connect repository to Netlify or Vercel
3. Auto-deploy on every push!

### Option 3: Manual Netlify Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Go to https://app.netlify.com/drop
3. Drag the `.next` folder
4. Done!

## Environment Variables
No environment variables needed - all data is stored locally in the browser.

## Build Settings (for Git-based deployment)
- **Build Command:** `npm run build`
- **Publish Directory:** `.next`
- **Framework:** Next.js

## Features
- ✅ All 24 ethical questions
- ✅ Real-time matrix visualization
- ✅ Local storage persistence
- ✅ JSON/CSV export
- ✅ Fully responsive design
- ✅ No backend required
