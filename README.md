# CollegeCompass 🎓

> Production-grade college discovery, side-by-side comparison, and rank predictor platform featuring verified placement analytics, closing cutoffs, and campus insights for Indian universities.

---

## 🌟 Overview

**CollegeCompass** is an all-in-one educational guidance and university comparison web application. It empowers students and parents to make data-backed higher education decisions across Engineering, Management, Medical, Design, and Law streams.

The platform combines rich directory search, verified historical placement statistics, multi-factor college comparison tables, and a predictive admission tool calibrated against entrance examination cutoffs.

---

## ✨ Key Features

### 1. 🔍 Comprehensive College Directory & Smart Filtering
- **Multi-parameter Search**: Filter colleges by stream (Engineering, Management, Medical, Design, Law), state/region, degree programs, NIRF ranking tier, annual fee range, and student rating.
- **Sorting Options**: Sort results by NIRF rank, highest placement CTC, lowest annual tuition, or user rating.
- **Cursor Pagination & Real-time Counts**: Seamless browsing across top IITs, NITs, IIMs, AIIMS, and premier private institutions.

### 2. 📊 In-Depth College Profiles
- **Placement Trends & CTC Visualizer**: Interactive charts showing year-over-year median, average, and highest salary packages (LPA), along with marquee recruiters.
- **Courses & Annual Fees**: Transparent curriculum breakdown with duration, degree level, and fees per semester/year.
- **Verified Student Reviews**: Category-wise rating breakdown (academics, placements, campus life, infrastructure) and student testimonials with upvoting functionality.
- **Cutoffs & Admission Guidelines**: Clear entrance examination thresholds and category-wise seat allotments.

### 3. ⚖️ Side-by-Side Comparison Engine
- Compare 2 to 3 colleges simultaneously across 10+ dimensions:
  - NIRF Ranking
  - Average & Highest Placement CTC
  - 4-Year Tuition & Hostel Expense Estimates
  - Accreditations (NAAC, NBA, NIRF)
  - Campus Size & Student Facilities
  - Key Recruiters
- **Difference Highlighter**: Toggle visual badges to immediately surface differences and category winners (e.g., *Most Economical*, *Highest Placement*).
- **Share & Save**: Export comparison sets or copy direct link states.

### 4. 🎯 Rank & Branch Predictor
- **Multi-Exam Support**: Predict admission probability for **JEE Main**, **JEE Advanced**, **NEET UG**, and **CAT**.
- **Probability Buckets**:
  - 🟢 **Safe (High Chance)**: Cutoffs where your rank comfortably surpasses historical closing ranks.
  - 🟡 **Moderate Match**: Competitive choices within reach.
  - 🔵 **Ambitious (Reach)**: Dream aspirational programs with razor-thin cutoff margins.
- **Quota & Category Aware**: Accounts for General, OBC-NCL, SC, ST, and EWS categories as well as Home State (HS) vs. Other State (OS) quotas.

### 5. 📌 Shortlists & Saved Items
- Bookmark prospective colleges to your personal shortlist.
- Save custom multi-college comparison matrices for offline review and quick retrieval.
- One-click link sharing with peers and counselors.

### 6. 🎨 Bento Grid UI Architecture
- Clean, structured card geometry (`rounded-3xl`, subtle hairline borders, and gentle shadow depth).
- Harmonious typography pairing **Outfit** for bold display headings with **Plus Jakarta Sans** for clear, accessible body reading.
- Fully responsive mobile, tablet, and desktop viewport layouts.

---

## 🛠️ Tech Stack

