'use client'

import DataTable from '../../components/DataTable'
import StatusBadge from '../../components/StatusBadge'
import { useState, useEffect } from "react";
import { Clock, AlertCircle, CheckCircle, Calendar } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { getTickets } from "../../../../lib/app";
import { requestsData as requests } from '../../data/mockData'

export default function RequestsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchTickets() {
      try {
        const res = await getTickets();
        console.log(res.data, 'resssssss')
        setTickets(res.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchTickets();
  }, []);


  const columns = [
    {
      key: 'id',
      label: 'شناسه'
    },
    {
      key: 'title',
      label: 'عنوان درخواست'
    },
    {
      key: 'owner',
      label: 'درخواست دهنده',
      render: (owner) => (
        <div className="flex flex-col">
          <span>{owner?.full_name || 'نامشخص'}</span>
          <span className="text-xs text-gray-400">{owner?.email}</span>
        </div>
      )
    },
    {
      key: 'department',
      label: 'دپارتمان',
      render: (dept) => dept?.name || 'تعیین نشده'
    },
    // {
    //   key: 'category',
    //   label: 'دسته‌بندی',
    //   render: (cat) => cat?.name || 'بدون دسته‌بندی'
    // },
    {
      key: 'assignee',
      label: 'کارشناس مسئول',
      render: (val) => val ? val.full_name : 'در انتظار تخصیص'
    },
    {
      key: 'priority',
      label: 'اولویت',
      render: (priority) => <StatusBadge status={priority?.name} />
    },
    {
      key: 'status',
      label: 'وضعیت',
      render: (status) => <StatusBadge status={status?.name} />
    },
    {
      key: 'reply_count',
      label: 'پاسخ‌ها',
      render: (count) => (
        <span className="bg-gray-100 px-2 py-1 rounded-full text-xs">
          {count} پاسخ
        </span>
      )
    },
    {
      key: 'has_attachments',
      label: 'پیوست',
      render: (hasFile) => hasFile ? '📎 دارد' : '---'
    },

    {
      key: 'created_at',
      label: 'تاریخ ایجاد',
      render: (created_at) => (
        <span className="text-sm">
          {created_at
            ? new Date(created_at).toLocaleDateString('fa-IR')
            : '---'}
        </span>
      )
    },
    {
      key: 'dates',
      label: 'زمان‌بندی پروژه',
      render: (dates) => (
        <div className="text-xs flex flex-col gap-1">
          <div className="flex justify-between gap-2">
            <span className="text-gray-400">شروع:</span>
            <span>{dates?.start_at ? new Date(dates.start_at).toLocaleDateString('fa-IR') : 'تعیین نشده'}</span>
          </div>
          {dates?.end_at && (
            <div className="flex justify-between gap-2 text-red-600 font-medium">
              <span className="text-gray-400">مهلت:</span>
              <span>{new Date(dates.end_at).toLocaleDateString('fa-IR')}</span>
            </div>
          )}
        </div>
      )
    }
  ];
  if (loading) return <p>در حال بارگذاری...</p>;


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

      <DataTable
        columns={columns}
        data={tickets}
        title="لیست درخواست‌ها"
      />
    </div >
  )
}