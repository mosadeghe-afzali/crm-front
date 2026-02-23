"use client";

import { useState, useEffect } from "react";
import { register, getCities, getProvinces, getDepartments, getPositions } from "../../../../lib/app";
import PasswordInput from "../../components/PasswordInput";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { useSearchParams } from 'next/navigation';
import EmployeeForm from "@/app/components/EmployeeForm";

export default function RegisterPage() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    mobile: "",
    password: "",
    customer_type: "",
    national_id: "",
    company_name: "",
    registeration_date: null,
    birth_date: null,
    gender: "",
    email: "",
    national_code: "",
    address: {
      city_id: "",
      province_id: "",
      postal_code: "",
      title: "",
    },
    department_id: "",
    position_id: "",
    internal_code: "",
  });

  const [cities, setCities] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const searchParams = useSearchParams();
  const typeName = searchParams.get('type_name')

  const validate = () => {
    const newErrors = {};
    if (typeName == 'customer' && !form.customer_type) newErrors.customer_type = "نوع شخص الزامی است";
    if (!form.first_name) newErrors.first_name = "نام الزامی است";
    if (!form.last_name) newErrors.last_name = "نام خانوادگی الزامی است";
    if (!form.mobile) newErrors.mobile = "شماره موبایل الزامی است";
    if (!form.password) newErrors.password = "رمز عبور الزامی است";

    if (Number(form.customer_type) === 2) {
      if (!form.national_id)
        newErrors.national_id = "شناسه ملی الزامی است";
      if (!form.company_name)
        newErrors.company_name = "نام شرکت الزامی است";
      if (!form.registeration_date)
        newErrors.registeration_date = "تاریخ ثبت الزامی است";
    }

    if (typeName === 'employee') {
      if (!form.department_id)
        newErrors.department_id = "دپارتمان الزامی است";

      if (!form.position_id)
        newErrors.position_id = "سمت شغلی الزامی است";
    }


    return newErrors;
  };

  useEffect(() => {
    getProvinces()
      .then(res => setProvinces(res.data.data))
      .catch(console.error);
  }, []);


  useEffect(() => {
    getDepartments()
      .then(res => setDepartments(res.data.data))
      .catch(console.error);
  }, []);

  const toGregorian = (date) => {
    if (!date) return undefined;

    const jsDate = date.toDate();
    return jsDate.toISOString().slice(0, 10); // YYYY-MM-DD
  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    const validationErrors = validate();
    console.log(validationErrors)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    console.log('in first')
    setErrors({});
    setLoading(true);

    try {

      const cleanPayload = (obj) =>
        Object.fromEntries(
          Object.entries(obj)
            .filter(([_, v]) => v !== "" && v !== null)
            .map(([k, v]) => [
              k,
              typeof v === "object" && !Array.isArray(v)
                ? cleanPayload(v)
                : v,
            ])
        );

      const payload = {
        ...cleanPayload(form),
        type_name: typeName,
        ...(form.birth_date && {
          birth_date: toGregorian(form.birth_date),
        }),
        ...(form.registeration_date && {
          registeration_date: toGregorian(form.registeration_date),
        }),
      };


      // const cleanPayload = Object.fromEntries(
      //   Object.entries(form).filter(
      //     ([_, value]) => value !== "" && value !== undefined
      //   )
      // );


      console.log("📤 Sending to API:", payload);

      const res = await register(typeName, payload);

      console.log("✅ Registration successful:", res.data);
      alert(
        "ثبت‌نام با موفقیت انجام شد! لطفاً ایمیل خود را برای تأیید باز کنید."
      );
      // Reset form
      const initialForm = {
        first_name: "",
        last_name: "",
        mobile: "",
        password: "",
        customer_type: "",
        national_id: "",
        company_name: "",
        registeration_date: null,
        birth_date: null,
        gender: "",
        email: "",
        national_code: "",
        address: {
          city_id: "",
          province_id: "",
          postal_code: "",
          title: "",
        },
        department_id: "",
        position_id: "",
        internal_code: "",
      };
      setForm(initialForm);

    } catch (err) {
      console.error("❌ Registration error:", err.response?.data);

      const response = err.response?.data;

      if (response?.data?.errors) {
        const apiErrors = response.data.errors;
        const formattedErrors = {};

        Object.keys(apiErrors).forEach((field) => {
          formattedErrors[field] = apiErrors[field].join("، ");
        });

        setErrors(formattedErrors);
        return;
      }

      if (response?.message) {
        alert(response.message);
        return;
      }

      alert("خطای غیرمنتظره‌ای رخ داد. لطفاً دوباره تلاش کنید.");
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <EmployeeForm
  form={form}
  setForm={setForm}
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
  mode="create"
  showPassword={true} 
/>
  );
}
