# ONIMIX EAGLE EYE Pick - Project Structure

## 📁 Complete File Structure

```
onimix-eagle-eye-pick/
│
├── 📂 app/                          # Next.js 14 App Router
│   ├── 📂 api/                      # API Routes
│   │   ├── 📂 results/
│   │   │   └── route.ts             # POST/GET historical results
│   │   ├── 📂 odds/
│   │   │   └── route.ts             # POST/GET odds + auto-analyze
│   │   └── 📂 predictions/
│   │       └── route.ts             # GET predictions with details
│   │
│   ├── globals.css                  # Global styles + Tailwind
│   ├── layout.tsx                   # Root layout component
│   └── page.tsx                     # Main dashboard (client component)
│
├── 📂 components/                   # React components (future use)
│
├── 📂 lib/                          # Core business logic
│   ├── prisma.ts                    # Prisma singleton client (Vercel optimized)
│   ├── parser.ts                    # Input parsing utilities
│   └── analyzer.ts                  # Prediction engine & algorithms
│
├── 📂 prisma/                       # Database configuration
│   └── schema.prisma                # PostgreSQL schema (3 models)
│
├── 📄 package.json                  # Dependencies & scripts
├── 📄 tsconfig.json                 # TypeScript configuration
├── 📄 next.config.js                # Next.js configuration
├── 📄 tailwind.config.ts            # Tailwind CSS configuration
├── 📄 postcss.config.js             # PostCSS configuration
│
├── 📄 .env.example                  # Environment variables template
├── 📄 .gitignore                    # Git ignore rules
│
├── 📄 README.md                     # Complete documentation
├── 📄 DEPLOYMENT.md                 # Deployment guide
├── 📄 QUICKSTART.md                 # Quick start guide
└── 📄 PROJECT_STRUCTURE.md          # This file
```

---

## 🗂️ Detailed Component Breakdown

### `/app` Directory (Next.js 14 App Router)

#### API Routes (`/app/api`)

**`/api/results/route.ts`**
- **POST**: Parse and store historical results
- **GET**: Retrieve stored results
- Validates input format
- Handles malformed data gracefully

**`/api/odds/route.ts`**
- **POST**: Parse odds, store, and auto-generate predictions
- **GET**: Retrieve stored odds
- Triggers analysis engine automatically
- Returns predictions with odds data

**`/api/predictions/route.ts`**
- **GET**: Fetch all predictions with match details
- Joins predictions with odds data
- Returns enriched prediction objects

#### UI Components

**`globals.css`**
- Tailwind CSS imports
- Custom CSS variables for dark theme
- Marquee animation keyframes
- Global styling

**`layout.tsx`**
- Root layout wrapper
- Metadata configuration
- HTML structure

**`page.tsx`** (Main Dashboard)
- Client-side component (`'use client'`)
- Two input panels (Results & Odds)
- Predictions table with real-time updates
- Professional dark theme UI
- Responsive design

---

### `/lib` Directory (Business Logic)

**`prisma.ts`** - Database Client
```typescript
// Singleton pattern for Vercel
// Prevents connection exhaustion
// Development vs Production handling
```

**`parser.ts`** - Input Parsing
```typescript
// parseResults(): Historical results parser
// parseOdds(): Upcoming odds parser
// Robust error handling
// Continues on malformed lines
```

**`analyzer.ts`** - Prediction Engine
```typescript
// getTeamStats(): Historical analysis
// analyzeMatch(): Generate predictions
// Sophisticated algorithm:
//   - Expected goals calculation
//   - Probability assessment
//   - Decision logic
//   - Confidence scoring
```

---

### `/prisma` Directory (Database)

**`schema.prisma`**

Three main models:

1. **Result** - Historical match data
   - Stores: teams, scores, time
   - Calculates: total goals, over flags
   - Indexed: homeTeam, awayTeam

2. **Odd** - Upcoming match odds
   - Stores: teams, odds, goal lines
   - Indexed: homeTeam, awayTeam

3. **Prediction** - Generated predictions
   - Stores: analysis results
   - Links to: Odd (via oddId)
   - Indexed: oddId

---

## 🔄 Data Flow

### 1. Historical Results Flow
```
User Input (CSV)
    ↓
parseResults() in parser.ts
    ↓
Validation & Parsing
    ↓
POST /api/results
    ↓
Prisma → PostgreSQL (Result table)
    ↓
Success Response
```

### 2. Odds & Prediction Flow
```
User Input (CSV)
    ↓
parseOdds() in parser.ts
    ↓
POST /api/odds
    ↓
Store in Odd table
    ↓
For each odd:
    ↓
analyzeMatch() in analyzer.ts
    ↓
Fetch historical data (Result table)
    ↓
Calculate statistics
    ↓
Generate prediction
    ↓
Store in Prediction table
    ↓
Return predictions to UI
```

