'use client'

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getEmployeeById, editEmployee } from "../../../../../../lib/app";

export default function EditEmployeePage() {
  const { id } = useParams(); // id از URL میاد
  const router = useRouter();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    mobile: "",
    email: "",
    gender: "",
    national_code: "",
    position_id: "",
    department_id: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEmployee() {
      try {
        const res = await getEmployeeById(id);
        setFormData({
          first_name: res.data.data.first_name || "",
          last_name: res.data.data.last_name || "",
          mobile: res.data.data.mobile || "",
          email: res.data.data.email || "",
          gender: res.data.data.gender || "",
          national_code: res.data.data.national_code || "",
          position_id: res.data.data.position_id || "",
          department_id: res.data.data.department_id || "",
        });
      } catch (error) {
        console.error(error);
        alert("خطا در دریافت اطلاعات کارمند");
      } finally {
        setLoading(false);
      }
    }

    fetchEmployee();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await editEmployee(id, formData); // مسیر API بدون /edit
      alert("ویرایش با موفقیت انجام شد");
      router.push("/dashboard/employees");
    } catch (error) {
      console.error(error);
      alert("خطا در ویرایش کارمند");
    }
  };

  if (loading) return <p>در حال بارگذاری...</p>;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-md">
      <input name="first_name" placeholder="نام" value={formData.first_name} onChange={handleChange} />
      <input name="last_name" placeholder="نام خانوادگی" value={formData.last_name} onChange={handleChange} />
      <input name="mobile" placeholder="موبایل" value={formData.mobile} onChange={handleChange} />
      <input name="email" placeholder="ایمیل" value={formData.email} onChange={handleChange} />
      <input name="gender" placeholder="جنسیت" value={formData.gender} onChange={handleChange} />
      <input name="national_code" placeholder="کد ملی" value={formData.national_code} onChange={handleChange} />
      <input name="position_id" type="number" placeholder="شناسه سمت" value={formData.position_id} onChange={handleChange} />
      <input name="department_id" type="number" placeholder="شناسه دپارتمان" value={formData.department_id} onChange={handleChange} />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">ذخیره تغییرات</button>
    </form>
  );
}
