import { useRef } from 'react'
import { FileText, Upload, ChevronRight, ChevronLeft } from 'lucide-react'
import type { StoredDocument, DocType } from '../../types'

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
  onUpload: (file: File, docType: DocType) => void
  isOpen: boolean
  onToggle: () => void
}

export function DocumentLibrary({
  claimId,
  documents,
  onUpload,
  isOpen,
  onToggle,
}: DocumentLibraryProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    onUpload(file, 'policy')
    e.target.value = ''
  }

  return (
    <div className="relative flex shrink-0">
      <aside
        className={`shrink-0 border-l border-gray-200 flex flex-col transition-all duration-200 ${
          isOpen ? 'w-64' : 'w-0 overflow-hidden'
        }`}
      >
        <div className="p-2 border-b border-gray-200">
          <h3 className="text-sm font-medium text-black">Documents</h3>
          <p className="text-[11px] text-gray-500">Claim {claimId}</p>
        </div>
        <div
          className="p-2 cursor-pointer border border-dashed border-gray-200 hover:border-gray-300 mb-2 mx-2"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx"
            className="hidden"
            onChange={handleFileChange}
          />
          <div className="flex items-center gap-2 text-gray-500">
            <Upload className="w-4 h-4" />
            <span className="text-xs">Upload</span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-2 space-y-2">
          {documents.map((doc) => (
            <div
              key={doc.doc_id}
              className="flex items-start gap-2 p-2 hover:bg-gray-50"
            >
              <FileText className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <div className="text-sm text-black truncate">{doc.filename}</div>
                <div className="text-xs text-gray-500">
                  {DOC_TYPE_LABELS[doc.doc_type]} · {doc.status}
                </div>
              </div>
            </div>
          ))}
          {documents.length === 0 && (
            <p className="text-xs text-gray-400 px-2">No documents. Upload above.</p>
          )}
        </div>
      </aside>
      <button
        onClick={onToggle}
        className="absolute -left-8 top-1/2 -translate-y-1/2 w-6 h-12 flex items-center justify-center bg-gray-200 hover:bg-gray-300 border border-gray-200 border-r-0"
      >
        {isOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </div>
  )
}
