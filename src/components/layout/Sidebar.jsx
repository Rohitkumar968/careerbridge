import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Menu, X, LogOut } from 'lucide-react'
import { logout } from '../../store/slices/authSlice'

export const Sidebar = ({ items, baseRoute }) => {
  const [isOpen, setIsOpen] = useState(true)
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const isActive = (route) => {
    if (route === baseRoute) return location.pathname === route
    return location.pathname.startsWith(route)
  }

  const handleLogout = () => {
    dispatch(logout())
    setIsOpen(false)
    navigate('/login')
  }

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed bottom-5 right-5 z-50 p-3 text-white rounded-xl shadow-brand-lg"
        style={{
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
        }}
      >
        {isOpen ? (
          <X className="w-5 h-5" />
        ) : (
          <Menu className="w-5 h-5" />
        )}
      </button>

      {/* Sidebar panel */}
      <aside
        className={`fixed left-0 top-16 h-[calc(100vh-64px)] w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 z-30 ${
          isOpen
            ? 'translate-x-0'
            : '-translate-x-full md:translate-x-0'
        }`}
      >
        <nav className="p-3 space-y-0.5 overflow-y-auto h-full">
          {items.map((item) => {
            const route = item.absolute
              ? item.path
              : `${baseRoute}${item.path}`

            const active = isActive(route)

            return (
              <Link
                key={item.path}
                to={route}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  active
                    ? 'bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300 border-l-[3px] border-primary-600 pl-[9px]'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 border-l-[3px] border-transparent pl-[9px]'
                }`}
              >
                <item.icon
                  className={`w-4.5 h-4.5 flex-shrink-0 ${
                    active
                      ? 'text-primary-600 dark:text-primary-400'
                      : ''
                  }`}
                  style={{
                    width: '18px',
                    height: '18px',
                  }}
                />

                <span>{item.label}</span>
              </Link>
            )
          })}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all duration-150 border-l-[3px] border-transparent pl-[9px] mt-2"
          >
            <LogOut
              className="flex-shrink-0"
              style={{
                width: '18px',
                height: '18px',
              }}
            />
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-20 top-16"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}

export default Sidebar