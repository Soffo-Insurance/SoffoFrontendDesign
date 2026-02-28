import { useTabs } from '../../contexts/TabsContext'
import { FileText } from 'lucide-react'
import { EditorView } from '../editor/EditorView'

export function TabContentPanel() {
  const { tabs, activeTabId } = useTabs()
  const activeTab = tabs.find((t) => t.id === activeTabId)

  if (!activeTab) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 text-sm bg-white">
        Select a tab or open a source / editor from chat.
      </div>
    )
  }

  if (activeTab.type === 'editor') {
    return (
      <EditorView
        content={activeTab.payload?.content ?? ''}
      />
    )
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white overflow-auto">
      <div className="p-4 border-b border-gray-100 flex items-center gap-2">
        <FileText className="w-4 h-4 text-gray-500 shrink-0" />
        <span className="text-sm font-medium text-gray-900">{activeTab.title}</span>
        <span className="text-xs text-gray-500">({activeTab.type})</span>
      </div>
      <div className="flex-1 p-4 text-sm text-gray-600">
        {activeTab.payload?.content ? (
          <pre className="whitespace-pre-wrap font-sans">{activeTab.payload.content}</pre>
        ) : (
          <p>Content for "{activeTab.title}" will appear here.</p>
        )}
      </div>
    </div>
  )
}
