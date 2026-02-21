'use client'

import { useState, useEffect } from "react";
import DataTable from '../../components/DataTable'
import { getEmployees } from "../../../../lib/app";
import { useRouter } from 'next/navigation'

export default function CustomerPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchEmployees() {
      try {
        const res = await getEmployees();
        console.log(res, 'resssssss')
        setEmployees(res.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchEmployees();
  }, []);

  const columns = [
    { key: 'id', label: '#' },
    { key: 'first_name', label: 'نام' },
    { key: 'last_name', label: 'نام خانوادگی' },
    { key: 'email', label: 'ایمیل' },
    { key: 'mobile', label: 'موبایل' },
    { key: 'gender', label: 'جنسیت' },
    { key: 'national_code', label: 'کد ملی' },
    { key: 'last_login', label: 'آخرین ورود' },
    { key: 'department_name', label: 'دپارتمان' },
    { key: 'position_name', label: 'سمت شغلی' },
    { key: 'interal_code', label: 'شماره داخلی' },

  ];

  if (loading) return <p>در حال بارگذاری...</p>;

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">مدیریت کاربران</h1>
        <button
          className="mt-3 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          onClick={() => router.push('/dashboard/register?type_name=employee')}
        >
          ایجاد کارشناس جدید
        </button>
      </div>

      <DataTable
        columns={columns}
        data={employees}
        title="لیست کارشناسان"
      />
    </div>
  );
}
