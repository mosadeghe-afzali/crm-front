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
    <div className="bg-white w-full rounded-2xl shadow-lg p-8">
      <h1 className="text-3xl font-bold text-center mb-10">
        {form.id ? "ویرایش کارشناس" : "ثبت کارشناس"}
      </h1>

      <form
        onSubmit={onSubmit}
        className="grid grid-cols-1 gap-4 w-full mx-auto px-4 md:px-6 lg:px-8"
      >
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
          <h4 className="mb-4 text-lg font-semibold text-gray-700">
            اطلاعات پایه
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <input
              className="border rounded p-3"
              placeholder="نام"
              value={form.first_name}
              onChange={(e) =>
                setForm({ ...form, first_name: e.target.value })
              }
            />

            <input
              className="border rounded p-3"
              placeholder="نام خانوادگی"
              value={form.last_name}
              onChange={(e) =>
                setForm({ ...form, last_name: e.target.value })
              }
            />

            <DatePicker
              calendar={persian}
              locale={persian_fa}
              value={form.birth_date}
              onChange={(date) =>
                setForm({ ...form, birth_date: date })
              }
              inputClass="border rounded p-3 w-full"
              placeholder="تاریخ تولد"
            />

            <select
              className="border rounded p-3"
              value={form.gender || ""}
              onChange={(e) =>
                setForm({ ...form, gender: Number(e.target.value) })
              }
            >
              <option value="">انتخاب جنسیت</option>
              <option value={1}>مرد</option>
              <option value={2}>زن</option>
            </select>

            <input
              className="border rounded p-3"
              placeholder="کد ملی"
              value={form.national_code}
              onChange={(e) =>
                setForm({ ...form, national_code: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
            <input
              className="border rounded p-3"
              placeholder="موبایل"
              value={form.mobile}
              onChange={(e) =>
                setForm({ ...form, mobile: e.target.value })
              }
            />

            <input
              className="border rounded p-3"
              placeholder="ایمیل"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />

{mode === "create" && (
  <PasswordInput
    label="رمز عبور"
    value={form.password}
    onChange={(e) => setForm({ ...form, password: e.target.value })}
    error={errors.password}
  />
)}

            <input
              className="border rounded p-3"
              placeholder="شماره داخلی"
              value={form.internal_code}
              onChange={(e) =>
                setForm({ ...form, internal_code: e.target.value })
              }
            />
          </div>
        </div>

        {/* Address Section */}
<div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-6">
  <h4 className="mb-4 text-lg font-semibold text-gray-700">
    آدرس
  </h4>

  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">

    {/* Title */}
    <div className="flex flex-col">
      <input
        type="text"
        className="w-full border border-gray-300 rounded p-3"
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
        <p className="text-sm text-red-500 mt-1">
          {errors["address.title"]}
        </p>
      )}
    </div>

    {/* Province */}
    <div className="flex flex-col">
      <select
        className="w-full border border-gray-300 rounded p-3"
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
      <select
        className="w-full border border-gray-300 rounded p-3"
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
      <input
        type="text"
        className="w-full border border-gray-300 rounded p-3"
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
  <div className="mt-3">
    <textarea
      rows={2}
      className="w-full border border-gray-300 rounded p-3"
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
        <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-6">
          <h4 className="mb-4 text-lg font-semibold text-gray-700">
            اطلاعات شغلی
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <select
  className="border rounded p-3"
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

            <select
              className="border rounded p-3"
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

        

<div className="flex justify-end mt-6">
  <button
    type="submit"
    disabled={loading}
    className={`bg-blue-600 text-white p-3 rounded-lg ${
      loading ? "opacity-70 cursor-not-allowed" : ""
    }`}
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