- **Frontend**:
  - [React 19](https://react.dev/) — Modern UI library
  - [TypeScript](https://www.typescriptlang.org/) — End-to-end type safety
  - [Tailwind CSS v4](https://tailwindcss.com/) — Utility-first modern CSS framework
  - [TanStack React Query v5](https://tanstack.com/query) — Asynchronous state management & caching
  - [Recharts](https://recharts.org/) — Placement trends and salary distribution charts
  - [Lucide React](https://lucide.dev/) — Consistent icon system
  - [Motion](https://motion.dev/) — Smooth micro-interactions and transitions

- **Backend**:
  - [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/) — RESTful API service
  - [Zod](https://zod.dev/) — Runtime schema validation
  - [Cookie-parser](https://www.npmjs.com/package/cookie-parser) — Client session and shortlist tracking
  - [esbuild](https://esbuild.github.io/) & [tsx](https://github.com/privatenumber/tsx) — Rapid server bundling and development execution

---

## 📁 Project Structure

```
├── server.ts                 # Express backend server with Vite middleware integration
├── server/
│   └── db.ts                 # In-memory database store, filtering logic, and prediction engine
├── src/
│   ├── main.tsx              # React application entry point
│   ├── App.tsx               # Primary layout, routing, and compare tray coordination
│   ├── index.css             # Tailwind v4 import and custom font/utility styles
│   ├── types.ts              # Zod schemas, TypeScript types, and domain models
│   ├── components/
│   │   ├── Header.tsx        # Top navigation bar, search, and view tabs
│   │   ├── CollegeListing.tsx# College directory, multi-filter drawer, and cards
│   │   ├── CollegeDetail.tsx # Detailed view (placements, courses, cutoffs, reviews)
│   │   ├── CompareView.tsx   # Side-by-side comparison matrix table
│   │   ├── CompareTray.tsx   # Floating sticky comparison bar
│   │   ├── PredictorView.tsx # Rank predictor form and bucketed match cards
│   │   └── SavedItemsView.tsx# Shortlisted colleges and saved comparisons
│   ├── context/
│   │   └── CollegeContext.tsx# Compare state, bookmarks, and global alerts
│   ├── data/
│   │   └── seedColleges.ts   # Curated data for top Indian universities
│   └── lib/
│       └── api.ts            # Client-side API fetch client & query hooks
├── index.html                # HTML entry point with metadata and fonts
├── metadata.json             # Google AI Studio app configuration and capabilities
└── package.json              # Dependencies and development scripts
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: Version 18+ or 20+ recommended
- **npm** or **bun** / **yarn**

### Installation

1. Clone the repository or navigate to the project directory:
   ```bash
   cd collegecompass
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Express + Vite development server on port 3000 via `tsx` |
| `npm run build` | Compiles the client with Vite and bundles `server.ts` to `dist/server.cjs` via `esbuild` |
| `npm start` | Runs the compiled production server (`node dist/server.cjs`) |
| `npm run lint` | Runs TypeScript type checking (`tsc --noEmit`) |

---

## 📡 API Reference

The backend provides clean, strongly typed REST endpoints:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Healthcheck and timestamp |
| `GET` | `/api/colleges/meta/filters` | Dynamic filter options (streams, states, fee boundaries) |
| `GET` | `/api/colleges` | Search & filter college list with cursor-based pagination |
| `GET` | `/api/colleges/:slug` | Full college dossier (details, courses, placements, reviews) |
| `GET` | `/api/colleges/:slug/reviews` | Paginated reviews for a specific college |
| `POST` | `/api/reviews/:reviewId/upvote` | Upvote a student review |
| `GET` | `/api/colleges/compare` | Multi-college comparison data (takes `ids` query param) |
| `POST` | `/api/predictor` | Rank predictor matching (safe, moderate, ambitious) |
| `GET` | `/api/saved/colleges` | Retrieve user's shortlisted colleges |
| `POST` | `/api/saved/colleges` | Add/remove college from shortlist |
| `GET` | `/api/saved/comparisons` | Retrieve user's saved comparison sets |
| `POST` | `/api/saved/comparisons` | Save a new comparison set |
| `DELETE`| `/api/saved/comparisons/:id` | Delete a saved comparison |

---

## 📄 License

This project is licensed under the MIT License.
