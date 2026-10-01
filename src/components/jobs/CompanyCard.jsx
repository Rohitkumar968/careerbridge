import React from 'react'
import { Link } from 'react-router-dom'
import {
  MapPin,
  Users,
  Star,
  ExternalLink,
} from 'lucide-react'

import { Button } from '../common'

export const CompanyCard = ({ company }) => {
  if (!company) return null

  const companyId =
    company._id ||
    company.id

  const fallbackLogo = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    company.name || 'Company'
  )}&background=4f46e5&color=fff&size=100`

  return (
    <div className="group bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-card hover:shadow-card-hover hover:border-primary-200 dark:hover:border-primary-800 transition-all duration-200 p-5 flex flex-col">

      {/* Header */}
      <div className="flex items-start gap-4 mb-4">

        <img
          src={company.logo || fallbackLogo}
          alt={company.name || 'Company'}
          className="w-14 h-14 rounded-xl object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0"
          onError={(event) => {
            event.currentTarget.src = fallbackLogo
          }}
        />

        <div className="flex-1 min-w-0">

          <h3 className="font-semibold text-slate-900 dark:text-white text-base leading-snug group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {company.name}
          </h3>

          <div className="flex items-center gap-1 mt-1">

            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />

            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              {company.rating ?? 'N/A'}
            </span>

            {company.reviews !== undefined && (
              <span className="text-xs text-slate-400">
                ({company.reviews} reviews)
              </span>
            )}

          </div>

        </div>

        {company.activeJobs > 0 && (
          <span className="flex-shrink-0 text-xs font-semibold px-2 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
            {company.activeJobs} open
          </span>
        )}

      </div>

      {/* Description */}

      <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 line-clamp-2 leading-relaxed">
        {company.description}
      </p>

      {/* Details */}

      <div className="space-y-1.5 mb-4 text-sm text-slate-500 dark:text-slate-400">

        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
          <span>
            {company.location || 'Location not specified'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Users className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
          <span>
            {company.size || 'Size not specified'} employees
          </span>
        </div>

      </div>

      {/* View Company */}

      <div className="mt-auto">

        <Link
          to={`/companies/${companyId}`}
          className="block"
        >
          <Button
            variant="outline"
            className="w-full inline-flex items-center justify-center gap-2"
          >
            View Company
            <ExternalLink className="w-3.5 h-3.5" />
          </Button>
        </Link>

      </div>

    </div>
  )
}

export default CompanyCard