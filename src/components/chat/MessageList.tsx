import { useEffect, useRef } from 'react'
import { UserBubble } from './UserBubble'
import { AssistantBubble } from './AssistantBubble'
import { ReportCard } from './ReportCard'
import { WorkingProgress } from './WorkingProgress'
import type { ChatMessage, QueryResponseMessage, ReportMessage } from '../../types'

interface MessageListProps {
  messages: ChatMessage[]
  isLoading: boolean
  onFollowUpClick?: (text: string) => void
}

export function MessageList({ messages, isLoading, onFollowUpClick }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  return (
    <div className="flex-1 overflow-y-auto bg-white">
      <div className="max-w-[800px] mx-auto px-6 py-8 space-y-8">
        {messages.length === 0 && !isLoading && (
          <div className="text-center py-16 text-gray-400 text-sm">
            Ask a question or generate a defensible report.
          </div>
        )}
        {messages.map((msg) => {
          if (msg.role === 'user') {
            return (
              <UserBubble
                key={msg.id}
                content={msg.content}
                attachments={msg.attachments}
              />
            )
          }
          if ((msg as ReportMessage).report) {
            return (
              <div key={msg.id} className="flex-1 min-w-0 max-w-[720px]">
                <ReportCard
                  report={(msg as ReportMessage).report!}
                  onExport={() => {}}
                />
              </div>
            )
          }
          return (
            <AssistantBubble
              key={msg.id}
              message={msg as QueryResponseMessage}
              onFollowUpClick={onFollowUpClick}
            />
          )
        })}
        {isLoading && <WorkingProgress animate />}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
