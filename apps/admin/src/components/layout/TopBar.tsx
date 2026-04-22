import { useState, useRef, useEffect } from 'react'
import { Search, Bell, ChevronDown, LogOut, User, HelpCircle } from 'lucide-react'
import { cn } from '@/utils/cn'
import type { User as UserType } from '@/types'

interface TopBarProps {
  user: UserType | null
  onLogout: () => void
}

export function TopBar({ user, onLogout }: TopBarProps) {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const notificationsRef = useRef<HTMLDivElement>(null)

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const notifications = [
    { id: 1, message: 'New order #BH-2025-00045 received', time: '2 min ago', read: false },
    { id: 2, message: 'Product "Classic Leather Tote" is low on stock', time: '1 hour ago', read: false },
    { id: 3, message: 'Order #BH-2025-00042 has been delivered', time: '3 hours ago', read: true },
  ]

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <header className="h-18 bg-white border-b border-border-subtle sticky top-0 z-30">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              placeholder="Search orders, products, customers..."
              className="w-full pl-10 pr-4 py-2 bg-cream border border-transparent rounded-elegant text-sm placeholder:text-muted/60 focus:outline-none focus:bg-white focus:border-gold/30 transition-all duration-luxury"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-muted hover:text-charcoal hover:bg-cream rounded-elegant transition-colors duration-luxury"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-gold text-white text-[10px] font-semibold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-elegant shadow-elegant border border-border-subtle py-2 animate-slide-in">
                <div className="px-4 py-2 border-b border-border-subtle">
                  <h3 className="font-medium text-sm">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        'px-4 py-3 hover:bg-cream/30 transition-colors duration-luxury cursor-pointer',
                        !notification.read && 'bg-gold/5'
                      )}
                    >
                      <p className="text-sm text-charcoal">{notification.message}</p>
                      <p className="text-xs text-muted mt-1">{notification.time}</p>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 border-t border-border-subtle">
                  <button className="text-xs text-gold hover:text-gold-dark font-medium transition-colors">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 p-1.5 rounded-elegant hover:bg-cream transition-colors duration-luxury"
            >
              <div className="w-8 h-8 bg-charcoal rounded-elegant flex items-center justify-center">
                <span className="text-white font-serif text-sm font-medium">
                  {user?.name?.charAt(0).toUpperCase() || 'A'}
                </span>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-charcoal">{user?.name || 'Admin'}</p>
                <p className="text-xs text-muted">{user?.role || 'Administrator'}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-muted" />
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-elegant shadow-elegant border border-border-subtle py-2 animate-slide-in">
                <div className="px-4 py-3 border-b border-border-subtle">
                  <p className="font-medium text-sm text-charcoal">{user?.name || 'Admin User'}</p>
                  <p className="text-xs text-muted">{user?.email || 'admin@maisonelise.com'}</p>
                </div>
                <div className="py-1">
                  <button className="w-full px-4 py-2 text-left text-sm text-charcoal hover:bg-cream/50 flex items-center gap-2 transition-colors duration-luxury">
                    <User className="w-4 h-4 text-muted" />
                    Profile
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-charcoal hover:bg-cream/50 flex items-center gap-2 transition-colors duration-luxury">
                    <HelpCircle className="w-4 h-4 text-muted" />
                    Help & Support
                  </button>
                </div>
                <div className="border-t border-border-subtle py-1">
                  <button
                    onClick={onLogout}
                    className="w-full px-4 py-2 text-left text-sm text-error hover:bg-error/5 flex items-center gap-2 transition-colors duration-luxury"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
