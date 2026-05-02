import { useEffect, useState, useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchJobs, fetchGitHubRepos,
  setJobSearch, setCategoryFilter, setCurrentPage, setGithubUsername,
  selectFilteredJobs, selectPaginatedJobs,
} from '../redux/slices/jobsSlice'
import { useDebounce, useToast } from '../hooks/useCustomHooks'
import LoadingSpinner from '../components/common/LoadingSpinner'
import SkillMatchRing from '../components/common/SkillMatchRing'
import { getLanguageStats } from '../utils/helpers'

const JOB_CATEGORIES = ['all', 'Frontend', 'Backend', 'Data Science', 'DevOps', 'Mobile', 'Database', 'Security']

export default function Jobs() {
  const dispatch = useDispatch()
  const toast = useToast()

  const {
    isLoading, error, searchQuery, categoryFilter, currentPage,
    githubUsername, githubRepos, githubLoading, githubError,
  } = useSelector(state => state.jobs)

  const { jobs, totalPages, totalCount } = useSelector(selectPaginatedJobs)
  const userSkills = useSelector(state => state.skills.items)

  const [searchInput, setSearchInput] = useState(searchQuery)
  const [selectedJob, setSelectedJob] = useState(null)
  const [githubInput, setGithubInput] = useState(githubUsername)

  // Debounced search - 400ms delay
  const debouncedSearch = useDebounce(searchInput, 400)

  useEffect(() => {
    dispatch(setJobSearch(debouncedSearch))
  }, [debouncedSearch, dispatch])

  // Fetch jobs on mount
  useEffect(() => {
    dispatch(fetchJobs())
  }, [dispatch])

  const handleGitHubFetch = useCallback(() => {
    if (!githubInput.trim()) { toast.error('Enter a GitHub username'); return }
    dispatch(setGithubUsername(githubInput))
    dispatch(fetchGitHubRepos(githubInput))
      .unwrap()
      .then(() => toast.success('GitHub repos loaded!'))
      .catch(err => toast.error(err || 'GitHub fetch failed'))
  }, [githubInput, dispatch, toast])

  const langStats = useMemo(() => getLanguageStats(githubRepos), [githubRepos])

  if (isLoading && !jobs.length) return <LoadingSpinner message="Loading job roles..." />

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">Job Role Explorer</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">{totalCount} roles · See your match score for each</p>
        </div>
        {/* GitHub integration */}
        <div className="flex gap-2">
          <input
            placeholder="GitHub username"
            value={githubInput}
            onChange={e => setGithubInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleGitHubFetch()}
            className="input !w-48 text-sm"
          />
          <button onClick={handleGitHubFetch} disabled={githubLoading} className="btn-secondary text-sm whitespace-nowrap">
            {githubLoading ? '⏳' : '⚡'} GitHub
          </button>
        </div>
      </div>

      {/* GitHub repos panel */}
      {githubRepos.length > 0 && (
        <div className="card p-5">
          <h3 className="font-display font-semibold text-slate-900 dark:text-white text-sm mb-3">
            📦 GitHub: {githubUsername} · {githubRepos.length} repos
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Language breakdown */}
            <div>
              <p className="text-xs text-slate-500 mb-2 font-medium">Top Languages Used</p>
              <div className="flex flex-wrap gap-2">
                {langStats.slice(0, 6).map(({ lang, count }) => (
                  <span key={lang} className="skill-tag text-xs">
                    {lang} <span className="opacity-60">×{count}</span>
                  </span>
                ))}
              </div>
            </div>
            {/* Recent repos */}
            <div>
              <p className="text-xs text-slate-500 mb-2 font-medium">Recent Repos</p>
              <div className="space-y-1">
                {githubRepos.slice(0, 4).map(repo => (
                  <a key={repo.id} href={repo.html_url} target="_blank" rel="noreferrer"
                    className="flex items-center gap-2 text-xs text-brand-600 dark:text-brand-400 hover:underline">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-400 flex-shrink-0" />
                    {repo.name}
                    {repo.language && <span className="text-slate-400">· {repo.language}</span>}
                    ⭐{repo.stargazers_count}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {githubError && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm px-4 py-3 rounded-xl">
          {githubError}
        </div>
      )}

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            placeholder="Search roles, companies, skills..."
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            className="input pl-9"
          />
          {searchInput && (
            <button onClick={() => { setSearchInput(''); dispatch(setJobSearch('')) }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <div className="flex gap-2 flex-wrap">
          {JOB_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => dispatch(setCategoryFilter(cat))}
              className={`px-3 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
                categoryFilter === cat ? 'bg-brand-600 text-white' : 'btn-secondary py-2 text-sm'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="card p-8 text-center">
          <p className="text-red-500 font-medium">{error}</p>
          <button onClick={() => dispatch(fetchJobs())} className="btn-primary mt-3">Try again</button>
        </div>
      )}

      {/* Jobs grid */}
      {!error && (
        <>
          {jobs.length === 0 ? (
            <div className="card p-12 text-center">
              <p className="text-4xl mb-3">🔍</p>
              <p className="font-medium text-slate-600 dark:text-slate-400">No jobs match your search</p>
              <button onClick={() => { setSearchInput(''); dispatch(setJobSearch('')); dispatch(setCategoryFilter('all')) }}
                className="btn-primary mt-4">Clear filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {jobs.map(job => (
                <JobCard
                  key={job.id}
                  job={job}
                  userSkills={userSkills}
                  onClick={() => setSelectedJob(selectedJob?.id === job.id ? null : job)}
                  isExpanded={selectedJob?.id === job.id}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => dispatch(setCurrentPage(currentPage - 1))}
                disabled={currentPage === 1}
                className="btn-secondary px-3 py-2 text-sm disabled:opacity-40"
              >
                ← Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => dispatch(setCurrentPage(page))}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                    page === currentPage
                      ? 'bg-brand-600 text-white'
                      : 'btn-secondary w-9 h-9 text-sm p-0'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => dispatch(setCurrentPage(currentPage + 1))}
                disabled={currentPage === totalPages}
                className="btn-secondary px-3 py-2 text-sm disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

// ─── Job Card ──────────────────────────────────────────────────────────────
function JobCard({ job, userSkills, onClick, isExpanded }) {
  const userSkillNames = new Set(userSkills.map(s => s.name.toLowerCase()))

  const matchedSkills = job.requiredSkills.filter(s => userSkillNames.has(s.toLowerCase()))
  const missingSkills = job.requiredSkills.filter(s => !userSkillNames.has(s.toLowerCase()))

  const score = job.matchScore ?? 0

  return (
    <div
      className={`card p-5 cursor-pointer hover:shadow-md transition-all duration-200 ${isExpanded ? 'ring-2 ring-brand-500' : ''}`}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <span className="text-3xl">{job.logo}</span>
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-bold text-slate-900 dark:text-white text-sm leading-tight">{job.title}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{job.company} · {job.location}</p>
          <p className="text-xs font-semibold text-brand-600 dark:text-brand-400 mt-1">{job.package}</p>
        </div>
        <SkillMatchRing score={score} size="sm" />
      </div>

      {/* Required skills preview */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {job.requiredSkills.slice(0, 4).map(skill => {
          const matched = userSkillNames.has(skill.toLowerCase())
          return (
            <span key={skill} className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              matched
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
            }`}>
              {matched ? '✓ ' : ''}{skill}
            </span>
          )
        })}
        {job.requiredSkills.length > 4 && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-400">
            +{job.requiredSkills.length - 4}
          </span>
        )}
      </div>

      {/* Match summary */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-green-600 dark:text-green-400 font-medium">
          {matchedSkills.length}/{job.requiredSkills.length} skills matched
        </span>
        <span className="text-slate-400">{job.type}</span>
      </div>

      {/* Expanded details */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 space-y-3" onClick={e => e.stopPropagation()}>
          <p className="text-xs text-slate-600 dark:text-slate-300">{job.description}</p>

          {missingSkills.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-red-600 dark:text-red-400 mb-1.5">Skills you need:</p>
              <div className="flex flex-wrap gap-1.5">
                {missingSkills.map(s => (
                  <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {job.niceToHave.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-1.5">Nice to have:</p>
              <div className="flex flex-wrap gap-1.5">
                {job.niceToHave.map(s => (
                  <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <span className="text-xs text-slate-400">Experience: {job.experience}</span>
            <span className="text-slate-300 dark:text-slate-600">·</span>
            <span className="text-xs text-slate-400">Apply by {job.applicationDeadline}</span>
          </div>
        </div>
      )}
    </div>
  )
}
