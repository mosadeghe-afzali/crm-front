'use client'

import DataTable from '../../components/DataTable'
import StatusBadge from '../../components/StatusBadge'
import { useState, useEffect } from "react";
import { Clock, AlertCircle, CheckCircle, Calendar, FileText } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { getTickets } from "../../../../lib/app";
import { Eye } from 'lucide-react'

const API_URL = 'http://localhost:8000/api/v1';

export default function RequestsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);
  const [reportLoading, setReportLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchTickets() {
      try {
        const res = await getTickets();
        setTickets(res.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    async function fetchReport() {
      try {
        const res = await fetch(`${API_URL}/tickets/report`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await res.json();
        if (data.success) {
          setReport(data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setReportLoading(false);
      }
    }

    fetchTickets();
    fetchReport();
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
      key: 'actions',
      label: 'عملیات',
      render: (_, row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/dashboard/requests/${row.id}`);
          }}
          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
        >
          <Eye className="w-4 h-4" />
          <span className="text-sm">مشاهده</span>
        </button>
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

      {!reportLoading && report && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">کل درخواست‌ها</p>
                <p className="text-xl font-bold text-gray-800">{report.total_tickets}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">در انتظار پاسخ</p>
                <p className="text-xl font-bold text-gray-800">{report.pending_response}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <AlertCircle className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">در حال انجام</p>
                <p className="text-xl font-bold text-gray-800">{report.in_progress}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Calendar className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">اولویت بالا</p>
                <p className="text-xl font-bold text-gray-800">{report.high_priority}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <DataTable
        columns={columns}
        data={tickets}
        title="لیست درخواست‌ها"
      />

      {!reportLoading && report && report.upcoming_end_tickets && report.upcoming_end_tickets.length > 0 && (
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">درخواست‌های با مهلت نزدیک</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">شناسه</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">درخواست دهنده</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">مهلت</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {report.upcoming_end_tickets.map((ticket) => (
                  <tr key={ticket.ticket_id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-800">{ticket.ticket_id}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{ticket.full_name}</td>
                    <td className="px-4 py-3 text-sm text-red-600 font-medium">
                      {new Date(ticket.end_at).toLocaleDateString('fa-IR')}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => router.push(`/dashboard/requests/${ticket.ticket_id}`)}
                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        مشاهده
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div >
  )
}