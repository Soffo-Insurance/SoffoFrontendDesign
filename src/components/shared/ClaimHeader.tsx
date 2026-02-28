import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import type { Claim } from '../../types'

interface ClaimHeaderProps {
  claim: Claim
  onEnrich: () => void
}

export function ClaimHeader({ claim }: ClaimHeaderProps) {
  return (
    <header className="shrink-0 px-4 py-3 border-b border-gray-100 bg-white shadow-soft flex items-center justify-between">
      <div>
        <h1 className="text-sm font-medium text-black">{claim.claim_id}</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          {claim.property_address} · {claim.loss_date} · {claim.jurisdiction}
        </p>
      </div>
      <Link
        to="/c"
        className="flex items-center gap-1.5 px-3 py-2 text-xs text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg transition-colors"
      >
        <Plus className="w-4 h-4" />
        New
      </Link>
    </header>
  )
}