### 3. Display Flow
```
Page Load
    ↓
GET /api/predictions
    ↓
Fetch predictions + odds
    ↓
Render in table
    ↓
Color-coded by decision & confidence
```

---

## 🎨 UI Components Breakdown

### Dashboard Layout

```
┌─────────────────────────────────────────────┐
│  🎯 Scrolling Marquee (Welcome Message)     │
├─────────────────────────────────────────────┤
│                                             │
│  📊 ONIMIX EAGLE EYE Pick                   │
│     Professional Football Intelligence      │
│                                             │
├──────────────────┬──────────────────────────┤
│                  │                          │
│  📊 Historical   │  🎯 Upcoming Odds        │
│     Results      │                          │
│                  │                          │
│  [Text Area]     │  [Text Area]             │
│                  │                          │
│  [Submit Button] │  [Submit Button]         │
│                  │                          │
├──────────────────┴──────────────────────────┤
│                                             │
│  🔮 Match Analysis & Predictions            │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │ Time | Match | Goals | % | Decision  │ │
│  ├───────────────────────────────────────┤ │
│  │ ...  | ...   | ...   | ... | ...     │ │
│  └───────────────────────────────────────┘ │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 🔧 Configuration Files

### `package.json`
- Dependencies: Next.js, React, Prisma, TypeScript
- Scripts: dev, build, start, postinstall
- Prisma auto-generation on install

### `tsconfig.json`
- Strict TypeScript configuration
- Path aliases: `@/*` → root
- Next.js plugin integration

### `tailwind.config.ts`
- Content paths for Tailwind
- Custom color variables
- Dark theme support

### `next.config.js`
- React strict mode enabled
- Production optimizations

---

## 🗄️ Database Schema Details

### Result Model
```prisma
model Result {
  id         String   @id @default(uuid())
  time       String
  homeTeam   String
  awayTeam   String
  homeGoals  Int
  awayGoals  Int
  totalGoals Int
  over15     Boolean
  over25     Boolean
  createdAt  DateTime @default(now())
}
```

### Odd Model
```prisma
model Odd {
  id        String   @id @default(uuid())
  time      String
  homeTeam  String
  awayTeam  String
  odd1      Float
  oddX      Float
  odd2      Float
  goalLine  Float
  overOdd   Float
  underOdd  Float
  createdAt DateTime @default(now())
}
```

### Prediction Model
```prisma
model Prediction {
  id                     String   @id @default(uuid())
  oddId                  String
  combinedExpectedGoals  Float
  over15Probability      Float
  over25Probability      Float
  decision               String
  confidenceScore        Float
  createdAt              DateTime @default(now())
}
```

---

## 🚀 Key Features Implementation

### 1. Robust Parsing
- Handles malformed input gracefully
- Continues processing on errors
- Validates all numeric values
- Trims whitespace automatically

### 2. Intelligent Analysis
- Historical team performance
- Expected goals calculation
- Probability assessment
- Confidence scoring

### 3. Production Ready
- Prisma singleton for Vercel
- PostgreSQL (no SQLite)
- Environment variable configuration
- Automatic Prisma generation

### 4. Professional UI
- Dark theme dashboard
- Responsive design
- Real-time updates
- Color-coded decisions
- Scrolling marquee

---

## 📦 Dependencies

### Production
- `next@14.1.0` - React framework
- `react@18.2.0` - UI library
- `@prisma/client@5.9.1` - Database client
- `typescript@5.3.3` - Type safety

### Development
- `prisma@5.9.1` - Database toolkit
- `tailwindcss@3.4.1` - CSS framework
- `@types/*` - TypeScript definitions

---

## 🔐 Environment Variables

Required:
```env
DATABASE_URL="postgresql://user:pass@host:5432/db"
```

Optional (future):
```env
NODE_ENV="production"
NEXT_PUBLIC_API_URL="https://your-domain.com"
```

---

## 📊 API Endpoints Summary

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/results` | POST | Store historical results |
| `/api/results` | GET | Retrieve results |
| `/api/odds` | POST | Store odds + analyze |
| `/api/odds` | GET | Retrieve odds |
| `/api/predictions` | GET | Get predictions |

---

## 🎯 Next Steps for Enhancement

Future improvements could include:

1. **Authentication**: User login system
2. **Historical Charts**: Visualize team performance
3. **Export Features**: Download predictions as CSV
4. **Real-time Updates**: WebSocket for live odds
5. **Mobile App**: React Native version
6. **API Rate Limiting**: Protect endpoints
7. **Caching**: Redis for performance
8. **Analytics**: Track prediction accuracy

---

**Built with ⚽ by ONIMIX - Where Data Sees What Others Miss**
