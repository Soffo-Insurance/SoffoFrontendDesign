import { X, FileText } from 'lucide-react'
import { useTabs } from '../../contexts/TabsContext'

export function TabStrip() {
  const { tabs, activeTabId, setActiveTabId, closeTab } = useTabs()

  if (tabs.length === 0) return null

  return (
    <div className="flex items-center gap-0.5 min-w-0 flex-1 overflow-x-auto h-full">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId
        return (
          <div
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            className={`shrink-0 flex items-center gap-2 pl-2.5 pr-1.5 py-1.5 rounded-t-lg text-sm max-w-[200px] transition-colors ${
              isActive
                ? 'bg-white text-gray-900'
                : 'bg-transparent text-gray-200 hover:text-white hover:bg-white/10'
            }`}
          >
            <FileText className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-gray-700' : ''}`} />
            <button
              type="button"
              onClick={() => setActiveTabId(tab.id)}
              className="min-w-0 flex-1 text-left truncate font-medium"
            >
              {tab.title}
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                closeTab(tab.id)
              }}
              className={`p-0.5 rounded shrink-0 ${isActive ? 'hover:bg-gray-200 text-gray-500' : 'hover:bg-white/20 text-gray-400'}`}
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
