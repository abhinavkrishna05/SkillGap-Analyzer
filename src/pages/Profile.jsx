import { useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateProfile } from '../redux/slices/authSlice'
import { addGoal, updateGoal, deleteGoal, updateGoalProgress } from '../redux/slices/goalsSlice'
import { addProject, updateProject, deleteProject } from '../redux/slices/projectsSlice'
import { useToast } from '../hooks/useCustomHooks'
import { formatDate, daysUntil, getInitials } from '../utils/helpers'

const GOAL_STATUSES = ['Not Started', 'In Progress', 'Completed']
const GOAL_PRIORITIES = ['Low', 'Medium', 'High', 'Critical']
const GOAL_CATEGORIES = ['Skill', 'Project', 'DSA', 'Interview Prep', 'DevOps', 'Other']
const PROJECT_STATUSES = ['Planning', 'In Progress', 'Completed', 'On Hold']

const EMPTY_GOAL = { title: '', category: 'Skill', priority: 'Medium', status: 'Not Started', progress: 0, deadline: '', notes: '' }
const EMPTY_PROJECT = { title: '', description: '', techStack: [], status: 'In Progress', githubUrl: '', liveUrl: '', startDate: '', endDate: '', complexity: 'Medium', teamSize: 1 }

export default function Profile() {
  const dispatch = useDispatch()
  const toast = useToast()
  const { user } = useSelector(state => state.auth)
  const goals = useSelector(state => state.goals.items)
  const projects = useSelector(state => state.projects.items)

  const [activeTab, setActiveTab] = useState('goals')
  const [profileEdit, setProfileEdit] = useState(false)
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', college: user?.college || '', branch: user?.branch || '', cgpa: user?.cgpa || '' })

  // Goal modal state
  const [goalModal, setGoalModal] = useState(false)
  const [goalForm, setGoalForm] = useState(EMPTY_GOAL)
  const [editingGoalId, setEditingGoalId] = useState(null)

  // Project modal state
  const [projModal, setProjModal] = useState(false)
  const [projForm, setProjForm] = useState(EMPTY_PROJECT)
  const [editingProjId, setEditingProjId] = useState(null)
  const [techInput, setTechInput] = useState('')

  // ── Profile handlers ──
  const saveProfile = () => {
    dispatch(updateProfile(profileForm))
    setProfileEdit(false)
    toast.success('Profile updated!')
  }

  // ── Goal handlers ──
  const openAddGoal = () => { setGoalForm(EMPTY_GOAL); setEditingGoalId(null); setGoalModal(true) }
  const openEditGoal = (g) => { setGoalForm({ ...g }); setEditingGoalId(g.id); setGoalModal(true) }

  const saveGoal = () => {
    if (!goalForm.title.trim()) { toast.error('Goal title is required'); return }
    if (editingGoalId) {
      dispatch(updateGoal({ id: editingGoalId, ...goalForm }))
      toast.success('Goal updated!')
    } else {
      dispatch(addGoal(goalForm))
      toast.success('Goal added!')
    }
    setGoalModal(false)
  }

  const handleDeleteGoal = (g) => {
    if (window.confirm(`Delete "${g.title}"?`)) {
      dispatch(deleteGoal(g.id))
      toast.success('Goal removed')
    }
  }

  // ── Project handlers ──
  const openAddProject = () => { setProjForm(EMPTY_PROJECT); setEditingProjId(null); setTechInput(''); setProjModal(true) }
  const openEditProject = (p) => { setProjForm({ ...p }); setEditingProjId(p.id); setTechInput(''); setProjModal(true) }

  const addTech = () => {
    if (techInput.trim() && !projForm.techStack.includes(techInput.trim())) {
      setProjForm(p => ({ ...p, techStack: [...p.techStack, techInput.trim()] }))
      setTechInput('')
    }
  }

  const removeTech = (tech) => setProjForm(p => ({ ...p, techStack: p.techStack.filter(t => t !== tech) }))

  const saveProject = () => {
    if (!projForm.title.trim()) { toast.error('Project title is required'); return }
    if (editingProjId) {
      dispatch(updateProject({ id: editingProjId, ...projForm }))
      toast.success('Project updated!')
    } else {
      dispatch(addProject(projForm))
      toast.success('Project added!')
    }
    setProjModal(false)
  }

  const handleDeleteProject = (p) => {
    if (window.confirm(`Delete "${p.title}"?`)) {
      dispatch(deleteProject(p.id))
      toast.success('Project removed')
    }
  }

  const statusColor = {
    'Completed': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    'In Progress': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'Not Started': 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400',
    'Planning': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    'On Hold': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  }

  const priorityColor = {
    'Critical': 'text-red-600 dark:text-red-400',
    'High': 'text-orange-600 dark:text-orange-400',
    'Medium': 'text-yellow-600 dark:text-yellow-400',
    'Low': 'text-slate-500 dark:text-slate-400',
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Profile card */}
      <div className="card p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-brand-500 to-accent-500 rounded-2xl flex items-center justify-center text-white font-display font-bold text-xl flex-shrink-0">
              {getInitials(user?.name)}
            </div>
            {profileEdit ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
                <input value={profileForm.name} onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))} placeholder="Full name" className="input text-sm" />
                <input value={profileForm.college} onChange={e => setProfileForm(p => ({ ...p, college: e.target.value }))} placeholder="College" className="input text-sm" />
                <input value={profileForm.branch} onChange={e => setProfileForm(p => ({ ...p, branch: e.target.value }))} placeholder="Branch" className="input text-sm" />
                <input value={profileForm.cgpa} onChange={e => setProfileForm(p => ({ ...p, cgpa: e.target.value }))} placeholder="CGPA" type="number" step="0.1" max="10" className="input text-sm" />
              </div>
            ) : (
              <div>
                <h2 className="font-display font-bold text-slate-900 dark:text-white text-xl">{user?.name}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">{user?.email}</p>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                  {user?.college} · {user?.branch} · {user?.graduationYear}
                </p>
                {user?.cgpa && <p className="text-sm text-slate-500 dark:text-slate-400">CGPA: {user.cgpa}</p>}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {user?.targetRoles?.map(r => (
                    <span key={r} className="skill-tag text-xs">{r}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            {profileEdit ? (
              <>
                <button onClick={() => setProfileEdit(false)} className="btn-secondary text-sm">Cancel</button>
                <button onClick={saveProfile} className="btn-primary text-sm">Save</button>
              </>
            ) : (
              <button onClick={() => setProfileEdit(true)} className="btn-secondary text-sm flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-fit">
        {['goals', 'projects'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
              activeTab === tab
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            {tab} ({tab === 'goals' ? goals.length : projects.length})
          </button>
        ))}
      </div>

      {/* ── GOALS TAB ── */}
      {activeTab === 'goals' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-slate-900 dark:text-white">Learning Goals</h3>
            <button onClick={openAddGoal} className="btn-primary flex items-center gap-1.5 text-sm">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Goal
            </button>
          </div>

          {goals.length === 0 ? (
            <div className="card p-10 text-center">
              <p className="text-3xl mb-3">🎯</p>
              <p className="text-slate-500 text-sm">No goals yet. Set your first learning goal!</p>
              <button onClick={openAddGoal} className="btn-primary mt-3 text-sm">Add Goal</button>
            </div>
          ) : (
            <div className="space-y-3">
              {goals.map(goal => {
                const days = daysUntil(goal.deadline)
                return (
                  <div key={goal.id} className="card p-4">
                    <div className="flex items-start gap-3">
                      {/* Progress ring mini */}
                      <div className="flex-shrink-0 w-10 h-10 relative">
                        <svg viewBox="0 0 40 40" className="w-full h-full -rotate-90">
                          <circle cx="20" cy="20" r="15" fill="none" stroke="currentColor" strokeWidth="3" className="text-slate-200 dark:text-slate-700" />
                          <circle cx="20" cy="20" r="15" fill="none"
                            stroke={goal.status === 'Completed' ? '#22c55e' : '#0ea5e9'}
                            strokeWidth="3" strokeLinecap="round"
                            strokeDasharray={`${2 * Math.PI * 15}`}
                            strokeDashoffset={`${2 * Math.PI * 15 * (1 - goal.progress / 100)}`}
                            style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                          />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-300">
                          {goal.progress}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-semibold text-slate-900 dark:text-white text-sm">{goal.title}</h4>
                          <div className="flex gap-1 flex-shrink-0">
                            <button onClick={() => openEditGoal(goal)} className="p-1 text-slate-400 hover:text-brand-600 transition-colors">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button onClick={() => handleDeleteGoal(goal)} className="p-1 text-slate-400 hover:text-red-500 transition-colors">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 mt-1.5">
                          <span className={`badge ${statusColor[goal.status]}`}>{goal.status}</span>
                          <span className={`text-xs font-medium ${priorityColor[goal.priority]}`}>{goal.priority} priority</span>
                          <span className="text-xs text-slate-400">{goal.category}</span>
                          {goal.deadline && (
                            <span className={`text-xs ${days !== null && days < 7 && goal.status !== 'Completed' ? 'text-red-500 font-medium' : 'text-slate-400'}`}>
                              {goal.status === 'Completed' ? `Due ${formatDate(goal.deadline)}` : days !== null ? `${days > 0 ? `${days}d left` : 'Overdue'}` : ''}
                            </span>
                          )}
                        </div>

                        {goal.notes && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-1">{goal.notes}</p>}

                        {/* Quick progress update */}
                        <div className="flex items-center gap-2 mt-2">
                          <input
                            type="range" min="0" max="100" step="5"
                            value={goal.progress}
                            onChange={e => dispatch(updateGoalProgress({ id: goal.id, progress: +e.target.value }))}
                            className="flex-1 accent-brand-600 h-1"
                          />
                          <span className="text-xs text-slate-400 w-8">{goal.progress}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* ── PROJECTS TAB ── */}
      {activeTab === 'projects' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-slate-900 dark:text-white">My Projects</h3>
            <button onClick={openAddProject} className="btn-primary flex items-center gap-1.5 text-sm">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Project
            </button>
          </div>

          {projects.length === 0 ? (
            <div className="card p-10 text-center">
              <p className="text-3xl mb-3">💻</p>
              <p className="text-slate-500 text-sm">No projects yet. Showcase your work!</p>
              <button onClick={openAddProject} className="btn-primary mt-3 text-sm">Add Project</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {projects.map(proj => (
                <div key={proj.id} className="card p-5">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h4 className="font-display font-bold text-slate-900 dark:text-white text-sm">{proj.title}</h4>
                    <div className="flex gap-1 flex-shrink-0">
                      <button onClick={() => openEditProject(proj)} className="p-1 text-slate-400 hover:text-brand-600 transition-colors">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button onClick={() => handleDeleteProject(proj)} className="p-1 text-slate-400 hover:text-red-500 transition-colors">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 mb-3 line-clamp-2">{proj.description}</p>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {proj.techStack.slice(0, 4).map(t => (
                      <span key={t} className="skill-tag text-xs">{t}</span>
                    ))}
                    {proj.techStack.length > 4 && <span className="text-xs text-slate-400">+{proj.techStack.length - 4}</span>}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={`badge ${statusColor[proj.status]}`}>{proj.status}</span>
                    <div className="flex gap-2">
                      {proj.githubUrl && (
                        <a href={proj.githubUrl} target="_blank" rel="noreferrer"
                          onClick={e => e.stopPropagation()}
                          className="text-xs text-brand-600 dark:text-brand-400 hover:underline font-medium">
                          GitHub →
                        </a>
                      )}
                      {proj.liveUrl && (
                        <a href={proj.liveUrl} target="_blank" rel="noreferrer"
                          onClick={e => e.stopPropagation()}
                          className="text-xs text-green-600 dark:text-green-400 hover:underline font-medium">
                          Live →
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="text-xs text-slate-400 mt-2">
                    {proj.teamSize > 1 ? `Team of ${proj.teamSize}` : 'Solo'} · {proj.complexity} complexity
                    {proj.startDate && ` · ${formatDate(proj.startDate)}`}
                    {proj.endDate && ` → ${formatDate(proj.endDate)}`}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── GOAL MODAL ── */}
      {goalModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="card p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-bold text-slate-900 dark:text-white">{editingGoalId ? 'Edit Goal' : 'Add Goal'}</h3>
              <button onClick={() => setGoalModal(false)} className="text-slate-400 hover:text-slate-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Goal Title *</label>
                <input value={goalForm.title} onChange={e => setGoalForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Master TypeScript" className="input" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Category</label>
                  <select value={goalForm.category} onChange={e => setGoalForm(p => ({ ...p, category: e.target.value }))} className="input">
                    {GOAL_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Priority</label>
                  <select value={goalForm.priority} onChange={e => setGoalForm(p => ({ ...p, priority: e.target.value }))} className="input">
                    {GOAL_PRIORITIES.map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Status</label>
                  <select value={goalForm.status} onChange={e => setGoalForm(p => ({ ...p, status: e.target.value }))} className="input">
                    {GOAL_STATUSES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Deadline</label>
                  <input type="date" value={goalForm.deadline} onChange={e => setGoalForm(p => ({ ...p, deadline: e.target.value }))} className="input" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Progress: <span className="text-brand-600 font-bold">{goalForm.progress}%</span>
                </label>
                <input type="range" min="0" max="100" step="5" value={goalForm.progress} onChange={e => setGoalForm(p => ({ ...p, progress: +e.target.value }))} className="w-full accent-brand-600" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Notes</label>
                <textarea value={goalForm.notes} onChange={e => setGoalForm(p => ({ ...p, notes: e.target.value }))} rows={2} className="input resize-none" placeholder="Additional details..." />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setGoalModal(false)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={saveGoal} className="btn-primary flex-1">{editingGoalId ? 'Update' : 'Add Goal'}</button>
            </div>
          </div>
        </div>
      )}

      {/* ── PROJECT MODAL ── */}
      {projModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="card p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-bold text-slate-900 dark:text-white">{editingProjId ? 'Edit Project' : 'Add Project'}</h3>
              <button onClick={() => setProjModal(false)} className="text-slate-400 hover:text-slate-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Project Title *</label>
                <input value={projForm.title} onChange={e => setProjForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. E-Commerce Platform" className="input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Description</label>
                <textarea value={projForm.description} onChange={e => setProjForm(p => ({ ...p, description: e.target.value }))} rows={2} className="input resize-none" placeholder="What does this project do?" />
              </div>
              {/* Tech stack input */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Tech Stack</label>
                <div className="flex gap-2 mb-2">
                  <input
                    value={techInput}
                    onChange={e => setTechInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addTech()}
                    placeholder="Add tech (Enter)"
                    className="input flex-1 text-sm"
                  />
                  <button onClick={addTech} className="btn-secondary text-sm px-3">Add</button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {projForm.techStack.map(t => (
                    <span key={t} className="flex items-center gap-1 skill-tag text-xs">
                      {t}
                      <button onClick={() => removeTech(t)} className="text-brand-400 hover:text-red-500 ml-0.5">×</button>
                    </span>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Status</label>
                  <select value={projForm.status} onChange={e => setProjForm(p => ({ ...p, status: e.target.value }))} className="input">
                    {PROJECT_STATUSES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Complexity</label>
                  <select value={projForm.complexity} onChange={e => setProjForm(p => ({ ...p, complexity: e.target.value }))} className="input">
                    {['Low', 'Medium', 'High'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Start Date</label>
                  <input type="date" value={projForm.startDate} onChange={e => setProjForm(p => ({ ...p, startDate: e.target.value }))} className="input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">End Date</label>
                  <input type="date" value={projForm.endDate} onChange={e => setProjForm(p => ({ ...p, endDate: e.target.value }))} className="input" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">GitHub URL</label>
                <input value={projForm.githubUrl} onChange={e => setProjForm(p => ({ ...p, githubUrl: e.target.value }))} placeholder="https://github.com/..." className="input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Live URL (optional)</label>
                <input value={projForm.liveUrl} onChange={e => setProjForm(p => ({ ...p, liveUrl: e.target.value }))} placeholder="https://your-project.netlify.app" className="input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Team Size</label>
                <input type="number" min="1" max="20" value={projForm.teamSize} onChange={e => setProjForm(p => ({ ...p, teamSize: +e.target.value }))} className="input" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setProjModal(false)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={saveProject} className="btn-primary flex-1">{editingProjId ? 'Update' : 'Add Project'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
