import { X, FileText } from 'lucide-react'
import { useTabs } from '../../contexts/TabsContext'

export function TabStrip() {
  const { tabs, activeTabId, setActiveTabId, closeTab } = useTabs()

  if (tabs.length === 0) return null

  return (
    <div className="flex items-end gap-0.5 min-w-0 flex-1 overflow-x-auto h-full pb-0">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId
        return (
          <div
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            className={`shrink-0 flex items-center gap-2 pl-3 pr-2 pt-2 pb-2 text-sm max-w-[200px] transition-colors ${
              isActive
                ? 'bg-white text-gray-900 rounded-t-[10px] border border-b-0 border-gray-200'
                : 'rounded-t-lg text-gray-500 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <FileText className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-gray-700' : 'text-gray-400'}`} />
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
              className={`p-0.5 rounded shrink-0 ${isActive ? 'hover:bg-gray-100 text-gray-500' : 'hover:bg-gray-200 text-gray-400'}`}
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
