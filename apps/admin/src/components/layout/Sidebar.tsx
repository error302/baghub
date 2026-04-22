import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Tags,
} from 'lucide-react'
import { cn } from '@/utils/cn'

interface SidebarProps {
  isCollapsed: boolean
  onToggle: () => void
}

const navigation = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Products', path: '/products', icon: Package },
  { name: 'Categories', path: '/categories', icon: Tags },
  { name: 'Orders', path: '/orders', icon: ShoppingBag },
  { name: 'Customers', path: '/customers', icon: Users },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  { name: 'Settings', path: '/settings', icon: Settings },
]

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const location = useLocation()

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen bg-white border-r border-border-subtle transition-all duration-luxury z-40',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo Area */}
      <div className="h-18 flex items-center border-b border-border-subtle px-4">
        <div className={cn('flex items-center gap-3', isCollapsed && 'justify-center w-full')}>
          <div className="w-8 h-8 bg-charcoal rounded-elegant flex items-center justify-center flex-shrink-0">
            <span className="text-white font-serif font-bold text-lg">É</span>
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <span className="font-serif text-lg font-semibold text-charcoal whitespace-nowrap">
                Maison Élise
              </span>
              <p className="text-xs text-muted whitespace-nowrap">Admin</p>
            </div>
          )}
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 w-6 h-6 bg-white border border-border-default rounded-full flex items-center justify-center shadow-soft hover:shadow-elegant transition-shadow duration-luxury"
      >
        {isCollapsed ? (
          <ChevronRight className="w-3 h-3 text-muted" />
        ) : (
          <ChevronLeft className="w-3 h-3 text-muted" />
        )}
      </button>

      {/* Navigation */}
      <nav className="p-3 mt-4">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path || 
              (item.path !== '/' && location.pathname.startsWith(item.path))

            return (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 text-sm transition-all duration-luxury rounded-elegant',
                    'hover:bg-cream/50',
                    isCollapsed && 'justify-center',
                    isActive
                      ? 'bg-gold/5 text-gold'
                      : 'text-muted hover:text-charcoal'
                  )}
                  title={isCollapsed ? item.name : undefined}
                >
                  <Icon
                    className={cn(
                      'w-5 h-5 flex-shrink-0',
                      isActive ? 'text-gold' : 'text-muted'
                    )}
                  />
                  {!isCollapsed && (
                    <span className="font-medium whitespace-nowrap">{item.name}</span>
                  )}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Bottom Section - Store Link */}
      <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-border-subtle">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'flex items-center gap-3 px-3 py-2 text-sm text-muted hover:text-charcoal transition-colors duration-luxury',
            isCollapsed && 'justify-center'
          )}
          title={isCollapsed ? 'View Store' : undefined}
        >
          <svg
            className="w-5 h-5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
          {!isCollapsed && <span className="font-medium whitespace-nowrap">View Store</span>}
        </a>
      </div>
    </aside>
  )
}
