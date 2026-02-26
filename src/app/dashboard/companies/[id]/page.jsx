'use client'

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getCustomerById, updateCustomer, getProvinces, getCities } from "../../../../../lib/app";
import { ArrowRight, MapPin, Phone, Mail, User, Calendar, Building, Edit, Save, X } from "lucide-react";
import toast from "react-hot-toast";

const formatToShamsi = (dateString) => {
  if (!dateString) return "---";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2digit",
  }).format(date);
};

export default function CompanyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    mobile: "",
    email: "",
    gender: "",
    national_code: "",
    birth_date: null,
    type: 2,
    user_id: null,
    national_id: "",
    registeration_date: "",
    company_name: "",
    address: {
      address_id: null,
      title: "",
      address: "",
      postal_code: "",
      city_id: "",
      province_id: "",
    },
  });

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

  useEffect(() => {
    async function fetchCustomer() {
      if (!params.id) return;
      
      try {
        const res = await getCustomerById(params.id);
        const customerData = res.data.data;
        setCustomer(customerData);
        
        const initialForm = {
          first_name: customerData.first_name || "",
          last_name: customerData.last_name || "",
          mobile: customerData.mobile || "",
          email: customerData.email || "",
          gender: customerData.gender?.id || "",
          national_code: customerData.national_code || "",
          birth_date: customerData.birth_date || null,
          type: customerData.type?.id || 2,
          user_id: customerData.user_id || null,
          national_id: customerData.compnay?.national_id || "",
          registeration_date: customerData.compnay?.registeration_date || "",
          company_name: customerData.compnay?.company_name || "",
          address: {
            address_id: customerData.addresses?.[0]?.id || null,
            title: customerData.addresses?.[0]?.address_title || "",
            address: customerData.addresses?.[0]?.address || "",
            postal_code: customerData.addresses?.[0]?.postal_code || "",
            city_id: customerData.addresses?.[0]?.city?.id || "",
            province_id: customerData.addresses?.[0]?.city?.province_id || "",
          },
        };
        setForm(initialForm);

        if (customerData.addresses?.[0]?.city?.province_id) {
          try {
            const cityRes = await getCities(customerData.addresses[0].city.province_id);
            setCities(cityRes.data.data);
          } catch (err) {
            console.error(err);
          }
        }
      } catch (err) {
        console.error(err);
        setError("خطا در دریافت اطلاعات شرکت");
      } finally {
        setLoading(false);
      }
    }

    fetchCustomer();
  }, [params.id]);

  const handleProvinceChange = async (provinceId) => {
    setForm({
      ...form,
      address: {
        ...form.address,
        province_id: provinceId,
        city_id: "",
      },
    });
    setCities([]);
    
    if (provinceId) {
      try {
        const res = await getCities(provinceId);
        setCities(res.data.data);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      let payload = {
        first_name: form.first_name,
        last_name: form.last_name,
        mobile: form.mobile,
        email: form.email,
        gender: form.gender,
        national_code: form.national_code,
        birth_date: form.birth_date,
        type: form.type,
        user_id: form.user_id,
        national_id: form.national_id,
        registeration_date: form.registeration_date,
        company_name: form.company_name,
      };

      const hasAddress = form.address.title || form.address.address || form.address.postal_code || form.address.city_id || form.address.province_id;
      if (hasAddress) {
        payload.address = {
          address_id: form.address.address_id,
          title: form.address.title,
          address: form.address.address,
          postal_code: form.address.postal_code,
          city_id: form.address.city_id,
          province_id: form.address.province_id,
        };
      }

      const res = await updateCustomer(params.id, payload);
      
      if (res.data.success) {
        toast.success(res.data.message || "اطلاعات با موفقیت بروزرسانی شد");
        setIsEditing(false);
        const updatedRes = await getCustomerById(params.id);
        setCustomer(updatedRes.data.data);
      }
    } catch (err) {
      console.error(err);
      const response = err.response?.data;
      if (response?.data?.errors) {
        const apiErrors = response.data.errors;
        const formattedErrors = {};
        Object.keys(apiErrors).forEach((field) => {
          formattedErrors[field] = apiErrors[field].join("، ");
        });
        toast.error(Object.values(formattedErrors)[0] || "خطا در بروزرسانی");
      } else {
        toast.error("خطا در بروزرسانی اطلاعات");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">در حال بارگذاری...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow p-6">
        <div className="text-red-500 text-center">{error}</div>
        <button
          onClick={() => router.back()}
          className="mt-4 flex items-center gap-2 text-blue-600 mx-auto"
        >
          <ArrowRight className="w-4 h-4" />
          بازگشت
        </button>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => setIsEditing(false)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowRight className="w-5 h-5" />
          بازگشت
        </button>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">ویرایش اطلاعات شرکت</h1>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                <X className="w-4 h-4" />
                لغو
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? "در حال ذخیره..." : "ذخیره"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">نام</label>
              <input
                type="text"
                value={form.first_name}
                onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                className="border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">نام خانوادگی</label>
              <input
                type="text"
                value={form.last_name}
                onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                className="border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">موبایل</label>
              <input
                type="text"
                value={form.mobile}
                onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                className="border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">ایمیل</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">جنسیت</label>
              <select
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: Number(e.target.value) })}
                className="border border-gray-300 rounded-lg px-4 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="">انتخاب جنسیت</option>
                <option value={1}>مرد</option>
                <option value={2}>زن</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">کد ملی</label>
              <input
                type="text"
                value={form.national_code}
                onChange={(e) => setForm({ ...form, national_code: e.target.value })}
                className="border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4">اطلاعات شرکت</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">نام شرکت</label>
                <input
                  type="text"
                  value={form.company_name}
                  onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                  className="border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">شناسه ملی</label>
                <input
                  type="text"
                  value={form.national_id}
                  onChange={(e) => setForm({ ...form, national_id: e.target.value })}
                  className="border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">تاریخ ثبت</label>
                <input
                  type="text"
                  value={form.registeration_date}
                  onChange={(e) => setForm({ ...form, registeration_date: e.target.value })}
                  className="border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="1402-01-01"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4">آدرس</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">نام آدرس</label>
                <input
                  type="text"
                  value={form.address.title}
                  onChange={(e) => setForm({ ...form, address: { ...form.address, title: e.target.value } })}
                  className="border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">استان</label>
                <select
                  value={form.address.province_id}
                  onChange={(e) => handleProvinceChange(Number(e.target.value))}
                  className="border border-gray-300 rounded-lg px-4 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="">انتخاب استان</option>
                  {provinces.map((province) => (
                    <option key={province.id} value={province.id}>
                      {province.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">شهر</label>
                <select
                  value={form.address.city_id}
                  onChange={(e) => setForm({ ...form, address: { ...form.address, city_id: Number(e.target.value) } })}
                  className="border border-gray-300 rounded-lg px-4 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100"
                  disabled={!form.address.province_id}
                >
                  <option value="">انتخاب شهر</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">کد پستی</label>
                <input
                  type="text"
                  value={form.address.postal_code}
                  onChange={(e) => setForm({ ...form, address: { ...form.address, postal_code: e.target.value } })}
                  className="border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div className="flex flex-col md:col-span-2">
                <label className="text-sm font-medium text-gray-700 mb-1">آدرس کامل</label>
                <textarea
                  value={form.address.address}
                  onChange={(e) => setForm({ ...form, address: { ...form.address, address: e.target.value } })}
                  className="border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  rows={2}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowRight className="w-5 h-5" />
          بازگشت به لیست
        </button>
        <button
          onClick={() => setIsEditing(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Edit className="w-4 h-4" />
          ویرایش
        </button>
      </div>

      {/* Main Info Card */}
      <div className="bg-white rounded-xl shadow p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          اطلاعات شرکت
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">نام کامل</p>
              <p className="font-semibold text-gray-900">
                {customer.first_name} {customer.last_name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Phone className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">موبایل</p>
              <p className="font-semibold text-gray-900">{customer.mobile}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Mail className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">ایمیل</p>
              <p className="font-semibold text-gray-900">{customer.email || "---"}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-pink-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">جنسیت</p>
              <p className="font-semibold text-gray-900">{customer.gender?.name || "---"}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">کد ملی</p>
              <p className="font-semibold text-gray-900">{customer.national_code || "---"}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">آخرین ورود</p>
              <p className="font-semibold text-gray-900">{formatToShamsi(customer.last_login)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Company Info Card */}
      {customer.compnay && (
        <div className="bg-white rounded-xl shadow p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Building className="w-5 h-5" />
            اطلاعات شرکت
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                <Building className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">نام شرکت</p>
                <p className="font-semibold text-gray-900">{customer.compnay.company_name}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">شناسه ملی</p>
                <p className="font-semibold text-gray-900">{customer.compnay.national_id}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">تاریخ ثبت</p>
                <p className="font-semibold text-gray-900">{customer.compnay.registeration_date || "---"}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Addresses Card */}
      {customer.addresses && customer.addresses.length > 0 && (
        <div className="bg-white rounded-xl shadow p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            آدرس‌ها
          </h2>

          <div className="space-y-4">
            {customer.addresses.map((address) => (
              <div
                key={address.id}
                className="p-6 border border-gray-200 rounded-lg hover:border-blue-300 transition"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {address.address_title || "آدرس"}
                    </h3>
                    {address.city && (
                      <p className="text-gray-600">شهر: {address.city.name}</p>
                    )}
                    <p className="text-gray-600">{address.address || "---"}</p>
                    {address.postal_code && (
                      <p className="text-gray-500 text-sm mt-1">کد پستی: {address.postal_code}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {(!customer.addresses || customer.addresses.length === 0) && (
        <div className="bg-white rounded-xl shadow p-8">
          <div className="text-gray-500 text-center">آدرسی ثبت نشده است</div>
        </div>
      )}
    </div>
  );
}
