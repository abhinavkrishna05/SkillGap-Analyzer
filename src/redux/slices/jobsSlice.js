import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ─── Mock job data (realistic placement roles) ────────────────────────────
const MOCK_JOBS = [
  {
    id: 'j1',
    title: 'Full Stack Developer',
    company: 'Flipkart',
    location: 'Bangalore',
    type: 'Full-time',
    package: '18-25 LPA',
    requiredSkills: ['React.js', 'Node.js', 'JavaScript', 'SQL', 'REST APIs', 'Git'],
    niceToHave: ['TypeScript', 'Redis', 'Docker', 'AWS'],
    experience: '0-2 years',
    category: 'Frontend',
    description: 'Build scalable web applications serving millions of users. Work with React on frontend and Node.js microservices on backend.',
    postedDate: '2024-03-10',
    applicationDeadline: '2024-04-30',
    logo: '🛒',
    matchScore: null, // calculated dynamically
  },
  {
    id: 'j2',
    title: 'Backend Software Engineer',
    company: 'Swiggy',
    location: 'Hyderabad',
    type: 'Full-time',
    package: '20-30 LPA',
    requiredSkills: ['Java', 'Spring Boot', 'SQL', 'Microservices', 'Docker', 'Kafka'],
    niceToHave: ['Kubernetes', 'Redis', 'AWS', 'Python'],
    experience: '0-3 years',
    category: 'Backend',
    description: 'Design and build backend systems for food delivery platform. Work on high-scale distributed systems.',
    postedDate: '2024-03-08',
    applicationDeadline: '2024-04-25',
    logo: '🍕',
    matchScore: null,
  },
  {
    id: 'j3',
    title: 'Data Scientist',
    company: 'Paytm',
    location: 'Noida',
    type: 'Full-time',
    package: '15-22 LPA',
    requiredSkills: ['Python', 'Machine Learning', 'Pandas', 'NumPy', 'SQL', 'Statistics'],
    niceToHave: ['Deep Learning', 'TensorFlow', 'Spark', 'Tableau'],
    experience: '0-2 years',
    category: 'Data Science',
    description: 'Build ML models for fraud detection, recommendation systems, and user behavior analysis.',
    postedDate: '2024-03-12',
    applicationDeadline: '2024-05-10',
    logo: '💳',
    matchScore: null,
  },
  {
    id: 'j4',
    title: 'DevOps Engineer',
    company: 'Razorpay',
    location: 'Bangalore',
    type: 'Full-time',
    package: '18-28 LPA',
    requiredSkills: ['Docker', 'Kubernetes', 'Jenkins', 'Linux', 'AWS', 'Terraform'],
    niceToHave: ['Python', 'Ansible', 'Prometheus', 'Grafana'],
    experience: '1-3 years',
    category: 'DevOps',
    description: 'Manage CI/CD pipelines and cloud infrastructure for fintech platform.',
    postedDate: '2024-03-05',
    applicationDeadline: '2024-04-20',
    logo: '⚙️',
    matchScore: null,
  },
  {
    id: 'j5',
    title: 'Frontend Engineer',
    company: 'Zomato',
    location: 'Gurgaon',
    type: 'Full-time',
    package: '15-20 LPA',
    requiredSkills: ['React.js', 'JavaScript', 'CSS', 'TypeScript', 'Redux', 'Performance Optimization'],
    niceToHave: ['React Native', 'Next.js', 'GraphQL', 'Storybook'],
    experience: '0-2 years',
    category: 'Frontend',
    description: 'Build delightful user experiences for food delivery and restaurant discovery apps.',
    postedDate: '2024-03-14',
    applicationDeadline: '2024-05-01',
    logo: '🍔',
    matchScore: null,
  },
  {
    id: 'j6',
    title: 'ML Engineer',
    company: 'Google India',
    location: 'Hyderabad',
    type: 'Full-time',
    package: '30-50 LPA',
    requiredSkills: ['Python', 'TensorFlow', 'Machine Learning', 'Deep Learning', 'Statistics', 'SQL'],
    niceToHave: ['JAX', 'Kubernetes', 'Spark', 'C++'],
    experience: '0-3 years',
    category: 'Data Science',
    description: 'Work on cutting-edge ML infrastructure and models that power Google products.',
    postedDate: '2024-03-01',
    applicationDeadline: '2024-04-15',
    logo: '🔍',
    matchScore: null,
  },
  {
    id: 'j7',
    title: 'Android Developer',
    company: 'CRED',
    location: 'Bangalore',
    type: 'Full-time',
    package: '20-35 LPA',
    requiredSkills: ['Kotlin', 'Android SDK', 'Jetpack Compose', 'MVVM', 'REST APIs', 'Git'],
    niceToHave: ['Java', 'RxJava', 'Dagger', 'Unit Testing'],
    experience: '0-2 years',
    category: 'Mobile',
    description: 'Build premium Android experiences for the credit card management app used by millions.',
    postedDate: '2024-03-11',
    applicationDeadline: '2024-04-30',
    logo: '💳',
    matchScore: null,
  },
  {
    id: 'j8',
    title: 'Cloud Engineer',
    company: 'Infosys',
    location: 'Pune',
    type: 'Full-time',
    package: '10-18 LPA',
    requiredSkills: ['AWS', 'Azure', 'Linux', 'Python', 'Networking', 'Security'],
    niceToHave: ['Terraform', 'Docker', 'Kubernetes', 'GCP'],
    experience: '0-2 years',
    category: 'DevOps',
    description: 'Design and manage cloud solutions for enterprise clients across industries.',
    postedDate: '2024-03-09',
    applicationDeadline: '2024-05-15',
    logo: '☁️',
    matchScore: null,
  },
  {
    id: 'j9',
    title: 'React Native Developer',
    company: 'PhonePe',
    location: 'Bangalore',
    type: 'Full-time',
    package: '18-28 LPA',
    requiredSkills: ['React Native', 'JavaScript', 'TypeScript', 'Redux', 'REST APIs', 'Mobile UX'],
    niceToHave: ['iOS', 'Android', 'GraphQL', 'Reanimated'],
    experience: '0-2 years',
    category: 'Mobile',
    description: 'Build cross-platform mobile experiences for India\'s leading payments app.',
    postedDate: '2024-03-13',
    applicationDeadline: '2024-04-28',
    logo: '📱',
    matchScore: null,
  },
  {
    id: 'j10',
    title: 'Database Administrator',
    company: 'TCS',
    location: 'Chennai',
    type: 'Full-time',
    package: '8-15 LPA',
    requiredSkills: ['SQL', 'PostgreSQL', 'MySQL', 'Performance Tuning', 'Backup & Recovery', 'Linux'],
    niceToHave: ['MongoDB', 'Redis', 'Oracle', 'AWS RDS'],
    experience: '0-2 years',
    category: 'Database',
    description: 'Manage and optimize databases for large-scale enterprise applications.',
    postedDate: '2024-03-07',
    applicationDeadline: '2024-05-20',
    logo: '🗄️',
    matchScore: null,
  },
  {
    id: 'j11',
    title: 'Security Engineer',
    company: 'HackerEarth',
    location: 'Remote',
    type: 'Full-time',
    package: '15-25 LPA',
    requiredSkills: ['Cybersecurity', 'Penetration Testing', 'Python', 'Networking', 'OWASP', 'Linux'],
    niceToHave: ['AWS Security', 'Burp Suite', 'SIEM', 'IDS/IPS'],
    experience: '0-3 years',
    category: 'Security',
    description: 'Identify and fix security vulnerabilities across web applications and infrastructure.',
    postedDate: '2024-03-06',
    applicationDeadline: '2024-04-22',
    logo: '🔒',
    matchScore: null,
  },
  {
    id: 'j12',
    title: 'Product Analyst',
    company: 'Meesho',
    location: 'Bangalore',
    type: 'Full-time',
    package: '12-18 LPA',
    requiredSkills: ['SQL', 'Python', 'Analytics', 'Statistics', 'A/B Testing', 'Tableau'],
    niceToHave: ['Machine Learning', 'Looker', 'Product Sense', 'Mixpanel'],
    experience: '0-2 years',
    category: 'Data Science',
    description: 'Drive data-driven product decisions for e-commerce platform serving tier-2 cities.',
    postedDate: '2024-03-15',
    applicationDeadline: '2024-05-05',
    logo: '📊',
    matchScore: null,
  },
]

