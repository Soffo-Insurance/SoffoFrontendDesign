import { useState } from 'react'
import { Outlet, useParams, NavLink } from 'react-router-dom'
import { User, ChevronDown, ChevronRight } from 'lucide-react'
import { TabsProvider, useTabsOptional } from '../../contexts/TabsContext'
import { ClaimChatProvider, useClaimChatOptional } from '../../contexts/ClaimChatContext'
import { TabStrip } from './TabStrip'
import { TabContentPanel } from './TabContentPanel'
import { ChatPanel } from './ChatPanel'

const SIDEBAR_WIDTH = 220
const RIGHT_CHAT_WIDTH = 360

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
      <path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </svg>
  )
}

function LibraryIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <rect width="8" height="18" x="3" y="3" rx="1" />
      <path d="M7 3v18" />
      <path d="M20.4 18.9c.2.5-.1 1.1-.6 1.3l-1.9.7c-.5.2-1.1-.1-1.3-.6L11.1 5.1c-.2-.5.1-1.1.6-1.3l1.9-.7c.5-.2 1.1.1 1.3.6Z" />
    </svg>
  )
}

function IntegrationsIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  )
}

function PanelLeftIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M9 3v18" />
    </svg>
  )
}

function LeftSidebar({ workspaceName }: { workspaceName: string }) {
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      isActive ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:bg-gray-200/70'
    }`

  return (
    <aside
      className="shrink-0 flex flex-col bg-[#FAFAF9]"
      style={{ width: SIDEBAR_WIDTH }}
    >
      <div className="p-3 flex items-center gap-2">
        <button
          type="button"
          className="flex items-center gap-2 min-w-0 flex-1 text-left rounded-lg py-1.5 px-2 hover:bg-gray-200/70 transition-colors"
          aria-label="Switch workspace"
        >
          <span className="w-8 h-8 shrink-0 rounded-lg bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-700">
            {workspaceName.charAt(0).toUpperCase() || 'W'}
          </span>
          <span className="text-sm font-medium text-gray-900 truncate min-w-0 flex-1">{workspaceName}</span>
          <ChevronDown className="w-4 h-4 shrink-0 text-gray-500" />
        </button>
        <button
          type="button"
          className="p-1 rounded text-gray-500 hover:bg-gray-200 shrink-0"
          aria-label="Collapse sidebar"
        >
          <PanelLeftIcon className="w-4 h-4" />
        </button>
      </div>
      <nav className="flex-1 p-2 space-y-0.5">
        <NavLink to="/c" end className={navLinkClass}>
          <HomeIcon className="w-4 h-4 shrink-0" />
          Home
        </NavLink>
        <NavLink to="/c/library" className={navLinkClass}>
          <LibraryIcon className="w-4 h-4 shrink-0" />
          Library
        </NavLink>
        <NavLink to="/c/integrations" className={navLinkClass}>
          <IntegrationsIcon className="w-4 h-4 shrink-0" />
          Integrations
        </NavLink>
      </nav>
      <div className="p-2">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-200/80">
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center shrink-0">
            <User className="w-4 h-4 text-gray-500" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900 truncate">Alex Yang</p>
            <p className="text-xs text-gray-500">Free</p>
          </div>
          <button
            type="button"
            className="p-0.5 rounded text-gray-500 hover:bg-gray-300"
            aria-label="Profile menu"
          >
            <ChevronRight className="w-4 h-4 rotate-[-90deg]" />
          </button>
        </div>
      </div>
    </aside>
  )
}

function MainContent() {
  const tabs = useTabsOptional()
  const claimId = useParams<{ claimId?: string }>().claimId
  const hasClaimChat = useClaimChatOptional()
  const hasTabs = tabs && tabs.tabs.length > 0
  const showSplitView = hasTabs && claimId && hasClaimChat

  if (showSplitView) {
    return (
      <>
        <div className="flex-1 flex flex-col min-w-0 min-h-0 px-2 pb-2 pt-0">
          <div className="flex-1 flex flex-col min-h-0 bg-white rounded-xl border border-gray-200 overflow-hidden">
            <TabContentPanel />
          </div>
        </div>
        <aside
          className="shrink-0 flex flex-col bg-[#FAFAF9] px-2 pb-2 pt-0"
          style={{ width: RIGHT_CHAT_WIDTH }}
        >
          <div className="flex-1 flex flex-col min-h-0 bg-white rounded-xl border border-gray-200 overflow-hidden">
            <ChatPanel />
          </div>
        </aside>
      </>
    )
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 min-h-0 px-2 pb-2 pt-0">
      <main className="flex-1 flex flex-col min-w-0 min-h-0 bg-white rounded-xl border border-gray-200 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}

function TopBar() {
  const tabs = useTabsOptional()
  const hasTabs = tabs && tabs.tabs.length > 0

  return (
    <header className="shrink-0 h-12 flex items-center bg-white px-3 gap-2">
      {hasTabs ? (
        <TabStrip />
      ) : (
        <div className="flex-1 min-w-0" />
      )}
    </header>
  )
}

function ContentWithClaimChat() {
  const claimId = useParams<{ claimId?: string }>().claimId

  if (claimId) {
    return (
      <ClaimChatProvider claimId={claimId}>
        <div className="flex-1 flex flex-col min-h-0 min-w-0">
          <TopBar />
          <div className="flex-1 flex min-h-0">
            <MainContent />
          </div>
        </div>
      </ClaimChatProvider>
    )
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 min-w-0">
      <TopBar />
      <div className="flex-1 flex min-h-0">
        <MainContent />
      </div>
    </div>
  )
}

export function AppShell() {
  const [workspaceName] = useState(() => 'My Workspace')

  return (
    <TabsProvider>
      <div className="flex h-screen bg-[#FAFAF9] text-gray-900">
        <LeftSidebar workspaceName={workspaceName} />
        <div className="flex-1 flex flex-col min-w-0 min-h-0 bg-white">
          <ContentWithClaimChat />
        </div>
      </div>
    </TabsProvider>
  )
}
