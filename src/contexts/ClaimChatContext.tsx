import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  ReactNode,
} from 'react'
import { useLocation } from 'react-router-dom'
import type { ChatMessage, StoredDocument } from '../types'
import { mockQueryResponse, mockReportResponse } from '../mockGenerator'

interface ClaimChatContextValue {
  claimId: string
  messages: ChatMessage[]
  isLoading: boolean
  prefillInput: string | null
  setPrefillInput: (v: string | null) => void
  send: (text: string, attachments?: StoredDocument[], includeWebSearch?: boolean) => void
}

const ClaimChatContext = createContext<ClaimChatContextValue | null>(null)

export function ClaimChatProvider({
  claimId,
  children,
}: {
  claimId: string
  children: ReactNode
}) {
  const location = useLocation()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [prefillInput, setPrefillInput] = useState<string | null>(null)
  const initialProcessed = useRef(false)

  const send = useCallback(
    (text: string, attachments?: StoredDocument[], includeWebSearch?: boolean) => {
      if (!text.trim()) return

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
    if (initial?.trim() && !initialProcessed.current) {
      initialProcessed.current = true
      const docs = files?.length
        ? files.map((f) => ({
            doc_id: `doc_${Date.now()}_${Math.random().toString(36).slice(2)}`,
            filename: f.name,
            doc_type: 'policy' as const,
            status: 'Ready' as const,
            created_at: new Date().toISOString(),
            claim_id: claimId,
          }))
        : undefined
      send(initial, docs, includeWebSearch)
      window.history.replaceState({}, '', location.pathname)
    }
  }, [claimId, send, location.state, location.pathname])

  const value: ClaimChatContextValue = {
    claimId,
    messages,
    isLoading,
    prefillInput,
    setPrefillInput,
    send,
  }

  return (
    <ClaimChatContext.Provider value={value}>{children}</ClaimChatContext.Provider>
  )
}

export function useClaimChat() {
  const ctx = useContext(ClaimChatContext)
  if (!ctx) throw new Error('useClaimChat must be used within ClaimChatProvider')
  return ctx
}

export function useClaimChatOptional() {
  return useContext(ClaimChatContext)
}
