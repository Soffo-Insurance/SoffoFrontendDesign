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
    `flex items-center gap-1.5 px-1.5 py-1 rounded-md text-sm font-medium text-gray-900 transition-colors ${
      isActive ? 'bg-gray-200' : 'hover:bg-gray-200/70'
    }`

  return (
    <aside
      className="shrink-0 flex flex-col bg-[#FAFAF9]"
      style={{ width: SIDEBAR_WIDTH }}
    >
      <div className="px-2 pt-2 pb-1.5 flex items-center gap-1.5">
        <button
          type="button"
          className="flex items-center gap-1.5 min-w-0 flex-1 text-left rounded-md py-1 px-1.5 hover:bg-gray-200/70 transition-colors"
          aria-label="Switch workspace"
        >
          <span className="w-5 h-5 shrink-0 rounded bg-gray-200 flex items-center justify-center text-[10px] font-semibold text-gray-700 leading-none">
            {workspaceName.charAt(0).toUpperCase() || 'W'}
          </span>
          <span className="text-sm font-medium text-gray-900 truncate min-w-0 flex-1">{workspaceName}</span>
          <ChevronDown className="w-3.5 h-3.5 shrink-0 text-gray-500" />
        </button>
        <button
          type="button"
          className="p-0.5 rounded text-gray-500 hover:bg-gray-200 shrink-0"
          aria-label="Collapse sidebar"
        >
          <PanelLeftIcon className="w-3.5 h-3.5" />
        </button>
      </div>
      <nav className="flex-1 px-1.5 py-1 space-y-0.5">
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
      <div className="px-1.5 py-1.5">
        <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-gray-200/80">
          <div className="w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center shrink-0">
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
        <div className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden">
          <TabContentPanel />
        </div>
        <aside
          className="shrink-0 flex flex-col bg-white"
          style={{ width: RIGHT_CHAT_WIDTH }}
        >
          <ChatPanel />
        </aside>
      </>
    )
  }

  return (
    <main className="flex-1 flex flex-col min-w-0 min-h-0 overflow-auto">
      <Outlet />
    </main>
  )
}

function TopBar() {
  const tabs = useTabsOptional()
  const hasTabs = tabs && tabs.tabs.length > 0

  return (
    <header className="shrink-0 h-10 flex items-center px-3 gap-2">
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

  const shell = (
    <div className="flex-1 flex flex-col min-h-0 min-w-0 p-3">
      <div className="flex-1 flex flex-col min-h-0 min-w-0 bg-white rounded-lg border border-gray-200 overflow-hidden">
        <TopBar />
        <div className="flex-1 flex min-h-0 min-w-0 overflow-hidden">
          <MainContent />
        </div>
      </div>
    </div>
  )

  if (claimId) {
    return (
      <ClaimChatProvider claimId={claimId}>
        <div className="flex-1 flex flex-col min-h-0 min-w-0">
          {shell}
        </div>
      </ClaimChatProvider>
    )
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 min-w-0">
      {shell}
    </div>
  )
}

export function AppShell() {
  const [workspaceName] = useState(() => 'My Workspace')

  return (
    <TabsProvider>
      <div className="flex h-screen bg-[#FAFAF9] text-gray-900">
        <LeftSidebar workspaceName={workspaceName} />
        <div className="flex-1 flex flex-col min-w-0 min-h-0 bg-[#FAFAF9]">
          <ContentWithClaimChat />
        </div>
      </div>
    </TabsProvider>
  )
}
