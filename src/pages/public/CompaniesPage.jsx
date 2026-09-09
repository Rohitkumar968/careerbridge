import React, { useState } from 'react'
import { Input, Card } from '../../components/common'
import { CompanyCard } from '../../components/jobs'
import { mockCompanies } from '../../data/mockData'

export const CompaniesPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredCompanies, setFilteredCompanies] = useState(mockCompanies)

  const handleSearch = (query) => {
    setSearchQuery(query)
    const filtered = mockCompanies.filter(company =>
      company.name.toLowerCase().includes(query.toLowerCase()) ||
      company.industry.toLowerCase().includes(query.toLowerCase()) ||
      company.location.toLowerCase().includes(query.toLowerCase())
    )
    setFilteredCompanies(filtered)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Explore Companies
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Discover great companies and find your next opportunity
          </p>

          <Input
            placeholder="Search companies by name, industry, or location..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="max-w-md"
          />
        </div>

        {filteredCompanies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              No companies found matching your search.
            </p>
          </Card>
        )}
      </div>
    </div>
  )
}

export default CompaniesPage
