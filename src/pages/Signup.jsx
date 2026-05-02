import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { signupUser, clearError } from '../redux/slices/authSlice'

// ─── Multi-step form steps ─────────────────────────────────────────────────
const STEPS = [
  { id: 1, title: 'Account Details', subtitle: 'Create your login credentials' },
  { id: 2, title: 'Personal Info', subtitle: 'Tell us about yourself' },
  { id: 3, title: 'Career Goals', subtitle: 'What are you aiming for?' },
]

const INITIAL_FORM = {
  // Step 1
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  // Step 2
  college: '',
  branch: '',
  graduationYear: new Date().getFullYear() + 1,
  cgpa: '',
  // Step 3
  targetRoles: [],
  experience: 'fresher',
}

const ROLES = [
  'Full Stack Developer', 'Frontend Engineer', 'Backend Engineer',
  'Data Scientist', 'ML Engineer', 'DevOps Engineer', 'Mobile Developer',
  'Product Manager', 'Cloud Engineer', 'Security Engineer',
]

export default function Signup() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isLoading, error, isAuthenticated } = useSelector(state => state.auth)

  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard')
    dispatch(clearError())
  }, [isAuthenticated, navigate, dispatch])

  const validateStep = (step) => {
    const e = {}
    if (step === 1) {
      if (!formData.name.trim()) e.name = 'Name is required'
      if (!formData.email) e.email = 'Email is required'
      else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = 'Invalid email'
      if (!formData.password) e.password = 'Password is required'
      else if (formData.password.length < 6) e.password = 'Min 6 characters'
      if (formData.password !== formData.confirmPassword) e.confirmPassword = 'Passwords do not match'
    }
    if (step === 2) {
      if (!formData.college.trim()) e.college = 'College is required'
      if (!formData.branch.trim()) e.branch = 'Branch is required'
    }
    if (step === 3) {
      if (!formData.targetRoles.length) e.targetRoles = 'Select at least one role'
    }
    return e
  }

  const nextStep = () => {
    const e = validateStep(currentStep)
    if (Object.keys(e).length) { setErrors(e); return }
    setErrors({})
    setCurrentStep(s => s + 1)
  }

  const prevStep = () => setCurrentStep(s => s - 1)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const toggleRole = (role) => {
    setFormData(prev => ({
      ...prev,
      targetRoles: prev.targetRoles.includes(role)
        ? prev.targetRoles.filter(r => r !== role)
        : [...prev.targetRoles, role],
    }))
    if (errors.targetRoles) setErrors(prev => ({ ...prev, targetRoles: '' }))
  }

  const handleSubmit = async () => {
    const e = validateStep(3)
    if (Object.keys(e).length) { setErrors(e); return }
    const { confirmPassword, ...submitData } = formData
    const result = await dispatch(signupUser(submitData))
    if (signupUser.fulfilled.match(result)) navigate('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 via-white to-accent-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-brand-500 to-accent-500 rounded-2xl mb-4 shadow-lg">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white">Create Account</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Start your placement prep journey</p>
        </div>

        <div className="card p-8">
          {/* Step indicator */}
          <div className="flex items-center mb-8">
            {STEPS.map((step, idx) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-all ${
                  currentStep >= step.id
                    ? 'bg-brand-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                }`}>
                  {currentStep > step.id ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : step.id}
                </div>
                {idx < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 transition-all ${
                    currentStep > step.id ? 'bg-brand-600' : 'bg-slate-200 dark:bg-slate-700'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Step title */}
          <div className="mb-6">
            <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
              {STEPS[currentStep - 1].title}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {STEPS[currentStep - 1].subtitle}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm px-4 py-3 rounded-xl border border-red-200 dark:border-red-800 mb-4">
              {error}
            </div>
          )}

          {/* ── STEP 1: Account Details ── */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
                <input name="name" value={formData.name} onChange={handleChange} placeholder="Arjun Sharma" className={`input ${errors.name ? 'border-red-400' : ''}`} />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" className={`input ${errors.email ? 'border-red-400' : ''}`} />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Min. 6 characters" className={`input ${errors.password ? 'border-red-400' : ''}`} />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Confirm Password</label>
                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Same as above" className={`input ${errors.confirmPassword ? 'border-red-400' : ''}`} />
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>
          )}

          {/* ── STEP 2: Personal Info ── */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">College/University</label>
                <input name="college" value={formData.college} onChange={handleChange} placeholder="IIT Delhi, NIT Trichy..." className={`input ${errors.college ? 'border-red-400' : ''}`} />
                {errors.college && <p className="text-red-500 text-xs mt-1">{errors.college}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Branch/Department</label>
                <input name="branch" value={formData.branch} onChange={handleChange} placeholder="Computer Science, IT, ECE..." className={`input ${errors.branch ? 'border-red-400' : ''}`} />
                {errors.branch && <p className="text-red-500 text-xs mt-1">{errors.branch}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Graduation Year</label>
                  <select name="graduationYear" value={formData.graduationYear} onChange={handleChange} className="input">
                   {Array.from({ length: 16 }, (_, i) => new Date().getFullYear() - 8 + i).map(y => <option key={y}>{y}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">CGPA (optional)</label>
                  <input name="cgpa" value={formData.cgpa} onChange={handleChange} placeholder="8.5" type="number" min="1" max="10" step="0.1" className="input" />
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 3: Career Goals ── */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                  Target Roles <span className="text-slate-400">(select all that apply)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {ROLES.map(role => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => toggleRole(role)}
                      className={`px-3 py-1.5 rounded-xl text-sm font-medium border transition-all ${
                        formData.targetRoles.includes(role)
                          ? 'bg-brand-600 text-white border-brand-600'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:border-brand-400'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
                {errors.targetRoles && <p className="text-red-500 text-xs mt-2">{errors.targetRoles}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Experience Level</label>
                <select name="experience" value={formData.experience} onChange={handleChange} className="input">
                  <option value="fresher">Fresher (0 years)</option>
                  <option value="intern">Internship experience</option>
                  <option value="1year">1 year</option>
                  <option value="2years">2+ years</option>
                </select>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex gap-3 mt-8">
            {currentStep > 1 && (
              <button onClick={prevStep} className="btn-secondary flex-1">← Back</button>
            )}
            {currentStep < STEPS.length ? (
              <button onClick={nextStep} className="btn-primary flex-1">
                Next →
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={isLoading} className="btn-primary flex-1">
                {isLoading ? 'Creating account...' : 'Create Account'}
              </button>
            )}
          </div>

          <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-600 dark:text-brand-400 font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
