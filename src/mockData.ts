import type { Claim, StoredDocument, DocFolder } from './types'

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

export const MOCK_FOLDERS: Record<string, DocFolder[]> = {
  'CLM-2024-TX-00847': [
    { folder_id: 'f1', name: 'Policy & Coverage', claim_id: 'CLM-2024-TX-00847' },
    { folder_id: 'f2', name: 'Inspection Reports', claim_id: 'CLM-2024-TX-00847' },
  ],
  'CLM-2024-FL-00122': [],
}

export const MOCK_DOCUMENTS: Record<string, StoredDocument[]> = {
  'CLM-2024-TX-00847': [
    {
      doc_id: 'doc_001',
      filename: 'policy_dec_sheet.pdf',
      doc_type: 'policy',
      status: 'Ready',
      created_at: '2024-05-20T10:00:00Z',
      claim_id: 'CLM-2024-TX-00847',
      folder_id: 'f1',
    },
    {
      doc_id: 'doc_002',
      filename: 'inspection_report.pdf',
      doc_type: 'inspection_report',
      status: 'Ready',
      created_at: '2024-05-22T14:30:00Z',
      claim_id: 'CLM-2024-TX-00847',
      folder_id: 'f2',
    },
  ],
  'CLM-2024-FL-00122': [],
}

export const MOCK_QUERY_RESPONSES: Record<string, string> = {
  'what caused the foundation damage': `Based on the claim documents and environmental data, the foundation damage at 4812 Jessamine St was **predisposed by drought-induced soil movement** and **proximately caused by the May 15, 2024 hail and wind event**. [doc_002_chunk_0003]

The inspection report notes differential settlement consistent with shrink-swell cycles in expansive clay soil. April 2024 PDSI of **-5.03** indicates extreme drought, supporting soil contraction and foundation micro-movement. [node:DroughtRecord:PDSI-4102-202404]

Golf-ball hail (1.75 in) and wind on May 15, 2024 at Bellaire were documented at the 4800 block of Jessamine St. Policy Coverage A applies to wind and hail; the anti-concurrent-causation clause requires a documented causal chain. [node:StormEvent:NCEI-941852]

The carrier can assert ACC with confidence: drought predisposed the structure; hail and wind were the efficient proximate cause of the claimed damage. Foundation movement is excludable as a separate peril. [doc_001_chunk_0001]`,
  'is this covered under coverage a': `Yes. The loss is **covered under Coverage A** subject to the wind/hail deductible. [doc_001_chunk_0002]

Coverage A includes wind and hail as named perils. The storm event corroborates hail and wind on the loss date. [node:StormEvent:NCEI-941852]

The property is in Flood Zone X (minimal flood risk), so flood exclusions do not apply. Wind/hail deductible is 2% per the policy. [node:FloodHazardZone:FHZ-1]`,
  'environmental evidence': `Environmental evidence for this claim includes storm, drought, and flood-hazard data. [node:StormEvent:NCEI-941852]

Storm Event: hail 1.75 in at Bellaire (NCEI). PDSI April 2024: -5.03 (extreme drought, NOAA). Flood Zone: X minimal (FEMA NFHL). [node:DroughtRecord:PDSI-4102-202404]

The PDSI value supports drought-induced foundation micro-movement as a predisposing factor for the loss. [doc_002_chunk_0003]`,
  default: `The system has analyzed the claim documents and graph data for this claim. [doc_001_chunk_0001]

Policy terms and coverage apply; inspection findings support the damage assessment. Claim context and loss date align with documented events. [doc_002_chunk_0002]

For a deeper analysis, try "What caused the foundation damage?" or "Is this covered under Coverage A?" You can also generate a defensible report with the button above. [node:Claim:CLM-2024-TX-00847]`,
}

export const SUGGESTED_PROMPTS = [
  'What caused the foundation damage?',
  'Is this covered under Coverage A?',
  'Environmental evidence for this claim',
  'Generate defensible report',
]
