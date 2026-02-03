"use client";

import { useState, useEffect } from "react";
import { register } from "../../../../lib/app";
import PasswordInput from "../../components/PasswordInput";

export default function RegisterPage() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    mobile: "",
    password: "",
    customer_type: "",
    national_id: "",
    company_name: "",
    registeration_date: "",
    birth_date: "",
    gender: null,
    email: "",
    national_code: "",
    city_id: null,
    postal_code: "",
    title: "",
  });

  // const [selectedSkills, setSelectedSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!form.customer_type) newErrors.customer_type = "نوع شخص الزامی است";
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

    return newErrors;
  };

  // useEffect(() => {
  //   getCountries().then((res) => setCountries(res.data.data));
  //   getSkills()
  //     .then((res) => setSkills(res.data.data))
  //     .catch(console.error);
  // }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const payload = {
        ...form,
      };
      console.log("📤 Sending to API:", payload);

      const res = await register("customer", payload);

      console.log("✅ Registration successful:", res.data);
      alert(
        "ثبت‌نام با موفقیت انجام شد! لطفاً ایمیل خود را برای تأیید باز کنید."
      );
      // Reset form
      setForm({
        first_name: "",
        last_name: "",
        email: "",
        mobile: "",
        password: "",
        national_code: "",
        birth_date: "",
        customer_type: "",
        city_id: "",
      });
      // setSelectedSkills([]);
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
    <div className="bg-white w-full rounded-2xl shadow-lg p-8 md:p-12">
      <h1 className="text-3xl font-bold text-center mb-10">ثبت‌نام</h1>
      <div className="flex flex-col md:flex-row justify-center items-center gap-10">

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-4 w-full max-w-6xl mx-auto md:px-10"
        >
          <div className="flex flex-col">
            <select
              className="border border-gray-300 rounded p-3 focus:outline-none focus:ring focus:ring-[#80bdff]"
              onChange={e => setForm({ ...form, customer_type: Number(e.target.value) })}
            >
              <option value="">انتخاب نوع شخص</option>
              <option value={1}>حقیقی</option>
              <option value={2}>حقوقی</option>
            </select>
            {errors.customer_type && (
              <p className="text-red-500 text-sm">{errors.customer_type}</p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="flex flex-col">
              <input
                className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring focus:ring-[#80bdff]"
                placeholder="نام"
                onChange={e => setForm({ ...form, first_name: e.target.value })}
              />
              {errors.first_name && (
                <p className="text-red-500 text-sm">{errors.first_name}</p>
              )}
            </div>
            <div className="flex flex-col">
              <input
                className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring focus:ring-[#80bdff]"
                placeholder="نام خانوادگی"
                onChange={e => setForm({ ...form, last_name: e.target.value })} />
              {errors.last_name && (
                <p className="text-red-500 text-sm">{errors.last_name}</p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <input
                  className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring focus:ring-[#80bdff]"
                  type="date"
                  onChange={e => setForm({ ...form, birth_date: e.target.value })}
                />
                {errors.birth_date && (
                  <p className="text-red-500 text-sm">{errors.birth_date}</p>
                )}
              </div>
              <div className="flex flex-col">
                <select
                  className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring focus:ring-[#80bdff]"
                  onChange={e => setForm({ ...form, gender: Number(e.target.value) })}
                >
                  <option value="">انتخاب جنسیت</option>
                  <option value={1}>مرد</option>
                  <option value={2}>زن</option>
                </select>
                {errors.gender && (
                  <p className="text-red-500 text-sm">{errors.gender}</p>
                )}
              </div>
            </div>
            <div className="flex flex-col">
              <input
                className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring focus:ring-[#80bdff]"
                placeholder="کد ملی" onChange={e => setForm({ ...form, national_code: e.target.value })}
              />
              {errors.national_code && (
                <p className="text-red-500 text-sm">{errors.national_code}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col">
              <input
                className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring focus:ring-[#80bdff]"
                placeholder="موبایل (نام کاربری)" onChange={e => setForm({ ...form, mobile: e.target.value })}
              />
              {errors.mobile && (
                <p className="text-red-500 text-sm">{errors.mobile}</p>
              )}
            </div>
            <div className="flex flex-col">
              <PasswordInput
                label="رمز عبور"
                onChange={e => setForm({ ...form, password: e.target.value })}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>
            <div className="flex flex-col">
              <input type="email"
                className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring focus:ring-[#80bdff]"
                placeholder="ایمیل" onChange={e => setForm({ ...form, email: e.target.value })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>
          </div>
          <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-6">
            <h4 className="mb-4 text-lg font-semibold text-gray-700">
              آدرس
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

              <div className="flex flex-col">
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring focus:ring-[#80bdff]"
                  placeholder="نام آدرس"
                  onChange={e =>
                    setForm({
                      ...form,
                      address: {
                        ...form.address,
                        title: e.target.value,
                      },
                    })
                  }
                />
                {errors["address.title"] && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors["address.title"]}
                  </p>
                )}
              </div>

              <div className="flex flex-col">
                <select
                  className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring focus:ring-[#80bdff]"
                  onChange={e =>
                    setForm({
                      ...form,
                      address: {
                        ...form.address,
                        city_id: Number(e.target.value),
                      },
                    })
                  }
                >
                  <option value="">انتخاب شهر</option>
                  <option value={1}>کرمان</option>
                  <option value={2}>تهران</option>
                </select>
                {errors["address.city_id"] && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors["address.city_id"]}
                  </p>
                )}
              </div>

              <div className="flex flex-col">
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring focus:ring-[#80bdff]"
                  placeholder="کد پستی"
                  onChange={e =>
                    setForm({
                      ...form,
                      address: {
                        ...form.address,
                        postal_code: e.target.value,
                      },
                    })
                  }
                />
                {errors["address.postal_code"] && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors["address.postal_code"]}
                  </p>
                )}
              </div>
            </div>
            <div className="col-span-2 flex flex-col mt-3">
              <textarea
                rows={3}
                className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring focus:ring-[#80bdff]"
                placeholder="آدرس کامل"
                onChange={e =>
                  setForm({
                    ...form,
                    address: {
                      ...form.address,
                      address: e.target.value,
                    },
                  })
                }
              />
              {errors["address.address"] && (
                <p className="mt-1 text-sm text-red-500">
                  {errors["address.address"]}
                </p>
              )}
            </div>
          </div>

          {form.customer_type === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col">
                <input className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring focus:ring-[#80bdff]" placeholder="شناسه ملی" onChange={e => setForm({ ...form, national_id: e.target.value })} />
                {errors.national_id && (
                  <p className="text-red-500 text-sm">{errors.national_id}</p>
                )}
              </div>
              <div className="flex flex-col">
                <input className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring focus:ring-[#80bdff]" placeholder="نام شرکت" onChange={e => setForm({ ...form, company_name: e.target.value })} />
                {errors.company_name && (
                  <p className="text-red-500 text-sm">{errors.company_name}</p>
                )}
              </div>
              <div className="flex flex-col">
                <input className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring focus:ring-[#80bdff]" type="date" onChange={e => setForm({ ...form, registeration_date: e.target.value })} />
                {errors.registeration_date && (
                  <p className="text-red-500 text-sm">{errors.registeration_date}</p>
                )}
              </div>
            </div>
          )}
          <div className="flex justify-end">
            <button
              type="submit"
              className={`bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition ${loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              disabled={loading}
            >ثبت‌نام
            </button>
          </div>

        </form>
      </div >
    </div >
  );
}
