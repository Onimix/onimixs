# ONIMIX EAGLE EYE Pick - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database URL (Supabase recommended)

---

## 📦 Installation

```bash
# 1. Clone and install
git clone <your-repo-url>
cd onimix-eagle-eye-pick
npm install

# 2. Set up environment
cp .env.example .env
# Edit .env and add your DATABASE_URL

# 3. Initialize database
npx prisma generate
npx prisma db push

# 4. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🎯 First Steps

### 1. Add Historical Results

Paste this in the **Historical Results** panel:

```
Time,Result
08:24,LEV 0-2 HSV
08:24,MAI 4-0 SCF
10:30,BAY 3-1 DOR
12:00,MAN 2-2 CHE
14:30,LIV 4-0 ARS
```

Click **Submit Results**

### 2. Add Upcoming Odds

Paste this in the **Upcoming Odds** panel:

```
Time,Event,1,X,2,Goals,Over,Under
15:00,LEV - MAI,2.51,3.46,2.93,2.5,2.32,1.64
17:30,BAY - MAN,1.85,3.60,4.20,2.5,2.10,1.75
```

Click **Submit Odds & Analyze**

### 3. View Predictions

The predictions table will show:
- Expected goals for each match
- Over 1.5 and Over 2.5 probabilities
- Decision (LOCK, SAFE, or AVOID)
- Confidence score

---

## 📊 Understanding the Output

### Decision Types

| Decision | Meaning | Criteria |
|----------|---------|----------|
| 🟢 **LOCK 2+ GOALS** | High confidence bet | Expected ≥ 2.4 goals AND Probability ≥ 70% |
| 🟡 **SAFE OVER 1.5** | Moderate confidence | Expected ≥ 2.0 goals |
| 🔴 **AVOID** | Low confidence | Below thresholds |

### Confidence Score

- **70-100%**: Very high confidence
- **50-69%**: Good confidence
- **Below 50%**: Low confidence

---

## 🔧 Common Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server

# Database
npx prisma studio    # Open database GUI
npx prisma db push   # Push schema changes
npx prisma generate  # Regenerate Prisma client

# Deployment
git push             # Auto-deploys on Vercel
vercel               # Manual deploy with Vercel CLI
```

---

## 📝 Input Format Reference

### Historical Results Format
```
Time,Result
HH:MM,TEAM1 X-Y TEAM2
```

Example:
```
08:24,LEV 0-2 HSV
```

### Upcoming Odds Format
```
Time,Event,1,X,2,Goals,Over,Under
HH:MM,TEAM1 - TEAM2,odd1,oddX,odd2,goalLine,overOdd,underOdd
```

Example:
```
05:36,FCA - HDH,2.51,3.46,2.93,2.5,2.32,1.64
```

---

## 🐛 Quick Troubleshooting

### "Database connection failed"
- Check your `DATABASE_URL` in `.env`
- Ensure database is running
- Try `npx prisma db push`

### "Module not found"
```bash
npm install
npx prisma generate
```

### "Port 3000 already in use"
```bash
# Kill the process
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

### Build errors
```bash
rm -rf .next node_modules
npm install
npm run build
```

---

## 🚀 Deploy to Production

See [`DEPLOYMENT.md`](./DEPLOYMENT.md) for complete deployment guide.

**Quick deploy:**
1. Push to GitHub
2. Import to Vercel
3. Add `DATABASE_URL` environment variable
4. Deploy!

---

## 📚 Learn More

- [README.md](./README.md) - Full documentation
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)

---

**Built with ⚽ by ONIMIX - Where Data Sees What Others Miss**
