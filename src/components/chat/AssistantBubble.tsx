import { useState, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import { Copy, Download, FileEdit, FileText, Globe, ThumbsUp, ThumbsDown } from 'lucide-react'

function RewriteIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  )
}

import { SourcePopover, type SourceEntry } from '../SourcePopover'
import { Tooltip } from '../shared/Tooltip'
import type { QueryResponseMessage } from '../../types'

interface AssistantBubbleProps {
  message: QueryResponseMessage
  followUps?: string[]
  onFollowUpClick?: (text: string) => void
}

function sourceEntriesFromCitations(citations: string[]): SourceEntry[] {
  return citations.map((name) => ({
    name,
    title: citationToDisplayDomain(name),
    description: 'Source content and context for this citation.',
  }))
}

/** Map citation id to a short domain-style label for the pill */
function citationToDisplayDomain(citation: string): string {
  if (citation.startsWith('node:')) {
    if (citation.includes('StormEvent') || citation.includes('NCEI')) return 'ncei.noaa.gov'
    if (citation.includes('PDSI') || citation.includes('Drought')) return 'drought.gov'
    if (citation.includes('FloodHazard') || citation.includes('FEMA')) return 'msc.fema.gov'
    if (citation.includes('Claim')) return 'claim file'
    return 'data source'
  }
  if (citation.includes('doc_') && citation.includes('chunk')) {
    if (citation.includes('doc_001')) return 'policy_dec_sheet.pdf'
    if (citation.includes('doc_002')) return 'inspection_report.pdf'
    return citation
  }
  return citation
}

function SourcePill({
  domain,
  citationIndex,
  onClick,
}: {
  domain: string
  citationIndex: number
  onClick: (index: number, el: HTMLElement) => void
}) {
  const isDoc = domain.endsWith('.pdf') || domain.endsWith('.doc') || domain.endsWith('.docx')
  return (
    <button
      type="button"
      onClick={(e) => onClick(citationIndex, e.currentTarget)}
      className="inline-flex items-center gap-1.5 rounded-full bg-gray-200 px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-300 transition-colors ml-1.5 align-middle"
    >
      {isDoc ? (
        <FileText className="w-3 h-3 shrink-0 text-gray-600" aria-hidden />
      ) : (
        <Globe className="w-3 h-3 shrink-0 text-gray-600" aria-hidden />
      )}
      <span className="truncate max-w-[180px]">{domain}</span>
    </button>
  )
}

/** Render paragraph text with bold, no [citation] markers (used when source is shown as pill at end) */
function renderParagraphText(text: string) {
  const withoutRefs = text.replace(/\s*\[[^\]]+\]\s*/g, ' ').trim()
  return (
    <span
      dangerouslySetInnerHTML={{
        __html: withoutRefs.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>'),
      }}
    />
  )
}

const DEFAULT_FOLLOW_UPS = [
  'What are the key allegations in the complaint?',
  'Summarize the strongest evidence against the plaintiff.',
  'What defenses are most likely to succeed?',
  'How does the notice period affect this case?',
]

function extractCitationLabels(content: string): string[] {
  const matches = content.matchAll(/\[([^\]]+)\]/g)
  const seen = new Set<string>()
  const list: string[] = []
  for (const m of matches) {
    const label = m[1]
    if (!seen.has(label)) {
      seen.add(label)
      list.push(label)
    }
  }
  return list
}