// ─── Async Thunks ──────────────────────────────────────────────────────────

/**
 * Fetch GitHub repos for a user (real API integration)
 * Returns languages used across repos to suggest skill improvements
 */
export const fetchGitHubRepos = createAsyncThunk(
  'jobs/fetchGitHubRepos',
  async (username, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `https://api.github.com/users/${username}/repos?sort=updated&per_page=10`
      )
      if (!response.ok) {
        if (response.status === 404) return rejectWithValue('GitHub user not found')
        return rejectWithValue('Failed to fetch GitHub data')
      }
      const repos = await response.json()
      return repos
    } catch (err) {
      return rejectWithValue('Network error. Check your connection.')
    }
  }
)

/**
 * Simulate fetching jobs (in prod, use a real jobs API)
 */
export const fetchJobs = createAsyncThunk(
  'jobs/fetchJobs',
  async (_, { getState }) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600))

    // Get user skills to calculate match scores
    const userSkills = getState().skills.items.map(s => s.name.toLowerCase())

    // Calculate match score for each job
    const jobsWithScores = MOCK_JOBS.map(job => {
      const requiredLower = job.requiredSkills.map(s => s.toLowerCase())
      const matchedSkills = requiredLower.filter(s => userSkills.includes(s))
      const matchScore = Math.round((matchedSkills.length / requiredLower.length) * 100)
      return { ...job, matchScore, matchedSkills }
    })

    return jobsWithScores
  }
)

