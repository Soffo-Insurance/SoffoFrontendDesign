import { useState, useCallback, useEffect, useRef } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { MessageList } from '../components/chat/MessageList'
import { ChatInput } from '../components/chat/ChatInput'
import { MOCK_CLAIMS } from '../mockData'
import { mockQueryResponse, mockReportResponse } from '../mockGenerator'
import type { ChatMessage, StoredDocument } from '../types'

export function ChatPage() {
  const { claimId } = useParams<{ claimId: string }>()
  const location = useLocation()
  const claim = MOCK_CLAIMS.find((c) => c.claim_id === claimId)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [prefillInput, setPrefillInput] = useState<string | null>(null)
  const initialProcessed = useRef(false)

  const handleSend = useCallback(
    (text: string, attachments?: StoredDocument[], includeWebSearch?: boolean) => {
      if (!text.trim() || !claimId) return

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: text.trim(),
        timestamp: new Date().toISOString(),
        attachments,
      }
      setMessages((prev) => [...prev, userMsg])
      setIsLoading(true)

      const queryText = includeWebSearch ? `${text} [web search enabled]` : text
      const lower = queryText.toLowerCase()
      const isReportRequest =
        lower.includes('generate') ||
        lower.includes('report') ||
        lower.includes('defensible')

      setTimeout(() => {
        const msgId = `assistant-${Date.now()}`
        if (isReportRequest) {
          const reportMsg = mockReportResponse(claimId, msgId)
          setMessages((prev) => [...prev, reportMsg])
        } else {
          const queryMsg = mockQueryResponse(text, claimId, msgId)
          setMessages((prev) => [...prev, queryMsg])
        }
        setIsLoading(false)
      }, 800 + Math.random() * 400)
    },
    [claimId]
  )

  useEffect(() => {
    const state = location.state as {
      initialQuery?: string
      initialAttachments?: File[]
      includeWebSearch?: boolean
    }
    const initial = state?.initialQuery
    const files = state?.initialAttachments
    const includeWebSearch = state?.includeWebSearch
    if (initial?.trim() && claimId && !initialProcessed.current) {
      initialProcessed.current = true
      const docs = files?.length
        ? files.map((f) => ({
            doc_id: `doc_${Date.now()}_${Math.random().toString(36).slice(2)}`,
            filename: f.name,
            doc_type: 'policy' as const,
            status: 'Ready' as const,
            created_at: new Date().toISOString(),
            claim_id: claimId ?? '',
          }))
        : undefined
      handleSend(initial, docs, includeWebSearch)
      window.history.replaceState({}, '', location.pathname)
    }
  }, [claimId, handleSend, location.state, location.pathname])

  if (!claim) {
    return (
      <div className="flex-1 flex justify-center items-center text-gray-500 text-sm">
        Claim not found
      </div>
    )
  }

  return (
    <div className="chat-page flex flex-1 flex-col min-h-0 relative">
      <MessageList
        messages={messages}
        isLoading={isLoading}
        onFollowUpClick={(text) => setPrefillInput(text)}
      />
      <div className="chat-input-bar absolute bottom-0 left-0 right-0 bg-transparent">
        <ChatInput
            onSend={handleSend}
            claimId={claimId}
            prefill={prefillInput}
            onPrefillConsumed={() => setPrefillInput(null)}
          />
      </div>
    </div>
  )
}
