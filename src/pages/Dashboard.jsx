import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell,
} from 'recharts'
import { fetchJobs } from '../redux/slices/jobsSlice'
import { selectAverageSkillScore, selectSkillsByCategory } from '../redux/slices/skillsSlice'
import { generateRecommendations } from '../utils/helpers'
import LoadingSpinner from '../components/common/LoadingSpinner'
import SkillMatchRing from '../components/common/SkillMatchRing'

const COLORS = ['#0ea5e9', '#d946ef', '#22c55e', '#f97316', '#eab308', '#8b5cf6', '#ef4444']

export default function Dashboard() {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const skills = useSelector(state => state.skills.items)
  const jobs = useSelector(state => state.jobs.items)
  const goals = useSelector(state => state.goals.items)
  const jobsLoading = useSelector(state => state.jobs.isLoading)
  const avgScore = useSelector(selectAverageSkillScore)
  const skillsByCategory = useSelector(selectSkillsByCategory)

  // Fetch jobs on mount so match scores are calculated
  useEffect(() => {
    if (!jobs.length) dispatch(fetchJobs())
  }, [dispatch, jobs.length])

  // Top matching jobs
  const topJobs = useMemo(() =>
    [...jobs].sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0)).slice(0, 5),
    [jobs]
  )

  // Skill recommendations based on gaps
  const recommendations = useMemo(() =>
    generateRecommendations(skills, jobs.slice(0, 8)),
    [skills, jobs]
  )

  // Radar chart data - skill categories
  const radarData = useMemo(() =>
    Object.entries(skillsByCategory).map(([cat, catSkills]) => ({
      subject: cat,
      score: Math.round(catSkills.reduce((s, sk) => s + sk.proficiency, 0) / catSkills.length),
    })),
    [skillsByCategory]
  )

  // Bar chart - top skills by proficiency
  const topSkillsData = useMemo(() =>
    [...skills]
      .sort((a, b) => b.proficiency - a.proficiency)
      .slice(0, 8)
      .map(s => ({ name: s.name.split('.')[0], score: s.proficiency })),
    [skills]
  )

  // Goals pie chart
  const goalsStats = useMemo(() => {
    const completed = goals.filter(g => g.status === 'Completed').length
    const inProgress = goals.filter(g => g.status === 'In Progress').length
    const notStarted = goals.filter(g => g.status === 'Not Started').length
    return [
      { name: 'Completed', value: completed },
      { name: 'In Progress', value: inProgress },
      { name: 'Not Started', value: notStarted },
    ].filter(d => d.value > 0)
  }, [goals])

  const GOAL_COLORS = ['#22c55e', '#0ea5e9', '#94a3b8']

  if (jobsLoading && !jobs.length) return <LoadingSpinner message="Loading your dashboard..." />

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome banner */}
      <div className="card p-6 bg-gradient-to-r from-brand-600 to-accent-600 border-0 text-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold mb-1">
              Welcome back, {user?.name?.split(' ')[0]}! 👋
            </h2>
            <p className="text-brand-100 text-sm">
              {user?.college} · {user?.branch} · Class of {user?.graduationYear}
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {user?.targetRoles?.slice(0, 2).map(role => (
                <span key={role} className="px-3 py-1 bg-white/20 text-white text-xs rounded-full font-medium">
                  {role}
                </span>
              ))}
            </div>
          </div>
          <div className="hidden sm:block">
            <SkillMatchRing score={avgScore} size="md" />
            <p className="text-xs text-brand-200 text-center mt-1">Avg. Score</p>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Skills Added', value: skills.length, icon: '🧠', color: 'brand' },
          {
            label: 'Best Job Match',
            value: topJobs[0] ? `${topJobs[0].matchScore}%` : 'N/A',
            icon: '💼',
            color: 'green',
          },
          {
            label: 'Goals Active',
            value: goals.filter(g => g.status !== 'Completed').length,
            icon: '🎯',
            color: 'orange',
          },
          {
            label: 'Skills to Learn',
            value: recommendations.length,
            icon: '📚',
            color: 'purple',
          },
        ].map((stat) => (
          <div key={stat.label} className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{stat.label}</p>
              <span className="text-xl">{stat.icon}</span>
            </div>
            <p className="font-display text-2xl font-bold text-slate-900 dark:text-white">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar chart */}
        <div className="card p-5">
          <h3 className="font-display font-bold text-slate-900 dark:text-white mb-4">
            Skill Coverage by Category
          </h3>
          {radarData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#64748b' }} />
                <Radar name="Score" dataKey="score" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.2} />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-60 flex items-center justify-center text-slate-400">
              Add skills to see coverage
            </div>
          )}
        </div>

        {/* Bar chart - top skills */}
        <div className="card p-5">
          <h3 className="font-display font-bold text-slate-900 dark:text-white mb-4">
            Top Skills Proficiency
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={topSkillsData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: 12 }}
                formatter={(val) => [`${val}%`, 'Proficiency']}
              />
              <Bar dataKey="score" fill="#0ea5e9" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top job matches */}
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-slate-900 dark:text-white">Top Job Matches</h3>
            <Link to="/jobs" className="text-xs text-brand-600 dark:text-brand-400 hover:underline font-medium">
              View all →
            </Link>
          </div>
          {topJobs.length > 0 ? (
            <div className="space-y-3">
              {topJobs.map(job => (
                <div key={job.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <span className="text-2xl">{job.logo}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 dark:text-white text-sm truncate">{job.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{job.company} · {job.package}</p>
                  </div>
                  <div className={`text-sm font-bold px-2.5 py-0.5 rounded-full ${
                    job.matchScore >= 80 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                    job.matchScore >= 60 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                    'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                  }`}>
                    {job.matchScore}%
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-sm">Loading job matches...</p>
          )}
        </div>

        {/* Goals status + Recommendations */}
        <div className="space-y-4">
          {/* Goals pie */}
          <div className="card p-5">
            <h3 className="font-display font-bold text-slate-900 dark:text-white mb-3 text-sm">Goals Overview</h3>
            {goalsStats.length > 0 ? (
              <div className="flex items-center gap-4">
                <ResponsiveContainer width={80} height={80}>
                  <PieChart>
                    <Pie data={goalsStats} cx="50%" cy="50%" innerRadius={25} outerRadius={38} dataKey="value">
                      {goalsStats.map((_, i) => <Cell key={i} fill={GOAL_COLORS[i]} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-1.5">
                  {goalsStats.map((stat, i) => (
                    <div key={stat.name} className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: GOAL_COLORS[i] }} />
                      <span className="text-xs text-slate-600 dark:text-slate-400">{stat.name}: {stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-slate-500 text-xs">No goals yet</p>
            )}
          </div>

          {/* Top skill recommendations */}
          <div className="card p-5">
            <h3 className="font-display font-bold text-slate-900 dark:text-white mb-3 text-sm">Skills to Learn</h3>
            <div className="space-y-2">
              {recommendations.slice(0, 5).map(rec => (
                <div key={rec.skill} className="flex items-center justify-between gap-2">
                  <span className="text-xs text-slate-700 dark:text-slate-300 truncate">{rec.skill}</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${
                    rec.priority === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                    rec.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                    'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                  }`}>
                    {rec.priority}
                  </span>
                </div>
              ))}
              {recommendations.length === 0 && (
                <p className="text-xs text-slate-500">Add more skills to get recommendations!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
