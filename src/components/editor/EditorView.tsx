import { useState } from 'react'
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Plus,
  ChevronDown,
} from 'lucide-react'

interface EditorViewProps {
  title?: string
  content: string
}

export function EditorView({ title, content }: EditorViewProps) {
  const [editingMode, setEditingMode] = useState<'editing' | 'suggesting' | 'viewing'>('editing')
  const [style, setStyle] = useState('Body')

  const displayTitle = title ?? content.split('\n')[0]?.trim() || 'Untitled'
  const bodyText = title ? content : content.split('\n').slice(1).join('\n').trim() || content

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white">
      {/* Toolbar */}
      <div className="shrink-0 flex items-center gap-2 px-3 py-2 bg-gray-100 border-b border-gray-200">
        <select
          value={style}
          onChange={(e) => setStyle(e.target.value)}
          className="text-sm font-medium text-gray-700 bg-transparent border-0 rounded px-2 py-1 cursor-pointer focus:ring-1 focus:ring-gray-300"
        >
          <option value="Body">Body</option>
          <option value="Heading 1">Heading 1</option>
          <option value="Heading 2">Heading 2</option>
          <option value="Heading 3">Heading 3</option>
        </select>
        <div className="w-px h-5 bg-gray-300" />
        <div className="flex items-center gap-0.5">
          <ToolbarButton aria-label="Bold">
            <Bold className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton aria-label="Italic">
            <Italic className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton aria-label="Underline">
            <Underline className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton aria-label="Strikethrough">
            <Strikethrough className="w-4 h-4" />
          </ToolbarButton>
        </div>
        <div className="w-px h-5 bg-gray-300" />
        <ToolbarButton aria-label="Bullet list">
          <List className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton aria-label="Numbered list">
          <ListOrdered className="w-4 h-4" />
        </ToolbarButton>
        <div className="w-px h-5 bg-gray-300" />
        <div className="flex items-center gap-0.5">
          <ToolbarButton aria-label="Align left">
            <AlignLeft className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton aria-label="Align center">
            <AlignCenter className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton aria-label="Align right">
            <AlignRight className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton aria-label="Justify">
            <AlignJustify className="w-4 h-4" />
          </ToolbarButton>
        </div>
        <div className="flex-1 min-w-0" />
        <button
          type="button"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Insert
        </button>
        <div className="relative">
          <button
            type="button"
            onClick={() => setEditingMode((m) => (m === 'editing' ? 'suggesting' : m === 'suggesting' ? 'viewing' : 'editing'))}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors capitalize"
          >
            {editingMode} mode
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Document area */}
      <div className="flex-1 overflow-auto min-h-0">
        <div className="max-w-[720px] mx-auto px-8 py-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight">
            {displayTitle}
          </h1>
          <div className="text-[15px] leading-relaxed text-gray-800 whitespace-pre-wrap">
            {bodyText}
          </div>
        </div>
      </div>
    </div>
  )
}

function ToolbarButton({
  children,
  'aria-label': ariaLabel,
}: {
  children: React.ReactNode
  'aria-label': string
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className="p-1.5 rounded text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-colors"
    >
      {children}
    </button>
  )
}
