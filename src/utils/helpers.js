/**
 * Calculate skill match score between user skills and job requirements
 * @param {string[]} userSkills - User's skill names
 * @param {string[]} requiredSkills - Job's required skill names
 * @returns {number} Match percentage (0-100)
 */
export function calculateMatchScore(userSkills, requiredSkills) {
  if (!requiredSkills.length) return 0
  const userSkillsLower = userSkills.map(s => s.toLowerCase())
  const matched = requiredSkills.filter(s => userSkillsLower.includes(s.toLowerCase()))
  return Math.round((matched.length / requiredSkills.length) * 100)
}

/**
 * Get color class based on match score
 * @param {number} score - Match percentage
 */
export function getMatchScoreColor(score) {
  if (score >= 80) return { text: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30', ring: '#22c55e' }
  if (score >= 60) return { text: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/30', ring: '#eab308' }
  if (score >= 40) return { text: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-900/30', ring: '#f97316' }
  return { text: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30', ring: '#ef4444' }
}

/**
 * Get proficiency level label from numeric score
 */
export function getProficiencyLabel(score) {
  if (score >= 85) return 'Expert'
  if (score >= 70) return 'Advanced'
  if (score >= 50) return 'Intermediate'
  if (score >= 25) return 'Beginner'
  return 'Novice'
}

/**
 * Get skill category color scheme
 */
export function getCategoryColor(category) {
  const colors = {
    'Frontend': { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300' },
    'Backend': { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300' },
    'Database': { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-300' },
    'DevOps': { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-300' },
    'Data Science': { bg: 'bg-pink-100 dark:bg-pink-900/30', text: 'text-pink-700 dark:text-pink-300' },
    'Mobile': { bg: 'bg-teal-100 dark:bg-teal-900/30', text: 'text-teal-700 dark:text-teal-300' },
    'Tools': { bg: 'bg-slate-100 dark:bg-slate-700', text: 'text-slate-700 dark:text-slate-300' },
    'Security': { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-300' },
  }
  return colors[category] || { bg: 'bg-slate-100 dark:bg-slate-700', text: 'text-slate-700 dark:text-slate-300' }
}

/**
 * Generate recommendations based on skill gaps
 */
export function generateRecommendations(userSkills, topJobs) {
  const userSkillNames = new Set(userSkills.map(s => s.name.toLowerCase()))
  const skillFrequency = {}

  // Count how often each missing skill appears across top jobs
  topJobs.forEach(job => {
    job.requiredSkills.forEach(skill => {
      if (!userSkillNames.has(skill.toLowerCase())) {
        skillFrequency[skill] = (skillFrequency[skill] || 0) + 1
      }
    })
  })

  // Sort by frequency and return top recommendations
  return Object.entries(skillFrequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([skill, count]) => ({ skill, count, priority: count >= 3 ? 'High' : count >= 2 ? 'Medium' : 'Low' }))
}

/**
 * Format date string to readable format
 */
export function formatDate(dateStr) {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

/**
 * Calculate days remaining until deadline
 */
export function daysUntil(dateStr) {
  if (!dateStr) return null
  const diff = new Date(dateStr) - new Date()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

/**
 * Get GitHub language statistics from repos
 */
export function getLanguageStats(repos) {
  const langCount = {}
  repos.forEach(repo => {
    if (repo.language) {
      langCount[repo.language] = (langCount[repo.language] || 0) + 1
    }
  })
  return Object.entries(langCount)
    .sort(([, a], [, b]) => b - a)
    .map(([lang, count]) => ({ lang, count }))
}

/**
 * Clamp a value between min and max
 */
export function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max)
}

/**
 * Generate initials from name
 */
export function getInitials(name = '') {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}
