import { useState, useRef, useEffect } from 'react'
import { Search, FileText, FileSpreadsheet, BookOpen, ExternalLink, LayoutGrid, Upload, ChevronRight } from 'lucide-react'

const MOCK_TABS = [
  { id: '1', title: 'Defensible Reasoning — Insurance Claims', icon: FileText },
  { id: '2', title: 'Untitled spreadsheet', icon: FileSpreadsheet },
  { id: '3', title: 'Litigation Trends in US Property Insuran...', icon: BookOpen },
  { id: '4', title: 'Outlook Add-In | Legora', icon: ExternalLink },
  { id: '5', title: 'ChatGPT', icon: LayoutGrid },
]

interface AddTabsOrFilesPopoverProps {
  open: boolean
  onClose: () => void
  onUploadClick: () => void
  anchorRef: React.RefObject<HTMLElement | null>
  /** Optional: show tabs section (e.g. hide on chat page if no tabs) */
  showTabs?: boolean
}

export function AddTabsOrFilesPopover({
  open,
  onClose,
  onUploadClick,
  anchorRef,
  showTabs = true,
}: AddTabsOrFilesPopoverProps) {
  const [search, setSearch] = useState('')
  const [viewMoreOpen, setViewMoreOpen] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handleClickOutside = (e: MouseEvent) => {
      const el = e.target as Node
      if (
        popoverRef.current?.contains(el) ||
        anchorRef.current?.contains(el)
      ) return
      setViewMoreOpen(false)
      onClose()
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open, onClose, anchorRef])

  useEffect(() => {
    if (!open) setSearch('')
  }, [open])

  if (!open) return null

  const filteredTabs = search.trim()
    ? MOCK_TABS.filter((t) =>
        t.title.toLowerCase().includes(search.trim().toLowerCase())
      )
    : MOCK_TABS

  return (
    <div
      ref={popoverRef}
      className="absolute left-0 top-full z-50 mt-1 min-w-[320px] max-w-[400px] rounded-xl border border-gray-200 bg-white py-2 shadow-lg"
      style={{ width: 'max(320px, min(400px, 90vw))' }}
    >
      <div className="px-3 pb-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tabs, history, bookmarks"
          className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none placeholder:text-gray-400 focus:border-gray-300 focus:bg-white"
          autoFocus
        />
      </div>

      {showTabs && (
        <>
          <div className="px-3">
            <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wide text-gray-400">
              TABS
            </p>
            <ul className="max-h-[200px] overflow-y-auto">
              {filteredTabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <li key={tab.id}>
                    <button
                      type="button"
                      className="flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-left text-sm text-gray-900 hover:bg-gray-50"
                    >
                      <Icon className="h-4 w-4 shrink-0 text-gray-500" />
                      <span className="min-w-0 truncate">{tab.title}</span>
                    </button>
                  </li>
                )
              })}
              <li className="relative">
                <button
                  type="button"
                  onMouseEnter={() => setViewMoreOpen(true)}
                  onMouseLeave={() => setViewMoreOpen(false)}
                  className="flex w-full items-center justify-between gap-2 rounded-md px-2 py-2 text-left text-sm text-gray-900 hover:bg-gray-50"
                >
                  <span className="flex items-center gap-2.5">
                    <span className="text-gray-500">•••</span>
                    <span>View more</span>
                  </span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-gray-400" />
                </button>
                {viewMoreOpen && (
                  <div
                    className="absolute left-full top-0 z-10 ml-0.5 min-w-[200px] rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
                    onMouseEnter={() => setViewMoreOpen(true)}
                    onMouseLeave={() => setViewMoreOpen(false)}
                  >
                    {['Overview - Vercel', 'Gmail', 'GitHub', 'Calendar'].map((label, i) => (
                      <button
                        key={label}
                        type="button"
                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-900 hover:bg-gray-50"
                      >
                        <span className="h-4 w-4 shrink-0 rounded bg-gray-200" />
                        {label}
                      </button>
                    ))}
                  </div>
                )}
              </li>
              <li>
                <button
                  type="button"
                  className="flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-left text-sm text-gray-900 hover:bg-gray-50"
                >
                  <LayoutGrid className="h-4 w-4 shrink-0 text-gray-500" />
                  <span>All open tabs (9)</span>
                </button>
              </li>
            </ul>
          </div>
          <div className="my-2 border-t border-gray-100" />
        </>
      )}

      <div className="px-3">
        <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wide text-gray-400">
          FILES
        </p>
        <button
          type="button"
          onClick={() => {
            onUploadClick()
            onClose()
          }}
          className="flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-left text-sm text-gray-900 hover:bg-gray-50"
        >
          <Upload className="h-4 w-4 shrink-0 text-gray-500" />
          <span>Upload file from computer</span>
        </button>
      </div>
    </div>
  )
}
