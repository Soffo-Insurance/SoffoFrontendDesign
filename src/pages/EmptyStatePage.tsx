import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plus, Mic, ArrowUp, MoreHorizontal } from 'lucide-react'
import { MOCK_CLAIMS } from '../mockData'

export function EmptyStatePage() {
  const [input, setInput] = useState('')
  const navigate = useNavigate()
  const firstClaimId = MOCK_CLAIMS[0]?.claim_id

  const handleSubmit = () => {
    const trimmed = input.trim()
    if (!trimmed || !firstClaimId) return
    navigate(`/c/${firstClaimId}`, { state: { initialQuery: trimmed } })
  }

  const handleAddFiles = () => {
    if (firstClaimId) navigate(`/c/${firstClaimId}`)
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-white px-4">
      <div className="w-full max-w-2xl flex flex-col items-center">
        <div className="w-16 h-8 rounded-b-full bg-gray-200/60 mb-8" aria-hidden />
        <div className="w-full bg-white border border-gray-200 rounded-2xl shadow-soft focus-within:shadow-soft-md focus-within:border-gray-300 transition-all overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3">
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSubmit())}
              placeholder="Ask anything..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400 min-w-0"
            />
          </div>
          <div className="flex items-center justify-between px-4 py-2 border-t border-gray-100">
            <button
              type="button"
              onClick={handleAddFiles}
              className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add tabs or files</span>
            </button>
            <div className="flex items-center gap-1">
              <button type="button" className="p-1.5 text-gray-400 hover:text-gray-600" title="More">
                <MoreHorizontal className="w-4 h-4" />
              </button>
              <button type="button" className="p-1.5 text-gray-400 hover:text-gray-600" title="Voice input">
                <Mic className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!input.trim()}
                className="p-1.5 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-40 disabled:cursor-not-allowed"
                title="Send"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
