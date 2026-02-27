"use client";

import { useState, useEffect } from "react";
import { createTicket, getDepartments, getTicketPriorities } from "../../../../../lib/app";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { useSearchParams } from 'next/navigation'
import RichTextEditor from "/src/app/components/RichTextEditor";
import SearchableSelect from "/src/app/components/SearchableSelect";
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function CreateTicketPage() {
  const router = useRouter();
  
  const [form, setForm] = useState({
    user_id: "",
    title: "",
    priority: "",
    department_id: "",
    description: "",
    start_at: null,
    end_at: null,
    category_id: "",
    attachments: [],
    requester_type: "",
    owner_id: null,
    assignee_id: null,
  });

  const [departments, setDepartments] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const formatDateTime = (dateObj) => {
    if (!dateObj) return null;
    const date = dateObj.toDate ? dateObj.toDate() : new Date(dateObj);
    const offset = date.getTimezoneOffset();
    const adjustedDate = new Date(date.getTime() - (offset * 60 * 1000));
    return adjustedDate.toISOString().slice(0, 19).replace("T", " ");
  };

  const removeFile = (index) => {
    setForm(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.title || form.title.trim().length < 3) newErrors.title = "عنوان حداقل ۳ کاراکتر الزامی است";
    if (!form.priority) newErrors.priority = "اولویت الزامی است";
    if (!form.department_id) newErrors.department_id = "دپارتمان الزامی است";
    if (!form.description || form.description.replace(/<[^>]*>/g, '').length < 10)
      newErrors.description = "توضیحات حداقل ۱۰ کاراکتر الزامی است";
    return newErrors;
  };

  useEffect(() => {
    getDepartments().then(res => setDepartments(res.data.data)).catch(console.error);
    getTicketPriorities().then(res => setPriorities(res.data.data)).catch(console.error);

    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setForm(prev => ({ ...prev, user_id: user.id }));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("لطفاً خطاهای فرم را برطرف کنید");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setLoading(true);
    try {
      const currentUserId = form.user_id || JSON.parse(localStorage.getItem("user"))?.id;
      const formData = new FormData();
      formData.append("user_id", currentUserId);
      formData.append("title", form.title);
      formData.append("priority", form.priority);
      formData.append("department_id", form.department_id);
      formData.append("requester_type", form.requester_type);

      const descriptionToSend = form.description.replace(/<p>&nbsp;<\/p>/g, "").trim();
      formData.append("description", descriptionToSend);
      if (form.owner_id) formData.append("owner_id", form.owner_id);
      if (form.assignee_id) formData.append("assignee_id", form.assignee_id);

      if (form.start_at) formData.append("start_at", formatDateTime(form.start_at));
      if (form.end_at) formData.append("end_at", formatDateTime(form.end_at));
      if (form.attachments.length > 0) {
        form.attachments.forEach((file) => {
          formData.append("attachments[]", file);
        });
      }

      const response = await createTicket(formData);
      if (response.data.success) {
        toast.success(response.data.message || "تیکت با موفقیت ثبت شد");
      }

      setTimeout(() => {
        router.push('/dashboard/requests');
      }, 1500);
      const initialForm = {
        user_id: "",
        title: "",
        priority: "",
        department_id: "",
        description: "",
        start_at: null,
        end_at: null,
        category_id: "",
        attachments: [],
        requester_type: "",
        owner_id: null,
        assignee_id: null,
      };
      setForm({
        ...initialForm,
        user_id: currentUserId
      }

      );
    } catch (err) {
      console.error("❌ Registration error:", err.response?.data);
      const apiResponse = err.response?.data;
      if (apiResponse?.errors) {
        setErrors(apiResponse.errors);
        toast.error("خطا در مقادیر ورودی");
      } else {
        toast.error(apiResponse?.message || "خطایی در هنگام ثبت رخ داد");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-10 shadow-md">
      <h2 className="text-2xl font-bold mb-10 text-gray-900 dark:text-white">ایجاد تیکت جدید</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        {/* RIGHT SIDE */}
        <div className="lg:col-span-3 space-y-8 max-w-xl">
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">عنوان تیکت</label>
            <input
              className="border border-gray-400 dark:border-gray-600 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title}</p>}
          </div>

          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">نوع درخواست‌دهنده</label>
            <select
              className="border border-gray-400 dark:border-gray-600 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
              value={form.requester_type}
              onChange={(e) => setForm({ ...form, requester_type: Number(e.target.value), owner_id: null })}
            >
              <option value="">انتخاب کنید</option>
              <option value={1}>کاربر</option>
              <option value={2}>کارشناس</option>
            </select>
          </div>

          {form.requester_type === 1 && (
            <div className="flex flex-col text-gray-900 dark:text-white">
              <label className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">انتخاب کاربر</label>
              <SearchableSelect
                placeholder="نام کاربر را انتخاب کنید"
                fetchUrl="users/customers"
                searchField="full_name"
                onChange={(selected) => setForm({ ...form, owner_id: selected?.value })}
              />
            </div>
          )}

          <div className="flex flex-col">
            <label className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">توضیحات تیکت</label>
            <div className="relative border border-gray-400 dark:border-gray-600 rounded-lg overflow-hidden text-gray-900 dark:text-white">
              <RichTextEditor
                value={form.description}
                onChange={(html) => setForm({ ...form, description: html })}
              />
            </div>
            {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description}</p>}
          </div>
        </div>

        {/* LEFT SIDE */}
        <div className="lg:col-span-2 space-y-6 bg-gray-50 dark:bg-gray-700 p-8 rounded-xl border border-gray-300 dark:border-gray-600 max-w-md h-fit">
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">اولویت تیکت</label>
            <select
              className="border border-gray-400 dark:border-gray-600 rounded-lg px-4 py-2.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
            >
              <option value="">انتخاب کنید</option>
              {priorities.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            {errors.priority && <p className="text-sm text-red-600 mt-1">{errors.priority}</p>}
          </div>

          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">دپارتمان</label>
            <select
              className="border border-gray-400 dark:border-gray-600 rounded-lg px-4 py-2.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              value={form.department_id}
              onChange={(e) => setForm({ ...form, department_id: e.target.value })}
            >
              <option value="">انتخاب دپارتمان</option>
              {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
            {errors.department_id && <p className="text-sm text-red-600 mt-1">{errors.department_id}</p>}
          </div>

          {/* Assignee */}
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
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
            <label className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">زمان آغاز</label>
            <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg border border-gray-400 dark:border-gray-600 pr-3">
              <DatePicker
                calendar={persian}
                locale={persian_fa}
                value={form.start_at}
                onChange={(date) => setForm({ ...form, start_at: date })}
                inputClass="border-none outline-none py-2.5 w-full text-gray-900 dark:text-white bg-transparent rmdp-input"
                format="YYYY/MM/DD HH:mm"
              />
              {form.start_at && (
                <button type="button" onClick={() => setForm({ ...form, start_at: null })} className="text-red-500 px-3 text-xl">×</button>
              )}
            </div>
          </div>

          {/* End Time */}
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">زمان پایان</label>
            <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg border border-gray-400 dark:border-gray-600 pr-3">
              <DatePicker
                calendar={persian}
                locale={persian_fa}
                value={form.end_at}
                onChange={(date) => setForm({ ...form, end_at: date })}
                inputClass="border-none outline-none py-2.5 w-full text-gray-900 dark:text-white bg-transparent rmdp-input"
                format="YYYY/MM/DD HH:mm"
              />
              {form.end_at && (
                <button type="button" onClick={() => setForm({ ...form, end_at: null })} className="text-red-500 px-3 text-xl">×</button>
              )}
            </div>
          </div>
        </div>

        {/* ATTACHMENTS */}
        <div className="lg:col-span-5 border-t border-gray-300 dark:border-gray-600 pt-8 mt-4">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-gray-900 dark:text-white">ضمائم و فایل‌های پیوست</h3>
              <label className="cursor-pointer bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg border border-gray-400 dark:border-gray-600 hover:text-blue-600 transition-all text-xs font-bold">
                <span>📎 انتخاب فایل</span>
                <input type="file" multiple className="hidden" onChange={(e) => {
                  const newFiles = Array.from(e.target.files);
                  setForm(prev => ({ ...prev, attachments: [...prev.attachments, ...newFiles] }));
                  e.target.value = null;
                }} />
              </label>
            </div>
            <div className="flex flex-wrap gap-3">
              {form.attachments.map((file, index) => (
                <div key={index} className="flex items-center gap-4 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600">
                  <span className="text-sm text-gray-900 dark:text-white truncate max-w-[150px]">{file.name}</span>
                  <button type="button" onClick={() => removeFile(index)} className="text-red-500 text-2xl font-bold">×</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="lg:col-span-5 flex justify-end pt-8 border-t border-gray-300 dark:border-gray-600">
          <button
            type="submit"
            disabled={loading}
            className={`bg-blue-600 hover:bg-blue-700 text-white px-12 py-3 rounded-lg font-bold text-lg transition-all ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {loading ? "در حال ثبت..." : "ثبت تیکت"}
          </button>
        </div>
      </form>
    </div>
  );
}