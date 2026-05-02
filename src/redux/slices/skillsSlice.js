import { createSlice } from '@reduxjs/toolkit'

// ─── Initial skill data for demo ──────────────────────────────────────────
const INITIAL_SKILLS = [
  { id: 's1', name: 'React.js', category: 'Frontend', level: 'Intermediate', proficiency: 70, yearsExp: 1.5, verified: false },
  { id: 's2', name: 'JavaScript', category: 'Frontend', level: 'Advanced', proficiency: 85, yearsExp: 3, verified: false },
  { id: 's3', name: 'Python', category: 'Backend', level: 'Intermediate', proficiency: 65, yearsExp: 2, verified: false },
  { id: 's4', name: 'Node.js', category: 'Backend', level: 'Beginner', proficiency: 40, yearsExp: 0.5, verified: false },
  { id: 's5', name: 'SQL', category: 'Database', level: 'Intermediate', proficiency: 60, yearsExp: 1, verified: false },
  { id: 's6', name: 'Git', category: 'Tools', level: 'Advanced', proficiency: 80, yearsExp: 2, verified: false },
  { id: 's7', name: 'TypeScript', category: 'Frontend', level: 'Beginner', proficiency: 30, yearsExp: 0.3, verified: false },
  { id: 's8', name: 'Docker', category: 'DevOps', level: 'Beginner', proficiency: 25, yearsExp: 0.2, verified: false },
]

const skillsSlice = createSlice({
  name: 'skills',
  initialState: {
    items: INITIAL_SKILLS,
    filter: 'all',        // Filter by category
    searchQuery: '',      // Search query
    editingId: null,      // Currently editing skill ID
  },
  reducers: {
    /**
     * Add a new skill
     */
    addSkill: (state, action) => {
      const newSkill = {
        id: `s${Date.now()}`,
        ...action.payload,
        verified: false,
      }
      state.items.unshift(newSkill) // Add to beginning
    },

    /**
     * Update an existing skill
     */
    updateSkill: (state, action) => {
      const idx = state.items.findIndex(s => s.id === action.payload.id)
      if (idx !== -1) {
        state.items[idx] = { ...state.items[idx], ...action.payload }
      }
    },

    /**
     * Delete a skill by ID
     */
    deleteSkill: (state, action) => {
      state.items = state.items.filter(s => s.id !== action.payload)
    },

    /**
     * Set the active category filter
     */
    setFilter: (state, action) => {
      state.filter = action.payload
    },

    /**
     * Update search query
     */
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload
    },

    /**
     * Set which skill is being edited
     */
    setEditingId: (state, action) => {
      state.editingId = action.payload
    },
  },
})

// ─── Selectors ─────────────────────────────────────────────────────────────

/**
 * Get filtered and searched skills
 */
export const selectFilteredSkills = (state) => {
  const { items, filter, searchQuery } = state.skills

  return items.filter(skill => {
    const matchesFilter = filter === 'all' || skill.category === filter
    const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          skill.category.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })
}

/**
 * Calculate average skill score across all skills
 */
export const selectAverageSkillScore = (state) => {
  const skills = state.skills.items
  if (!skills.length) return 0
  return Math.round(skills.reduce((sum, s) => sum + s.proficiency, 0) / skills.length)
}

/**
 * Get skills grouped by category
 */
export const selectSkillsByCategory = (state) => {
  return state.skills.items.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = []
    acc[skill.category].push(skill)
    return acc
  }, {})
}

export const { addSkill, updateSkill, deleteSkill, setFilter, setSearchQuery, setEditingId } = skillsSlice.actions
export default skillsSlice.reducer
