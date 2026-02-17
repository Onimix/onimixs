# 🔧 Troubleshooting: No Data Stored in Supabase

## 🎯 Most Common Issue: RLS (Row Level Security) Policies

Supabase enables Row Level Security by default, which **blocks all INSERT/UPDATE/DELETE operations** unless you explicitly allow them.

---

## ✅ Solution 1: Disable RLS (Quickest Fix)

### Step 1: Go to Supabase Dashboard

1. Open https://supabase.com/dashboard
2. Select your project
3. Click **Table Editor** in left sidebar

### Step 2: Disable RLS for Each Table

For **Result** table:
1. Click on `Result` table
2. Click the **shield icon** (🛡️) or **RLS** button at the top
3. Toggle **"Enable RLS"** to **OFF**
4. Confirm the action

Repeat for:
- `Odd` table
- `Prediction` table

### Step 3: Test Your Application

Try submitting data again - it should work immediately.

---

## ✅ Solution 2: Create Permissive RLS Policies (More Secure)

If you want to keep RLS enabled for security:

### Step 1: Go to SQL Editor

1. Supabase Dashboard → **SQL Editor**
2. Click **New Query**

### Step 2: Run This SQL

```sql
-- Allow all operations on Result table
CREATE POLICY "Allow all operations on Result" ON "Result"
FOR ALL
USING (true)
WITH CHECK (true);

-- Allow all operations on Odd table
CREATE POLICY "Allow all operations on Odd" ON "Odd"
FOR ALL
USING (true)
WITH CHECK (true);

-- Allow all operations on Prediction table
CREATE POLICY "Allow all operations on Prediction" ON "Prediction"
FOR ALL
USING (true)
WITH CHECK (true);
```

### Step 3: Click Run

You should see: **Success. No rows returned**

---

## 🔍 Diagnostic Steps

### 1. Check if Tables Exist

**Supabase Dashboard → Table Editor**

You should see:
- ✅ `Result` table
- ✅ `Odd` table
- ✅ `Prediction` table

If tables don't exist, follow [`DATABASE_SETUP.md`](DATABASE_SETUP.md) first.

### 2. Check RLS Status

**For each table:**
1. Click on the table name
2. Look for a **shield icon** 🛡️ or **RLS badge**
3. If it says **"RLS Enabled"** → This is likely your problem

### 3. Check Vercel Function Logs

1. Go to Vercel Dashboard
2. Click on your project
3. Go to **Deployments** → Select latest deployment
4. Click **Functions** tab
5. Look for errors in `/api/results` or `/api/odds`

**Common error messages:**
- `new row violates row-level security policy` → RLS is blocking inserts
- `relation "Result" does not exist` → Tables not created
- `P1001: Can't reach database` → DATABASE_URL issue

### 4. Test API Endpoints Directly

Open these URLs in your browser (replace with your domain):

**Test Results API:**
```
https://your-app.vercel.app/api/results
```

Should return:
```json
{
  "success": true,
  "count": 0,
  "data": []
}
```

If you get an error, check the error message.

### 5. Check DATABASE_URL in Vercel

1. Vercel Dashboard → Your Project
2. **Settings** → **Environment Variables**
3. Verify `DATABASE_URL` exists and is correct
4. Format should be:
   ```
   postgresql://postgres:PASSWORD@db.xxxxx.supabase.co:5432/postgres
   ```

---

## 🐛 Common Issues & Solutions

### Issue 1: "new row violates row-level security policy"

**Cause**: RLS is enabled and blocking inserts
**Solution**: Disable RLS (Solution 1) or create policies (Solution 2)

### Issue 2: "relation does not exist"

**Cause**: Tables haven't been created
**Solution**: Follow [`DATABASE_SETUP.md`](DATABASE_SETUP.md) to create tables

### Issue 3: "P1001: Can't reach database server"

**Cause**: Wrong DATABASE_URL or database is down
**Solution**: 
1. Check DATABASE_URL in Vercel environment variables
2. Verify Supabase project is active (not paused)
3. Get fresh connection string from Supabase

### Issue 4: Data submits but doesn't appear

**Cause**: Frontend not refreshing or API not returning data
**Solution**:
1. Hard refresh browser (Ctrl+Shift+R / Cmd+Shift+R)
2. Check Supabase Table Editor directly
3. Check browser console for errors

### Issue 5: "Failed to process results/odds"

**Cause**: Input format is incorrect
**Solution**: Check [`INPUT_EXAMPLES.md`](INPUT_EXAMPLES.md) for correct format

---

## 📋 Complete Diagnostic Checklist

Run through this checklist:

- [ ] Tables exist in Supabase (Result, Odd, Prediction)
- [ ] RLS is disabled OR policies are created
- [ ] DATABASE_URL is set in Vercel environment variables
- [ ] DATABASE_URL format is correct
- [ ] Supabase project is active (not paused)
- [ ] Input format matches examples in INPUT_EXAMPLES.md
- [ ] No errors in Vercel function logs
- [ ] API endpoints return valid JSON (not errors)
- [ ] Browser console shows no errors

---

## 🔬 Advanced Debugging

### Test Database Connection Locally

```bash
# Clone repo
git clone https://github.com/Onimix/onimixs.git
cd onimixs

# Install dependencies
npm install

# Create .env with your DATABASE_URL
echo 'DATABASE_URL="your-supabase-url"' > .env

# Test Prisma connection
npx prisma db push

# Open Prisma Studio to view data
npx prisma studio
```

### Check Supabase Logs

1. Supabase Dashboard → **Logs**
2. Select **Postgres Logs**
3. Look for INSERT/UPDATE errors
4. Check for RLS policy violations

### Test with cURL

```bash
# Test Results API
curl -X POST https://your-app.vercel.app/api/results \
  -H "Content-Type: application/json" \
  -d '{"input":"Time,Result\n08:24,LEV 0-2 HSV"}'

# Test Odds API
curl -X POST https://your-app.vercel.app/api/odds \
  -H "Content-Type: application/json" \
  -d '{"input":"Time,Event,1,X,2,Goals,Over,Under\n05:36,FCA - HDH,2.51,3.46,2.93,2.5,2.32,1.64"}'
```

---

## 🎯 Most Likely Solution

**90% of "no data stored" issues are caused by RLS policies.**

**Quick Fix:**
1. Go to Supabase → Table Editor
2. For each table (Result, Odd, Prediction):
   - Click the table
   - Disable RLS (toggle off the shield icon)
3. Try submitting data again

This should immediately fix the issue.

---

## 📞 Still Not Working?

If you've tried everything above and it still doesn't work:

1. **Check Vercel function logs** for specific error messages
2. **Check Supabase Postgres logs** for database errors
3. **Test API endpoints directly** in browser
4. **Verify input format** matches examples exactly
5. **Check browser console** for JavaScript errors

Provide the specific error messages for more targeted help.
