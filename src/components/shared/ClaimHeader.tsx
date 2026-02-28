import type { Claim } from '../../types'

interface ClaimHeaderProps {
  claim: Claim
  onEnrich: () => void
}

export function ClaimHeader({ claim }: ClaimHeaderProps) {
  return (
    <header className="shrink-0 px-4 py-3 border-b border-gray-100 bg-white shadow-soft">
      <h1 className="text-sm font-medium text-black">{claim.claim_id}</h1>
      <p className="text-xs text-gray-500 mt-0.5">
        {claim.property_address} · {claim.loss_date} · {claim.jurisdiction}
      </p>
    </header>
  )
}
