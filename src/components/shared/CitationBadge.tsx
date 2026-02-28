interface CitationBadgeProps {
  citation: string
}

/** Light grey superscript citation number/style to match chat design. */
export function CitationBadge({ citation }: CitationBadgeProps) {
  const isNode = citation.startsWith('node:')
  const display = isNode ? citation.replace('node:', '') : citation

  return (
    <sup className="text-gray-400 text-xs font-normal align-super ml-0.5">
      {display.length > 20 ? display.slice(0, 17) + '...' : display}
    </sup>
  )
}
