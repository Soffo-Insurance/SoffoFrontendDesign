import { useState, useEffect, useRef } from 'react'
import { ChevronDown, Download, Printer } from 'lucide-react'
import type { ReportData } from '../../types'

interface ReportCardProps {
  report: ReportData
  onExport: () => void
}

const SECTION_KEYS = [
  'executiveSummary',
  'causationDiagram',
  'coverageAnalysis',
  'environmentalEvidence',
  'behavioralSignals',
  'timeline',
  'recommendedAction',
  'citationIndex',
] as const

const SECTION_LABELS: Record<(typeof SECTION_KEYS)[number], string> = {
  executiveSummary: 'Executive Summary',
  causationDiagram: 'Causation Chain Diagram',
  coverageAnalysis: 'Coverage Analysis',
  environmentalEvidence: 'Environmental Evidence',
  behavioralSignals: 'Behavioral & SIU Signals',
  timeline: 'Chronological Timeline',
  recommendedAction: 'Recommended Action',
  citationIndex: 'Citation Index',
}

function CausationDiagram({ mermaidCode }: { mermaidCode: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current || !mermaidCode) return
    import('mermaid').then((mermaid) => {
      mermaid.default.initialize({ startOnLoad: false, theme: 'neutral' })
      mermaid.default.run({ nodes: [ref.current!], suppressErrors: true }).catch(() => {})
    })
  }, [mermaidCode])

  return (
    <div ref={ref} className="mermaid bg-gray-50/60 p-4 rounded-xl text-sm">
      {mermaidCode}
    </div>
  )
}

export function ReportCard({ report }: ReportCardProps) {
  const [openSection, setOpenSection] = useState<string>('executiveSummary')

  const handleExport = () => {
    const md = [
      `# Defensible Report`,
      ``,
      `## Executive Summary`,
      report.executiveSummary,
      ``,
      `## Coverage Analysis`,
      report.coverageAnalysis,
      ``,
      `## Environmental Evidence`,
      report.environmentalEvidence.map((r) => `- ${r.dataType}: ${r.value} (${r.source})`).join('\n'),
      ``,
      `## Recommended Action`,
      report.recommendedAction,
    ].join('\n')
    const blob = new Blob([md], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'defensible-report.md'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handlePrint = () => window.print()

  return (
    <div className="rounded-2xl border border-gray-200 overflow-hidden shadow-soft-lg bg-white">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50/80">
        <h3 className="text-sm font-medium text-black">Report</h3>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-2 text-xs text-gray-600 hover:bg-white hover:text-black rounded-lg border border-gray-200 shadow-soft-button transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            Export
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 text-xs text-gray-600 hover:bg-white hover:text-black rounded-lg border border-gray-200 shadow-soft-button transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            Print
          </button>
        </div>
      </div>
      <div className="divide-y divide-gray-100">
        {SECTION_KEYS.map((key) => {
          const isOpen = openSection === key
          const label = SECTION_LABELS[key]
          let content: React.ReactNode = null

          switch (key) {
            case 'executiveSummary':
              content = <p className="text-gray-800 text-sm leading-relaxed">{report.executiveSummary}</p>
              break
            case 'causationDiagram':
              if (report.causationDiagram) {
                content = <CausationDiagram mermaidCode={report.causationDiagram} />
              } else content = null
              break
            case 'coverageAnalysis':
              content = <div className="text-gray-800 text-sm whitespace-pre-wrap">{report.coverageAnalysis}</div>
              break
            case 'environmentalEvidence':
              content = (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 text-xs font-medium">Data Type</th>
                      <th className="text-left py-2 font-medium">Value</th>
                      <th className="text-left py-2 font-medium">Source</th>
                      <th className="text-left py-2 font-medium">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.environmentalEvidence.map((row, i) => (
                      <tr key={i} className="border-b border-gray-100">
                        <td className="py-2">{row.dataType}</td>
                        <td className="py-2">{row.value}</td>
                        <td className="py-2">{row.source}</td>
                        <td className="py-2">{row.timestamp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
              break
            case 'behavioralSignals':
              content = <p className="text-gray-800 text-sm">{report.behavioralSignals}</p>
              break
            case 'timeline':
              content = (
                <ul className="space-y-2 text-sm">
                  {report.timeline.map((evt) => (
                    <li key={evt.event_id} className="flex gap-3">
                      <span className="text-gray-500 shrink-0">{evt.event_date}</span>
                      <span className="font-medium">{evt.event_type}</span>
                      <span className="text-gray-600">{evt.description}</span>
                    </li>
                  ))}
                </ul>
              )
              break
            case 'recommendedAction':
              content = <p className="text-gray-800 text-sm whitespace-pre-wrap">{report.recommendedAction}</p>
              break
            case 'citationIndex':
              content = (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 text-xs font-medium">Chunk ID</th>
                      <th className="text-left py-2 font-medium">Source</th>
                      <th className="text-left py-2 font-medium">Page</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.citationIndex.map((c, i) => (
                      <tr key={i} className="border-b border-gray-100">
                        <td className="py-2 font-mono text-xs">{c.chunk_id}</td>
                        <td className="py-2">{c.source}</td>
                        <td className="py-2">{c.page}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
              break
          }

          if (!content && key === 'causationDiagram') return null

          return (
            <div key={key}>
              <button
                onClick={() => setOpenSection(isOpen ? '' : key)}
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
              >
                <span className="text-sm font-medium text-black">{label}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              {isOpen && content && (
                <div className="px-4 pb-4 pt-0">{content}</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
