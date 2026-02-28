import { X } from 'lucide-react'
import { useTabs } from '../../contexts/TabsContext'

export function TabStrip() {
  const { tabs, activeTabId, setActiveTabId, closeTab } = useTabs()

  if (tabs.length === 0) return null

  return (
    <div className="flex items-center gap-0.5 min-w-0 flex-1 overflow-x-auto">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId
        return (
          <div
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            className={`shrink-0 flex items-center gap-2 pl-3 pr-2 py-2 rounded-t-lg text-sm border border-b-0 border-gray-200 max-w-[200px] ${
              isActive ? 'bg-white border-gray-200' : 'bg-gray-200/80 hover:bg-gray-200'
            }`}
          >
            <button
              type="button"
              onClick={() => setActiveTabId(tab.id)}
              className="min-w-0 flex-1 text-left truncate font-medium text-gray-900"
            >
              {tab.title}
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                closeTab(tab.id)
              }}
              className="p-0.5 rounded hover:bg-gray-300 text-gray-500"
              aria-label={`Close ${tab.title}`}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
