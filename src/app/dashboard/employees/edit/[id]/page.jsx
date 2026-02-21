'use client'

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { getEmployeeById, getDepartments, editEmployee, getPositions, getCities,getProvinces } from "../../../../../../lib/app";
import EmployeeForm from "@/app/components/EmployeeForm";

export default function EditEmployeePage() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const userIdFromQuery = searchParams.get("user_id");
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);

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
  const [departments, setDepartments] = useState([]);


  useEffect(() => {
    async function fetchProvinces() {
      try {
        const res = await getProvinces();
        setProvinces(res.data.data);
      } catch (err) {
        console.error(err);
      }
    }
  
    fetchProvinces();
  }, []);

  // گرفتن لیست دپارتمان‌ها
  useEffect(() => {
    async function fetchDepartments() {
      try {
        const res = await getDepartments();
        setDepartments(res.data.data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchDepartments();
  }, []);

  // گرفتن اطلاعات کارمند
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
            data.gender === "مرد"
              ? "1"
              : data.gender === "زن"
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
  }, [id, userIdFromQuery]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      gender: Number(formData.gender),
      position_id: Number(formData.position_id),
      department_id: Number(formData.department_id),
      user_id: Number(formData.user_id),
    };

    try {
      await editEmployee(id, payload);
      alert("ویرایش با موفقیت انجام شد");
      router.push("/dashboard/employees?refresh=true");
    } catch (error) {
      console.error(error);
      alert("خطا در ویرایش کارمند");
    }
  };

  if (loading) return <p>در حال بارگذاری...</p>;

  return (
    <EmployeeForm
  form={formData}
  setForm={setFormData}
  onSubmit={handleSubmit}
  loading={loading}
  departments={departments}
  positions={positions}
  provinces={provinces}
  cities={cities}
  setCities={setCities}
  getCities={getCities} 
  fetchPositions={async (departmentId) => {
    const res = await getPositions(departmentId);
    setPositions(res.data.data);
  }}
  mode="edit"
/>
  );
}