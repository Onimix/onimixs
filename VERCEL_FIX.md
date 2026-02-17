# 🔧 Vercel Deployment Fix - P1001 Error

## Problem

Deployment fails with:
```
Error: P1001: Can't reach database server at `postgres:5432`
```

## Root Cause

You're running `prisma db push` in the Vercel build command. This tries to connect to the database during build time, which:
1. May not have access to environment variables properly
2. Is not the correct approach for Vercel deployments
3. Causes Prisma to fall back to a default local database host

## ✅ Solution

### Step 1: Fix Vercel Build Command

In your Vercel project settings:

1. Go to **Settings** → **General** → **Build & Development Settings**
2. Set **Build Command** to:
   ```bash
   npm run build
   ```
   OR explicitly:
   ```bash
   prisma generate && next build
   ```

**DO NOT include `prisma db push` in the build command!**

### Step 2: Initialize Database Schema Separately

Choose one of these methods:

#### Option A: Before Deployment (Recommended)

```bash
# 1. Create local .env with your Supabase DATABASE_URL
echo 'DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres"' > .env

# 2. Push schema to Supabase
npx prisma db push

# 3. Verify
npx prisma studio

# 4. Clean up
rm .env
```

#### Option B: After Deployment with Vercel CLI

```bash
# Install and login
npm i -g vercel
vercel login

# Link project and pull env vars
vercel link
vercel env pull .env.local

# Push schema
npx prisma db push

# Clean up
rm .env.local
```

#### Option C: Manual SQL in Supabase

Go to Supabase Dashboard → SQL Editor and run:

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

### Step 3: Verify Environment Variables

In Vercel Dashboard:

1. Go to **Settings** → **Environment Variables**
2. Ensure `DATABASE_URL` is set for **Production**, **Preview**, and **Development**
3. Value should be your full Supabase connection string:
   ```
   postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres
   ```

### Step 4: Redeploy

```bash
# Trigger a new deployment
git commit --allow-empty -m "Trigger redeploy"
git push
```

Or in Vercel Dashboard:
- Go to **Deployments**
- Click **Redeploy** on the latest deployment

## ✅ Verification

After redeployment:

1. Build should complete successfully
2. No database connection errors during build
3. Application should connect to database at runtime
4. API endpoints should work correctly

## 📋 Checklist

- [ ] Removed `prisma db push` from Vercel build command
- [ ] Build command is: `prisma generate && next build`
- [ ] Database schema initialized using one of the methods above
- [ ] `DATABASE_URL` environment variable is set in Vercel
- [ ] Redeployed to Vercel
- [ ] Deployment successful
- [ ] Application works correctly

## 🎯 Key Takeaway

**Database operations (like `prisma db push`) should NEVER run during the Vercel build process.**

The build process should only:
1. Install dependencies
2. Generate Prisma Client (`prisma generate`)
3. Build the Next.js application (`next build`)

Database schema initialization is a separate, one-time operation done outside the build process.
