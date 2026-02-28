import { NavLink } from 'react-router-dom'
import { FileText, Plus } from 'lucide-react'
import { MOCK_CLAIMS } from '../../mockData'

export function Sidebar() {
  return (
    <aside className="w-56 shrink-0 border-r border-gray-200 bg-white flex flex-col">
      <div className="p-2 border-b border-gray-200">
        <NavLink
          to="/c"
          className="flex items-center gap-2 px-2 py-1.5 text-gray-600 hover:bg-gray-100 hover:text-black"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm">New claim</span>
        </NavLink>
      </div>
      <div className="flex-1 overflow-y-auto py-1">
        <div className="px-2 py-0.5 text-[10px] font-medium text-gray-400 uppercase tracking-wider">
          Claims
        </div>
        {MOCK_CLAIMS.map((claim) => (
          <NavLink
            key={claim.claim_id}
            to={`/c/${claim.claim_id}`}
            className={({ isActive }) =>
              `flex items-start gap-2 px-2 py-1.5 mx-1 ${
                isActive ? 'bg-gray-100 text-black' : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            <FileText className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <div className="min-w-0">
              <div className="text-sm truncate">{claim.claim_id}</div>
              <div className="text-[11px] text-gray-500 truncate">{claim.property_address}</div>
            </div>
          </NavLink>
        ))}
      </div>
    </aside>
  )
}
