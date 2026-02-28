import type { Claim } from '../../types'

interface ClaimHeaderProps {
  claim: Claim
  onEnrich: () => void
}

export function ClaimHeader({ claim }: ClaimHeaderProps) {
  return (
    <header className="shrink-0 px-4 py-2 border-b border-gray-200">
      <h1 className="text-sm font-medium text-black">{claim.claim_id}</h1>
      <p className="text-xs text-gray-500">
        {claim.property_address} · {claim.loss_date} · {claim.jurisdiction}
      </p>
    </header>
  )
}
