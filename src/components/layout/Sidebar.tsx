import { NavLink } from 'react-router-dom'
import { FileText, Plus } from 'lucide-react'
import { MOCK_CLAIMS } from '../../mockData'

export function Sidebar() {
  return (
    <aside className="w-56 shrink-0 border-r border-gray-100 bg-white flex flex-col shadow-soft">
      <div className="p-3 border-b border-gray-100">
        <NavLink
          to="/c"
          className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-50 hover:text-black rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm">New claim</span>
        </NavLink>
      </div>
      <div className="flex-1 overflow-y-auto py-2">
        <div className="px-3 py-1 text-[10px] font-medium text-gray-400 uppercase tracking-wider">
          Claims
        </div>
        {MOCK_CLAIMS.map((claim) => (
          <NavLink
            key={claim.claim_id}
            to={`/c/${claim.claim_id}`}
            className={({ isActive }) =>
              `flex items-start gap-2 px-3 py-2 mx-2 rounded-lg transition-colors ${
                isActive ? 'bg-gray-100 text-black shadow-soft' : 'text-gray-600 hover:bg-gray-50'
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
