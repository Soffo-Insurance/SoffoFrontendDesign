import { useState, useRef } from 'react'
import { FileText, Upload, ChevronRight, ChevronLeft, FolderPlus, Folder, ChevronDown, ChevronRight as ChevronRightIcon } from 'lucide-react'
import type { StoredDocument, DocType, DocFolder } from '../../types'
import { DOC_DRAG_TYPE } from '../../utils/drag'

const DOC_TYPE_LABELS: Record<DocType, string> = {
  policy: 'Policy',
  inspection_report: 'Inspection',
  estimate: 'Estimate',
  adjuster_notes: 'Adjuster Notes',
  legal: 'Legal',
  permit: 'Permit',
}

interface DocumentLibraryProps {
  claimId: string
  documents: StoredDocument[]
  folders: DocFolder[]
  onUpload: (file: File, docType: DocType) => void
  onCreateFolder: () => void
  onMoveToFolder: (docId: string, folderId: string | null) => void
  isOpen: boolean
  onToggle: () => void
}

export function DocumentLibrary({
  claimId,
  documents,
  folders,
  onUpload,
  onCreateFolder,
  onMoveToFolder,
  isOpen,
  onToggle,
}: DocumentLibraryProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    () => new Set(folders.map((f) => f.folder_id))
  )

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev)
      if (next.has(folderId)) next.delete(folderId)
      else next.add(folderId)
      return next
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    onUpload(file, 'policy')
    e.target.value = ''
  }

  const handleDocDragStart = (e: React.DragEvent, doc: StoredDocument) => {
    e.dataTransfer.setData(DOC_DRAG_TYPE, JSON.stringify(doc))
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleFolderDrop = (e: React.DragEvent, folderId: string) => {
    e.preventDefault()
    e.currentTarget.classList.remove('bg-gray-100', 'border-gray-300')
    const raw = e.dataTransfer.getData(DOC_DRAG_TYPE)
    if (!raw) return
    try {
      const doc = JSON.parse(raw) as StoredDocument
      if (doc.folder_id !== folderId) onMoveToFolder(doc.doc_id, folderId)
    } catch {}
  }

  const handleFolderDragOver = (e: React.DragEvent, folderId: string) => {
    e.preventDefault()
    if (e.dataTransfer.types.includes(DOC_DRAG_TYPE)) {
      e.dataTransfer.dropEffect = 'move'
      e.currentTarget.classList.add('bg-gray-100', 'border-gray-300')
    }
  }

  const handleFolderDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('bg-gray-100', 'border-gray-300')
  }

  const handleUnfiledDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.currentTarget.classList.remove('bg-gray-100')
    const raw = e.dataTransfer.getData(DOC_DRAG_TYPE)
    if (!raw) return
    try {
      const doc = JSON.parse(raw) as StoredDocument
      if (doc.folder_id) onMoveToFolder(doc.doc_id, null)
    } catch {}
  }

  const docsByFolder = documents.reduce<Record<string, StoredDocument[]>>((acc, doc) => {
    const fid = doc.folder_id ?? '_root'
    if (!acc[fid]) acc[fid] = []
    acc[fid].push(doc)
    return acc
  }, {})

  const rootDocs = docsByFolder['_root'] ?? []

  return (
    <div className="relative flex shrink-0">
      <aside
        className={`shrink-0 border-l border-gray-100 flex flex-col transition-all duration-200 shadow-soft ${
          isOpen ? 'w-64' : 'w-0 overflow-hidden'
        }`}
      >
        <div className="p-3 border-b border-gray-100">
          <h3 className="text-sm font-medium text-black">Documents</h3>
          <p className="text-[11px] text-gray-500 mt-0.5">Claim {claimId}</p>
        </div>
        <div className="flex gap-2 p-3 border-b border-gray-100">
          <div
            className="flex-1 cursor-pointer border border-dashed border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-lg p-2.5 flex items-center justify-center gap-1.5 transition-all"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx"
              className="hidden"
              onChange={handleFileChange}
            />
            <Upload className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-xs text-gray-600">Upload</span>
          </div>
          <button
            onClick={onCreateFolder}
            className="p-2.5 border border-dashed border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-lg flex items-center justify-center transition-all"
            title="New folder"
          >
            <FolderPlus className="w-3.5 h-3.5 text-gray-500" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
          {folders.map((folder) => {
            const docs = docsByFolder[folder.folder_id] ?? []
            const isExpanded = expandedFolders.has(folder.folder_id)
            return (
              <div
                key={folder.folder_id}
                className="mb-1 rounded-lg border border-transparent transition-colors"
                onDrop={(e) => handleFolderDrop(e, folder.folder_id)}
                onDragOver={(e) => handleFolderDragOver(e, folder.folder_id)}
                onDragLeave={handleFolderDragLeave}
              >
                <button
                  onClick={() => toggleFolder(folder.folder_id)}
                  className="w-full flex items-center gap-1.5 py-2 px-3 hover:bg-gray-50 rounded-lg text-left transition-colors"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                  ) : (
                    <ChevronRightIcon className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                  )}
                  <Folder className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                  <span className="text-xs font-medium text-black truncate flex-1">{folder.name}</span>
                  <span className="text-[10px] text-gray-400">{docs.length}</span>
                </button>
                {isExpanded &&
                  docs.map((doc) => (
                    <div
                      key={doc.doc_id}
                      draggable
                      onDragStart={(e) => handleDocDragStart(e, doc)}
                      className="flex items-start gap-2 py-2 pl-7 pr-3 hover:bg-gray-50 rounded-lg cursor-grab active:cursor-grabbing transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                      <div className="min-w-0 flex-1">
                        <div className="text-sm text-black truncate" title="Drag to chat to attach">
                          {doc.filename}
                        </div>
                        <div className="text-xs text-gray-500">
                          {DOC_TYPE_LABELS[doc.doc_type]} · {doc.status}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )
          })}
          {(folders.length > 0 || rootDocs.length > 0) && (
            <div className="mt-2">
              <div
                className="rounded-lg border border-dashed border-gray-200 p-2 transition-colors min-h-[40px]"
                onDrop={handleUnfiledDrop}
                onDragOver={(e) => {
                  e.preventDefault()
                  if (e.dataTransfer.types.includes(DOC_DRAG_TYPE)) {
                    e.dataTransfer.dropEffect = 'move'
                    e.currentTarget.classList.add('bg-gray-100')
                  }
                }}
                onDragLeave={(e) => e.currentTarget.classList.remove('bg-gray-100')}
              >
                <div className="text-[10px] text-gray-400 px-2 py-1 uppercase">Unfiled</div>
                {rootDocs.map((doc) => (
                <div
                  key={doc.doc_id}
                  draggable
                  onDragStart={(e) => handleDocDragStart(e, doc)}
                  className="flex items-start gap-2 py-2 px-3 hover:bg-gray-50 rounded-lg cursor-grab active:cursor-grabbing transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm text-black truncate" title="Drag to chat to attach">
                      {doc.filename}
                    </div>
                    <div className="text-xs text-gray-500">
                      {DOC_TYPE_LABELS[doc.doc_type]} · {doc.status}
                    </div>
                  </div>
                </div>
              ))}
              </div>
            </div>
          )}
          {documents.length === 0 && folders.length === 0 && (
            <p className="text-xs text-gray-400 px-2 py-2">No documents. Upload or create a folder.</p>
          )}
        </div>
      </aside>
      <button
        onClick={onToggle}
        className="absolute -left-8 top-1/2 -translate-y-1/2 w-6 h-12 flex items-center justify-center bg-white hover:bg-gray-100 border border-gray-200 rounded-l-lg shadow-soft transition-colors"
      >
        {isOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </div>
  )
}
