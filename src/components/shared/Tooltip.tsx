import { useState, useRef, useCallback } from 'react'

const TOOLTIP_DELAY_MS = 150

interface TooltipProps {
  label: string
  children: React.ReactNode
  /** Optional position: 'above' | 'below'. Default 'below'. */
  position?: 'above' | 'below'
}

export function Tooltip({ label, children, position = 'below' }: TooltipProps) {
  const [visible, setVisible] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleEnter = useCallback(() => {
    timeoutRef.current = setTimeout(() => setVisible(true), TOOLTIP_DELAY_MS)
  }, [])

  const handleLeave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setVisible(false)
  }, [])

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {children}
      {visible && label && (
        <span
          className={`absolute left-1/2 -translate-x-1/2 z-[100] px-2.5 py-1.5 text-xs font-medium text-white bg-black rounded-md whitespace-nowrap ${
            position === 'above' ? 'bottom-full mb-1.5' : 'top-full mt-1.5'
          }`}
          role="tooltip"
        >
          {label}
        </span>
      )}
    </div>
  )
}
