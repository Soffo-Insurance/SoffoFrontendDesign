import type { ReportData } from './types'

export function generateMockReport(claimId: string): ReportData {
  return {
    executiveSummary: `The claim at 4812 Jessamine St, Bellaire TX (CLM-2024-TX-00847) is defensible. The May 15, 2024 hail and wind event was the efficient proximate cause of roof damage. Drought-induced foundation micro-movement (PDSI -5.03) predisposed the structure but is excludable under the ACC clause. Coverage A applies; recommend payment subject to wind/hail deductible.`,
    causationDiagram: `flowchart LR
    subgraph Environmental
        DR[DroughtRecord PDSI -5.03]
        SE[StormEvent Hail 1.75in]
    end
    subgraph Damage
        DE[DamageEvent Roof/Hail]
    end
    DR -->|PREDISPOSED_BY| DE
    SE -->|TRIGGERED_BY| DE`,
    coverageAnalysis: `**Coverage A — Dwelling:** Applicable. Wind and hail are named perils. Loss date and storm event corroborated.

**Exclusions:** Flood inapplicable (Zone X). Earth movement: foundation differential settlement is excludable; roof damage from hail is covered.

**ACC clause:** Enforceable. Documented causal chain: drought predisposed; hail proximately caused roof loss.`,
    environmentalEvidence: [
      { dataType: 'Storm Event', value: 'Hail 1.75 in, Bellaire', source: 'NCEI Storm Events', timestamp: '2024-05-20' },
      { dataType: 'PDSI Apr 2024', value: '-5.03 (extreme drought)', source: 'NOAA PDSI', timestamp: '2024-05-20' },
      { dataType: 'Flood Zone', value: 'X (minimal)', source: 'FEMA NFHL', timestamp: '2024-05-20' },
      { dataType: 'Earthquake', value: 'M3.2, 8 km NW Houston', source: 'USGS', timestamp: '2024-05-20' },
    ],
    behavioralSignals: `No significant behavioral signals detected for this claim. Public adjuster involvement noted; standard review recommended.`,
    timeline: [
      { event_id: 'evt_1', event_type: 'StormEvent', event_date: '2024-05-15', description: 'Hail 1.75 in' },
      { event_id: 'evt_2', event_type: 'DamageEvent', event_date: '2024-05-15', description: 'Roof and exterior damage' },
      { event_id: 'evt_3', event_type: 'Inspection', event_date: '2024-05-22', description: 'Field inspection completed' },
    ],
    recommendedAction: `**Recommended action:** Approve coverage for wind/hail damage subject to 2% wind deductible. Document ACC assertion with this report. Legal exposure: low if narrative is maintained.`,
    citationIndex: [
      { chunk_id: 'doc_001_chunk_0001', source: 'Policy Declaration', page: '1' },
      { chunk_id: 'doc_001_chunk_0002', source: 'Policy Coverage A', page: '3' },
      { chunk_id: 'doc_002_chunk_0003', source: 'Inspection Report', page: '2' },
    ],
  }
}
