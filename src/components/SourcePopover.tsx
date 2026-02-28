import { useRef, useEffect, useLayoutEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronLeft, ChevronRight, FileText } from 'lucide-react'

export interface SourceEntry {
  name: string
  title: string
  description: string
}

interface SourcePopoverProps {
  open: boolean
  onClose: () => void
  anchorRef: React.RefObject<HTMLElement | null>
  sources: SourceEntry[]
  /** Initial 0-based index to show when opening */
  initialIndex?: number
}

export function SourcePopover({
  open,
  onClose,
  anchorRef,
  sources,
  initialIndex = 0,
}: SourcePopoverProps) {
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null)
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) setCurrentIndex(Math.min(initialIndex, Math.max(0, sources.length - 1)))
  }, [open, initialIndex, sources.length])

  const updatePosition = () => {
    const anchor = anchorRef.current
    if (!anchor) return
    const r = anchor.getBoundingClientRect()
    const padding = 12
    let left = r.left + r.width / 2
    if (left < padding) left = padding
    if (left > window.innerWidth - padding) left = window.innerWidth - padding
    const top = r.top - 8
    setPosition({ top, left })
  }

  useLayoutEffect(() => {
    if (!open) {
      setPosition(null)
      return
    }
    updatePosition()
    const id = requestAnimationFrame(updatePosition)
    return () => cancelAnimationFrame(id)
  }, [open, anchorRef])

  useEffect(() => {
    if (!open) return
    const handleClick = (e: MouseEvent) => {
      const el = e.target as Node
      if (popoverRef.current?.contains(el) || anchorRef.current?.contains(el)) return
      onClose()
    }
    const t = setTimeout(() => {
      document.addEventListener('mousedown', handleClick, true)
    }, 0)
    return () => {
      clearTimeout(t)
      document.removeEventListener('mousedown', handleClick, true)
    }
  }, [open, onClose, anchorRef])

  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  if (!open || position === null || sources.length === 0) return null

  const source = sources[currentIndex]
  const total = sources.length
  const canPrev = currentIndex > 0
  const canNext = currentIndex < total - 1

  const popoverContent = (
    <div
      ref={popoverRef}
      className="font-apple overflow-hidden rounded-xl border border-gray-200/90 bg-[#f5f5f5] text-[13px] text-gray-800 shadow-[0_4px_20px_rgba(0,0,0,0.1)]"
      style={{
        position: 'fixed',
        top: position.top,
        left: position.left,
        transform: 'translate(-50%, -100%)',
        width: 320,
        maxWidth: 'calc(100vw - 24px)',
        zIndex: 2147483647,
      }}
      role="dialog"
      aria-label="Source"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-3">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1 text-gray-500">
            <button
              type="button"
              onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
              disabled={!canPrev}
              className="p-0.5 rounded hover:bg-black/5 disabled:opacity-40 disabled:pointer-events-none"
              aria-label="Previous source"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="min-w-[2.5rem] text-center tabular-nums">
              {currentIndex + 1}/{total}
            </span>
            <button
              type="button"
              onClick={() => setCurrentIndex((i) => Math.min(total - 1, i + 1))}
              disabled={!canNext}
              className="p-0.5 rounded hover:bg-black/5 disabled:opacity-40 disabled:pointer-events-none"
              aria-label="Next source"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <span className="flex items-center gap-1.5 text-gray-500">
            <FileText className="h-4 w-4 text-blue-600" aria-hidden />
            {total} source{total !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-blue-100 text-blue-600">
            <FileText className="h-3 w-3" />
          </span>
          <span className="text-gray-700">{source.name}</span>
        </div>
        <h4 className="font-semibold text-gray-900 text-[14px] leading-snug mb-2">
          {source.title}
        </h4>
        <p className="text-[13px] leading-relaxed text-gray-800">{source.description}</p>
      </div>
    </div>
  )

  return createPortal(popoverContent, document.body)
}
