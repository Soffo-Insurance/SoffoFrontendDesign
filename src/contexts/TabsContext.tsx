import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

export type TabType = 'source' | 'editor'

export interface Tab {
  id: string
  title: string
  type: TabType
  payload?: { sourceName?: string; content?: string }
}

interface TabsContextValue {
  tabs: Tab[]
  activeTabId: string | null
  addTab: (tab: Omit<Tab, 'id'>) => string
  closeTab: (id: string) => void
  setActiveTabId: (id: string | null) => void
}

const TabsContext = createContext<TabsContextValue | null>(null)

export function TabsProvider({ children }: { children: ReactNode }) {
  const [tabs, setTabs] = useState<Tab[]>([])
  const [activeTabId, setActiveTabId] = useState<string | null>(null)

  const addTab = useCallback((tab: Omit<Tab, 'id'>) => {
    const id = `tab-${Date.now()}-${Math.random().toString(36).slice(2)}`
    const newTab: Tab = { ...tab, id }
    setTabs((prev) => {
      // Dedupe sources only; allow multiple editor tabs (e.g. multiple "Untitled")
      if (tab.type === 'source') {
        const existing = prev.find((t) => t.title === tab.title && t.type === tab.type)
        if (existing) {
          setActiveTabId(existing.id)
          return prev
        }
      }
      setActiveTabId(id)
      return [...prev, newTab]
    })
    return id
  }, [])

  const closeTab = useCallback((id: string) => {
    setTabs((prev) => {
      const next = prev.filter((t) => t.id !== id)
      return next
    })
    setActiveTabId((current) => (current === id ? null : current))
  }, [])

  return (
    <TabsContext.Provider
      value={{
        tabs,
        activeTabId,
        addTab,
        closeTab,
        setActiveTabId,
      }}
    >
      {children}
    </TabsContext.Provider>
  )
}

export function useTabs() {
  const ctx = useContext(TabsContext)
  if (!ctx) throw new Error('useTabs must be used within TabsProvider')
  return ctx
}

export function useTabsOptional() {
  return useContext(TabsContext)
}
