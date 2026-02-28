import { useState, useEffect } from 'react'
import { ChevronUp } from 'lucide-react'

const WORKING_STEPS = [
  'Assessing query',
  'Planning for analysis',
  'Searching uploaded documents for relevant information',
  'Researching complaint details',
  'Evaluating potential defenses',
  'Examining damage and notice issues',
  'Planning Web Searches',
  'Searching the web for relevant information',
]

interface WorkingProgressProps {
  /** If true, steps appear one by one. If false, all steps show at once. */
  animate?: boolean
}

export function WorkingProgress({ animate = true }: WorkingProgressProps) {
  const [visibleCount, setVisibleCount] = useState(0)
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    if (!animate) {
      setVisibleCount(WORKING_STEPS.length)
      return
    }
    setVisibleCount(0)
    const interval = setInterval(() => {
      setVisibleCount((n) => {
        if (n >= WORKING_STEPS.length) {
          clearInterval(interval)
          return n
        }
        return n + 1
      })
    }, 280)
    return () => clearInterval(interval)
  }, [animate])

  return (
    <div className="flex-1 min-w-0 max-w-[720px]">
      <button
        type="button"
        onClick={() => setCollapsed((c) => !c)}
        className="flex items-center gap-1.5 text-[15px] font-normal text-gray-900 hover:opacity-80 transition-opacity"
      >
        <span className="text-shimmer">Working...</span>
        <ChevronUp
          className={`w-4 h-4 text-gray-400 transition-transform ${collapsed ? 'rotate-180' : ''}`}
          aria-hidden
        />
      </button>
      {!collapsed && (
        <ul className="mt-2 space-y-1.5 pl-0">
          {WORKING_STEPS.slice(0, visibleCount).map((label) => (
            <li key={label} className="text-sm text-gray-900">
              {label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