// ─── Slice ─────────────────────────────────────────────────────────────────

const jobsSlice = createSlice({
  name: 'jobs',
  initialState: {
    items: [],
    isLoading: false,
    error: null,
    searchQuery: '',
    categoryFilter: 'all',
    currentPage: 1,
    itemsPerPage: 6,
    // GitHub integration
    githubUsername: '',
    githubRepos: [],
    githubLoading: false,
    githubError: null,
  },
  reducers: {
    setJobSearch: (state, action) => {
      state.searchQuery = action.payload
      state.currentPage = 1 // Reset pagination on search
    },
    setCategoryFilter: (state, action) => {
      state.categoryFilter = action.payload
      state.currentPage = 1
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload
    },
    setGithubUsername: (state, action) => {
      state.githubUsername = action.payload
    },
    clearGithubData: (state) => {
      state.githubRepos = []
      state.githubError = null
    },
  },
  extraReducers: (builder) => {
    // ── Fetch Jobs ──
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = action.payload
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload || 'Failed to load jobs'
      })

    // ── GitHub Repos ──
    builder
      .addCase(fetchGitHubRepos.pending, (state) => {
        state.githubLoading = true
        state.githubError = null
      })
      .addCase(fetchGitHubRepos.fulfilled, (state, action) => {
        state.githubLoading = false
        state.githubRepos = action.payload
      })
      .addCase(fetchGitHubRepos.rejected, (state, action) => {
        state.githubLoading = false
        state.githubError = action.payload
      })
  },
})

// ─── Selectors ─────────────────────────────────────────────────────────────

export const selectFilteredJobs = (state) => {
  const { items, searchQuery, categoryFilter } = state.jobs
  return items.filter(job => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.requiredSkills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory =
      categoryFilter === 'all' || job.category === categoryFilter
    return matchesSearch && matchesCategory
  })
}

export const selectPaginatedJobs = (state) => {
  const filtered = selectFilteredJobs(state)
  const { currentPage, itemsPerPage } = state.jobs
  const start = (currentPage - 1) * itemsPerPage
  return {
    jobs: filtered.slice(start, start + itemsPerPage),
    totalPages: Math.ceil(filtered.length / itemsPerPage),
    totalCount: filtered.length,
  }
}

export const { setJobSearch, setCategoryFilter, setCurrentPage, setGithubUsername, clearGithubData } = jobsSlice.actions
export default jobsSlice.reducer
