import { createSlice } from '@reduxjs/toolkit'

const INITIAL_PROJECTS = [
  {
    id: 'p1',
    title: 'E-Commerce Platform',
    description: 'Full-stack shopping app with React, Node.js, and PostgreSQL. Includes auth, cart, payments.',
    techStack: ['React.js', 'Node.js', 'PostgreSQL', 'Stripe', 'Tailwind CSS'],
    status: 'In Progress',
    githubUrl: 'https://github.com/username/ecommerce',
    liveUrl: '',
    startDate: '2024-01-15',
    endDate: '',
    complexity: 'High',
    teamSize: 1,
  },
  {
    id: 'p2',
    title: 'Weather Dashboard',
    description: 'Real-time weather app using OpenWeather API with 7-day forecast and interactive maps.',
    techStack: ['React.js', 'JavaScript', 'OpenWeather API', 'Leaflet.js'],
    status: 'Completed',
    githubUrl: 'https://github.com/username/weather',
    liveUrl: 'https://weather-demo.netlify.app',
    startDate: '2023-11-01',
    endDate: '2023-12-15',
    complexity: 'Medium',
    teamSize: 1,
  },
  {
    id: 'p3',
    title: 'Student Management System',
    description: 'CRUD application for managing student records with role-based access control.',
    techStack: ['Python', 'Django', 'PostgreSQL', 'Bootstrap'],
    status: 'Completed',
    githubUrl: 'https://github.com/username/sms',
    liveUrl: '',
    startDate: '2023-08-01',
    endDate: '2023-09-30',
    complexity: 'Medium',
    teamSize: 3,
  },
]

const projectsSlice = createSlice({
  name: 'projects',
  initialState: { items: INITIAL_PROJECTS },
  reducers: {
    addProject: (state, action) => {
      state.items.unshift({ id: `p${Date.now()}`, ...action.payload })
    },
    updateProject: (state, action) => {
      const idx = state.items.findIndex(p => p.id === action.payload.id)
      if (idx !== -1) state.items[idx] = { ...state.items[idx], ...action.payload }
    },
    deleteProject: (state, action) => {
      state.items = state.items.filter(p => p.id !== action.payload)
    },
  },
})

export const { addProject, updateProject, deleteProject } = projectsSlice.actions
export default projectsSlice.reducer
