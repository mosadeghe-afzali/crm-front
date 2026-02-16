'use client'

import DataTable from '../../components/DataTable'
import StatusBadge from '../../components/StatusBadge'
import { requestsData as requests } from '../../data/mockData'
import { Clock, AlertCircle, CheckCircle, Calendar } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function RequestsPage() {
  const columns = [
    { key: 'title', label: 'عنوان درخواست' },
    { key: 'company', label: 'شرکت' },
    { key: 'expert', label: 'کارشناس مسئول' },
    { key: 'category', label: 'دسته‌بندی' },
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
    { key: 'createdDate', label: 'تاریخ ایجاد' },
    { key: 'dueDate', label: 'مهلت' },
  ]

  const newRequests = requests.filter(r => r.status === 'جدید').length
  const inProgressRequests = requests.filter(r => r.status === 'در حال انجام').length
  const completedRequests = requests.filter(r => r.status === 'انجام شده').length
  const highPriorityRequests = requests.filter(r => r.priority === 'بالا').length
  const router = useRouter();

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">

        <h1 className="text-2xl font-bold text-gray-800 mb-6">مدیریت درخواست‌ها</h1>
        <button
          className="mt-3 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          onClick={() => router.push('/dashboard/requests/create')}
        >
          ایجاد درخواست
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">درخواست‌های جدید</p>
              <p className="text-3xl font-bold text-gray-800">{newRequests}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">در حال انجام</p>
              <p className="text-3xl font-bold text-gray-800">{inProgressRequests}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <AlertCircle className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">انجام شده</p>
              <p className="text-3xl font-bold text-gray-800">{completedRequests}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">اولویت بالا</p>
              <p className="text-3xl font-bold text-gray-800">{highPriorityRequests}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <span className="text-red-600 font-bold text-lg">!</span>
            </div>
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={requests}
        title="لیست درخواست‌ها"
      />

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">وضعیت درخواست‌ها</h3>
          <div className="space-y-4">
            {[
              { status: 'جدید', count: newRequests, color: 'bg-blue-500' },
              { status: 'در حال انجام', count: inProgressRequests, color: 'bg-yellow-500' },
              { status: 'انجام شده', count: completedRequests, color: 'bg-green-500' },
              { status: 'در انتظار', count: requests.filter(r => r.status === 'در انتظار').length, color: 'bg-gray-500' },
            ].map((item) => (
              <div key={item.status} className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-700">{item.status}</span>
                    <span className="text-sm text-gray-600">{item.count} درخواست</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${item.color}`}
                      style={{
                        width: `${(item.count / requests.length) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>
                <div className={`w-4 h-4 ${item.color} rounded-full`}></div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">مهلت‌های نزدیک</h3>
          <div className="space-y-3">
            {requests
              .filter(r => r.status !== 'انجام شده')
              .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
              .slice(0, 4)
              .map((request) => (
                <div key={request.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Calendar className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium">{request.title}</p>
                      <p className="text-sm text-gray-600">{request.company}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">مهلت</p>
                    <p className="font-bold text-gray-800">{request.dueDate}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div >
  )
}