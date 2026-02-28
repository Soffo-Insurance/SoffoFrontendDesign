import { useState, useRef } from 'react'

interface TooltipProps {
  label: string
  children: React.ReactNode
  /** Optional position: 'above' | 'below'. Default 'below'. */
  position?: 'above' | 'below'
}

export function Tooltip({ label, children, position = 'below' }: TooltipProps) {
  const [visible, setVisible] = useState(false)
  const triggerRef = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={triggerRef}
      className="relative inline-flex"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
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
