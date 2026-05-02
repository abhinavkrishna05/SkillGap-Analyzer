import { createSlice } from '@reduxjs/toolkit'

// ─── GOALS SLICE ──────────────────────────────────────────────────────────

const INITIAL_GOALS = [
  { id: 'g1', title: 'Master TypeScript', category: 'Skill', priority: 'High', status: 'In Progress', progress: 35, deadline: '2024-05-01', notes: 'Complete TypeScript Handbook and build a project' },
  { id: 'g2', title: 'Build Full-Stack Project', category: 'Project', priority: 'High', status: 'In Progress', progress: 60, deadline: '2024-04-15', notes: 'E-commerce app with React + Node.js + PostgreSQL' },
  { id: 'g3', title: 'DSA - 150 Problems', category: 'DSA', priority: 'Critical', status: 'In Progress', progress: 72, deadline: '2024-03-31', notes: 'Focus on trees, graphs, dynamic programming' },
  { id: 'g4', title: 'Learn Docker Basics', category: 'DevOps', priority: 'Medium', status: 'Not Started', progress: 0, deadline: '2024-05-15', notes: 'Containerize existing projects' },
  { id: 'g5', title: 'Mock Interviews - 10 rounds', category: 'Interview Prep', priority: 'High', status: 'Completed', progress: 100, deadline: '2024-03-15', notes: 'Practice behavioral and technical questions' },
]

export const goalsSlice = createSlice({
  name: 'goals',
  initialState: { items: INITIAL_GOALS },
  reducers: {
    addGoal: (state, action) => {
      state.items.unshift({ id: `g${Date.now()}`, ...action.payload })
    },
    updateGoal: (state, action) => {
      const idx = state.items.findIndex(g => g.id === action.payload.id)
      if (idx !== -1) state.items[idx] = { ...state.items[idx], ...action.payload }
    },
    deleteGoal: (state, action) => {
      state.items = state.items.filter(g => g.id !== action.payload)
    },
    updateGoalProgress: (state, action) => {
      const { id, progress } = action.payload
      const goal = state.items.find(g => g.id === id)
      if (goal) {
        goal.progress = progress
        goal.status = progress === 100 ? 'Completed' : progress > 0 ? 'In Progress' : 'Not Started'
      }
    },
  },
})

export const { addGoal, updateGoal, deleteGoal, updateGoalProgress } = goalsSlice.actions
export default goalsSlice.reducer
