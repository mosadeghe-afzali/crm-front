'use client'

import { useState, useEffect } from 'react'
import StatsCard from '../components/StatsCard'
import DataTable from '../components/DataTable'
import StatusBadge from '../components/StatusBadge'
import { Users, Building, FileText, TrendingUp } from 'lucide-react'
import { getDashboard, getEmployees, getCompanies, getTickets } from '../../../lib/app'

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('experts')
  const [stats, setStats] = useState({
    active_employees: 0,
    companies: 0,
    customers: 0,
    open_tickets: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await getDashboard()
        if (res.data.success) {
          setStats(res.data.data)
        }
      } catch (err) {
        console.error('Failed to fetch dashboard:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [])

  const [employees, setEmployees] = useState([])
  const [companies, setCompanies] = useState([])
  const [tickets, setTickets] = useState([])
  const [tableLoading, setTableLoading] = useState(true)

  useEffect(() => {
    const fetchTableData = async () => {
      try {
        const [empRes, compRes, ticketRes] = await Promise.all([
          getEmployees(),
          getCompanies(),
          getTickets()
        ])
        setEmployees(empRes.data.data || [])
        setCompanies(compRes.data.data || [])
        setTickets(ticketRes.data.data || [])
      } catch (err) {
        console.error('Failed to fetch table data:', err)
      } finally {
        setTableLoading(false)
      }
    }
    fetchTableData()
  }, [])

  const expertColumns = [
    { 
      key: 'first_name', 
      label: 'نام',
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
            <span className="text-white font-bold">{value?.charAt(0) || '?'}</span>
          </div>
          <div>
            <p className="font-medium dark:text-white">{value} {row.last_name}</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{row.department?.name || '-'}</p>
          </div>
        </div>
      )
    },
    { key: 'mobile', label: 'موبایل' },
    { key: 'email', label: 'ایمیل' },
    { 
      key: 'position', 
      label: 'سمت',
      render: (value) => <span className="dark:text-white">{value?.name || '-'}</span>
    },
  ]

  const companyColumns = [
    { key: 'company_name', label: 'نام شرکت' },
    { key: 'full_name', label: 'نام کامل' },
    { key: 'mobile', label: 'موبایل' },
    { key: 'email', label: 'ایمیل' },
  ]

  const requestColumns = [
    { key: 'title', label: 'عنوان تیکت' },
    { 
      key: 'user', 
      label: 'درخواست‌دهنده',
      render: (value) => <span className="dark:text-white">{value?.full_name || '-'}</span>
    },
    { 
      key: 'priority', 
      label: 'اولویت',
      render: (value) => <span className="dark:text-white">{value?.name || '-'}</span>
    },
    { 
      key: 'status', 
      label: 'وضعیت',
      render: (value) => <span className="dark:text-white">{value?.name || '-'}</span>
    },
    { 
      key: 'created_at', 
      label: 'تاریخ ایجاد',
      render: (value) => {
        if (!value) return <span className="dark:text-white">-</span>;
        const date = new Date(value);
        const persianDate = date.toLocaleDateString('fa-IR');
        return <span className="dark:text-white">{persianDate}</span>;
      }
    },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">داشبورد مدیریت</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="کارشناسان فعال"
          value={loading ? '...' : stats.active_employees}
          icon={<Users className="w-6 h-6" />}
          color="bg-blue-500"
        />
        <StatsCard
          title="شرکت‌ها"
          value={loading ? '...' : stats.companies}
          icon={<Building className="w-6 h-6" />}
          color="bg-green-500"
        />
        <StatsCard
          title="مشتریان"
          value={loading ? '...' : stats.customers}
          icon={<FileText className="w-6 h-6" />}
          color="bg-purple-500"
        />
        <StatsCard
          title="تیکت‌های باز"
          value={loading ? '...' : stats.open_tickets}
          icon={<TrendingUp className="w-6 h-6" />}
          color="bg-orange-500"
        />
      </div>

      <div className="mb-6">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('experts')}
            className={`px-6 py-3 font-medium ${activeTab === 'experts' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
          >
            کارشناسان
          </button>
          <button
            onClick={() => setActiveTab('companies')}
            className={`px-6 py-3 font-medium ${activeTab === 'companies' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
          >
            شرکت‌ها
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-6 py-3 font-medium ${activeTab === 'requests' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
          >
            تیکت‌ها
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow">
        {activeTab === 'experts' && (
          <DataTable
            columns={expertColumns}
            data={employees}
            title="لیست کارشناسان"
            loading={tableLoading}
          />
        )}
        
        {activeTab === 'companies' && (
          <DataTable
            columns={companyColumns}
            data={companies}
            title="لیست شرکت‌ها"
            loading={tableLoading}
          />
        )}
        
        {activeTab === 'requests' && (
          <DataTable
            columns={requestColumns}
            data={tickets}
            title="لیست تیکت‌ها"
            loading={tableLoading}
          />
        )}
      </div>
    </div>
  )
}