# 🚀 SkillGap Analyzer – AI-Assisted Placement Preparation Dashboard

A full-featured React application that helps engineering students analyze their skill gaps, match with job roles, and prepare for campus placements.

---

## 📌 Problem Statement

Engineering students struggle to know which skills to learn for placement. This app:
- Accepts user skills, projects, and career goals
- Compares skills with real industry job requirements
- Shows a **Skill Match Score (%)** for each job role
- Recommends priority skills to learn based on job market gaps
- Integrates with **GitHub API** to auto-detect languages from repos

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Language | JavaScript (ES6+) |
| State | Redux Toolkit + React-Redux |
| Routing | React Router v6 |
| Styling | Tailwind CSS v3 |
| Charts | Recharts |
| API | GitHub REST API (real), Mock Jobs API |
| Auth | Mock auth (localStorage) |
| Deployment | Vercel / Netlify ready |

---

## 📁 Folder Structure

```
skillgap-analyzer/
├── public/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── ErrorBoundary.jsx     # Class-based error boundary
│   │   │   ├── LoadingSpinner.jsx    # Loading + skeleton states
│   │   │   ├── SkillMatchRing.jsx    # SVG circular progress ring
│   │   │   └── ToastContainer.jsx    # Toast notification system
│   │   └── layout/
│   │       ├── Layout.jsx            # App shell (sidebar + main)
│   │       ├── Navbar.jsx            # Top navigation bar
│   │       └── Sidebar.jsx           # Side navigation
│   ├── hooks/
│   │   └── useCustomHooks.js         # useDebounce, useToast, usePolling, etc.
│   ├── pages/
│   │   ├── Login.jsx                 # Login page with validation
│   │   ├── Signup.jsx                # Multi-step signup form
│   │   ├── Dashboard.jsx             # Main dashboard with Recharts
│   │   ├── Skills.jsx                # Skills CRUD + filter/search
│   │   ├── Jobs.jsx                  # Jobs listing + GitHub API
│   │   └── Profile.jsx               # Goals + Projects CRUD
│   ├── redux/
│   │   ├── store.js                  # Redux store config
│   │   └── slices/
│   │       ├── authSlice.js          # Auth state + async thunks
│   │       ├── skillsSlice.js        # Skills CRUD + selectors
│   │       ├── jobsSlice.js          # Jobs + GitHub API thunks
│   │       ├── goalsSlice.js         # Goals CRUD
│   │       ├── projectsSlice.js      # Projects CRUD
│   │       └── uiSlice.js            # Dark mode, toasts, sidebar
│   ├── services/                     # (API service layer - extend here)
│   ├── utils/
│   │   └── helpers.js                # calculateMatchScore, formatDate, etc.
│   ├── App.jsx                       # Root with routing + lazy loading
│   ├── main.jsx                      # React DOM mount
│   └── index.css                     # Tailwind + custom CSS
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## ⚙️ Core Features Implemented

### ✅ Authentication
- Login / Signup with form validation
- Mock auth with localStorage persistence
- Protected routes (redirect if not logged in)
- Multi-step signup form (3 steps with validation)

### ✅ Dashboard
- Skill coverage radar chart
- Top skills bar chart
- Goals pie chart
- Top job matches with live match scores
- Skill recommendations based on gaps

### ✅ Skill Analysis
- Manual skill entry (name, category, level, proficiency slider, years exp)
- Skill Match Score (%) calculated per job role
- Color-coded match indicators (green/yellow/orange/red)
- Category filter + debounced search
- Grouped by category view

### ✅ CRUD Operations
- **Skills**: Add / Edit / Delete
- **Goals**: Add / Edit / Delete / Progress slider update
- **Projects**: Add / Edit / Delete (with tech stack management)
- **Profile**: Edit user details

### ✅ GitHub API Integration
- Fetch any GitHub user's public repos
- Display language statistics
- Show recent repos with star counts
- Link to GitHub repos and live demos

### ✅ Search + Filter
- Debounced search (400ms delay) on Skills and Jobs pages
- Category filters on both pages
- Live job count update on filter

### ✅ Pagination
- Jobs list paginated (6 per page)
- Page number buttons + prev/next controls

### ✅ Advanced Features
- **Dark mode** toggle (persisted to localStorage)
- **Lazy loading** all pages with React.lazy + Suspense
- **Code splitting** via Vite manual chunks
- **Error Boundary** catches JS errors with dev error details
- **useMemo** for expensive computations (filtered skills, job matching)
- **useCallback** to prevent unnecessary re-renders
- **Debounced search** (custom useDebounce hook)
- **Toast notifications** system (success/error/info/warning)
- **Real-time refresh** button (refetches job data)
- **Polling hook** available (usePolling) for real-time updates

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone or download the project
cd skillgap-analyzer

# Install dependencies
npm install

# Start development server
npm run dev
```

