import { Routes, Route, Navigate } from 'react-router-dom'
import { ChatLayout } from './components/layout/ChatLayout'
import { ChatPage } from './pages/ChatPage'
import { EmptyStatePage } from './pages/EmptyStatePage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<ChatLayout />}>
        <Route index element={<Navigate to="/c" replace />} />
        <Route path="c" element={<EmptyStatePage />} />
        <Route path="c/:claimId" element={<ChatPage />} />
      </Route>
    </Routes>
  )
}

export default App
