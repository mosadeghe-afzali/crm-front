'use client'

import DataTable from '../../components/DataTable'
import StatusBadge from '../../components/StatusBadge'
import { useState, useEffect } from "react";
import { Building, Phone, Mail, TrendingUp, Eye } from 'lucide-react'
import { getCompanies } from "../../../../lib/app";
import { useRouter } from 'next/navigation'

export default function CompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchCompanies() {
      try {
        const res = await getCompanies();
        setCompanies(res.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchCompanies();
  }, []);

  const activeCompanies = companies.filter(c => c && c.status === 'active' || c?.status?.name === 'فعال').length
  
  const industries = [...new Set(companies.map(c => c?.industry || c?.category?.name).filter(Boolean))]

  const columns = [
    { key: 'id', label: 'شناسه' },
    { 
      key: 'full_name', 
      label: 'نام شخص',
      render: (val) => val || '---'
    },
    { 
      key: 'mobile', 
      label: 'موبایل',
      render: (val) => val || '---'
    },
    { 
      key: 'email', 
      label: 'ایمیل',
      render: (val) => val || '---'
    },
    { 
      key: 'national_id', 
      label: 'شناسه ملی',
      render: (val) => val || '---'
    },
    { 
      key: 'company_name', 
      label: 'نام شرکت',
      render: (val) => val || '---'
    },
    { 
      key: 'registeration_date', 
      label: 'تاریخ ثبت',
      render: (val) => val ? new Date(val).toLocaleDateString('fa-IR') : '---'
    },
    {
      key: 'actions',
      label: 'عملیات',
      render: (_, row) => (
        <button
          onClick={() => router.push(`/dashboard/companies/${row.id}`)}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
          title="مشاهده جزئیات"
        >
          <Eye className="w-5 h-5" />
        </button>
      )
    },
  ]

  if (loading) return <p className="dark:text-white">در حال بارگذاری...</p>;

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">مدیریت شرکت‌ها</h1>
        <button
          className="mt-3 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          onClick={() => router.push('/dashboard/companies/create')}
        >
          ایجاد شرکت جدید
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">شرکت‌های فعال</p>
              <p className="text-3xl font-bold text-gray-800 dark:text-white">
                {activeCompanies || 0}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <Building className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">مجموع شرکت‌ها</p>
              <p className="text-3xl font-bold text-gray-800 dark:text-white">
                {companies.length || 0}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <TrendingUp className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">صنایع مختلف</p>
              <p className="text-3xl font-bold text-gray-800 dark:text-white">
                {industries.length || 0}
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <span className="text-purple-600 dark:text-purple-400 font-bold text-lg">صنایع</span>
            </div>
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={companies}
        title="لیست شرکت‌ها"
      />

      {industries.length > 0 && (
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">توزیع صنایع</h3>
          <div className="space-y-3">
            {industries.map((industry) => {
              const count = companies.filter(c => (c?.industry?.name || c?.industry || c?.category?.name) === industry).length
              const percentage = companies.length > 0 
                ? (count / companies.length * 100).toFixed(0)
                : 0
              
              return (
                <div key={industry} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">{industry}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {count} شرکت ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
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
