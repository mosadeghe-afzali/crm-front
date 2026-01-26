'use client'

import DataTable from '../../components/DataTable'
import StatusBadge from '../../components/StatusBadge'
import { expertsData as experts } from '../../data/mockData'
import { Star, Phone, Mail, Calendar } from 'lucide-react'

export default function ExpertsPage() {
  const columns = [
    { 
      key: 'name', 
      label: 'نام کارشناس',
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full ${row.avatarColor} flex items-center justify-center`}>
            <span className="text-white font-bold text-lg">{value.charAt(0)}</span>
          </div>
          <div>
            <p className="font-medium">{value}</p>
            <p className="text-gray-500 text-sm">{row.department}</p>
          </div>
        </div>
      )
    },
    { key: 'email', label: 'ایمیل' },
    { key: 'phone', label: 'تلفن' },
    { key: 'specialty', label: 'تخصص' },
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
          <Star className="w-4 h-4 text-yellow-500 fill-current" />
          <span className="font-medium">{value}</span>
        </div>
      )
    },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">مدیریت کارشناسان</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">کارشناسان فعال</p>
              <p className="text-3xl font-bold text-gray-800">
                {experts.filter(e => e.status === 'فعال').length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">
                  {experts.filter(e => e.status === 'فعال').length}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">پروژه‌های انجام شده</p>
              <p className="text-3xl font-bold text-gray-800">
                {experts.reduce((sum, e) => sum + e.completedProjects, 0)}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">میانگین امتیاز</p>
              <p className="text-3xl font-bold text-gray-800">
                {(experts.reduce((sum, e) => sum + e.rating, 0) / experts.length).toFixed(1)}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Star className="w-8 h-8 text-yellow-600 fill-current" />
            </div>
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={experts}
        title="لیست کارشناسان"
      />

      <div className="mt-8 bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">اطلاعات تماس</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {experts.slice(0, 3).map((expert) => (
            <div key={expert.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-lg">
                    {expert.name.split(' ')[0][0]}{expert.name.split(' ')[1][0]}
                  </span>
                </div>
                <div>
                  <p className="font-bold text-gray-800">{expert.name}</p>
                  <p className="text-sm text-gray-600">{expert.department}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{expert.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">{expert.phone}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}