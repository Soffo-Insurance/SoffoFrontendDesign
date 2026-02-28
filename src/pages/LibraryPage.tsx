import { useState, useRef, useEffect } from 'react'
import {
  Search,
  FileText,
  Upload,
  MessageSquare,
  MoreHorizontal,
  X,
} from 'lucide-react'
import { useLibrary } from '../contexts/LibraryContext'
import { useTabsOptional } from '../contexts/TabsContext'
import type { LibraryFile } from '../contexts/LibraryContext'

type LibraryTab = 'all' | 'files' | 'prompts'

// Create project style icon (cross-hatch / grid)
function CreateProjectIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      className={className}
      aria-hidden
    >
      <rect x="8" y="8" width="8" height="8" rx="1" fill="currentColor" opacity="0.4" />
      <rect x="24" y="8" width="8" height="8" rx="1" fill="currentColor" opacity="0.4" />
      <rect x="8" y="24" width="8" height="8" rx="1" fill="currentColor" opacity="0.4" />
      <rect x="24" y="24" width="8" height="8" rx="1" fill="currentColor" opacity="0.4" />
    </svg>
  )
}

// Knowledge base / prompt style icon (magnifying glass over doc)
function SavePromptCardIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect x="6" y="4" width="20" height="28" rx="2" />
      <path d="M26 14h6l4 4v14a2 2 0 0 1-2 2H26" />
      <circle cx="18" cy="18" r="6" />
      <path d="m22 22 4 4" />
    </svg>
  )
}

interface AddFilesOrTabsModalProps {
  open: boolean
  onClose: () => void
}

