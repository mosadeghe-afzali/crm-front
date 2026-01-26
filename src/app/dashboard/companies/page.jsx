'use client'

import DataTable from '../../components/DataTable'
import StatusBadge from '../../components/StatusBadge'
import { companiesData } from '../../data/mockData'
import { Building, Phone, Mail, TrendingUp } from 'lucide-react'

export default function CompaniesPage() {
  // Fallback برای داده‌ها
  const safeCompaniesData = companiesData || []
  
  // محاسبات با چک کردن وجود فیلدها
  const activeCompanies = safeCompaniesData.filter(c => c && c.status === 'فعال').length
  
  const totalDeals = safeCompaniesData.reduce((sum, c) => {
    if (!c || typeof c.totalDeals === 'undefined') return sum
    const deals = Number(c.totalDeals)
    return sum + (isNaN(deals) ? 0 : deals)
  }, 0)
  
  const industries = [...new Set(safeCompaniesData.map(c => c?.industry).filter(Boolean))]

  const columns = [
    { key: 'name', label: 'نام شرکت' },
    { key: 'industry', label: 'صنعت' },
    { key: 'contactPerson', label: 'شخص رابط' },
    { key: 'email', label: 'ایمیل' },
    { key: 'phone', label: 'تلفن' },
    { 
      key: 'status', 
      label: 'وضعیت',
      render: (value) => <StatusBadge status={value} />
    },
    { key: 'joinDate', label: 'تاریخ عضویت' },
    { 
      key: 'totalDeals', 
      label: 'تعداد قراردادها',
      render: (value) => <span>{value || 0}</span>
    },
    { key: 'totalValue', label: 'ارزش کل' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">مدیریت شرکت‌ها</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">شرکت‌های فعال</p>
              <p className="text-3xl font-bold text-gray-800">
                {activeCompanies || 0}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Building className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">مجموع قراردادها</p>
              <p className="text-3xl font-bold text-gray-800">
                {totalDeals || 0}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">صنایع مختلف</p>
              <p className="text-3xl font-bold text-gray-800">
                {industries.length || 0}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <span className="text-purple-600 font-bold text-lg">صنایع</span>
            </div>
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={safeCompaniesData}
        title="لیست شرکت‌ها"
      />

      {industries.length > 0 && (
        <div className="mt-8 bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">توزیع صنایع</h3>
          <div className="space-y-3">
            {industries.map((industry) => {
              const count = safeCompaniesData.filter(c => c?.industry === industry).length
              const percentage = safeCompaniesData.length > 0 
                ? (count / safeCompaniesData.length * 100).toFixed(0)
                : 0
              
              return (
                <div key={industry} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">{industry}</span>
                    <span className="text-sm text-gray-600">
                      {count} شرکت ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}