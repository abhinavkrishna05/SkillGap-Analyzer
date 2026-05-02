Skill Gap Analyzer & Placement Preparation Dashboard-
An intelligent web application that helps students analyze their current skills, identify missing competencies, and get personalized recommendations for placement preparation.

Problem Statement-
Many engineering students struggle to understand:
- Which skills they lack for specific job roles
- How prepared they are for placements
- What they should learn next
This project solves the problem by providing a **data-driven skill analysis system** that compares user skills with industry requirements and suggests improvements.

Live Demo-
https://dreamy-rolypoly-02ebb7.netlify.app/login

Key Features-
Authentication :
- User signup & login system
- Personalized dashboard for each user

Dashboard :
- Skill Match Score (%)
- Visual charts for skill distribution
- Personalized recommendations

Skill Gap Analysis :
- Add your skills manually or fetch from GitHub
- Compare with job requirements
- Identify missing skills
- Get improvement suggestions

CRUD Operations :
- Add / Edit / Delete:
  - Skills
  - Projects
  - Goals

API Integration :
- GitHub API → Fetch repositories & languages
- Job API → Fetch roles & required skills

Search & Filter :
- Search job roles
- Filter based on skills/categories

Data Visualization :
- Charts using Recharts
- Progress tracking

Performance Optimization :
- Lazy loading
- Pagination / Infinite scrolling
- Debounced API calls

UI Enhancements :
- Dark mode toggle
- Responsive design

Error Handling :
- API error handling
- Error boundaries

Tech Stack :

| Category | Technology |
|---------|----------|
| Frontend | React (Vite), JavaScript (ES6+) |
| State Management | Redux Toolkit |
| Routing | React Router |
| API Calls | Axios / Fetch API |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Deployment | Vercel / Netlify |

How It Works :
1. User signs up / logs in  
2. Adds skills or connects GitHub  
3. App fetches data from APIs  
4. Compares skills with job requirements  
5. Calculates Skill Match Score  
6. Displays:
   - Missing skills  
   - Recommendations  
   - Progress charts  

Example :
**User Skills:** HTML, CSS, JavaScript  
**Job Requirements:** HTML, CSS, JavaScript, React  

**Match Score:** 75%  
**Missing Skill:** React  

