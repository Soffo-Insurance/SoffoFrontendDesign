import ReactMarkdown from 'react-markdown'
import { ConfidenceMeter } from '../shared/ConfidenceMeter'
import { CitationBadge } from '../shared/CitationBadge'
import type { QueryResponseMessage } from '../../types'

interface AssistantBubbleProps {
  message: QueryResponseMessage
}

function renderContentWithCitations(text: string) {
  const parts = text.split(/(\[[^\]]+\])/g)
  return parts.map((part, i) => {
    if (part.startsWith('[') && part.endsWith(']')) {
      return <CitationBadge key={i} citation={part.slice(1, -1)} />
    }
    return (
      <span key={i} dangerouslySetInnerHTML={{
        __html: part.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>'),
      }} />
    )
  })
}

export function AssistantBubble({ message }: AssistantBubbleProps) {
  const hasCitations = message.content.includes('[')
  const showMeter = message.confidence != null

  return (
    <div className="flex justify-start">
      <div className="max-w-[85%] rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-soft">
        <div className="text-gray-800">
          {hasCitations ? (
            <p className="text-sm leading-relaxed">{renderContentWithCitations(message.content)}</p>
          ) : (
            <ReactMarkdown>{message.content}</ReactMarkdown>
          )}
        </div>
        {showMeter && (
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-4">
            <ConfidenceMeter value={message.confidence!} />
            {message.graphNodesUsed != null && (
              <span>{message.graphNodesUsed} graph nodes</span>
            )}
            {message.chunksUsed != null && (
              <span>{message.chunksUsed} chunks</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
