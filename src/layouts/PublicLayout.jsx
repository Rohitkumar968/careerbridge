import React from 'react'
import { Outlet } from 'react-router-dom'
import { Navbar, Footer } from '../components/layout'

export const PublicLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default PublicLayout
