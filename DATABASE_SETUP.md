# 🗄️ Database Setup Guide - Initialize Supabase Tables

Your Vercel deployment is successful, but the database tables don't exist yet. Follow these steps to create them.

## ⚠️ Current Status

- ✅ Vercel deployment: **SUCCESS**
- ✅ Database connection: **WORKING** (23 requests in 24 hours)
- ❌ Database tables: **NOT CREATED YET**

## 🎯 Choose ONE Method to Initialize Database

---

## Method 1: Using Supabase SQL Editor (Easiest - Recommended)

### Step 1: Open Supabase SQL Editor

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**

### Step 2: Copy and Paste This SQL

```sql
-- Create Results table
CREATE TABLE "Result" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
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
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
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
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
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

### Step 3: Run the Query

1. Click **Run** button (or press Ctrl+Enter / Cmd+Enter)
2. You should see: **Success. No rows returned**

### Step 4: Verify Tables Were Created

1. Click **Table Editor** in the left sidebar
2. You should now see 3 tables:
   - `Result`
   - `Odd`
   - `Prediction`

---

## Method 2: Using Prisma CLI (For Developers)

### Prerequisites
- Node.js installed locally
- Project cloned from GitHub

### Step 1: Clone and Install

```bash
git clone https://github.com/Onimix/onimixs.git
cd onimixs
npm install
```

### Step 2: Create Local .env File

```bash
# Create .env file with your Supabase DATABASE_URL
echo 'DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres"' > .env
```

**Replace with your actual Supabase connection string from:**
- Supabase Dashboard → Settings → Database → Connection string → URI

### Step 3: Push Schema to Database

```bash
npx prisma db push
```

You should see:
```
✔ Generated Prisma Client
✔ The database is now in sync with your Prisma schema
```

### Step 4: Verify with Prisma Studio

```bash
npx prisma studio
```

This opens a browser at http://localhost:5555 where you can see your tables.

### Step 5: Clean Up

```bash
rm .env  # Delete local .env file (it's gitignored)
```

---

## Method 3: Using Vercel CLI

### Prerequisites
- Vercel CLI installed: `npm i -g vercel`

### Step 1: Login and Link

```bash
vercel login
vercel link
```

### Step 2: Pull Environment Variables

```bash
vercel env pull .env.local
```

### Step 3: Push Schema

```bash
npx prisma db push
```

### Step 4: Clean Up

```bash
rm .env.local
```

---

## ✅ Verification

After running ONE of the methods above, verify the setup:

### 1. Check Supabase Dashboard

Go to **Table Editor** and confirm you see:
- ✅ `Result` table
- ✅ `Odd` table
- ✅ `Prediction` table

### 2. Test Your Application

Visit your Vercel deployment URL and:

1. **Submit Historical Results**:
   ```
   Time,Result
   08:24,LEV 0-2 HSV
   08:24,MAI 4-0 SCF
   ```

2. **Submit Odds**:
   ```
   Time,Event,1,X,2,Goals,Over,Under
   05:36,FCA - HDH,2.51,3.46,2.93,2.5,2.32,1.64
   ```

3. **Check Predictions Table** - Should show predictions

### 3. Check Supabase Table Editor

- Go to **Table Editor** → **Result** - Should see 2 rows
- Go to **Table Editor** → **Odd** - Should see 1 row
- Go to **Table Editor** → **Prediction** - Should see 1 row

---

## 🐛 Troubleshooting

### Error: "relation does not exist"

**Cause**: Tables haven't been created yet
**Solution**: Run one of the methods above

### Error: "permission denied"

**Cause**: Database user doesn't have CREATE TABLE permissions
**Solution**: Use Method 1 (SQL Editor) - it runs as superuser

### Error: "connection refused"

**Cause**: Wrong DATABASE_URL
**Solution**: 
1. Go to Supabase → Settings → Database
2. Copy the **Connection string** → **URI** tab
3. Replace `[YOUR-PASSWORD]` with your actual password
4. Update in Vercel environment variables

---

## 🎉 Success!

Once tables are created, your application will:
- ✅ Store historical results
- ✅ Store odds data
- ✅ Generate predictions automatically
- ✅ Display predictions in the dashboard

---

## 📞 Need Help?

If you encounter issues:
1. Check Vercel function logs for errors
2. Check Supabase logs: Dashboard → Logs → Postgres Logs
3. Verify DATABASE_URL is correct in Vercel environment variables
4. Ensure Supabase project is active (not paused)

---

**Remember**: Database initialization is a ONE-TIME operation. Once tables are created, they persist and your application will work normally.
