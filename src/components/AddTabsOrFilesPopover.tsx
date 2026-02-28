import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
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
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) {
      setViewMoreOpen(false)
      try { popoverRef.current?.hidePopover?.() } catch { /* noop */ }
      return
    }
    const el = popoverRef.current
    if (!el) return
    el.setAttribute('popover', 'manual')
    // Position below trigger, left-aligned
    const anchor = anchorRef.current
    if (anchor) {
      const r = anchor.getBoundingClientRect()
      setPosition({
        top: r.bottom + 4,
        left: r.left,
      })
    }
    // showPopover() puts element in top layer (avoids overflow clipping)
    try { el.showPopover?.() } catch { /* noop */ }
  }, [open, anchorRef])

  // Close on outside click — defer so the opening click doesn't close it
  useEffect(() => {
    if (!open) return
    const id = setTimeout(() => {
      const handleClick = (e: MouseEvent) => {
        const el = e.target as Node
        if (popoverRef.current?.contains(el) || anchorRef.current?.contains(el)) return
        setViewMoreOpen(false)
        onClose()
      }
      document.addEventListener('mousedown', handleClick, true)
      return () => document.removeEventListener('mousedown', handleClick, true)
    }, 0)
    return () => clearTimeout(id)
  }, [open, onClose, anchorRef])

  // Close on Escape (native popover behavior)
  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setViewMoreOpen(false)
        onClose()
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  useEffect(() => {
    if (!open) setSearch('')
  }, [open])

  const filteredTabs = search.trim()
    ? MOCK_TABS.filter((t) =>
        t.title.toLowerCase().includes(search.trim().toLowerCase())
      )
    : MOCK_TABS

  const popoverContent = (
    <div
      ref={popoverRef}
      className="font-apple w-[320px] max-w-[calc(100vw-24px)] rounded-lg border border-[rgba(0,0,0,0.08)] bg-[#fafafa] py-2 text-[13px] text-black shadow-[0_4px_16px_rgba(0,0,0,0.12)]"
      style={{
        position: 'fixed',
        top: position.top,
        left: position.left,
        zIndex: 2147483647,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="px-2 pb-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tabs, history, bookmarks"
          className="w-full rounded-md border-0 bg-white px-3 py-1.5 text-[13px] text-black shadow-sm outline-none placeholder:opacity-60 focus:ring-1 focus:ring-[rgba(0,0,0,0.1)]"
          autoFocus
        />
      </div>

      {showTabs && (
        <>
          <div className="px-2">
            <p className="mb-1 px-2 text-[11px] font-semibold uppercase tracking-wide opacity-70">
              TABS
            </p>
            <ul className="max-h-[200px] overflow-y-auto">
              {filteredTabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <li key={tab.id}>
                    <button
                      type="button"
                      className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left hover:bg-black/5"
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
                  className="flex w-full items-center justify-between gap-2 rounded px-2 py-1.5 text-left hover:bg-black/5"
                >
                  <span className="flex items-center gap-2">
                    <span className="opacity-50">•••</span>
                    <span>View more</span>
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                </button>
                {viewMoreOpen && (
                  <div
                    className="absolute left-full top-0 z-10 ml-0.5 min-w-[180px] rounded-md border border-[rgba(0,0,0,0.08)] bg-[#fafafa] py-1 shadow-[0_4px_16px_rgba(0,0,0,0.12)]"
                    onMouseEnter={() => setViewMoreOpen(true)}
                    onMouseLeave={() => setViewMoreOpen(false)}
                  >
                    {['Overview - Vercel', 'Gmail', 'GitHub', 'Calendar'].map((label) => (
                      <button
                        key={label}
                        type="button"
                        className="flex w-full items-center gap-2 px-3 py-1.5 text-left hover:bg-black/5"
                      >
                        <span className="h-4 w-4 shrink-0 rounded bg-black/10" />
                        {label}
                      </button>
                    ))}
                  </div>
                )}
              </li>
              <li>
                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left hover:bg-black/5"
                >
                  <LayoutGrid className="h-4 w-4 shrink-0 opacity-6" />
                  <span>All open tabs </span>
                  <span className="text-gray-500">(9)</span>
                </button>
              </li>
            </ul>
          </div>
          <div className="my-2 border-t border-black/06" />
        </>
      )}

      <div className="px-2">
        <p className="mb-1 px-2 text-[11px] font-semibold uppercase tracking-wide opacity-70">
          FILES
        </p>
        <button
          type="button"
          onClick={() => {
            onUploadClick()
            onClose()
          }}
          className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left hover:bg-black/5"
        >
          <Upload className="h-4 w-4 shrink-0 text-gray-500" />
          <span>Upload file from computer</span>
        </button>
      </div>
    </div>
  )

  if (!open) return null

  return createPortal(popoverContent, document.body)
}
