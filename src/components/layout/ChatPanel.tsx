import { useCallback } from 'react'
import { useClaimChat } from '../../contexts/ClaimChatContext'
import { useLibraryOptional } from '../../contexts/LibraryContext'
import { MessageList } from '../chat/MessageList'
import { ChatInput } from '../chat/ChatInput'

export function ChatPanel() {
  const { claimId, messages, isLoading, send, prefillInput, setPrefillInput } = useClaimChat()
  const library = useLibraryOptional()
  const handleSavePrompt = useCallback(
    (content: string) => {
      const title = content.slice(0, 80).trim() || 'Untitled prompt'
      library?.addSavedPrompt({ title, body: content })
    },
    [library]
  )

  return (
    <div className="chat-page flex flex-1 flex-col min-h-0 relative h-full">
      <MessageList
        messages={messages}
        isLoading={isLoading}
        onFollowUpClick={(text) => setPrefillInput(text)}
        onSavePrompt={handleSavePrompt}
      />
      <div className="chat-input-bar absolute bottom-0 left-0 right-0 bg-transparent">
        <ChatInput
          onSend={send}
          claimId={claimId}
          prefill={prefillInput}
          onPrefillConsumed={() => setPrefillInput(null)}
          placeholder="Ask anything"
          sidePanel
        />
      </div>
    </div>
  )
}
