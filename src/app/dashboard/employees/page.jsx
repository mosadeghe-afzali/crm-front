'use client'

import { useState, useEffect } from "react";
import DataTable from '../../components/DataTable'
import { getEmployees, deleteEmployee , updateEmployee } from "../../../../lib/app";
import { useRouter } from 'next/navigation';
import { Eye, Pencil, Trash2 } from "lucide-react";




export default function CustomerPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchEmployees() {
      try {
        const res = await getEmployees();
        
        setEmployees(res.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchEmployees();
  }, []);

  const handleView = (id) => {
    router.push(`/dashboard/employees/${id}`);
  };
  
  const handleEdit = (row) => {
    router.push(`/dashboard/employees/edit/${row.id}`);
  };
  
  
  
  const handleDelete = async (id) => {
    const confirmDelete = confirm("آیا از حذف این کارشناس مطمئن هستید؟");
    if (!confirmDelete) return;
  
    try {
      await deleteEmployee(id);
  
      // حذف از state بدون نیاز به رفرش
      setEmployees(prev => prev.filter(emp => emp.id !== id));
  
    } catch (error) {
      console.error(error);
      alert("خطا در حذف کاربر");
    }
  };
  
  

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
  
   
    {
      key: 'actions',
      label: 'عملیات',
      render: (_, row) => (
        <div className="flex items-center gap-3 justify-center">
    
          {/* مشاهده */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleView(row.id);
            }}
            className="text-gray-500 hover:text-blue-600 transition"
            title="مشاهده"
          >
            <Eye size={18} />
          </button>
    
          {/* ویرایش */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(row);
            }}
            className="text-gray-500 hover:text-yellow-600 transition"
            title="ویرایش"
          >
            <Pencil size={18} />
          </button>
    
          {/* حذف */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row.id);
            }}
            className="text-gray-500 hover:text-red-600 transition"
            title="حذف"
          >
            <Trash2 size={18} />
          </button>
    
        </div>
      ),
    }
    
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
