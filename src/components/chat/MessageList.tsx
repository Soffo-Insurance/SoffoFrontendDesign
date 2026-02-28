import { useEffect, useRef } from 'react'
import { UserBubble } from './UserBubble'
import { AssistantBubble } from './AssistantBubble'
import { ReportCard } from './ReportCard'
import { TypingIndicator } from './TypingIndicator'
import type { ChatMessage, QueryResponseMessage, ReportMessage } from '../../types'

interface MessageListProps {
  messages: ChatMessage[]
  isLoading: boolean
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {messages.length === 0 && !isLoading && (
          <div className="text-center py-12 text-gray-400 text-sm">
            Ask a question or generate a defensible report. Try a suggested prompt below.
          </div>
        )}
        {messages.map((msg) => {
          if (msg.role === 'user') {
            return <UserBubble key={msg.id} content={msg.content} />
          }
          if ((msg as ReportMessage).report) {
            return (
              <ReportCard
                key={msg.id}
                report={(msg as ReportMessage).report!}
                onExport={() => {}}
              />
            )
          }
          return (
            <AssistantBubble
              key={msg.id}
              message={msg as QueryResponseMessage}
            />
          )
        })}
        {isLoading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
