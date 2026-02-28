import { useEffect, useRef, useMemo } from 'react'
import { AffineEditorContainer } from '@blocksuite/presets'
import { createEmptyDoc } from '@blocksuite/presets'
import type { Doc } from '@blocksuite/store'
// Optional: uncomment if your @blocksuite/presets includes themes
// import '@blocksuite/presets/themes/affine.css'

interface BlockSuiteEditorProps {
  /** Initial document content (plain text). Seeded into the first paragraph. */
  content?: string
  /** Optional title; if provided, first line or content can be used as title block. */
  title?: string
}

/**
 * BlockSuite (AFFiNE) document editor. Mounted inside EditorView shell so app layout and design stay identical.
 */
export function BlockSuiteEditor({ content = '', title }: BlockSuiteEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<AffineEditorContainer | null>(null)

  const { doc } = useMemo(() => {
    const { doc: d, init } = createEmptyDoc()
    init()
    return { doc: d }
  }, [])

  useEffect(() => {
    if (!doc || !containerRef.current) return

    const editor = new AffineEditorContainer()
    editor.doc = doc as Doc
    editorRef.current = editor

    containerRef.current.innerHTML = ''
    containerRef.current.appendChild(editor)

    return () => {
      editor.remove()
      editorRef.current = null
    }
  }, [doc])

  // Seed initial content into the first paragraph once the block tree is ready
  useEffect(() => {
    if (!doc) return
    const initialText = [title, content].filter(Boolean).join(title && content ? '\n\n' : '')
    if (!initialText.trim()) return

    const seed = () => {
      try {
        const paragraphs = doc.getBlocksByFlavour('affine:paragraph')
        const first = paragraphs[0]
        const model = first?.model
        const textProp = model && (model as { text?: { insert: (s: string, i: number) => void } }).text
        if (typeof textProp?.insert === 'function') {
          textProp.insert(initialText, 0)
        }
      } catch {
        // ignore
      }
    }
    let disposable: { dispose?: () => void } | undefined
    if (doc.ready) seed()
    else disposable = doc.slots.ready.on(seed)
    return () => disposable?.dispose?.()
  }, [doc, content, title])

  return (
    <div
      ref={containerRef}
      className="blocksuite-editor-wrap h-full w-full overflow-auto bg-white"
      data-testid="blocksuite-editor"
    />
  )
}
