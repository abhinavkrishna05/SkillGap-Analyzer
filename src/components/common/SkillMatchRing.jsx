import { useMemo } from 'react'
import { getMatchScoreColor } from '../../utils/helpers'

/**
 * Circular progress ring showing skill match percentage
 * Uses SVG stroke-dashoffset animation for the ring fill effect
 */
export default function SkillMatchRing({ score = 0, size = 'md' }) {
  const sizes = {
    sm: { dim: 64, radius: 26, stroke: 4, fontSize: '14px' },
    md: { dim: 96, radius: 38, stroke: 6, fontSize: '18px' },
    lg: { dim: 128, radius: 52, stroke: 8, fontSize: '24px' },
  }

  const { dim, radius, stroke, fontSize } = sizes[size]
  const circumference = 2 * Math.PI * radius
  const colors = getMatchScoreColor(score)

  // Calculate stroke offset (higher score = less offset = more filled ring)
  const offset = useMemo(() =>
    circumference - (score / 100) * circumference,
    [score, circumference]
  )

  // Ring color based on score
  const ringColor = score >= 80 ? '#22c55e' : score >= 60 ? '#eab308' : score >= 40 ? '#f97316' : '#ef4444'

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={dim} height={dim} viewBox={`0 0 ${dim} ${dim}`}>
        {/* Background ring */}
        <circle
          cx={dim / 2}
          cy={dim / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-slate-200 dark:text-slate-700"
        />
        {/* Progress ring */}
        <circle
          cx={dim / 2}
          cy={dim / 2}
          r={radius}
          fill="none"
          stroke={ringColor}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${dim / 2} ${dim / 2})`}
          style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
        />
      </svg>
      {/* Score text in center */}
      <span
        className={`absolute font-display font-bold ${colors.text}`}
        style={{ fontSize }}
      >
        {score}%
      </span>
    </div>
  )
}
