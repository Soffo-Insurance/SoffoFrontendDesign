import { useClaimChat } from '../../contexts/ClaimChatContext'
import { MessageList } from '../chat/MessageList'
import { ChatInput } from '../chat/ChatInput'

export function ChatPanel() {
  const { claimId, messages, isLoading, send, prefillInput, setPrefillInput } = useClaimChat()

  return (
    <div className="chat-page flex flex-1 flex-col min-h-0 relative h-full">
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
