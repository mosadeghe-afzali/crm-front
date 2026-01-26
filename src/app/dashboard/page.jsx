'use client'

import { useState } from 'react'
import StatsCard from '../components/StatsCard'
import DataTable from '../components/DataTable'
import StatusBadge from '../components/StatusBadge'
import { 
  expertsData as experts, 
  companiesData as companies, 
  requestsData as requests 
} from '../data/mockData'
import { Users, Building, FileText, TrendingUp } from 'lucide-react'

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('experts')

  const expertColumns = [
    { 
      key: 'name', 
      label: 'نام کارشناس',
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full ${row.avatarColor} flex items-center justify-center`}>
            <span className="text-white font-bold">{value.charAt(0)}</span>
          </div>
          <div>
            <p className="font-medium">{value}</p>
            <p className="text-gray-500 text-sm">{row.department}</p>
          </div>
        </div>
      )
    },
    { key: 'email', label: 'ایمیل' },
    { 
      key: 'status', 
      label: 'وضعیت',
      render: (value) => <StatusBadge status={value} />
    },
    { key: 'joinDate', label: 'تاریخ عضویت' },
    { key: 'completedProjects', label: 'پروژه‌ها' },
    { 
      key: 'rating', 
      label: 'امتیاز',
      render: (value) => (
        <div className="flex items-center gap-1">
          <span className="font-bold">{value}</span>
          <span className="text-yellow-500">★</span>
        </div>
      )
    },
  ]

  const companyColumns = [
    { key: 'name', label: 'نام شرکت' },
    { key: 'industry', label: 'صنعت' },
    { key: 'contactPerson', label: 'شخص رابط' },
    { 
      key: 'status', 
      label: 'وضعیت',
      render: (value) => <StatusBadge status={value} />
    },
    { key: 'totalContracts', label: 'قراردادها' },
    { key: 'totalValue', label: 'ارزش کل' },
  ]

  const requestColumns = [
    { key: 'title', label: 'عنوان درخواست' },
    { key: 'company', label: 'شرکت' },
    { key: 'expert', label: 'کارشناس' },
    { 
      key: 'priority', 
      label: 'اولویت',
      render: (value) => <StatusBadge status={value} />
    },
    { 
      key: 'status', 
      label: 'وضعیت',
      render: (value) => <StatusBadge status={value} />
    },
    { key: 'dueDate', label: 'مهلت' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">داشبورد مدیریت</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="کارشناسان فعال"
          value="24"
          icon={<Users className="w-6 h-6" />}
          color="bg-blue-500"
          change="+۲ نفر"
        />
        <StatsCard
          title="شرکت‌ها"
          value="156"
          icon={<Building className="w-6 h-6" />}
          color="bg-green-500"
          change="+۵ شرکت"
        />
        <StatsCard
          title="درخواست‌های فعال"
          value="42"
          icon={<FileText className="w-6 h-6" />}
          color="bg-purple-500"
          change="+۱۲٪"
        />
        <StatsCard
          title="رشد ماهانه"
          value="12.5%"
          icon={<TrendingUp className="w-6 h-6" />}
          color="bg-orange-500"
          change="+۳.۲٪"
        />
      </div>

      <div className="mb-6">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('experts')}
            className={`px-6 py-3 font-medium ${activeTab === 'experts' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            کارشناسان
          </button>
          <button
            onClick={() => setActiveTab('companies')}
            className={`px-6 py-3 font-medium ${activeTab === 'companies' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            شرکت‌ها
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-6 py-3 font-medium ${activeTab === 'requests' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            درخواست‌ها
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow">
        {activeTab === 'experts' && (
          <DataTable
            columns={expertColumns}
            data={experts}
            title="لیست کارشناسان"
          />
        )}
        
        {activeTab === 'companies' && (
          <DataTable
            columns={companyColumns}
            data={companies}
            title="لیست شرکت‌ها"
          />
        )}
        
        {activeTab === 'requests' && (
          <DataTable
            columns={requestColumns}
            data={requests}
            title="لیست درخواست‌ها"
          />
        )}
      </div>
    </div>
  )
}