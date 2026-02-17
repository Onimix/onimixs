# ONIMIX EAGLE EYE Pick - Deployment Guide

## 🚀 Quick Deployment Checklist

Follow these steps to deploy your football intelligence dashboard to production.

### ✅ Pre-Deployment Checklist

- [ ] All code is committed to Git
- [ ] `.env` file is in `.gitignore` (already configured)
- [ ] Database credentials are ready (Supabase or PostgreSQL)
- [ ] GitHub repository is created
- [ ] Vercel account is set up

---

## 📦 Step 1: Prepare Your Repository

### 1.1 Initialize Git (if not done)

```bash
git init
git add .
git commit -m "Initial commit: ONIMIX EAGLE EYE Pick production-ready"
```

### 1.2 Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `onimix-eagle-eye-pick` (or your choice)
3. **DO NOT** initialize with README, .gitignore, or license
4. Click "Create repository"

### 1.3 Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

---

## 🗄️ Step 2: Set Up Database (Supabase)

### 2.1 Create Supabase Project

1. Go to https://supabase.com
2. Click "New Project"
3. Fill in:
   - **Name**: `onimix-eagle-eye`
   - **Database Password**: (save this securely!)
   - **Region**: Choose closest to your users
4. Click "Create new project"
5. Wait 2-3 minutes for provisioning

### 2.2 Get Database Connection String

1. In Supabase dashboard, go to **Settings** → **Database**
2. Scroll to **Connection string** section
3. Select **URI** tab
4. Copy the connection string
5. Replace `[YOUR-PASSWORD]` with your actual password

Example:
```
postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres
```

### 2.3 Test Connection Locally (Optional)

```bash
# Create .env file
echo 'DATABASE_URL="your-connection-string-here"' > .env

# Test Prisma connection
npx prisma db push

# Verify with Prisma Studio
npx prisma studio
```

---

## ☁️ Step 3: Deploy to Vercel

### 3.1 Import Project

1. Go to https://vercel.com
2. Click **"Add New"** → **"Project"**
3. Click **"Import Git Repository"**
4. Select your GitHub repository
5. Click **"Import"**

### 3.2 Configure Build Settings

Vercel should auto-detect Next.js. Verify:

- **Framework Preset**: Next.js
- **Build Command**: `npm run build` (or leave default)
- **Output Directory**: `.next` (or leave default)
- **Install Command**: `npm install` (or leave default)

**⚠️ IMPORTANT: DO NOT run `prisma db push` in the build command!**

The build script should ONLY be:
```bash
prisma generate && next build
```

Database schema initialization must be done separately (see Step 4).

### 3.3 Add Environment Variables

**CRITICAL STEP:**

1. In the deployment configuration, find **"Environment Variables"**
2. Add the following:

   | Name | Value |
   |------|-------|
   | `DATABASE_URL` | Your Supabase connection string |

3. Click **"Deploy"**

### 3.4 Wait for Deployment

- First deployment takes 2-5 minutes
- Watch the build logs for any errors
- Prisma will automatically generate the client during build

---

## 🔍 Step 4: Initialize Database Schema

**⚠️ CRITICAL: This step must be completed BEFORE or AFTER deployment, NOT during the Vercel build!**

The Vercel build process should NOT connect to the database. Database schema initialization is a separate operation.

### Option A: Before First Deployment (Recommended)

```bash
# 1. Create a local .env file with your Supabase DATABASE_URL
echo 'DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres"' > .env

# 2. Push schema to Supabase
npx prisma db push

# 3. Verify tables were created
npx prisma studio

# 4. Delete local .env file (it's gitignored)
rm .env
```

### Option B: After Deployment Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link to your project
vercel link

# Pull environment variables from Vercel
vercel env pull .env.local

# Push database schema
npx prisma db push

