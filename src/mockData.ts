import type { Claim, StoredDocument } from './types'

export const MOCK_CLAIMS: Claim[] = [
  {
    claim_id: 'CLM-2024-TX-00847',
    policy_id: 'POL-2022-TX-04419',
    property_id: 'PROP-8821-BELLAIRE-TX',
    property_address: '4812 Jessamine St, Bellaire, TX 77401',
    loss_date: '2024-05-15',
    jurisdiction: 'US-TX',
    status: 'open',
  },
  {
    claim_id: 'CLM-2024-FL-00122',
    policy_id: 'POL-2023-FL-08901',
    property_id: 'PROP-5542-MIAMI-FL',
    property_address: '1200 Brickell Ave, Miami, FL 33131',
    loss_date: '2024-08-22',
    jurisdiction: 'US-FL',
    status: 'open',
  },
]

export const MOCK_DOCUMENTS: Record<string, StoredDocument[]> = {
  'CLM-2024-TX-00847': [
    {
      doc_id: 'doc_001',
      filename: 'policy_dec_sheet.pdf',
      doc_type: 'policy',
      status: 'Ready',
      created_at: '2024-05-20T10:00:00Z',
      claim_id: 'CLM-2024-TX-00847',
    },
    {
      doc_id: 'doc_002',
      filename: 'inspection_report.pdf',
      doc_type: 'inspection_report',
      status: 'Ready',
      created_at: '2024-05-22T14:30:00Z',
      claim_id: 'CLM-2024-TX-00847',
    },
  ],
  'CLM-2024-FL-00122': [],
}

export const MOCK_QUERY_RESPONSES: Record<string, string> = {
  'what caused the foundation damage': `Based on the claim documents and environmental data, the foundation damage at 4812 Jessamine St was **predisposed by drought-induced soil movement** and **proximately caused by the May 15, 2024 hail and wind event**.

**Key evidence:**
- [doc_002_chunk_0003] — Inspection report notes differential settlement consistent with shrink-swell cycles in expansive clay soil.
- [node:DroughtRecord:PDSI-4102-202404] — PDSI of **-5.03** in April 2024 indicates extreme drought (threshold &lt; -4.0), supporting soil contraction and foundation micro-movement.
- [node:StormEvent:NCEI-941852] — Golf-ball hail (1.75 in) and wind on May 15, 2024 at Bellaire; roof damage reported at 4800 block Jessamine St.
- [doc_001_chunk_0001] — Policy Coverage A applies to wind/hail; anti-concurrent-causation (ACC) clause requires documented causal chain.

**Conclusion:** The carrier can assert ACC with confidence: drought predisposed the structure; hail/wind was the efficient proximate cause of the claimed roof damage. Foundation movement is excludable as a separate peril.`,
  'is this covered under coverage a': `Yes. The loss is **covered under Coverage A** subject to the wind/hail deductible.

**Evidence:**
- [doc_001_chunk_0002] — Coverage A includes wind and hail as named perils.
- [node:StormEvent:NCEI-941852] — Storm event corroborates hail and wind on loss date.
- [node:FloodHazardZone:FHZ-1] — Property in Zone X (minimal flood risk); flood exclusions do not apply.

Deductible: 2% wind/hail per [doc_001_chunk_0005].`,
  'environmental evidence': `**Environmental evidence for CLM-2024-TX-00847:**

| Data Type | Value | Source | Fetch Time |
|-----------|-------|--------|------------|
| Storm Event | Hail 1.75 in, Bellaire | NCEI Storm Events | 2024-05-20 |
| PDSI (Apr 2024) | -5.03 (extreme drought) | NOAA PDSI | 2024-05-20 |
| Flood Zone | X (minimal) | FEMA NFHL | 2024-05-20 |
| Earthquake | M3.2, 8 km NW Houston | USGS | 2024-05-20 |

The PDSI value supports drought-induced foundation micro-movement as a predisposing factor.`,
  default: `The system has analyzed the claim documents and graph data. Based on available evidence:

- [doc_001_chunk_0001] — Policy terms and coverage apply.
- [doc_002_chunk_0002] — Inspection findings support the damage assessment.
- [node:Claim:CLM-2024-TX-00847] — Claim context and loss date align with documented events.

For more specific analysis, try: "What caused the foundation damage?" or "Generate defensible report."`,
}

export const SUGGESTED_PROMPTS = [
  'What caused the foundation damage?',
  'Is this covered under Coverage A?',
  'Environmental evidence for this claim',
  'Generate defensible report',
]