export function AssistantBubble({ message, followUps = DEFAULT_FOLLOW_UPS, onFollowUpClick }: AssistantBubbleProps) {
  const hasCitations = message.content.includes('[')
  const citations =
    message.citations && message.citations.length > 0
      ? message.citations
      : extractCitationLabels(message.content)
  const sources = sourceEntriesFromCitations(citations)
  const [sourcePopoverOpen, setSourcePopoverOpen] = useState(false)
  const [sourcePopoverIndex, setSourcePopoverIndex] = useState(0)
  const sourceAnchorRef = useRef<HTMLElement | null>(null)

  const handleCitationClick = (index: number, el: HTMLElement) => {
    sourceAnchorRef.current = el
    setSourcePopoverIndex(index)
    setSourcePopoverOpen(true)
  }

  const handleCopy = () => {
    void navigator.clipboard.writeText(message.content)
  }

  const paragraphs = message.content.split(/\n\n+/)

  return (
    <div className="flex-1 min-w-0 max-w-[720px]">
        <div className="text-[15px] leading-relaxed text-gray-900">
          {hasCitations && citations.length > 0 ? (
            <div className="space-y-4">
              {paragraphs.map((para, i) => {
                const citation = citations[i]
                const hasSourcePill = citation != null
                return (
                  <p key={i} className="leading-relaxed">
                    {renderParagraphText(para)}
                    {hasSourcePill && (
                      <SourcePill
                        domain={citationToDisplayDomain(citation)}
                        citationIndex={i}
                        onClick={handleCitationClick}
                      />
                    )}
                  </p>
                )
              })}
            </div>
          ) : hasCitations ? (
            <div className="space-y-3">
              {paragraphs.map((para, i) => (
                <p key={i} className="leading-relaxed">
                  {renderParagraphText(para)}
                </p>
              ))}
            </div>
          ) : (
            <ReactMarkdown
              className="space-y-3 [&>p]:leading-relaxed [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-1 [&_strong]:font-semibold"
              components={{
                p: ({ children }) => <p className="leading-relaxed">{children}</p>,
                ul: ({ children }) => <ul className="list-disc pl-5 space-y-1 my-3">{children}</ul>,
                li: ({ children }) => <li className="leading-relaxed">{children}</li>,
              }}
            >
              {message.content}
            </ReactMarkdown>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 mt-3 flex-wrap">
          <div className="flex items-center gap-1">
            <Tooltip label="Copy">
              <button
                type="button"
                onClick={handleCopy}
                className="p-1.5 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                aria-label="Copy"
              >
                <Copy className="w-4 h-4" />
              </button>
            </Tooltip>
            <Tooltip label="Export">
              <button
                type="button"
                className="p-1.5 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                aria-label="Export"
              >
                <Download className="w-4 h-4" />
              </button>
            </Tooltip>
            <Tooltip label="Rewrite">
              <button
                type="button"
                className="p-1.5 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                aria-label="Rewrite"
              >
                <RewriteIcon className="w-4 h-4" />
              </button>
            </Tooltip>
            <Tooltip label="Open in editor">
              <button
                type="button"
                className="p-1.5 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                aria-label="Open in editor"
              >
                <FileEdit className="w-4 h-4" />
              </button>
            </Tooltip>
          </div>
          <div className="flex items-center gap-1">
            <Tooltip label="Good response">
              <button
                type="button"
                className="p-1 text-gray-500 hover:text-gray-700 transition-colors rounded-md hover:bg-gray-100"
                aria-label="Good response"
              >
                <ThumbsUp className="w-4 h-4" />
              </button>
            </Tooltip>
            <Tooltip label="Bad response">
              <button
                type="button"
                className="p-1 text-gray-500 hover:text-gray-700 transition-colors rounded-md hover:bg-gray-100"
                aria-label="Bad response"
              >
                <ThumbsDown className="w-4 h-4" />
              </button>
            </Tooltip>
          </div>
        </div>

        {sources.length > 0 && (
          <SourcePopover
            open={sourcePopoverOpen}
            onClose={() => setSourcePopoverOpen(false)}
            anchorRef={sourceAnchorRef}
            sources={sources}
            initialIndex={sourcePopoverIndex}
          />
        )}
        {followUps.length > 0 && (
          <div className="mt-8">
            <h3 className="text-[15px] font-semibold text-gray-900 mb-3">Follow-ups</h3>
            <ul className="border-t border-gray-200">
              {followUps.map((prompt, i) => (
                <li
                  key={i}
                  className="border-t border-gray-200 first:border-t-0"
                >
                  <button
                    type="button"
                    onClick={() => onFollowUpClick?.(prompt)}
                    className="w-full py-2 text-left text-sm text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {prompt}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
    </div>
  )
}
