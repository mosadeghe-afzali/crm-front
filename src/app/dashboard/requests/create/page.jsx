"use client";

import { useState, useEffect } from "react";
import { register, getCities, getProvinces, getDepartments, getPositions } from "../../../../../lib/app";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { useSearchParams } from 'next/navigation'
import RichTextEditor from "/src/app/components/RichTextEditor";
import SearchableSelect from "/src/app/components/SearchableSelect";

export default function createTicket() {
  const [form, setForm] = useState({
    user_id: "",      // بعداً از auth بگیر
    title: "",
    priority: "",
    department_id: "",
    description: "",
    start_at: null,
    end_at: null,
    category_id: "",
    attachments: [],
  });


  const [departments, setDepartments] = useState([]);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const searchParams = useSearchParams();

  const validate = () => {
    const newErrors = {};

    if (!form.title || form.title.length < 3)
      newErrors.title = "عنوان حداقل ۳ کاراکتر الزامی است";

    if (!form.priority)
      newErrors.priority = "اولویت الزامی است";

    if (!form.department_id)
      newErrors.department_id = "دپارتمان الزامی است";

    if (!form.description || form.description.length < 10)
      newErrors.description = "توضیحات حداقل ۱۰ کاراکتر الزامی است";

    return newErrors;
  };




  useEffect(() => {
    getDepartments()
      .then(res => setDepartments(res.data.data))
      .catch(console.error);
  }, []);

  const toDateTime = (date) => {
    if (!date) return null;
    const jsDate = date.toDate();
    return jsDate.toISOString().slice(0, 19).replace("T", " ");
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const formData = new FormData();

    formData.append("user_id", form.user_id);
    formData.append("title", form.title);
    formData.append("priority", form.priority);
    formData.append("department_id", form.department_id);
    formData.append("description", form.description);

    if (form.start_at)
      formData.append("start_at", toDateTime(form.start_at));

    if (form.end_at)
      formData.append("end_at", toDateTime(form.end_at));

    if (form.category_id)
      formData.append("category_id", form.category_id);

    form.attachments.forEach((file, index) => {
      formData.append(`attachments[${index}]`, file);
    });

    await createTicket(formData); // API خودت
  };


return (
  <div className="rounded-2xl border border-gray-200 bg-white p-10 shadow-sm">
    <h2 className="text-2xl font-bold mb-10 text-gray-800">
      ایجاد تیکت جدید
    </h2>

    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 lg:grid-cols-5 gap-12"
    >
      {/* ================= RIGHT SIDE ================= */}
      <div className="lg:col-span-3 space-y-8 max-w-xl">

        {/* Title */}
        <div className="flex flex-col">
          <label className="mb-2 text-sm font-medium text-gray-600">
            عنوان تیکت
          </label>
          <input
            className="border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
            value={form.title}
            onChange={e =>
              setForm({ ...form, title: e.target.value })
            }
          />
        </div>

        {/* Requester Type */}
        <div className="flex flex-col">
          <label className="mb-2 text-sm font-medium text-gray-600">
            نوع درخواست‌دهنده
          </label>
          <select
            className="border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
            value={form.requester_type}
            onChange={e =>
              setForm({
                ...form,
                requester_type: Number(e.target.value),
                owner_id: null,
                owner_name: ""
              })
            }
          >
            <option value="">انتخاب کنید</option>
            <option value={1}>کاربر</option>
            <option value={2}>کارشناس</option>
          </select>
        </div>

        {/* Owner Search - فقط اگر کاربر باشد */}
        {form.requester_type === 1 && (
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-600">
              انتخاب کاربر
            </label>

            <SearchableSelect
              placeholder="نام کاربر را انتخاب کنید"
              fetchUrl="users/customers"
              searchField="full_name"
              value={
                form.owner_id
                  ? { value: form.owner_id, label: form.owner_name }
                  : null
              }
              onChange={(selected) =>
                setForm({
                  ...form,
                  owner_id: selected?.value || null,
                  owner_name: selected?.label || ""
                })
              }
            />
          </div>
        )}

        {/* Description */}
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-600">
              توضیحات
            </label>

            <label className="cursor-pointer text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-md border border-gray-300 transition">
              انتخاب فایل
              <input
                type="file"
                multiple
                className="hidden"
                onChange={(e) =>
                  setForm({
                    ...form,
                    attachments: Array.from(e.target.files),
                  })
                }
              />
            </label>
          </div>

          <RichTextEditor
            value={form.description}
            onChange={(html) =>
              setForm({ ...form, description: html })
            }
          />
        </div>
      </div>

      {/* ================= LEFT SIDE ================= */}
      <div className="lg:col-span-2 space-y-8 bg-gray-50 p-8 rounded-xl border border-gray-200 max-w-md">

        {/* Department */}
        <div className="flex flex-col">
          <label className="mb-2 text-sm font-medium text-gray-600">
            دپارتمان
          </label>
          <select
            className="border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
            value={form.department_id}
            onChange={e =>
              setForm({
                ...form,
                department_id: Number(e.target.value)
              })
            }
          >
            <option value="">انتخاب دپارتمان</option>
            {departments.map(dep => (
              <option key={dep.id} value={dep.id}>
                {dep.name}
              </option>
            ))}
          </select>
        </div>

        {/* Assignee */}
        <div className="flex flex-col">
          <label className="mb-2 text-sm font-medium text-gray-600">
            مسئول تیکت
          </label>

          <SearchableSelect
            placeholder="انتخاب کنید"
            fetchUrl="users/employees"
            searchField="full_name"
            value={
              form.assignee_id
                ? { value: form.assignee_id, label: form.assignee_name }
                : null
            }
            onChange={(selected) =>
              setForm({
                ...form,
                assignee_id: selected?.value || null,
                assignee_name: selected?.label || ""
              })
            }
          />
        </div>

        {/* Start Time */}
        <div className="flex flex-col">
          <label className="mb-2 text-sm font-medium text-gray-600">
            زمان آغاز
          </label>

          <div className="flex gap-2 items-center">
            <DatePicker
              calendar={persian}
              locale={persian_fa}
              value={form.start_at || ""}
              onChange={(date) =>
                setForm({
                  ...form,
                  start_at: date || null
                })
              }
              inputClass="border border-gray-300 rounded-lg px-4 py-2.5 w-full"
              format="YYYY/MM/DD HH:mm:ss"
            />

            {form.start_at && (
              <button
                type="button"
                onClick={() =>
                  setForm({ ...form, start_at: null })
                }
                className="text-red-500 text-xs"
              >
                حذف
              </button>
            )}
          </div>
        </div>

        {/* End Time */}
        <div className="flex flex-col">
          <label className="mb-2 text-sm font-medium text-gray-600">
            زمان پایان
          </label>

          <div className="flex gap-2 items-center">
            <DatePicker
              calendar={persian}
              locale={persian_fa}
              value={form.end_at || ""}
              onChange={(date) =>
                setForm({
                  ...form,
                  end_at: date || null
                })
              }
              inputClass="border border-gray-300 rounded-lg px-4 py-2.5 w-full"
              format="YYYY/MM/DD HH:mm:ss"
            />

            {form.end_at && (
              <button
                type="button"
                onClick={() =>
                  setForm({ ...form, end_at: null })
                }
                className="text-red-500 text-xs"
              >
                حذف
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Submit */}
      <div className="lg:col-span-5 flex justify-end pt-6">
        <button
          type="submit"
          className={`bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-lg transition ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          ثبت تیکت
        </button>
      </div>
    </form>
  </div>
);



}
