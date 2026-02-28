import { useParams } from 'react-router-dom'
import { MessageList } from '../components/chat/MessageList'
import { ChatInput } from '../components/chat/ChatInput'
import { MOCK_CLAIMS } from '../mockData'
import { useClaimChat } from '../contexts/ClaimChatContext'

export function ChatPage() {
  const { claimId } = useParams<{ claimId: string }>()
  const claim = MOCK_CLAIMS.find((c) => c.claim_id === claimId)
  const { messages, isLoading, send, prefillInput, setPrefillInput } = useClaimChat()

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
          onSend={send}
          claimId={claimId}
          prefill={prefillInput}
          onPrefillConsumed={() => setPrefillInput(null)}
        />
      </div>
    </div>
  )
}
