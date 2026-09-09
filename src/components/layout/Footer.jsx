import React from 'react'
import { Link } from 'react-router-dom'
import { Linkedin, Twitter, Github, Globe } from 'lucide-react'

export const Footer = () => {
  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">

          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="cb-logo-mark">CB</div>
              <span className="text-lg font-bold text-white tracking-tight">
                Career<span style={{ background: 'linear-gradient(135deg, #818cf8, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Bridge</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-500">
              AI-powered job & recruitment platform connecting talent with opportunity.
            </p>
            <div className="flex gap-3 mt-4">
              {[
                { icon: Linkedin, href: '#', label: 'LinkedIn' },
                { icon: Twitter,  href: '#', label: 'Twitter' },
                { icon: Github,   href: '#', label: 'GitHub' },
                { icon: Globe,    href: '#', label: 'Website' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-primary-600 text-slate-400 hover:text-white transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { to: '/jobs',      label: 'Browse Jobs' },
                { to: '/companies', label: 'Companies' },
                { to: '/',          label: 'About Us' },
              ].map(({ to, label }) => (
                <li key={label}>
                  <Link to={to} className="hover:text-primary-400 transition-colors duration-150">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Recruiters */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Recruiters</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { to: '/register', label: 'Post a Job' },
                { to: '/register', label: 'Find Candidates' },
                { to: '/',         label: 'Pricing' },
              ].map(({ to, label }) => (
                <li key={label}>
                  <Link to={to} className="hover:text-primary-400 transition-colors duration-150">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Legal</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { to: '/privacy', label: 'Privacy Policy' },
                { to: '/terms',   label: 'Terms of Service' },
                { to: '/contact', label: 'Contact Us' },
              ].map(({ to, label }) => (
                <li key={label}>
                  <Link to={to} className="hover:text-primary-400 transition-colors duration-150">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm">
          <p className="text-slate-500">
            © 2026 CareerBridge. All rights reserved.
          </p>
          <p className="text-slate-500">
            Built with{' '}
            <span className="text-red-400">❤️</span>
            {' '}by{' '}
            <span className="font-semibold text-slate-300">Rohit Kumar</span>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
