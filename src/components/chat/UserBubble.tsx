import { Copy } from 'lucide-react'
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
    <div className="flex gap-3">
      <div className="shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mt-0.5">
        <svg
          className="w-4 h-4 text-gray-500"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      </div>
      <div className="flex-1 min-w-0 max-w-[720px]">
        {attachments && attachments.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
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
        <p className="text-[15px] leading-relaxed text-gray-900 whitespace-pre-wrap">
          {content}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
            Copy
          </button>
          <button
            type="button"
            onClick={onSavePrompt}
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <SavePromptIcon className="w-3.5 h-3.5" />
            Save prompt
          </button>
        </div>
      </div>
    </div>
  )
}
