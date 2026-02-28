export interface Claim {
  claim_id: string
  policy_id: string
  property_id: string
  property_address: string
  loss_date: string
  jurisdiction: string
  status: string
}

export type MessageRole = 'user' | 'assistant'

export interface ChatMessage {
  id: string
  role: MessageRole
  content: string
  timestamp: string
}

export interface QueryResponseMessage extends ChatMessage {
  role: 'assistant'
  queryType?: string
  citations?: string[]
  graphNodesUsed?: number
  chunksUsed?: number
  confidence?: number
}

export interface ReportMessage extends ChatMessage {
  role: 'assistant'
  report?: ReportData
}

export interface ReportData {
  executiveSummary: string
  causationDiagram?: string
  coverageAnalysis: string
  environmentalEvidence: Array<{ dataType: string; value: string; source: string; timestamp: string }>
  behavioralSignals: string
  timeline: Array<{ event_id: string; event_type: string; event_date: string; description: string }>
  recommendedAction: string
  citationIndex: Array<{ chunk_id: string; source: string; page: string }>
}

export type DocType = 'policy' | 'inspection_report' | 'estimate' | 'adjuster_notes' | 'legal' | 'permit'

export interface StoredDocument {
  doc_id: string
  filename: string
  doc_type: DocType
  status: 'Processing' | 'Ready' | 'Failed'
  created_at: string
  claim_id: string
}