Open http://localhost:5173 in your browser.

### Demo Credentials
```
Email: demo@example.com
Password: demo123
```

---

## 🏗 Build for Production

```bash
npm run build
```

Output goes to `/dist` folder. Preview locally:
```bash
npm run preview
```

---

## 🌐 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts, select "Vite" framework preset
# Or connect GitHub repo at vercel.com for auto-deploys
```

Add `vercel.json` for SPA routing:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

### Netlify

```bash
# Build command: npm run build
# Publish directory: dist
```

Add `public/_redirects` file:
```
/*  /index.html  200
```

Or via `netlify.toml`:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## 🔧 Environment Variables (Optional)

For production GitHub API (higher rate limits):
```
VITE_GITHUB_TOKEN=your_github_personal_access_token
```

Use in service:
```js
headers: { Authorization: `token ${import.meta.env.VITE_GITHUB_TOKEN}` }
```

---

## 📊 Performance Optimizations

| Technique | Where Used |
|-----------|-----------|
| Code splitting | Vite manual chunks (vendor, redux, charts) |
| Lazy loading | All page components via React.lazy |
| useMemo | Filtered skills, job match scores, recommendations |
| useCallback | Event handlers in Skills, Jobs pages |
| Debounce | Search inputs (400ms delay) |
| Error Boundary | Full app wrapped, catches runtime errors |

---

## 🗺 Routes

| Route | Component | Access |
|-------|-----------|--------|
| `/login` | Login | Public |
| `/signup` | Signup | Public |
| `/dashboard` | Dashboard | Protected |
| `/skills` | Skills | Protected |
| `/jobs` | Jobs | Protected |
| `/profile` | Profile | Protected |

---

## 🧩 Extending the App

### Add a Real Jobs API
In `src/redux/slices/jobsSlice.js`, replace `fetchJobs` with:
```js
const response = await fetch('https://api.example.com/jobs', {
  headers: { 'X-RapidAPI-Key': import.meta.env.VITE_RAPID_API_KEY }
})
```

### Add Firebase Auth
1. `npm install firebase`
2. Replace `loginUser` thunk in `authSlice.js` with Firebase `signInWithEmailAndPassword`
3. Replace `signupUser` with `createUserWithEmailAndPassword`

### Add a Database
Use Supabase or Firebase Firestore to persist skills/goals across devices.

---

## 📝 Academic Checklist

- [x] React (Vite) + JavaScript ES6+
- [x] Redux Toolkit (slices, thunks, selectors)
- [x] React Router v6 (6 routes)
- [x] Fetch API (GitHub API integration)
- [x] Tailwind CSS (responsive, dark mode)
- [x] Lazy loading (React.lazy + Suspense)
- [x] Pagination (jobs list)
- [x] Debounced search (useDebounce hook)
- [x] Dark mode toggle (persisted)
- [x] Real-time refresh button
- [x] useMemo + useCallback optimization
- [x] Error Boundary (class component)
- [x] CRUD: Skills, Goals, Projects
- [x] Multi-step form with validation (signup)
- [x] Search + filter (both pages)
- [x] Dashboard with Recharts (radar, bar, pie)
- [x] Deployment-ready (Vercel/Netlify config)
- [x] Modular folder structure
- [x] Error states (loading, success, error UI)

---

## 👨‍💻 Author

Built as a capstone project for Full-Stack React Development.
#   S k i l l G a p - A n a l y z e r  
 