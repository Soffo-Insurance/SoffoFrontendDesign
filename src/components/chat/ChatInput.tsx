import { useState, useRef, useEffect } from 'react'
import { ArrowUp, X, Globe, Plus, ChevronDown } from 'lucide-react'
import { SUGGESTED_PROMPTS } from '../../mockData'
import { DOC_DRAG_TYPE } from '../../utils/drag'
import type { StoredDocument } from '../../types'

interface ChatInputProps {
  onSend: (text: string, attachments?: StoredDocument[], includeWebSearch?: boolean) => void
  showSuggestions?: boolean
  claimId?: string
}

export function ChatInput({ onSend, showSuggestions = true, claimId }: ChatInputProps) {
  const [input, setInput] = useState('')
  const [attachments, setAttachments] = useState<StoredDocument[]>([])
  const [includeWebSearch, setIncludeWebSearch] = useState(false)
  const [webSearchExpanded, setWebSearchExpanded] = useState(false)
  const [webSearchQuery, setWebSearchQuery] = useState('')
  const [isDropTarget, setIsDropTarget] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const ta = textareaRef.current
    if (ta) {
      ta.style.height = 'auto'
      ta.style.height = `${Math.min(ta.scrollHeight, 200)}px`
    }
  }, [input])

  const handleSubmit = (forceWebSearch?: boolean) => {
    const trimmed = input.trim()
    if (!trimmed) return
    const useWebSearch = forceWebSearch ?? includeWebSearch
    onSend(trimmed, attachments.length > 0 ? attachments : undefined, useWebSearch)
    setInput('')
    setAttachments([])
  }

  const handleWebSearchSubmit = () => {
    const q = webSearchQuery.trim()
    if (q) {
      onSend(q, attachments.length > 0 ? attachments : undefined, true)
      setWebSearchQuery('')
      setWebSearchExpanded(false)
      setAttachments([])
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(includeWebSearch)
    }
  }

  const removeAttachment = (docId: string) => {
    setAttachments((prev) => prev.filter((d) => d.doc_id !== docId))
  }

  const fileToDoc = (file: File): StoredDocument => ({
    doc_id: `doc_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    filename: file.name,
    doc_type: 'policy',
    status: 'Ready',
    created_at: new Date().toISOString(),
    claim_id: claimId ?? '',
  })

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDropTarget(false)
    const files = e.dataTransfer.files
    if (files?.length) {
      const newDocs = Array.from(files)
        .filter((f) => f.name && (f.name.endsWith('.pdf') || f.name.endsWith('.docx') || f.name.endsWith('.doc')))
        .map(fileToDoc)
      if (newDocs.length) setAttachments((prev) => [...prev, ...newDocs])
      return
    }
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
    if (e.dataTransfer.types.includes(DOC_DRAG_TYPE) || e.dataTransfer.types.includes('Files')) {
      e.dataTransfer.dropEffect = 'copy'
      setIsDropTarget(true)
    }
  }

  const handleDragLeave = () => setIsDropTarget(false)

  return (
    <div className="shrink-0 border-t border-gray-100 px-4 py-3 bg-white">
      {showSuggestions && (
        <div className="flex flex-wrap gap-2 mb-2">
          {SUGGESTED_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => onSend(prompt)}
              className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 text-gray-600 bg-white hover:bg-gray-50 hover:border-gray-300 shadow-soft transition-all duration-150"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {attachments.map((doc) => (
            <span
              key={doc.doc_id}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs bg-gray-50 border border-gray-200 text-gray-800 rounded-lg shadow-soft"
            >
              {doc.filename}
              <button
                type="button"
                onClick={() => removeAttachment(doc.doc_id)}
                className="p-0.5 hover:bg-gray-200 rounded-md transition-colors"
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
        className={`flex items-end gap-2 p-2.5 rounded-xl transition-all duration-200 ${
          isDropTarget
            ? 'border-2 border-black bg-gray-50 shadow-soft-md'
            : 'border border-gray-200 bg-white shadow-soft'
        }`}
      >
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isDropTarget ? 'Drop document here' : 'Ask about causation, coverage... or drag a doc here'}
          rows={1}
          className="flex-1 resize-none bg-transparent px-2 py-1.5 text-sm outline-none placeholder:text-gray-400 min-h-[36px] max-h-[200px] rounded-lg"
        />
        <div className="flex items-center gap-1.5 shrink-0">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.docx,.doc"
            className="hidden"
            onChange={(e) => {
              const files = e.target.files
              if (files?.length && claimId) {
                const newDocs = Array.from(files).map(fileToDoc)
                setAttachments((prev) => [...prev, ...newDocs])
              }
              e.target.value = ''
            }}
          />
          {webSearchExpanded ? (
            <div className="flex items-center gap-2 min-w-0 max-w-[240px] bg-gray-50 rounded-full px-3 py-1.5 border border-gray-200">
              <Globe className="w-4 h-4 text-gray-500 shrink-0" />
              <input
                type="text"
                value={webSearchQuery}
                onChange={(e) => setWebSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleWebSearchSubmit()}
                placeholder="Search the web"
                className="flex-1 min-w-0 bg-transparent text-sm outline-none placeholder:text-gray-400"
              />
              <button
                type="button"
                onClick={handleWebSearchSubmit}
                disabled={!webSearchQuery.trim()}
                className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 disabled:opacity-50 shrink-0"
              >
                <Globe className="w-3 h-3" />
                Search
              </button>
              <button
                type="button"
                onClick={() => { setWebSearchExpanded(false); setWebSearchQuery('') }}
                className="p-1 text-gray-400 hover:text-gray-600 shrink-0"
                aria-label="Collapse"
              >
                <ChevronDown className="w-4 h-4 rotate-180" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setWebSearchExpanded(true)}
              className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50 shrink-0"
              title="Search the web"
            >
              <Globe className="w-4 h-4 text-gray-600" />
            </button>
          )}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50 shrink-0"
            title="Add files"
          >
            <Plus className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={() => handleSubmit(includeWebSearch)}
            disabled={!input.trim()}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 shadow-soft-button disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 shrink-0"
            title="Send"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