# Clean up
rm .env.local
```

### Option C: Using Supabase SQL Editor

If you prefer not to use the CLI:

1. Go to Supabase Dashboard → SQL Editor
2. Run the following SQL to create tables manually:

```sql
-- Create Results table
CREATE TABLE "Result" (
    "id" TEXT PRIMARY KEY,
    "time" TEXT NOT NULL,
    "homeTeam" TEXT NOT NULL,
    "awayTeam" TEXT NOT NULL,
    "homeGoals" INTEGER NOT NULL,
    "awayGoals" INTEGER NOT NULL,
    "totalGoals" INTEGER NOT NULL,
    "over15" BOOLEAN NOT NULL,
    "over25" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "Result_homeTeam_idx" ON "Result"("homeTeam");
CREATE INDEX "Result_awayTeam_idx" ON "Result"("awayTeam");

-- Create Odds table
CREATE TABLE "Odd" (
    "id" TEXT PRIMARY KEY,
    "time" TEXT NOT NULL,
    "homeTeam" TEXT NOT NULL,
    "awayTeam" TEXT NOT NULL,
    "odd1" DOUBLE PRECISION NOT NULL,
    "oddX" DOUBLE PRECISION NOT NULL,
    "odd2" DOUBLE PRECISION NOT NULL,
    "goalLine" DOUBLE PRECISION NOT NULL,
    "overOdd" DOUBLE PRECISION NOT NULL,
    "underOdd" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "Odd_homeTeam_idx" ON "Odd"("homeTeam");
CREATE INDEX "Odd_awayTeam_idx" ON "Odd"("awayTeam");

-- Create Predictions table
CREATE TABLE "Prediction" (
    "id" TEXT PRIMARY KEY,
    "oddId" TEXT NOT NULL,
    "combinedExpectedGoals" DOUBLE PRECISION NOT NULL,
    "over15Probability" DOUBLE PRECISION NOT NULL,
    "over25Probability" DOUBLE PRECISION NOT NULL,
    "decision" TEXT NOT NULL,
    "confidenceScore" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "Prediction_oddId_idx" ON "Prediction"("oddId");
```

---

## ✅ Step 5: Verify Deployment

### 5.1 Check Deployment Status

1. In Vercel dashboard, check deployment status
2. Should show **"Ready"** with a green checkmark
3. Click on the deployment URL

### 5.2 Test the Application

1. **Homepage loads**: Dark dashboard with marquee
2. **Submit test results**:
   ```
   Time,Result
   08:24,LEV 0-2 HSV
   08:24,MAI 4-0 SCF
   ```
3. **Submit test odds**:
   ```
   Time,Event,1,X,2,Goals,Over,Under
   05:36,FCA - HDH,2.51,3.46,2.93,2.5,2.32,1.64
   ```
4. **Verify predictions appear** in the table

### 5.3 Check API Endpoints

Test these URLs (replace with your domain):

- `https://your-app.vercel.app/api/results` (GET)
- `https://your-app.vercel.app/api/odds` (GET)
- `https://your-app.vercel.app/api/predictions` (GET)

All should return JSON responses.

---

## 🔧 Step 6: Post-Deployment Configuration

### 6.1 Set Up Custom Domain (Optional)

1. In Vercel dashboard, go to **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions
4. Wait for SSL certificate provisioning

### 6.2 Configure Production Settings

In Vercel dashboard:

1. **Settings** → **Environment Variables**
   - Ensure `DATABASE_URL` is set for Production
   - Add any additional variables if needed

2. **Settings** → **General**
   - Set Node.js version: `18.x` or higher

---

## 🐛 Troubleshooting

### Build Fails

**Error: Prisma Client not generated**

Solution:
```bash
# Ensure postinstall script is in package.json
"postinstall": "prisma generate"
```

**Error: DATABASE_URL not found**

Solution:
- Check environment variables in Vercel dashboard
- Ensure variable name is exactly `DATABASE_URL`
- Redeploy after adding variables

### Database Connection Issues

**Error: P1001: Can't reach database server at `postgres:5432`**

This error means Prisma is trying to connect during the Vercel build, which is incorrect.

**Root Cause:**
- You're running `prisma db push` in the build command
- The `DATABASE_URL` environment variable is not available during build
- Prisma falls back to a default local database host

**Solution:**
1. Remove `prisma db push` from your Vercel build command
2. The build command should ONLY be: `prisma generate && next build`
3. Initialize the database schema separately using one of the methods in Step 4
4. Redeploy to Vercel

**Error: Can't reach database server**

Solutions:
1. Verify connection string is correct
2. Check Supabase project is active
3. Try using "Connection Pooling" URL from Supabase
4. Ensure no extra spaces in environment variable
5. Make sure you're not running `prisma db push` during Vercel build

**Error: SSL connection required**

Solution:
```
DATABASE_URL="postgresql://...?sslmode=require"
```

### Runtime Errors

**Error: Prisma Client initialization failed**

Solution:
1. Check build logs for Prisma generation
2. Ensure `prisma generate` runs during build
3. Verify `@prisma/client` version matches `prisma` version

---

## 📊 Monitoring & Maintenance

### View Logs

```bash
# Using Vercel CLI
vercel logs

# Or in Vercel dashboard
# Go to Deployments → Select deployment → View Function Logs
```

### Database Monitoring

1. Supabase Dashboard → **Database** → **Query Performance**
2. Monitor connection count
3. Check slow queries

### Update Application

```bash
# Make changes locally
git add .
git commit -m "Update: description"
git push

# Vercel automatically deploys on push to main
```

---

## 🔒 Security Best Practices

1. **Never commit `.env` files** ✅ (already in .gitignore)
2. **Rotate database passwords** regularly
3. **Use environment variables** for all secrets
4. **Enable Supabase Row Level Security** (RLS) if needed
5. **Monitor API usage** in Vercel dashboard
6. **Set up rate limiting** for production (future enhancement)

---

## 📈 Scaling Considerations

### Database

- Supabase free tier: Good for development and testing
- Upgrade to Pro for production workloads
- Monitor connection pooling

### Vercel

- Free tier: Good for small projects
- Pro tier: Recommended for production
- Monitor function execution time and bandwidth

---

## 🎯 Success Criteria

Your deployment is successful when:

- ✅ Application loads at Vercel URL
- ✅ Can submit historical results
- ✅ Can submit odds and see predictions
- ✅ Predictions table displays correctly
- ✅ All API endpoints respond
- ✅ No console errors in browser
- ✅ Database stores data persistently

---

## 📞 Support

If you encounter issues:

1. Check Vercel build logs
2. Check browser console for errors
3. Verify database connection in Supabase
4. Review this deployment guide
5. Check the main README.md for troubleshooting

---

## 🎉 Congratulations!

Your ONIMIX EAGLE EYE Pick dashboard is now live and ready for production use!

**Next Steps:**
- Share the URL with your team
- Start adding historical data
- Begin analyzing matches
- Monitor performance and accuracy

---

**Built with ⚽ by ONIMIX - Where Data Sees What Others Miss**
