import { useState, useRef, useEffect } from 'react'
import { Send } from 'lucide-react'
import { SUGGESTED_PROMPTS } from '../../mockData'

interface ChatInputProps {
  onSend: (text: string) => void
  showSuggestions?: boolean
}

export function ChatInput({ onSend, showSuggestions = true }: ChatInputProps) {
  const [input, setInput] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const ta = textareaRef.current
    if (ta) {
      ta.style.height = 'auto'
      ta.style.height = `${Math.min(ta.scrollHeight, 200)}px`
    }
  }, [input])

  const handleSubmit = () => {
    const trimmed = input.trim()
    if (!trimmed) return
    onSend(trimmed)
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="shrink-0 border-t border-gray-200 px-4 py-3">
      {showSuggestions && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {SUGGESTED_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => onSend(prompt)}
              className="px-2 py-1 text-xs border border-gray-200 text-gray-600 hover:bg-gray-50"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}
      <div className="flex items-end gap-2 border border-gray-200 p-2">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about causation, coverage..."
          rows={1}
          className="flex-1 resize-none bg-transparent px-2 py-1.5 text-sm outline-none placeholder:text-gray-400 min-h-[36px] max-h-[200px]"
        />
        <button
          onClick={handleSubmit}
          disabled={!input.trim()}
          className="p-1.5 bg-black text-white hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
