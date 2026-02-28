import { useState, useRef, useEffect, useLayoutEffect } from 'react'
import { createPortal } from 'react-dom'
import { Search, FileText, Upload } from 'lucide-react'

export interface LibraryFile {
  id: string
  name: string
}

interface AddTabsOrFilesPopoverProps {
  open: boolean
  onClose: () => void
  onUploadClick: () => void
  anchorRef: React.RefObject<HTMLElement | null>
  /** Library files (saved/added documents) to browse and search */
  libraryFiles?: LibraryFile[]
  /** When user selects a file from the library (e.g. to attach or open) */
  onSelectFile?: (file: LibraryFile) => void
}

export function AddTabsOrFilesPopover({
  open,
  onClose,
  onUploadClick,
  anchorRef,
  libraryFiles = [],
  onSelectFile,
}: AddTabsOrFilesPopoverProps) {
  const [search, setSearch] = useState('')
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null)
  const popoverRef = useRef<HTMLDivElement>(null)

  // Position popover directly below the trigger button (no Popover API so we control placement)
  const updatePosition = () => {
    const anchor = anchorRef.current
    if (!anchor) return
    const r = anchor.getBoundingClientRect()
    const width = 320
    const padding = 12
    let left = r.left
    if (left + width > window.innerWidth - padding) left = window.innerWidth - width - padding
    if (left < padding) left = padding
    setPosition({
      top: r.bottom + 4,
      left,
    })
  }
  useLayoutEffect(() => {
    if (!open) {
      setPosition(null)
      return
    }
    updatePosition()
    // Fallback: anchor might not be laid out yet (e.g. first frame)
    const id = requestAnimationFrame(() => {
      updatePosition()
    })
    return () => cancelAnimationFrame(id)
  }, [open, anchorRef])

  useEffect(() => {
    if (!open) return
    const id = setTimeout(() => {
      const handleClick = (e: MouseEvent) => {
        const el = e.target as Node
        if (popoverRef.current?.contains(el) || anchorRef.current?.contains(el)) return
        onClose()
      }
      document.addEventListener('mousedown', handleClick, true)
      return () => document.removeEventListener('mousedown', handleClick, true)
    }, 0)
    return () => clearTimeout(id)
  }, [open, onClose, anchorRef])

  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  useEffect(() => {
    if (!open) setSearch('')
  }, [open])

  const filteredFiles = search.trim()
    ? libraryFiles.filter((f) =>
        f.name.toLowerCase().includes(search.trim().toLowerCase())
      )
    : libraryFiles

  const popoverContent = (
    <div
      ref={popoverRef}
      className="font-apple overflow-x-hidden rounded-xl border border-gray-200/90 bg-[#f5f5f5] py-2.5 text-[13px] text-gray-800 shadow-[0_4px_20px_rgba(0,0,0,0.1)]"
      style={{
        position: 'fixed',
        top: position.top,
        left: position.left,
        width: 320,
        maxWidth: 'calc(100vw - 24px)',
        zIndex: 2147483647,
      }}
      role="dialog"
      aria-label="Library"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Search bar + Upload button on same row (reference: pill search + circular upload) */}
      <div className="flex items-center gap-2 px-3 pb-3">
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full bg-[#e8e8e8] px-3 py-2">
          <Search className="h-4 w-4 shrink-0 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className="min-w-0 flex-1 bg-transparent text-[13px] text-gray-800 outline-none placeholder:text-gray-500"
            autoFocus
          />
        </div>
        <button
          type="button"
          onClick={() => {
            onUploadClick()
            onClose()
          }}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e8e8e8] text-gray-600 transition-colors hover:bg-[#dcdcdc]"
          title="Upload file from computer"
        >
          <Upload className="h-4 w-4" />
        </button>
      </div>

      {/* LIBRARY: saved/added files to browse */}
      <div className="px-2">
        <p className="mb-1 px-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
          Library
        </p>
        <ul className="max-h-[220px] overflow-y-auto overflow-x-hidden">
          {filteredFiles.length === 0 ? (
            <li className="px-2 py-4 text-center text-[13px] text-gray-500">
              {libraryFiles.length === 0
                ? 'No files yet. Upload to add.'
                : 'No matches for your search.'}
            </li>
          ) : (
            filteredFiles.map((file) => (
              <li key={file.id}>
                <button
                  type="button"
                  onClick={() => {
                    onSelectFile?.(file)
                    onClose()
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left hover:bg-black/5"
                >
                  <FileText className="h-4 w-4 shrink-0 text-gray-500" />
                  <span className="min-w-0 truncate">{file.name}</span>
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  )

  if (!open || position === null) return null

  return createPortal(popoverContent, document.body)
}
