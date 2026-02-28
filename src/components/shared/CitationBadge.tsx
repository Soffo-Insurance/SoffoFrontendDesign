import { useState } from 'react'

interface CitationBadgeProps {
  citation: string
}

export function CitationBadge({ citation }: CitationBadgeProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  const isNode = citation.startsWith('node:')
  const display = isNode ? citation.replace('node:', '') : citation

  return (
    <span className="relative inline-block">
      <sup
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="inline-flex items-center justify-center min-w-[1.25em] h-5 px-1.5 mx-0.5 text-xs font-medium rounded-lg bg-gray-100 text-gray-700 cursor-help align-super shadow-soft"
      >
        [{display.length > 20 ? display.slice(0, 17) + '...' : display}]
      </sup>
      {showTooltip && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2.5 py-1.5 text-xs bg-black text-white rounded-lg shadow-soft-md whitespace-nowrap z-10">
          {citation}
        </span>
      )}
    </span>
  )
}
