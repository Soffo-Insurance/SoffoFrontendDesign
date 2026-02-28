import { Copy } from 'lucide-react'
import { Tooltip } from '../shared/Tooltip'
import type { StoredDocument } from '../../types'

function SavePromptIcon({ className }: { className?: string }) {
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
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M7 7v10" />
      <path d="M11 7v10" />
      <path d="m15 7 2 10" />
    </svg>
  )
}

interface UserBubbleProps {
  content: string
  attachments?: StoredDocument[]
  onCopy?: () => void
  onSavePrompt?: () => void
}

export function UserBubble({
  content,
  attachments,
  onCopy,
  onSavePrompt,
}: UserBubbleProps) {
  const handleCopy = () => {
    if (onCopy) onCopy()
    else void navigator.clipboard.writeText(content)
  }

  return (
    <div className="flex-1 min-w-0 max-w-[720px]">
      <div className="rounded-xl bg-gray-100 px-3 py-2 w-fit max-w-full">
        {attachments && attachments.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-1.5">
            {attachments.map((doc) => (
              <span
                key={doc.doc_id}
                className="inline-flex items-center text-xs text-gray-500"
              >
                {doc.filename}
              </span>
            ))}
          </div>
        )}
        <p className="text-[15px] leading-snug text-gray-900 whitespace-pre-wrap">
          {content}
        </p>
      </div>
      <div className="flex items-center gap-1 mt-2">
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
        <Tooltip label="Save prompt">
          <button
            type="button"
            onClick={onSavePrompt}
            className="p-1.5 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Save prompt"
          >
            <SavePromptIcon className="w-4 h-4" />
          </button>
        </Tooltip>
      </div>
    </div>
  )
}
