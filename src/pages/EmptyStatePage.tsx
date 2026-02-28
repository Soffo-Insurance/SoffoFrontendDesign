import { FileText } from 'lucide-react'

export function EmptyStatePage() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center max-w-sm px-4">
        <FileText className="w-12 h-12 mx-auto text-gray-300 mb-3" />
        <h2 className="text-sm font-medium text-black mb-1">Select a claim</h2>
        <p className="text-gray-500 text-xs">
          Choose a claim from the sidebar to start asking questions, storing documents, and generating defensible reports.
        </p>
      </div>
    </div>
  )
}
