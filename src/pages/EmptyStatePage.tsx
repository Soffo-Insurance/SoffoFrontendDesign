import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plus, Mic, ArrowUp, Globe, ChevronDown, X, FileText } from 'lucide-react'
import { MOCK_CLAIMS } from '../mockData'

export function EmptyStatePage() {
  const [input, setInput] = useState('')
  const [attachments, setAttachments] = useState<{ id: string; file: File }[]>([])
  const [isDropTarget, setIsDropTarget] = useState(false)
  const [webSearchExpanded, setWebSearchExpanded] = useState(false)
  const [webSearchQuery, setWebSearchQuery] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const firstClaimId = MOCK_CLAIMS[0]?.claim_id

  const handleSubmit = (includeWebSearch?: boolean) => {
    const trimmed = input.trim()
    if (!trimmed || !firstClaimId) return
    navigate(`/c/${firstClaimId}`, {
      state: {
        initialQuery: trimmed,
        initialAttachments: attachments.map((a) => a.file),
        includeWebSearch: includeWebSearch ?? webSearchExpanded,
      },
    })
  }

  const handleWebSearchSubmit = () => {
    const q = webSearchQuery.trim()
    if (q && firstClaimId) {
      navigate(`/c/${firstClaimId}`, {
        state: {
          initialQuery: q,
          initialAttachments: attachments.map((a) => a.file),
          includeWebSearch: true,
        },
      })
      setWebSearchQuery('')
      setWebSearchExpanded(false)
    }
  }

  const addFiles = (files: FileList | null) => {
    if (!files?.length) return
    setAttachments((prev) => [
      ...prev,
      ...Array.from(files).map((f) => ({ id: `att_${Date.now()}_${Math.random()}`, file: f })),
    ])
  }

  const handleAddFiles = () => fileInputRef.current?.click()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    addFiles(e.target.files)
    e.target.value = ''
  }

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id))
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDropTarget(false)
    addFiles(e.dataTransfer.files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDropTarget(true)
  }

  const handleDragLeave = () => setIsDropTarget(false)

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-white px-4">
      <div className="w-full max-w-2xl flex flex-col items-center">
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`w-full bg-white rounded-2xl shadow-soft transition-all overflow-hidden ${
            isDropTarget ? 'border-2 border-black bg-gray-50' : 'border border-gray-200 focus-within:border-gray-300'
          }`}
        >
          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 px-4 pt-3">
              {attachments.map(({ id, file }) => (
                <span
                  key={id}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs bg-gray-50 border border-gray-200 text-gray-800 rounded-lg"
                >
                  <FileText className="w-3 h-3 shrink-0" />
                  {file.name}
                  <button
                    type="button"
                    onClick={() => removeAttachment(id)}
                    className="p-0.5 hover:bg-gray-200 rounded-md"
                    aria-label="Remove"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
          <div className="flex items-center gap-2 px-4 py-3">
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSubmit())}
              placeholder="Ask anything..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400 min-w-0"
            />
          </div>
          <div className="flex items-center justify-between gap-2 px-4 py-2 border-t border-gray-100">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.docx,.doc"
              className="hidden"
              onChange={handleFileChange}
            />
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {webSearchExpanded ? (
                <div className="flex items-center gap-2 flex-1 min-w-0 bg-gray-50 rounded-lg px-3 py-1.5 border border-gray-200">
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
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                  >
                    <Globe className="w-3.5 h-3.5" />
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
                  className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 text-xs shrink-0"
                  title="Search the web"
                >
                  <Globe className="w-4 h-4" />
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={handleAddFiles}
                className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 text-xs shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add tabs or files</span>
              </button>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button type="button" className="w-9 h-9 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600" title="Voice input">
                <Mic className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleSubmit()}
                disabled={!input.trim()}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                title="Send"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
