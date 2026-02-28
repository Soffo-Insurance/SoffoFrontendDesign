import { useState, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import { Copy, Download, FileEdit, Globe, ThumbsUp, ThumbsDown } from 'lucide-react'

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
import type { QueryResponseMessage } from '../../types'

interface AssistantBubbleProps {
  message: QueryResponseMessage
  followUps?: string[]
  onFollowUpClick?: (text: string) => void
}

function sourceEntriesFromCitations(citations: string[]): SourceEntry[] {
  return citations.map((name) => ({
    name,
    title: name,
    description: 'Source content and context for this citation.',
  }))
}

function renderInlineWithCitations(
  text: string,
  citations: string[],
  onCitationClick: (index: number, el: HTMLElement) => void
) {
  const parts = text.split(/(\[[^\]]+\])/g)
  return parts.map((part, i) => {
    if (part.startsWith('[') && part.endsWith(']')) {
      const cite = part.slice(1, -1)
      const index = citations.indexOf(cite)
      const idx = index >= 0 ? index : 0
      return (
        <sup key={i} className="align-super ml-0.5">
          <button
            type="button"
            onClick={(e) => onCitationClick(idx, e.currentTarget)}
            className="text-gray-400 text-xs font-normal hover:text-gray-600 cursor-pointer underline decoration-dotted"
          >
            {cite}
          </button>
        </sup>
      )
    }
    return (
      <span
        key={i}
        dangerouslySetInnerHTML={{
          __html: part.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>'),
        }}
      />
    )
  })
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
  const citedCount = message.citations?.length ?? message.chunksUsed ?? 16
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

  return (
    <div className="flex gap-3">
      <div className="shrink-0 w-8 h-8 rounded bg-gray-700 flex items-center justify-center mt-0.5">
        <span className="text-white font-semibold text-sm">H</span>
      </div>
      <div className="flex-1 min-w-0 max-w-[720px]">
        <div className="text-[15px] leading-relaxed text-gray-900">
          {hasCitations ? (
            <div className="space-y-3">
              {message.content.split(/\n\n+/).map((para, i) => (
                <p key={i} className="leading-relaxed">
                  {renderInlineWithCitations(para, citations, handleCitationClick)}
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

        <div className="mt-6">
          <p className="text-sm font-medium text-gray-500 mb-2">Sources</p>
          <button
            type="button"
            className="flex flex-col items-start gap-0.5 px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-100 hover:bg-gray-50 transition-colors text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]"
          >
            <span className="flex items-center gap-2 text-sm font-medium text-gray-900">
              <Globe className="w-4 h-4 text-gray-600" />
              Web search and files
            </span>
            <span className="text-xs text-gray-500 pl-6">{citedCount} cited</span>
          </button>
        </div>

        <div className="flex items-center justify-between gap-2 mt-3 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              Copy
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Export
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <RewriteIcon className="w-3.5 h-3.5" />
              Rewrite
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <FileEdit className="w-3.5 h-3.5" />
              Open in editor
            </button>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Good response"
            >
              <ThumbsUp className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Bad response"
            >
              <ThumbsDown className="w-4 h-4" />
            </button>
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
    </div>
  )
}
