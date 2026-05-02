import { useState, useMemo, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  addSkill, updateSkill, deleteSkill,
  setFilter, setSearchQuery, setEditingId,
  selectFilteredSkills,
} from '../redux/slices/skillsSlice'
import { useDebounce, useToast } from '../hooks/useCustomHooks'
import { getCategoryColor, getProficiencyLabel } from '../utils/helpers'

const CATEGORIES = ['all', 'Frontend', 'Backend', 'Database', 'DevOps', 'Data Science', 'Mobile', 'Tools', 'Security']
const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert']

const EMPTY_FORM = {
  name: '', category: 'Frontend', level: 'Intermediate',
  proficiency: 50, yearsExp: 1,
}

export default function Skills() {
  const dispatch = useDispatch()
  const toast = useToast()
  const { filter, searchQuery, editingId } = useSelector(state => state.skills)
  const filteredSkills = useSelector(selectFilteredSkills)

  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [formErrors, setFormErrors] = useState({})

  // Debounced search - avoids re-filtering on every keystroke
  const handleSearch = useCallback((e) => {
    dispatch(setSearchQuery(e.target.value))
  }, [dispatch])

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Skill name is required'
    if (form.proficiency < 0 || form.proficiency > 100) e.proficiency = '0–100 only'
    return e
  }

  const openAdd = useCallback(() => {
    setForm(EMPTY_FORM)
    dispatch(setEditingId(null))
    setFormErrors({})
    setShowModal(true)
  }, [dispatch])

  const openEdit = useCallback((skill) => {
    setForm({ ...skill })
    dispatch(setEditingId(skill.id))
    setFormErrors({})
    setShowModal(true)
  }, [dispatch])

  const closeModal = useCallback(() => {
    setShowModal(false)
    dispatch(setEditingId(null))
    setFormErrors({})
  }, [dispatch])

  const handleSave = () => {
    const errors = validate()
    if (Object.keys(errors).length) { setFormErrors(errors); return }

    if (editingId) {
      dispatch(updateSkill({ id: editingId, ...form }))
      toast.success('Skill updated!')
    } else {
      dispatch(addSkill(form))
      toast.success(`${form.name} added to your skills!`)
    }
    closeModal()
  }

  const handleDelete = useCallback((skill) => {
    if (window.confirm(`Delete "${skill.name}"?`)) {
      dispatch(deleteSkill(skill.id))
      toast.success('Skill removed')
    }
  }, [dispatch, toast])

  // Group by category for display
  const groupedSkills = useMemo(() => {
    if (filter !== 'all') return { [filter]: filteredSkills }
    return filteredSkills.reduce((acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = []
      acc[skill.category].push(skill)
      return acc
    }, {})
  }, [filteredSkills, filter])

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">My Skills</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {filteredSkills.length} skill{filteredSkills.length !== 1 ? 's' : ''} tracked
          </p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2 self-start">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Skill
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            placeholder="Search skills..."
            value={searchQuery}
            onChange={handleSearch}
            className="input pl-9"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.slice(0, 6).map(cat => (
            <button
              key={cat}
              onClick={() => dispatch(setFilter(cat))}
              className={`px-3 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
                filter === cat
                  ? 'bg-brand-600 text-white'
                  : 'btn-secondary py-2 text-sm'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Skills grid grouped by category */}
      {filteredSkills.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-slate-400 text-4xl mb-3">🧠</p>
          <p className="font-medium text-slate-600 dark:text-slate-400">No skills found</p>
          <p className="text-sm text-slate-400 mt-1">Try adjusting your search or filter</p>
          <button onClick={openAdd} className="btn-primary mt-4">Add Your First Skill</button>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedSkills).map(([category, catSkills]) => {
            const colors = getCategoryColor(category)
            return (
              <div key={category}>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`badge ${colors.bg} ${colors.text}`}>{category}</span>
                  <span className="text-xs text-slate-400">({catSkills.length})</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {catSkills.map(skill => (
                    <SkillCard
                      key={skill.id}
                      skill={skill}
                      onEdit={() => openEdit(skill)}
                      onDelete={() => handleDelete(skill)}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="card p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-bold text-slate-900 dark:text-white text-lg">
                {editingId ? 'Edit Skill' : 'Add New Skill'}
              </h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Skill Name *</label>
                <input
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. React.js, Python, Docker..."
                  className={`input ${formErrors.name ? 'border-red-400' : ''}`}
                />
                {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Category</label>
                  <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="input">
                    {CATEGORIES.slice(1).map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Level</label>
                  <select value={form.level} onChange={e => setForm(p => ({ ...p, level: e.target.value }))} className="input">
                    {LEVELS.map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Proficiency: <span className="text-brand-600 font-bold">{form.proficiency}%</span>
                  <span className="text-slate-400 font-normal ml-1">({getProficiencyLabel(form.proficiency)})</span>
                </label>
                <input
                  type="range" min="0" max="100" step="5"
                  value={form.proficiency}
                  onChange={e => setForm(p => ({ ...p, proficiency: +e.target.value }))}
                  className="w-full accent-brand-600"
                />
                {formErrors.proficiency && <p className="text-red-500 text-xs mt-1">{formErrors.proficiency}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Years of Experience</label>
                <input
                  type="number" min="0" max="20" step="0.5"
                  value={form.yearsExp}
                  onChange={e => setForm(p => ({ ...p, yearsExp: +e.target.value }))}
                  className="input"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={closeModal} className="btn-secondary flex-1">Cancel</button>
              <button onClick={handleSave} className="btn-primary flex-1">
                {editingId ? 'Update Skill' : 'Add Skill'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Skill Card ────────────────────────────────────────────────────────────
function SkillCard({ skill, onEdit, onDelete }) {
  const levelColors = {
    Expert: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30',
    Advanced: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30',
    Intermediate: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30',
    Beginner: 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/30',
    Novice: 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700',
  }

  const barColor = skill.proficiency >= 70 ? 'bg-green-500' :
                   skill.proficiency >= 50 ? 'bg-brand-500' :
                   skill.proficiency >= 25 ? 'bg-orange-400' : 'bg-red-400'

  return (
    <div className="card p-4 hover:shadow-md transition-shadow duration-200 group">
      <div className="flex items-start justify-between gap-2 mb-3">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm">{skill.name}</h4>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onEdit}
            className="p-1 text-slate-400 hover:text-brand-600 transition-colors"
            title="Edit"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={onDelete}
            className="p-1 text-slate-400 hover:text-red-500 transition-colors"
            title="Delete"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Proficiency bar */}
      <div className="mb-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-slate-500 dark:text-slate-400">Proficiency</span>
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{skill.proficiency}%</span>
        </div>
        <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className={`h-full ${barColor} rounded-full transition-all duration-1000`}
            style={{ width: `${skill.proficiency}%` }}
          />
        </div>
      </div>

      {/* Meta */}
      <div className="flex items-center justify-between">
        <span className={`badge text-xs ${levelColors[skill.level] || levelColors.Novice}`}>
          {skill.level}
        </span>
        <span className="text-xs text-slate-400">{skill.yearsExp}y exp</span>
      </div>
    </div>
  )
}
