import { NavLink } from 'react-router-dom'

const TABS = [
  { to: '/admin', label: 'Menu Items', end: true },
  { to: '/admin/inventory', label: 'Inventory' },
  { to: '/admin/orders', label: 'Orders' },
]

export default function AdminNav() {
  return (
    <nav className="flex items-center gap-1 overflow-x-auto">
      {TABS.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.end}
          className={({ isActive }) =>
            `px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
              isActive ? 'bg-cream text-sage-dark' : 'text-cream-dark/80 hover:text-cream'
            }`
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </nav>
  )
}
