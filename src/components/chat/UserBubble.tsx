import { FileText } from 'lucide-react'
import type { StoredDocument } from '../../types'

interface UserBubbleProps {
  content: string
  attachments?: StoredDocument[]
}

export function UserBubble({ content, attachments }: UserBubbleProps) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[85%] rounded-md bg-black text-white px-3 py-2">
        {attachments && attachments.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2 pb-2 border-b border-white/20">
            {attachments.map((doc) => (
              <span
                key={doc.doc_id}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-white/10 rounded"
              >
                <FileText className="w-3 h-3 shrink-0" />
                {doc.filename}
              </span>
            ))}
          </div>
        )}
        <p className="text-sm whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  )
}
