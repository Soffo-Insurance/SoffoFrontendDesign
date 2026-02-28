import { Routes, Route, Navigate } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { ChatPage } from './pages/ChatPage'
import { EmptyStatePage } from './pages/EmptyStatePage'

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
      {title} — coming soon
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppShell />}>
        <Route index element={<Navigate to="/c" replace />} />
        <Route path="c" element={<EmptyStatePage />} />
        <Route path="c/library" element={<PlaceholderPage title="Library" />} />
        <Route path="c/integrations" element={<PlaceholderPage title="Integrations" />} />
        <Route path="c/:claimId" element={<ChatPage />} />
      </Route>
    </Routes>
  )
}

export default App
