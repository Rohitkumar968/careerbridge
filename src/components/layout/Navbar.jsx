import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  Menu,
  X,
  Moon,
  Sun,
  Bell,
  LogOut,
} from 'lucide-react'

import { logout } from '../../store/slices/authSlice'
import { clearResume } from '../../store/slices/resumeSlice'
import { toggleTheme } from '../../store/slices/themeSlice'
import { Avatar } from '../common'

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { user, isAuthenticated } = useSelector(
    (state) => state.auth
  )

  const { mode } = useSelector(
    (state) => state.theme
  )

  const { unreadCount } = useSelector(
    (state) => state.notifications
  )

  // =====================================================
  // LOGOUT
  // =====================================================
  const handleLogout = () => {
    // Clear authentication
    dispatch(logout())

    // Clear resume data from Redux
    dispatch(clearResume())

    // Clear any possible cached user-specific data
    sessionStorage.clear()

    // Go to home page
    navigate('/', { replace: true })
  }

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex justify-between items-center h-16">

          {/* =====================================================
              LOGO
          ===================================================== */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group"
          >
            <div className="cb-logo-mark shadow-brand">
              CB
            </div>

            <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Career
              <span className="text-brand-gradient">
                Bridge
              </span>
            </span>
          </Link>

          {/* =====================================================
              DESKTOP NAVIGATION
          ===================================================== */}
          <div className="hidden md:flex items-center gap-1">

            <Link
              to="/jobs"
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950 rounded-lg transition-all"
            >
              Jobs
            </Link>

            <Link
              to="/companies"
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950 rounded-lg transition-all"
            >
              Companies
            </Link>

            {/* Recruiter */}
            {isAuthenticated &&
              user?.role === 'recruiter' && (
                <Link
                  to="/recruiter"
                  className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950 rounded-lg transition-all"
                >
                  Recruiter
                </Link>
              )}

            {/* Admin */}
            {isAuthenticated &&
              user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950 rounded-lg transition-all"
                >
                  Admin
                </Link>
              )}

          </div>

          {/* =====================================================
              RIGHT ACTIONS
          ===================================================== */}
          <div className="flex items-center gap-2">

            {/* Notifications */}
            {isAuthenticated && (
              <button
                onClick={() =>
                  navigate('/notifications')
                }
                className="relative p-2 text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950 rounded-lg transition-all"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />

                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-secondary-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
                )}
              </button>
            )}

            {/* =====================================================
                THEME TOGGLE
            ===================================================== */}
            <button
              onClick={() =>
                dispatch(toggleTheme())
              }
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950 rounded-lg transition-all"
              title="Toggle theme"
            >
              {mode === 'light' ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </button>

            {/* =====================================================
                AUTHENTICATED USER
            ===================================================== */}
            {isAuthenticated ? (

              <div className="flex items-center gap-2">

                {/* Profile */}
                <button
                  onClick={() =>
                    navigate('/profile')
                  }
                  className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full hover:bg-primary-50 dark:hover:bg-primary-950 transition-all group"
                  title="View profile"
                >

                  <Avatar
                    src={user?.avatar}
                    size="sm"
                  />

                  <span className="hidden md:block text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 max-w-[100px] truncate">
                    {user?.name?.split(' ')[0]}
                  </span>

                </button>

                {/* =====================================================
                    LOGOUT BUTTON
                ===================================================== */}
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-500 dark:text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-all"
                  title="Sign out"
                >
                  <LogOut className="w-5 h-5" />
                </button>

              </div>

            ) : (

              /* =====================================================
                 NOT AUTHENTICATED
              ===================================================== */
              <div className="hidden md:flex items-center gap-2">

                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950 rounded-lg transition-all"
                >
                  Sign in
                </Link>

                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white rounded-lg transition-all shadow-brand hover:shadow-brand-lg"
                  style={{
                    background:
                      'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                  }}
                >
                  Get Started
                </Link>

              </div>
            )}

            {/* =====================================================
                MOBILE MENU BUTTON
            ===================================================== */}
            <button
              onClick={() =>
                setMobileMenuOpen(
                  !mobileMenuOpen
                )
              }
              className="md:hidden p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>

          </div>
        </div>

        {/* =====================================================
            MOBILE MENU
        ===================================================== */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 pt-2 space-y-1 border-t border-slate-100 dark:border-slate-800">

            <Link
              to="/jobs"
              onClick={() =>
                setMobileMenuOpen(false)
              }
              className="block px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-primary-950 hover:text-primary-600 rounded-lg"
            >
              Jobs
            </Link>

            <Link
              to="/companies"
              onClick={() =>
                setMobileMenuOpen(false)
              }
              className="block px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-primary-950 hover:text-primary-600 rounded-lg"
            >
              Companies
            </Link>

            {!isAuthenticated && (
              <>
                <Link
                  to="/login"
                  onClick={() =>
                    setMobileMenuOpen(false)
                  }
                  className="block px-4 py-2.5 text-sm font-semibold text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950 rounded-lg"
                >
                  Sign in
                </Link>

                <Link
                  to="/register"
                  onClick={() =>
                    setMobileMenuOpen(false)
                  }
                  className="block px-4 py-2.5 text-sm font-semibold text-white rounded-lg"
                  style={{
                    background:
                      'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                  }}
                >
                  Get Started
                </Link>
              </>
            )}

          </div>
        )}

      </div>
    </nav>
  )
}

export default Navbar