function AddFilesOrTabsModal({ open, onClose }: AddFilesOrTabsModalProps) {
  const { libraryFiles, addLibraryFile } = useLibrary()
  const tabsApi = useTabsOptional()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = () => fileInputRef.current?.click()
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files?.length) return
    Array.from(files).forEach((f) => addLibraryFile(f.name))
    e.target.value = ''
  }

  const openAsTab = (file: LibraryFile) => {
    tabsApi?.addTab({ title: file.name, type: 'source', payload: { sourceName: file.name } })
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20" onClick={onClose}>
      <div
        className="bg-white rounded-xl border border-gray-200 shadow-lg w-full max-w-md max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">Add files or tabs</h3>
          <button type="button" onClick={onClose} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-4 flex flex-col gap-4 overflow-y-auto">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.docx,.doc"
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            type="button"
            onClick={handleUpload}
            className="flex items-center gap-3 w-full rounded-lg border border-gray-200 bg-gray-50/80 hover:bg-gray-100 px-4 py-3 text-left transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center text-gray-600">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Upload files</p>
              <p className="text-xs text-gray-500">Add documents from your computer</p>
            </div>
          </button>
          {libraryFiles.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Open as tab</p>
              <ul className="space-y-1">
                {libraryFiles.map((file) => (
                  <li key={file.id}>
                    <button
                      type="button"
                      onClick={() => openAsTab(file)}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <FileText className="w-4 h-4 shrink-0 text-gray-500" />
                      <span className="min-w-0 truncate">{file.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

interface SavePromptModalProps {
  open: boolean
  onClose: () => void
  initialTitle?: string
  initialBody?: string
}

function SavePromptModal({
  open,
  onClose,
  initialTitle = '',
  initialBody = '',
}: SavePromptModalProps) {
  const { addSavedPrompt } = useLibrary()
  const [title, setTitle] = useState(initialTitle)
  const [body, setBody] = useState(initialBody)

  useEffect(() => {
    if (open) {
      setTitle(initialTitle)
      setBody(initialBody)
    }
  }, [open, initialTitle, initialBody])

  const handleSave = () => {
    const t = title.trim() || body.slice(0, 80).trim() || 'Untitled prompt'
    addSavedPrompt({ title: t.slice(0, 100), body: body.trim() })
    setTitle('')
    setBody('')
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20" onClick={onClose}>
      <div
        className="bg-white rounded-xl border border-gray-200 shadow-lg w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">Save prompt</h3>
          <button type="button" onClick={onClose} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-4 space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Prompt name"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-gray-200"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Content</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Paste or type the prompt..."
              rows={4}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-gray-200 resize-none"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!title.trim() && !body.trim()}
              className="px-3 py-1.5 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 disabled:opacity-50 rounded-lg"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function formatDate(iso: string) {
  const d = new Date(iso)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  if (diff < 86400000) return 'Today'
  if (diff < 172800000) return 'Yesterday'
  return d.toLocaleDateString()
}

export function LibraryPage() {
  const { libraryFiles, savedPrompts, removeLibraryFile, removeSavedPrompt } = useLibrary()
  const [activeTab, setActiveTab] = useState<LibraryTab>('all')
  const [search, setSearch] = useState('')
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [savePromptModalOpen, setSavePromptModalOpen] = useState(false)
  const [menuId, setMenuId] = useState<string | null>(null)

  const q = search.trim().toLowerCase()
  const filteredFiles = q
    ? libraryFiles.filter((f) => f.name.toLowerCase().includes(q))
    : libraryFiles
  const filteredPrompts = q
    ? savedPrompts.filter(
        (p) =>
          p.title.toLowerCase().includes(q) || p.body.toLowerCase().includes(q)
      )
    : savedPrompts

  const tabs: { id: LibraryTab; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'files', label: 'Files & tabs' },
    { id: 'prompts', label: 'Saved prompts' },
  ]

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Header */}
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Library</h1>
          <p className="mt-1 text-sm text-gray-500">
            Upload, store, and manage files and saved prompts.
          </p>

          {/* Action cards */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setAddModalOpen(true)}
              className="flex items-start gap-4 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-gray-50 p-4 text-left transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-gray-200/80 flex items-center justify-center text-gray-500 shrink-0">
                <CreateProjectIcon className="w-8 h-8" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-gray-900">Add files or tabs</p>
                <p className="text-sm text-gray-500 mt-0.5">
                  Upload a new collection of files or open one as a tab.
                </p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setSavePromptModalOpen(true)}
              className="flex items-start gap-4 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-gray-50 p-4 text-left transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-gray-200/80 flex items-center justify-center text-gray-500 shrink-0">
                <SavePromptCardIcon className="w-8 h-8" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-gray-900">Save prompt</p>
                <p className="text-sm text-gray-500 mt-0.5">
                  Save a prompt to your library for reuse.
                </p>
              </div>
            </button>
          </div>

          {/* Tabs + Search */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-1 border-b border-gray-200">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
                    activeTab === tab.id
                      ? 'border-gray-900 text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50/80 px-3 py-2 min-w-[200px]">
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search"
                className="flex-1 min-w-0 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 outline-none"
              />
            </div>
          </div>

          {/* Grid */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeTab === 'all' &&
              filteredFiles.map((file) => (
                <LibraryCard
                  key={file.id}
                  id={file.id}
                  type="file"
                  title={file.name}
                  subtitle="File"
                  onRemove={() => removeLibraryFile(file.id)}
                  menuId={menuId}
                  setMenuId={setMenuId}
                />
              ))}
            {activeTab === 'all' &&
              filteredPrompts.map((prompt) => (
                <LibraryCard
                  key={prompt.id}
                  id={prompt.id}
                  type="prompt"
                  title={prompt.title}
                  subtitle={formatDate(prompt.createdAt)}
                  onRemove={() => removeSavedPrompt(prompt.id)}
                  menuId={menuId}
                  setMenuId={setMenuId}
                />
              ))}
            {activeTab === 'files' &&
              filteredFiles.map((file) => (
                <LibraryCard
                  key={file.id}
                  id={file.id}
                  type="file"
                  title={file.name}
                  subtitle="File"
                  onRemove={() => removeLibraryFile(file.id)}
                  menuId={menuId}
                  setMenuId={setMenuId}
                />
              ))}
            {activeTab === 'prompts' &&
              filteredPrompts.map((prompt) => (
                <LibraryCard
                  key={prompt.id}
                  id={prompt.id}
                  type="prompt"
                  title={prompt.title}
                  subtitle={formatDate(prompt.createdAt)}
                  onRemove={() => removeSavedPrompt(prompt.id)}
                  menuId={menuId}
                  setMenuId={setMenuId}
                />
              ))}
          </div>

          {((activeTab === 'all' && filteredFiles.length === 0 && filteredPrompts.length === 0) ||
            (activeTab === 'files' && filteredFiles.length === 0) ||
            (activeTab === 'prompts' && filteredPrompts.length === 0)) && (
            <div className="mt-12 text-center py-12 rounded-xl bg-gray-50/80 border border-gray-100">
              <p className="text-sm text-gray-500">
                {activeTab === 'all' && 'No files or saved prompts yet.'}
                {activeTab === 'files' && 'No files yet. Use "Add files or tabs" to upload.'}
                {activeTab === 'prompts' && 'No saved prompts yet. Use "Save prompt" or save from chat.'}
              </p>
            </div>
          )}
        </div>
      </div>

      <AddFilesOrTabsModal open={addModalOpen} onClose={() => setAddModalOpen(false)} />
      <SavePromptModal open={savePromptModalOpen} onClose={() => setSavePromptModalOpen(false)} />
    </div>
  )
}

interface LibraryCardProps {
  id: string
  type: 'file' | 'prompt'
  title: string
  subtitle: string
  onRemove: () => void
  menuId: string | null
  setMenuId: (id: string | null) => void
}

function LibraryCard({ id, type, title, subtitle, onRemove, menuId, setMenuId }: LibraryCardProps) {
  const open = menuId === id

  return (
    <div className="relative rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-gray-50 p-4 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gray-200/80 flex items-center justify-center text-gray-500 shrink-0">
              {type === 'file' ? (
                <FileText className="w-5 h-5" />
              ) : (
                <MessageSquare className="w-5 h-5" />
              )}
            </div>
            <div className="min-w-0">
              <p className="font-medium text-gray-900 truncate">{title}</p>
              <p className="text-xs text-gray-500">{subtitle}</p>
            </div>
          </div>
        </div>
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setMenuId(open ? null : id)}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200/80 rounded-lg"
            aria-label="More options"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
          {open && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setMenuId(null)}
                aria-hidden
              />
              <div className="absolute right-0 top-full mt-1 z-20 py-1 w-40 rounded-lg border border-gray-200 bg-white shadow-lg">
                <button
                  type="button"
                  onClick={() => {
                    onRemove()
                    setMenuId(null)
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  Remove
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
