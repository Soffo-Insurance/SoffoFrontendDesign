import { Outlet } from 'react-router-dom'

export function ChatLayout() {
  return (
    <div className="flex h-screen bg-white">
      <main className="flex-1 flex flex-col min-w-0">
        <Outlet />
      </main>
    </div>
  )
}
