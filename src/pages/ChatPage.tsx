import { useState, useCallback, useEffect, useRef } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { ClaimHeader } from '../components/shared/ClaimHeader'
import { MessageList } from '../components/chat/MessageList'
import { ChatInput } from '../components/chat/ChatInput'
import { DocumentLibrary } from '../components/documents/DocumentLibrary'
import { MOCK_CLAIMS, MOCK_DOCUMENTS, MOCK_FOLDERS } from '../mockData'
import { mockQueryResponse, mockReportResponse } from '../mockGenerator'
import type { ChatMessage, QueryResponseMessage, ReportMessage, StoredDocument, DocFolder } from '../types'

export function ChatPage() {
  const { claimId } = useParams<{ claimId: string }>()
  const location = useLocation()
  const claim = MOCK_CLAIMS.find((c) => c.claim_id === claimId)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [documents, setDocuments] = useState(
    () => MOCK_DOCUMENTS[claimId ?? ''] ?? []
  )
  const [folders, setFolders] = useState<DocFolder[]>(
    () => MOCK_FOLDERS[claimId ?? ''] ?? []
  )
  const [isLoading, setIsLoading] = useState(false)
  const [docLibraryOpen, setDocLibraryOpen] = useState(true)

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

  const handleUpload = useCallback(
    (file: File, docType: string) => {
      const doc = {
        doc_id: `doc_${Date.now()}`,
        filename: file.name,
        doc_type: docType as import('../types').DocType,
        status: 'Processing' as const,
        created_at: new Date().toISOString(),
        claim_id: claimId ?? '',
      }
      setDocuments((prev) => [...prev, doc])
      setTimeout(() => {
        setDocuments((prev) =>
          prev.map((d) =>
            d.doc_id === doc.doc_id ? { ...d, status: 'Ready' as const } : d
          )
        )
      }, 2000)
    },
    [claimId]
  )

  const handleCreateFolder = useCallback(() => {
    if (!claimId) return
    const name = `Folder ${folders.length + 1}`
    setFolders((prev) => [
      ...prev,
      { folder_id: `f_${Date.now()}`, name, claim_id: claimId },
    ])
  }, [claimId, folders.length])

  const handleMoveToFolder = useCallback((docId: string, folderId: string | null) => {
    setDocuments((prev) =>
      prev.map((d) => (d.doc_id === docId ? { ...d, folder_id: folderId ?? undefined } : d))
    )
  }, [])

  const initialProcessed = useRef(false)
  useEffect(() => {
    const initial = (location.state as { initialQuery?: string })?.initialQuery
    if (initial?.trim() && claimId && !initialProcessed.current) {
      initialProcessed.current = true
      handleSend(initial)
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
    <div className="flex flex-1 min-h-0">
      <div className="flex-1 flex flex-col min-w-0">
        <ClaimHeader claim={claim} onEnrich={() => {}} />
        <MessageList messages={messages} isLoading={isLoading} />
        <ChatInput onSend={handleSend} showSuggestions={messages.length === 0} />
      </div>
      <DocumentLibrary
        claimId={claimId}
        documents={documents}
        folders={folders}
        onUpload={handleUpload}
        onCreateFolder={handleCreateFolder}
        onMoveToFolder={handleMoveToFolder}
        isOpen={docLibraryOpen}
        onToggle={() => setDocLibraryOpen((o) => !o)}
      />
    </div>
  )
}
