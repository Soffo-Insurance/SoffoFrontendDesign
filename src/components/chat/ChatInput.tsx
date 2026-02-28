import { useState, useRef, useEffect } from 'react'
import { ArrowUp, X, Globe, Plus } from 'lucide-react'
import { DOC_DRAG_TYPE } from '../../utils/drag'
import type { StoredDocument } from '../../types'
import { AddTabsOrFilesPopover } from '../AddTabsOrFilesPopover'

interface ChatInputProps {
  onSend: (text: string, attachments?: StoredDocument[], includeWebSearch?: boolean) => void
  claimId?: string
}

export function ChatInput({ onSend, claimId }: ChatInputProps) {
  const [input, setInput] = useState('')
  const [attachments, setAttachments] = useState<StoredDocument[]>([])
  const [includeWebSearch, setIncludeWebSearch] = useState(false)
  const [isDropTarget, setIsDropTarget] = useState(false)
  const [addPopoverOpen, setAddPopoverOpen] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const addButtonRef = useRef<HTMLButtonElement>(null)

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

  const fileToDoc = (file: File, index: number): StoredDocument => ({
    doc_id: `doc_${Date.now()}_${index}_${Math.random().toString(36).slice(2)}`,
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
      const fileList = Array.from(files).filter(
        (f) => f.name && (f.name.endsWith('.pdf') || f.name.endsWith('.docx') || f.name.endsWith('.doc'))
      )
      const newDocs = fileList.map((f, i) => fileToDoc(f, i))
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
    <div className="shrink-0 px-4 pt-4 pb-10 bg-transparent flex justify-center">
      <div className="w-full max-w-xl flex flex-col items-center">
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2 justify-start w-full">
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
          className={`w-full flex items-center gap-2 p-2.5 rounded-2xl bg-transparent shadow-input transition-all duration-200 ${
            isDropTarget ? 'shadow-soft-md' : ''
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
        <div className="flex items-center gap-1 shrink-0">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.docx,.doc"
            className="hidden"
            onChange={(e) => {
              const files = e.target.files
              if (files?.length && claimId) {
                const fileList = Array.from(files)
                const newDocs = fileList.map((f, i) => fileToDoc(f, i))
                setAttachments((prev) => [...prev, ...newDocs])
              }
              e.target.value = ''
            }}
          />
          <button
            type="button"
            onClick={() => setIncludeWebSearch((v) => !v)}
            title={includeWebSearch ? 'Web search on' : 'Web search off'}
            className={`flex items-center justify-center gap-1.5 h-7 shrink-0 overflow-hidden transition-[width,background-color,color] duration-200 ${
              includeWebSearch
                ? 'w-[72px] px-2.5 rounded-md bg-gray-100 text-gray-600'
                : 'w-7 rounded-full text-gray-500 hover:bg-gray-100'
            }`}
          >
            <Globe className="w-3.5 h-3.5 shrink-0" />
            {includeWebSearch && <span className="text-[11px] font-semibold whitespace-nowrap">Search</span>}
          </button>
          <div className="relative shrink-0">
            <button
              ref={addButtonRef}
              type="button"
              onClick={() => setAddPopoverOpen((v) => !v)}
              className="flex items-center justify-center h-7 w-7 text-gray-600 hover:text-gray-800 shrink-0"
              title="Add tabs or files"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
            <AddTabsOrFilesPopover
              open={addPopoverOpen}
              onClose={() => setAddPopoverOpen(false)}
              onUploadClick={() => fileInputRef.current?.click()}
              anchorRef={addButtonRef}
              placement="above"
              libraryFiles={attachments.map((d) => ({ id: d.doc_id, name: d.filename }))}
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={!input.trim()}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 shadow-soft-button disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 shrink-0"
            title="Send"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
    </div>
  )
}
