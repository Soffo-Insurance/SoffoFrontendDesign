import type { QueryResponseMessage, ReportMessage } from './types'
import { MOCK_QUERY_RESPONSES } from './mockData'
import { generateMockReport } from './mockReport'

function normalizeQuery(q: string): string {
  return q.toLowerCase().trim().replace(/\?/g, '')
}

export function mockQueryResponse(
  question: string,
  claimId: string,
  messageId: string
): QueryResponseMessage {
  const normalized = normalizeQuery(question)
  let answer = MOCK_QUERY_RESPONSES.default
  if (normalized.includes('foundation damage') || normalized.includes('what caused')) answer = MOCK_QUERY_RESPONSES['what caused the foundation damage']
  else if (normalized.includes('coverage a') || normalized.includes('covered')) answer = MOCK_QUERY_RESPONSES['is this covered under coverage a']
  else if (normalized.includes('environmental')) answer = MOCK_QUERY_RESPONSES['environmental evidence']
  else if (normalized.includes('report') || normalized.includes('defensible')) answer = 'Use the "Generate defensible report" button to produce a full litigation-ready report with all 8 sections.'
  return {
    id: messageId,
    role: 'assistant',
    content: answer,
    timestamp: new Date().toISOString(),
    queryType: 'causation_query',
    citations: extractCitations(answer),
    graphNodesUsed: 4,
    chunksUsed: 3,
    confidence: 0.89,
  }
}

function extractCitations(text: string): string[] {
  const matches = text.matchAll(/\[([^\]]+)\]/g)
  return Array.from(matches).map((m) => m[1])
}

export function mockReportResponse(claimId: string, messageId: string): ReportMessage {
  const report = generateMockReport(claimId)
  return {
    id: messageId,
    role: 'assistant',
    content: 'Generated defensible report.',
    timestamp: new Date().toISOString(),
    report,
  }
}
