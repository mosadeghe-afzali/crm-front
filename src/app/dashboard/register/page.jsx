"use client";

import { useState, useEffect } from "react";
import { register, getCities, getProvinces, getDepartments, getPositions } from "../../../../lib/app";
import PasswordInput from "../../components/PasswordInput";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { useSearchParams } from 'next/navigation'

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
    <div className="bg-white w-full rounded-2xl shadow-lg p-8">
      <h1 className="text-3xl font-bold text-center mb-10">ثبت‌نام</h1>
      <div className="w-full">

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-4 w-full mx-auto px-4 md:px-6 lg:px-8"
        >


          <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
            <h4 className="mb-4 text-lg font-semibold text-gray-700">
              اطلاعات پایه
            </h4>
            {typeName === "customer" && (
              <div className="flex flex-col">
                <select
                  value={form.customer_type || ""}
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
            )}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mt-3">
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
              <div className="flex flex-col">
                <DatePicker
                  calendar={persian}
                  locale={persian_fa}
                  value={form.birth_date}
                  onChange={(date) =>
                    setForm({ ...form, birth_date: date })
                  }
                  inputClass="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring focus:ring-[#80bdff]"
                  placeholder="تاریخ تولد "
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
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
          </div>
          <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-6">
            <h4 className="mb-4 text-lg font-semibold text-gray-700">
              آدرس
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">

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
                  value={form.address?.province_id || ""}
                  onChange={async (e) => {
                    const provinceId = Number(e.target.value);

                    setForm({
                      ...form,
                      address: {
                        ...form.address,
                        province_id: provinceId,
                        city_id: "",
                      },
                    });

                    if (provinceId) {
                      try {
                        const res = await getCities(provinceId);
                        setCities(res.data.data);
                      } catch (err) {
                        console.error(err);
                        setCities([]);
                      }
                    } else {
                      setCities([]);
                    }
                  }}
                >
                  <option value="">انتخاب استان</option>
                  {provinces.map(province => (
                    <option key={province.id} value={province.id}>
                      {province.name}
                    </option>
                  ))}
                </select>

                {errors["address.province_id"] && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors["address.province_id"]}
                  </p>
                )}
              </div>

              <div className="flex flex-col">
                <select
                  className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring focus:ring-[#80bdff]"
                  value={form.address?.city_id || ""}
                  disabled={!form.address?.province_id}
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
                  <option value="">
                    انتخاب شهر
                  </option>

                  {cities.map(city => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
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
                rows={2}
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
            <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-6">
              <h4 className="mb-4 text-lg font-semibold text-gray-700">
                اطلاعات شرکت
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="flex flex-col">
                  <input className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring focus:ring-[#80bdff]" placeholder="نام شرکت" onChange={e => setForm({ ...form, company_name: e.target.value })} />
                  {errors.company_name && (
                    <p className="text-red-500 text-sm">{errors.company_name}</p>
                  )}
                </div>
                <div className="flex flex-col">
                  <input
                    className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring focus:ring-[#80bdff]"
                    placeholder="شناسه ملی"
                    onChange={e => setForm({ ...form, national_id: e.target.value })} />
                  {errors.national_id && (
                    <p className="text-red-500 text-sm">{errors.national_id}</p>
                  )}
                </div>
                <div className="flex flex-col">
                  <DatePicker
                    calendar={persian}
                    locale={persian_fa}
                    value={form.registeration_date}
                    onChange={(date) =>
                      setForm({ ...form, registeration_date: date })
                    }
                    inputClass="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring focus:ring-[#80bdff]"
                    placeholder="تاریخ ثبت شرکت"
                  />

                  {errors.registeration_date && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.registeration_date}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {typeName === "employee" && (
            <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-6">
              <h4 className="mb-4 text-lg font-semibold text-gray-700">
                اطلاعات کارمند
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="flex flex-col">

                  <select
                    className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring focus:ring-[#80bdff]"
                    value={form.department_id || ""}
                    onChange={async (e) => {
                      const departmentId = Number(e.target.value);

                      setForm({
                        ...form,
                        department_id: departmentId,
                        position_id: "",
                      });

                      if (departmentId) {
                        try {
                          const res = await getPositions(departmentId);
                          setPositions(res.data.data);
                        } catch (err) {
                          console.error(err);
                          setPositions([]);
                        }
                      } else {
                        setPositions([]);
                      }
                    }}
                  >
                    <option value="">انتخاب دپارتمان</option>
                    {departments.map(dep => (
                      <option key={dep.id} value={dep.id}>
                        {dep.name}
                      </option>
                    ))}
                  </select>

                  {errors.department_id && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.department_id}
                    </p>
                  )}

                </div>

                <div className="flex flex-col">
                  <select
                    className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring focus:ring-[#80bdff]"
                    value={form.position_id || ""}
                    disabled={!form.department_id}
                    onChange={e =>
                      setForm({ ...form, position_id: Number(e.target.value) })
                    }
                  >
                    <option value="">
                      انتخاب موقعیت شغلی
                    </option>

                    {positions.map(pos => (
                      <option key={pos.id} value={pos.id}>
                        {pos.name}
                      </option>
                    ))}
                  </select>

                  {errors.position_id && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.position_id}
                    </p>
                  )}

                </div>

                <div className="flex flex-col">
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring focus:ring-[#80bdff]"
                    placeholder="شماره داخلی"
                    value={form.internal_code}
                    onChange={e =>
                      setForm({ ...form, internal_code: e.target.value })
                    }
                  />

                  {errors.internal_code && (
                    <p className="text-sm text-red-500">
                      {errors.internal_code}
                    </p>
                  )}
                </div>

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
