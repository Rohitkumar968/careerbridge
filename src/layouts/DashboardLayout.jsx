import React from 'react'
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Navbar, Sidebar, Footer } from '../components/layout'
import {
  LayoutDashboard,
  Briefcase,
  Bookmark,
  FileText,
  Calendar,
  MessageSquare,
  Settings,
  Zap,
  Users,
  BarChart3,
  Building2,
  Bell,
} from 'lucide-react'

export const DashboardLayout = ({ role }) => {
  const { user } = useSelector(state => state.auth)

  const sidebarItems = {
    job_seeker: [
  { path: '', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/jobs', label: 'Find Jobs', icon: Briefcase },
  { path: '/recommended', label: 'Recommended', icon: Zap },
  { path: '/saved', label: 'Saved Jobs', icon: Bookmark },
  { path: '/applications', label: 'Applications', icon: FileText },
  { path: '/interviews', label: 'Interviews', icon: Calendar },
  { path: '/resume', label: 'Resume', icon: FileText },
  { path: '/ai-assistant', label: 'AI Assistant', icon: MessageSquare },
  { path: '/profile', label: 'Profile', icon: Users, absolute: true },
  { path: '/notifications', label: 'Notifications', icon: Bell, absolute: true },
  { path: '/settings', label: 'Settings', icon: Settings, absolute: true },
  ],
    recruiter: [
      { path: '', label: 'Dashboard', icon: LayoutDashboard },
      // { path: '/jobs', label: 'My Jobs', icon: Briefcase },
      { path: '/jobs/create', label: 'Post Job', icon: Briefcase },
      // { path: '/applicants', label: 'Applicants', icon: Users },
      // { path: '/candidates', label: 'Candidates', icon: Users },
      // { path: '/interviews', label: 'Interviews', icon: Calendar },
      // { path: '/analytics', label: 'Analytics', icon: BarChart3 },
      // { path: '/company', label: 'Company', icon: Building2 },
      // { path: '/settings', label: 'Settings', icon: Settings },
    ],
    admin: [
      { path: '', label: 'Overview', icon: LayoutDashboard },
      { path: '/users', label: 'Users', icon: Users },
      { path: '/jobs', label: 'Jobs', icon: Briefcase },
      { path: '/companies', label: 'Companies', icon: Building2 },
      { path: '/applications', label: 'Applications', icon: FileText },
      { path: '/reports', label: 'Reports', icon: BarChart3 },
      { path: '/settings', label: 'Settings', icon: Settings },
    ],
  }

  const baseRoute = role === 'job_seeker' ? '/dashboard' : role === 'recruiter' ? '/recruiter' : '/admin'
  const items = sidebarItems[role] || []

  return (
    <div className="min-h-screen flex flex-col bg-surface dark:bg-surface-dark">
      <Sidebar items={items} baseRoute={baseRoute} />
      <div className="flex flex-col flex-1 md:ml-64">
        <Navbar />
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Outlet />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default DashboardLayout
