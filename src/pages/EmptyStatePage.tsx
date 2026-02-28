import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plus, Mic, ArrowUp, Globe, X, FileText, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { MOCK_CLAIMS } from '../mockData'
import { AddTabsOrFilesPopover } from '../components/AddTabsOrFilesPopover'

export function EmptyStatePage() {
  const [input, setInput] = useState('')
  const [attachments, setAttachments] = useState<{ id: string; file: File }[]>([])
  const [isDropTarget, setIsDropTarget] = useState(false)
  const [webSearchOn, setWebSearchOn] = useState(false)
  const [addPopoverOpen, setAddPopoverOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mainOpen, setMainOpen] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const addButtonRef = useRef<HTMLButtonElement>(null)
  const navigate = useNavigate()
  const firstClaimId = MOCK_CLAIMS[0]?.claim_id

  const handleSubmit = () => {
    const trimmed = input.trim()
    if (!trimmed || !firstClaimId) return
    navigate(`/c/${firstClaimId}`, {
      state: {
        initialQuery: trimmed,
        initialAttachments: attachments.map((a) => a.file),
        includeWebSearch: webSearchOn,
      },
    })
  }

  const addFiles = (files: FileList | null) => {
    if (!files?.length) return
    const fileList = Array.from(files)
    setAttachments((prev) => [
      ...prev,
      ...fileList.map((f, i) => ({ id: `att_${Date.now()}_${i}_${Math.random().toString(36).slice(2)}`, file: f })),
    ])
  }

  const handleAddFiles = () => fileInputRef.current?.click()
  const openUpload = () => fileInputRef.current?.click()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target
    if (files) addFiles(files)
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
    <div className="min-h-screen bg-[#e8e8ea] flex">
      {/* Grey sidebar — no divider, closable */}
      <aside
        className={`flex shrink-0 flex-col bg-[#e0e0e4] transition-[width] duration-200 ${
          sidebarOpen ? 'w-56 lg:w-64' : 'w-0 overflow-hidden'
        }`}
      >
        <div className="flex h-12 shrink-0 items-center justify-between gap-2 px-3">
          {sidebarOpen && (
            <>
              <span className="text-sm font-medium text-gray-700">Nav</span>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="rounded p-1.5 text-gray-500 hover:bg-black/5 hover:text-gray-700"
                title="Close sidebar"
                aria-label="Close sidebar"
              >
                <PanelLeftClose className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
        {sidebarOpen && (
          <nav className="flex-1 px-2 space-y-1 pb-4 text-sm">
            <button className="flex w-full items-center rounded-lg px-3 py-2 bg-white/60 text-gray-900">
              <span>Home</span>
            </button>
            <button className="flex w-full items-center rounded-lg px-3 py-2 text-gray-700 hover:bg-white/40">
              <span>Library</span>
            </button>
            <button className="flex w-full items-center rounded-lg px-3 py-2 text-gray-700 hover:bg-white/40">
              <span>Integration</span>
            </button>
            <button className="flex w-full items-center rounded-lg px-3 py-2 text-gray-700 hover:bg-white/40">
              <span>Search</span>
            </button>
          </nav>
        )}
      </aside>
      {!sidebarOpen && (
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="fixed left-2 top-4 z-10 rounded-lg border border-gray-200 bg-white p-2 text-gray-600 shadow-sm hover:bg-gray-50"
          title="Open sidebar"
          aria-label="Open sidebar"
        >
          <PanelLeftOpen className="h-4 w-4" />
        </button>
      )}

      {/* Main: white rounded shell with gap, no divider; closable */}
      <main className="flex-1 flex items-center justify-center p-6 min-w-0">
        {mainOpen ? (
          <div className="relative w-full max-w-2xl">
            <button
              type="button"
              onClick={() => setMainOpen(false)}
              className="absolute -right-2 -top-2 z-10 rounded-full border border-gray-200 bg-white p-1.5 text-gray-500 shadow-sm hover:bg-gray-50 hover:text-gray-700"
              title="Close"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`rounded-2xl bg-white shadow-input transition-all overflow-hidden ${
                isDropTarget ? 'shadow-soft-md' : ''
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
              <button
                type="button"
                onClick={() => setWebSearchOn((v) => !v)}
                title={webSearchOn ? 'Web search on' : 'Web search off'}
                className={`flex items-center justify-center gap-1.5 h-7 shrink-0 overflow-hidden transition-[width] duration-200 ${
                  webSearchOn
                    ? 'w-[72px] px-2.5 rounded-md bg-gray-100 text-gray-600'
                    : 'w-7 rounded-full text-gray-500 hover:bg-gray-100'
                }`}
              >
                <Globe className="w-3.5 h-3.5 shrink-0" />
                {webSearchOn && <span className="text-xs font-semibold whitespace-nowrap">Search</span>}
              </button>
              <div className="relative">
                <button
                  ref={addButtonRef}
                  type="button"
                  onClick={() => setAddPopoverOpen((v) => !v)}
                  className="flex items-center justify-center gap-1.5 rounded-lg bg-gray-100 px-2.5 py-1.5 text-gray-600 hover:bg-gray-200 text-xs shrink-0 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 shrink-0" />
                  <span>Add tabs or files</span>
                </button>
                <AddTabsOrFilesPopover
                  open={addPopoverOpen}
                  onClose={() => setAddPopoverOpen(false)}
                  onUploadClick={openUpload}
                  anchorRef={addButtonRef}
                  libraryFiles={attachments.map((a) => ({ id: a.id, name: a.file.name }))}
                />
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button type="button" className="w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600" title="Voice input">
                <Mic className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!input.trim()}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                title="Send"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setMainOpen(true)}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Open chat
          </button>
        )}
      </main>
    </div>
  )
}
