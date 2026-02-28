import { useState, useEffect } from 'react'
import { ChevronUp, Check } from 'lucide-react'

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
  /** If true, steps fill in over time. If false, all steps show as completed immediately. */
  animate?: boolean
}

export function WorkingProgress({ animate = true }: WorkingProgressProps) {
  const [completedCount, setCompletedCount] = useState(0)
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    if (!animate) {
      setCompletedCount(WORKING_STEPS.length)
      return
    }
    setCompletedCount(0)
    const interval = setInterval(() => {
      setCompletedCount((n) => {
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
    <div className="flex gap-3">
      <div className="shrink-0 w-8 h-8 rounded bg-gray-700 flex items-center justify-center mt-0.5">
        <span className="text-white font-semibold text-sm">H</span>
      </div>
      <div className="flex-1 min-w-0 max-w-[720px]">
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          className="flex items-center gap-1.5 text-[15px] font-normal text-gray-900 hover:opacity-80 transition-opacity"
        >
          Working...
          <ChevronUp
            className={`w-4 h-4 text-gray-400 transition-transform ${collapsed ? 'rotate-180' : ''}`}
            aria-hidden
          />
        </button>
        {!collapsed && (
          <ul className="mt-2 space-y-1.5 pl-0">
            {WORKING_STEPS.map((label, i) => (
              <li
                key={label}
                className="flex items-center gap-2 text-sm text-gray-900"
              >
                {i < completedCount ? (
                  <Check className="w-4 h-4 shrink-0 text-gray-500" />
                ) : (
                  <span className="w-4 h-4 shrink-0" />
                )}
                <span>{label}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
