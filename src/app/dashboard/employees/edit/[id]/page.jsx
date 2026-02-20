'use client'

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { getEmployeeById, editEmployee, getPositions } from "../../../../../../lib/app";

export default function EditEmployeePage() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const userIdFromQuery = searchParams.get("user_id");

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    mobile: "",
    birth_date: "",
    email: "",
    gender: "",
    national_code: "",
    internal_code: "",
    department_id: "",
    position_id: "",
    user_id: "",
  });

  const [loading, setLoading] = useState(true);
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    async function fetchEmployee() {
      try {
        const res = await getEmployeeById(id);
        const data = res.data.data;

        const departmentId = data.department_id;

        setFormData({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          mobile: data.mobile || "",
          birth_date: data.birth_date || "",
          email: data.email || "",
          gender:
            data.gender === "زن"
              ? "1"
              : data.gender === "مرد"
              ? "2"
              : "",
          national_code: data.national_code || "",
          internal_code: data.internal_code || "",
          department_id: departmentId || "",
          position_id: data.position_id || "",
          user_id: userIdFromQuery || data.user_id || "",
        });

        if (departmentId) {
          const posRes = await getPositions(departmentId);
          setPositions(posRes.data.data);
        }


      } catch (error) {
        console.error(error);
        alert("خطا در دریافت اطلاعات کارمند");
      } finally {
        setLoading(false);
      }
    }

    fetchEmployee();
  }, [id, userIdFromQuery,searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      gender: Number(formData.gender),
      position_id: Number(formData.position_id),
      department_id: Number(formData.department_id),
      user_id: Number(formData.user_id),
    };
    console.log("payload:", payload);
    try {
      await editEmployee(id, payload);
      const check = await getEmployeeById(id);
console.log("after update:", check.data.data.gender);
      alert("ویرایش با موفقیت انجام شد");
      router.push("/dashboard/employees?refresh=true");
     
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

      {/* جنسیت به صورت انتخابی */}
      <select
  name="gender"
  value={formData.gender}
  onChange={handleChange}
  className="border p-2 rounded"
>
  <option value="">انتخاب جنسیت</option>
  <option value="1">زن</option>
  <option value="2">مرد</option>
</select>


      <input name="national_code" placeholder="کد ملی" value={formData.national_code} onChange={handleChange} />
      <input name="internal_code" placeholder="کد داخلی" value={formData.internal_code} onChange={handleChange} />
      <input name="birth_date" type="date" value={formData.birth_date} onChange={handleChange} />
      <select
  value={formData.position_id || ""}
  disabled={!formData.department_id}
  onChange={(e) =>
    setFormData(prev => ({
      ...prev,
      position_id: Number(e.target.value),
    }))
  }
>
  <option value="">انتخاب موقعیت شغلی</option>

  {positions.map(pos => (
    <option key={pos.id} value={pos.id}>
      {pos.name}
    </option>
  ))}
</select>
      
      
      
      
      <select
  value={formData.department_id || ""}
  onChange={async (e) => {
    const departmentId = Number(e.target.value);

    setFormData(prev => ({
      ...prev,
      department_id: departmentId,
      position_id: "",
    }));

    if (departmentId) {
      const res = await getPositions(departmentId);
      setPositions(res.data.data);
    } else {
      setPositions([]);
    }
  }}
>
  <option value="">انتخاب دپارتمان</option>
  {/* departments.map(...) */}
</select>

      {/* user_id مخفی */}
      <input type="hidden" name="user_id" value={formData.user_id} />

      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        ذخیره تغییرات
      </button>

    </form>
  );
}
