import { useState, useRef, useEffect } from 'react'
import { Send, X, Globe } from 'lucide-react'
import { SUGGESTED_PROMPTS } from '../../mockData'
import { DOC_DRAG_TYPE } from '../../utils/drag'
import type { StoredDocument } from '../../types'

interface ChatInputProps {
  onSend: (text: string, attachments?: StoredDocument[], includeWebSearch?: boolean) => void
  showSuggestions?: boolean
}

export function ChatInput({ onSend, showSuggestions = true }: ChatInputProps) {
  const [input, setInput] = useState('')
  const [attachments, setAttachments] = useState<StoredDocument[]>([])
  const [includeWebSearch, setIncludeWebSearch] = useState(false)
  const [isDropTarget, setIsDropTarget] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const ta = textareaRef.current
    if (ta) {
      ta.style.height = 'auto'
      ta.style.height = `${Math.min(ta.scrollHeight, 200)}px`
    }
  }, [input])

  const handleSubmit = () => {
    const trimmed = input.trim()
    if (!trimmed) return
    onSend(trimmed, attachments.length > 0 ? attachments : undefined, includeWebSearch)
    setInput('')
    setAttachments([])
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const removeAttachment = (docId: string) => {
    setAttachments((prev) => prev.filter((d) => d.doc_id !== docId))
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDropTarget(false)
    const raw = e.dataTransfer.getData(DOC_DRAG_TYPE)
    if (!raw) return
    try {
      const doc = JSON.parse(raw) as StoredDocument
      setAttachments((prev) => {
        if (prev.some((d) => d.doc_id === doc.doc_id)) return prev
        return [...prev, doc]
      })
    } catch {
      // ignore invalid drop data
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (e.dataTransfer.types.includes(DOC_DRAG_TYPE)) {
      e.dataTransfer.dropEffect = 'copy'
      setIsDropTarget(true)
    }
  }

  const handleDragLeave = () => setIsDropTarget(false)

  return (
    <div className="shrink-0 border-t border-gray-200 px-4 py-3">
      {showSuggestions && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {SUGGESTED_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => onSend(prompt)}
              className="px-2 py-1 text-xs border border-gray-200 text-gray-600 hover:bg-gray-50"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {attachments.map((doc) => (
            <span
              key={doc.doc_id}
              className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 border border-gray-200 text-gray-800"
            >
              {doc.filename}
              <button
                type="button"
                onClick={() => removeAttachment(doc.doc_id)}
                className="p-0.5 hover:bg-gray-200 rounded"
                aria-label="Remove"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`flex items-end gap-2 border p-2 transition-colors ${
          isDropTarget ? 'border-black bg-gray-50' : 'border-gray-200'
        }`}
      >
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isDropTarget ? 'Drop document here' : 'Ask about causation, coverage... or drag a doc here'}
          rows={1}
          className="flex-1 resize-none bg-transparent px-2 py-1.5 text-sm outline-none placeholder:text-gray-400 min-h-[36px] max-h-[200px]"
        />
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => setIncludeWebSearch((v) => !v)}
            title={includeWebSearch ? 'Web search on' : 'Include web search'}
            className={`p-1.5 border ${includeWebSearch ? 'bg-black text-white border-black' : 'border-gray-200 hover:bg-gray-50'}`}
          >
            <Globe className="w-4 h-4" />
          </button>
          <button
            onClick={handleSubmit}
            disabled={!input.trim()}
            className="p-1.5 bg-black text-white hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
