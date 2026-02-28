import { X, FileText, Plus } from 'lucide-react'
import { useTabs } from '../../contexts/TabsContext'

export function TabStrip() {
  const { tabs, activeTabId, setActiveTabId, closeTab, addTab } = useTabs()

  if (tabs.length === 0) return null

  return (
    <div className="flex items-end gap-1 min-w-0 flex-1 overflow-x-auto h-full px-1.5 pt-1 pb-0 bg-[#E5E7EB]">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId
        return (
          <div
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            className={`shrink-0 flex items-center gap-2 pl-2.5 pr-2 pt-1.5 pb-2 text-sm max-w-[220px] min-w-0 transition-colors rounded-t-[8px] ${
              isActive
                ? 'bg-white text-gray-900 shadow-sm border border-b-0 border-gray-200/80'
                : 'bg-[#D1D5DB] text-gray-600 hover:bg-[#D9DCE0] hover:text-gray-700'
            }`}
          >
            <FileText className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-gray-600' : 'text-gray-500'}`} />
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
              className="p-0.5 rounded shrink-0 text-gray-500 hover:bg-gray-300/50 hover:text-gray-700"
              aria-label={`Close ${tab.title}`}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )
      })}
      <button
        type="button"
        onClick={() => addTab({ type: 'editor', title: 'Untitled', payload: { content: '' } })}
        className="shrink-0 flex items-center justify-center w-7 h-7 rounded-t-[6px] text-gray-500 hover:bg-[#D1D5DB] hover:text-gray-700 transition-colors"
        aria-label="New tab"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  )
}
