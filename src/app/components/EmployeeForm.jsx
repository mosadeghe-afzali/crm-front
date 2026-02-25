"use client";

import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

import PasswordInput from "./PasswordInput";

export default function EmployeeForm({
    form,
    setForm,
    onSubmit,
    loading,
    departments,
    positions,
    provinces,     
    cities,        
    setCities,     
    getCities,
    fetchPositions,     
    errors = {},  
    mode = "create"
}) {
  const toGregorian = (date) => {
    if (!date) return undefined;
    const jsDate = date.toDate();
    return jsDate.toISOString().slice(0, 10);
  };

  return (
    <div className="rounded-2xl border border-gray-300 bg-white p-10 shadow-md">
      <h1 className="text-2xl font-bold mb-10 text-gray-900 text-center">
        {form.id ? "ویرایش کارشناس" : "ثبت کارشناس"}
      </h1>

      <form
        onSubmit={onSubmit}
        className="grid grid-cols-1 gap-12 w-full mx-auto"
      >
        <div className="rounded-xl border border-gray-300 bg-gray-50 p-8">
          <h4 className="mb-6 text-lg font-semibold text-gray-900">
            اطلاعات پایه
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium text-gray-700">نام</label>
              <input
                className="border border-gray-400 rounded-lg px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="نام"
                value={form.first_name}
                onChange={(e) =>
                  setForm({ ...form, first_name: e.target.value })
                }
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium text-gray-700">نام خانوادگی</label>
              <input
                className="border border-gray-400 rounded-lg px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="نام خانوادگی"
                value={form.last_name}
                onChange={(e) =>
                  setForm({ ...form, last_name: e.target.value })
                }
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium text-gray-700">تاریخ تولد</label>
              <div className="flex items-center bg-white rounded-lg border border-gray-400 pr-4">
                <DatePicker
                  calendar={persian}
                  locale={persian_fa}
                  value={form.birth_date}
                  onChange={(date) =>
                    setForm({ ...form, birth_date: date })
                  }
                  inputClass="border-none outline-none py-2.5 w-full text-gray-900 bg-transparent"
                  placeholder="تاریخ تولد"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium text-gray-700">جنسیت</label>
              <select
                className="border border-gray-400 rounded-lg px-4 py-2.5 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                value={form.gender || ""}
                onChange={(e) =>
                  setForm({ ...form, gender: Number(e.target.value) })
                }
              >
                <option value="">انتخاب جنسیت</option>
                <option value={1}>مرد</option>
                <option value={2}>زن</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium text-gray-700">کد ملی</label>
              <input
                className="border border-gray-400 rounded-lg px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="کد ملی"
                value={form.national_code}
                onChange={(e) =>
                  setForm({ ...form, national_code: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium text-gray-700">موبایل</label>
              <input
                className="border border-gray-400 rounded-lg px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="موبایل"
                value={form.mobile}
                onChange={(e) =>
                  setForm({ ...form, mobile: e.target.value })
                }
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium text-gray-700">ایمیل</label>
              <input
                className="border border-gray-400 rounded-lg px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="ایمیل"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />
            </div>

            {mode === "create" && (
              <PasswordInput
                label="رمز عبور"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                error={errors.password}
              />
            )}

            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium text-gray-700">شماره داخلی</label>
              <input
                className="border border-gray-400 rounded-lg px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="شماره داخلی"
                value={form.internal_code}
                onChange={(e) =>
                  setForm({ ...form, internal_code: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        {/* Address Section */}
        <div className="rounded-xl border border-gray-300 bg-gray-50 p-8">
          <h4 className="mb-6 text-lg font-semibold text-gray-900">
            آدرس
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

            {/* Title */}
            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium text-gray-700">نام آدرس</label>
              <input
                type="text"
                className="border border-gray-400 rounded-lg px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="نام آدرس"
                value={form.address?.title || ""}
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
                <p className="text-sm text-red-600 mt-1">
                  {errors["address.title"]}
                </p>
              )}
            </div>

            {/* Province */}
            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium text-gray-700">استان</label>
              <select
                className="border border-gray-400 rounded-lg px-4 py-2.5 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
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
                {provinces.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* City */}
            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium text-gray-700">شهر</label>
              <select
                className="border border-gray-400 rounded-lg px-4 py-2.5 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-200"
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
                <option value="">انتخاب شهر</option>
                {cities.map(city => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Postal Code */}
            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium text-gray-700">کد پستی</label>
              <input
                type="text"
                className="border border-gray-400 rounded-lg px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="کد پستی"
                value={form.address?.postal_code || ""}
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
            </div>

          </div>

          {/* Full Address */}
          <div className="mt-4">
            <label className="mb-2 text-sm font-medium text-gray-700">آدرس کامل</label>
            <textarea
              rows={2}
              className="w-full border border-gray-400 rounded-lg px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="آدرس کامل"
              value={form.address?.address || ""}
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
          </div>
        </div>

        {/* اطلاعات شغلی */}
        <div className="rounded-xl border border-gray-300 bg-gray-50 p-8">
          <h4 className="mb-6 text-lg font-semibold text-gray-900">
            اطلاعات شغلی
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium text-gray-700">دپارتمان</label>
              <select
                className="border border-gray-400 rounded-lg px-4 py-2.5 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                value={form.department_id || ""}
                onChange={async (e) => {
                  const departmentId = Number(e.target.value);

                  setForm({
                    ...form,
                    department_id: departmentId,
                    position_id: "",
                  });

                  if (departmentId && fetchPositions) {
                      await fetchPositions(departmentId);
                  }
                }}
              >
                <option value="">انتخاب دپارتمان</option>
                {departments.map((dep) => (
                  <option key={dep.id} value={dep.id}>
                    {dep.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium text-gray-700">موقعیت شغلی</label>
              <select
                className="border border-gray-400 rounded-lg px-4 py-2.5 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-200"
                value={form.position_id || ""}
                disabled={!form.department_id}
                onChange={(e) =>
                  setForm({
                    ...form,
                    position_id: Number(e.target.value),
                  })
                }
              >
                <option value="">انتخاب موقعیت شغلی</option>
                {positions.map((pos) => (
                  <option key={pos.id} value={pos.id}>
                    {pos.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-300">
          <button
            type="submit"
            disabled={loading}
            className={`bg-blue-600 hover:bg-blue-700 text-white px-12 py-3 rounded-lg font-bold text-lg transition-all ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {loading
              ? "در حال ذخیره..."
              : mode === "edit"
              ? "ذخیره تغییرات"
              : "ثبت کارشناس"}
          </button>
        </div>
      </form>
    </div>
  );
}
