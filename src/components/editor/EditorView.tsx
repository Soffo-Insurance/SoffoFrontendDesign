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
} from 'lucide-react'
import { BlockSuiteEditor } from './BlockSuiteEditor'

interface EditorViewProps {
  title?: string
  content: string
}

export function EditorView({ title, content }: EditorViewProps) {
  const [style, setStyle] = useState('Body')

  const bodyText = title ? content : (content.split('\n').slice(1).join('\n').trim() || content)
  const displayTitle = title ?? (content.split('\n')[0]?.trim() || 'Untitled')
  const initialContent = title ? `${displayTitle}\n\n${bodyText}` : content

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white">
      {/* Toolbar - minimal, connects to tab above; design identical to app */}
      <div className="shrink-0 flex items-center gap-1.5 px-4 py-2.5 bg-white border-b border-gray-100">
        <select
          value={style}
          onChange={(e) => setStyle(e.target.value)}
          className="text-[13px] font-medium text-gray-600 bg-transparent border-0 rounded px-1.5 py-0.5 cursor-pointer focus:ring-0 focus:outline-none hover:text-gray-900"
        >
          <option value="Body">Paragraph</option>
          <option value="Heading 1">Heading 1</option>
          <option value="Heading 2">Heading 2</option>
          <option value="Heading 3">Heading 3</option>
        </select>
        <div className="w-px h-4 bg-gray-200" />
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
        <div className="w-px h-4 bg-gray-200" />
        <ToolbarButton aria-label="Bullet list">
          <List className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton aria-label="Numbered list">
          <ListOrdered className="w-4 h-4" />
        </ToolbarButton>
        <div className="w-px h-4 bg-gray-200" />
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
        <div className="flex-1 min-w-0" />
        <button
          type="button"
          className="flex items-center gap-1.5 px-2 py-1 rounded text-[13px] font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Insert
        </button>
      </div>

      {/* Document area - BlockSuite (AFFiNE) editor, same white minimal look */}
      <div className="flex-1 overflow-hidden min-h-0 bg-white flex flex-col">
        <div className="flex-1 min-h-0 max-w-[680px] w-full mx-auto flex flex-col">
          <BlockSuiteEditor content={initialContent} />
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
      className="p-1.5 rounded text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
    >
      {children}
    </button>
  )
}
