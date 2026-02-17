# ONIMIX EAGLE EYE Pick

**Professional Football Intelligence Dashboard**

A production-ready football intelligence system built with Next.js 14, TypeScript, Prisma ORM, and PostgreSQL. This system analyzes historical match data and upcoming odds to generate intelligent predictions for football matches.

## 🚀 Features

- **Historical Results Parser**: Parse and store match results with automatic goal calculations
- **Odds Analysis Engine**: Process upcoming match odds and generate predictions
- **Intelligent Prediction System**: AI-powered analysis based on team statistics
- **Professional Dashboard**: Dark-themed, CEO-level interface
- **Real-time Updates**: Instant prediction generation upon odds submission
- **PostgreSQL Database**: Production-ready with Supabase compatibility
- **Vercel Optimized**: Built for seamless deployment

## 📋 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL (Supabase compatible)
- **ORM**: Prisma
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## 🛠️ Installation

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (Supabase recommended)
- Git

### Local Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd onimix-eagle-eye-pick
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"
   ```

   For Supabase, get your connection string from:
   - Go to your Supabase project
   - Settings → Database → Connection string → URI
   - Replace `[YOUR-PASSWORD]` with your actual password

4. **Initialize the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🚢 Deployment to Vercel

### Step 1: Push to GitHub

1. **Initialize Git repository** (if not already done)
   ```bash
   git init
   git add .
   git commit -m "Initial commit: ONIMIX EAGLE EYE Pick"
   ```

2. **Create a new repository on GitHub**
   - Go to [GitHub](https://github.com/new)
   - Create a new repository (don't initialize with README)

3. **Push your code**
   ```bash
   git remote add origin https://github.com/yourusername/your-repo-name.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Set Up Supabase Database

1. **Create a Supabase project**
   - Go to [Supabase](https://supabase.com)
   - Create a new project
   - Wait for the database to be provisioned

2. **Get your database URL**
   - Go to Settings → Database
   - Copy the Connection string (URI format)
   - It should look like: `postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres`

### Step 3: Deploy to Vercel

1. **Go to [Vercel](https://vercel.com)**
   - Sign in with your GitHub account

2. **Import your repository**
   - Click "Add New" → "Project"
   - Select your GitHub repository
   - Click "Import"

3. **Configure environment variables**
   - In the deployment settings, add:
     - Key: `DATABASE_URL`
     - Value: Your Supabase connection string
   - Click "Deploy"

4. **Initialize the database**
   
   After deployment, run migrations:
   - Go to your Vercel project dashboard
   - Navigate to Settings → Environment Variables
   - Ensure `DATABASE_URL` is set
   - The build process will automatically run `prisma generate`
   - You may need to manually run `npx prisma db push` locally with your production DATABASE_URL

### Alternative: Manual Database Setup

If you prefer to set up the database manually:

```bash
# Set your production DATABASE_URL
export DATABASE_URL="your-production-database-url"

# Push the schema
npx prisma db push
```

## 📊 Usage

### 1. Submit Historical Results

**Format:**
```
Time,Result
08:24,LEV 0-2 HSV
08:24,MAI 4-0 SCF
```

**Steps:**
1. Paste historical results in the "Historical Results" panel
2. Click "Submit Results"
3. Data is parsed and stored in the database

### 2. Submit Upcoming Odds

**Format:**
```
Time,Event,1,X,2,Goals,Over,Under
05:36,FCA - HDH,2.51,3.46,2.93,2.5,2.32,1.64
```

**Steps:**
1. Paste upcoming odds in the "Upcoming Odds" panel
2. Click "Submit Odds & Analyze"
3. System automatically:
   - Stores odds data
   - Analyzes historical performance
   - Generates predictions
   - Displays results in the predictions table

### 3. View Predictions

The predictions table shows:
- **Match**: Teams playing
- **Expected Goals**: Combined expected goals
- **Over 1.5%**: Probability of 2+ goals
- **Over 2.5%**: Probability of 3+ goals
- **Decision**: 
  - 🟢 **LOCK 2+ GOALS**: High confidence (≥2.4 expected goals, ≥70% probability)
  - 🟡 **SAFE OVER 1.5**: Moderate confidence (≥2 expected goals)
  - 🔴 **AVOID**: Low confidence
- **Confidence Score**: Overall prediction confidence (0-100%)

## 🧮 Prediction Algorithm

The system uses a sophisticated algorithm:

1. **Historical Analysis**
   - Average goals scored/conceded per team
   - Over 1.5 and Over 2.5 rates
   - Match count for data quality assessment

2. **Expected Goals Calculation**
   ```
   Home Expected = (Home Avg Scored + Away Avg Conceded) / 2
   Away Expected = (Away Avg Scored + Home Avg Conceded) / 2
   Combined = Home Expected + Away Expected
   ```

3. **Probability Calculation**
   - Weighted combination of historical rates and expected goals
   - Consistency scoring between teams
   - Bookmaker goal line alignment

4. **Decision Logic**
   - **LOCK 2+ GOALS**: Expected ≥ 2.4 AND Probability ≥ 70%
   - **SAFE OVER 1.5**: Expected ≥ 2.0
   - **AVOID**: Below thresholds

## 🗄️ Database Schema

### Result
- Historical match results
- Stores: teams, scores, time, over/under flags

### Odd
- Upcoming match odds
- Stores: teams, odds, goal lines, time

### Prediction
- Generated predictions
- Stores: expected goals, probabilities, decision, confidence

## 🔧 Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Project Structure

```
onimix-eagle-eye-pick/
├── app/
│   ├── api/
│   │   ├── results/route.ts      # Results API endpoint
│   │   ├── odds/route.ts         # Odds API endpoint
│   │   └── predictions/route.ts  # Predictions API endpoint
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main dashboard
├── components/                   # React components (future)
├── lib/
│   ├── prisma.ts                 # Prisma client singleton
│   ├── parser.ts                 # Input parsing utilities
│   └── analyzer.ts               # Prediction engine
├── prisma/
│   └── schema.prisma             # Database schema
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## 🐛 Troubleshooting

### Database Connection Issues

If you encounter database connection errors:

1. Verify your `DATABASE_URL` is correct
2. Ensure your database is accessible
3. Check Supabase connection pooler settings
4. Try using the "Connection Pooling" URL from Supabase

### Build Errors

If the build fails:

```bash
# Clear Next.js cache
rm -rf .next

# Regenerate Prisma client
npx prisma generate

# Rebuild
npm run build
```

### Prisma Issues

```bash
# Reset Prisma client
npx prisma generate

# Push schema changes
npx prisma db push

# View database in Prisma Studio
npx prisma studio
```

## 📝 Environment Variables

Required environment variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |

## 🔒 Security Notes

- Never commit `.env` files
- Use environment variables for sensitive data
- Rotate database credentials regularly
- Enable SSL for production databases

## 📄 License

This project is proprietary software for ONIMIX.

## 🤝 Support

For issues or questions, please contact the development team.

---

**Built with ⚽ by ONIMIX - Where Data Sees What Others Miss**
