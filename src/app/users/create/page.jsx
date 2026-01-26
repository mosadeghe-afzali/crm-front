"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function UserRegistrationPage() {
  const [formData, setFormData] = useState({
    // اطلاعات پایه
    first_name: "",
    last_name: "",
    mobile: "",
    birth_date: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    national_code: "",
    customer_type: "1", // 1=حقیقی, 2=حقوقی
    national_id: "",
    registration_date: "",
    company_name: "",
    
    // آدرس (آرایه)
    addresses: [{
      title: "آدرس اصلی",
      city_id: "",
      address: "",
      postal_code: ""
    }],
    
    // اطلاعات کارشناس (اگر نیاز باشد)
    position_id: "",
    department_id: "",
    internal_code: "",
    is_expert: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cities, setCities] = useState([]);
  const [positions, setPositions] = useState([]);
  const [departments, setDepartments] = useState([]);

  // بارگذاری داده‌های استاتیک
  useEffect(() => {
    // شبیه‌سازی دریافت شهرها از API
    const mockCities = [
      { id: 1, name: "تهران" },
      { id: 2, name: "مشهد" },
      { id: 3, name: "اصفهان" },
      { id: 4, name: "شیراز" },
      { id: 5, name: "تبریز" },
      { id: 6, name: "کرج" },
      { id: 7, name: "قم" },
      { id: 8, name: "اهواز" },
    ];
    setCities(mockCities);

    // پست‌های سازمانی
    const mockPositions = [
      { id: 1, name: "مدیر فروش" },
      { id: 2, name: "کارشناس فنی" },
      { id: 3, name: "پشتیبان" },
      { id: 4, name: "مدیر پروژه" },
      { id: 5, name: "توسعه دهنده" },
    ];
    setPositions(mockPositions);

    // دپارتمان‌ها
    const mockDepartments = [
      { id: 1, name: "فروش" },
      { id: 2, name: "پشتیبانی" },
      { id: 3, name: "فنی" },
      { id: 4, name: "مالی" },
      { id: 5, name: "بازاریابی" },
    ];
    setDepartments(mockDepartments);
  }, []);

  // اعتبارسنجی فرم
  const validateForm = () => {
    const newErrors = {};
    
    // اعتبارسنجی فیلدهای اجباری
    if (!formData.first_name.trim()) newErrors.first_name = "نام الزامی است";
    if (!formData.last_name.trim()) newErrors.last_name = "نام خانوادگی الزامی است";
    
    if (!formData.mobile.trim()) newErrors.mobile = "شماره موبایل الزامی است";
    else if (!/^09\d{9}$/.test(formData.mobile)) newErrors.mobile = "شماره موبایل معتبر نیست";
    
    if (!formData.email.trim()) newErrors.email = "ایمیل الزامی است";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "ایمیل معتبر نیست";
    
    if (!formData.password) newErrors.password = "رمز عبور الزامی است";
    else if (formData.password.length < 6) newErrors.password = "رمز عبور باید حداقل ۶ کاراکتر باشد";
    
    if (formData.password !== formData.confirmPassword) 
      newErrors.confirmPassword = "رمز عبور و تأیید آن مطابقت ندارند";
    
    if (!formData.gender) newErrors.gender = "جنسیت الزامی است";
    
    if (formData.national_code && !/^\d{10}$/.test(formData.national_code)) 
      newErrors.national_code = "کد ملی باید ۱۰ رقم باشد";
    
    // اعتبارسنجی برای حقوقی
    if (formData.customer_type === "2") {
      if (!formData.national_id) newErrors.national_id = "شناسه ملی الزامی است";
      if (!formData.company_name) newErrors.company_name = "نام شرکت الزامی است";
      if (!formData.registration_date) newErrors.registration_date = "تاریخ ثبت شرکت الزامی است";
    }
    
    // اعتبارسنجی آدرس
    if (formData.addresses.length > 0) {
      const address = formData.addresses[0];
      if (!address.city_id) newErrors["addresses[0].city_id"] = "شهر الزامی است";
      if (!address.address.trim()) newErrors["addresses[0].address"] = "آدرس الزامی است";
      if (address.postal_code && !/^\d{10}$/.test(address.postal_code)) 
        newErrors["addresses[0].postal_code"] = "کد پستی باید ۱۰ رقم باشد";
    }
    
    // اعتبارسنجی برای کارشناس
    if (formData.is_expert) {
      if (!formData.position_id) newErrors.position_id = "سمت الزامی است";
      if (!formData.department_id) newErrors.department_id = "دپارتمان الزامی است";
      if (!formData.internal_code) newErrors.internal_code = "کد داخلی الزامی است";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // مدیریت تغییرات فرم
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith("addresses[")) {
      // تغییر آدرس
      const match = name.match(/addresses\[(\d+)\]\.(\w+)/);
      if (match) {
        const index = parseInt(match[1]);
        const field = match[2];
        setFormData(prev => {
          const newAddresses = [...prev.addresses];
          newAddresses[index] = { ...newAddresses[index], [field]: value };
          return { ...prev, addresses: newAddresses };
        });
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
    
    // پاک کردن خطای فیلد هنگام تایپ
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  // اضافه کردن آدرس جدید
  const addAddress = () => {
    setFormData(prev => ({
      ...prev,
      addresses: [...prev.addresses, { title: "", city_id: "", address: "", postal_code: "" }]
    }));
  };

  // حذف آدرس
  const removeAddress = (index) => {
    if (formData.addresses.length > 1) {
      setFormData(prev => ({
        ...prev,
        addresses: prev.addresses.filter((_, i) => i !== index)
      }));
    }
  };

  // ارسال فرم
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // ساخت داده‌ی نهایی برای ارسال به API
      const submitData = {
        ...formData,
        // تبدیل تاریخ‌ها به فرمت Y-m-d
        birth_date: formData.birth_date,
        registration_date: formData.registration_date,
        // حذف confirmPassword
        confirmPassword: undefined,
      };
      
      console.log("Data to submit:", submitData);
      
      // شبیه‌سازی API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert("کاربر با موفقیت ثبت شد!");
      
      // ریست فرم
      setFormData({
        first_name: "",
        last_name: "",
        mobile: "",
        birth_date: "",
        email: "",
        password: "",
        confirmPassword: "",
        gender: "",
        national_code: "",
        customer_type: "1",
        national_id: "",
        registration_date: "",
        company_name: "",
        addresses: [{
          title: "آدرس اصلی",
          city_id: "",
          address: "",
          postal_code: ""
        }],
        position_id: "",
        department_id: "",
        internal_code: "",
        is_expert: false,
      });
      
    } catch (error) {
      console.error("Error:", error);
      setErrors({ submit: "خطا در ثبت کاربر. لطفاً دوباره تلاش کنید." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ریست فرم
  const handleReset = () => {
    setFormData({
      first_name: "",
      last_name: "",
      mobile: "",
      birth_date: "",
      email: "",
      password: "",
      confirmPassword: "",
      gender: "",
      national_code: "",
      customer_type: "1",
      national_id: "",
      registration_date: "",
      company_name: "",
      addresses: [{
        title: "آدرس اصلی",
        city_id: "",
        address: "",
        postal_code: ""
      }],
      position_id: "",
      department_id: "",
      internal_code: "",
      is_expert: false,
    });
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                <i className="fas fa-arrow-right"></i>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">ثبت نام کاربر جدید</h1>
                <p className="text-sm text-gray-600">افزودن کاربر به سیستم CRM</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Link
                href="/users"
                className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2"
              >
                <i className="fas fa-list"></i>
                لیست کاربران
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">کاربران حقیقی</p>
                  <p className="text-2xl font-bold text-gray-800">۸۹</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-user text-blue-600"></i>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">کاربران حقوقی</p>
                  <p className="text-2xl font-bold text-gray-800">۳۵</p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-building text-green-600"></i>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">کارشناسان</p>
                  <p className="text-2xl font-bold text-gray-800">۲۴</p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-user-tie text-purple-600"></i>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">ثبت امروز</p>
                  <p className="text-2xl font-bold text-gray-800">۵</p>
                </div>
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-chart-line text-yellow-600"></i>
                </div>
              </div>
            </div>
          </div>

          {/* Form Container */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Form Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
                    <i className="fas fa-user-plus"></i>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">فرم ثبت نام کاربر</h2>
                    <p className="text-sm text-gray-600">بر اساس ساختار داده‌های سیستمی</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">جدید</span>
                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">نسخه ۱.۰</span>
                </div>
              </div>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-8">
                {/* بخش ۱: اطلاعات پایه */}
                <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                  <div className="flex items-center gap-2 mb-4">
                    <i className="fas fa-id-card text-gray-500"></i>
                    <h3 className="font-bold text-gray-800">اطلاعات پایه</h3>
                    <span className="text-xs text-red-500">الزامی</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* ردیف اول */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        نام <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                          errors.first_name ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="نام"
                      />
                      {errors.first_name && <p className="mt-1 text-xs text-red-500">{errors.first_name}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        نام خانوادگی <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                          errors.last_name ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="نام خانوادگی"
                      />
                      {errors.last_name && <p className="mt-1 text-xs text-red-500">{errors.last_name}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        شماره موبایل <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                          errors.mobile ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="0912XXXXXXX"
                      />
                      {errors.mobile && <p className="mt-1 text-xs text-red-500">{errors.mobile}</p>}
                    </div>
                    
                    {/* ردیف دوم */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ایمیل <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                          errors.email ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="email@example.com"
                      />
                      {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        رمز عبور <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                          errors.password ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="حداقل ۶ کاراکتر"
                      />
                      {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        تأیید رمز عبور <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                          errors.confirmPassword ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="تکرار رمز عبور"
                      />
                      {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
                    </div>
                    
                    {/* ردیف سوم */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        جنسیت <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                          errors.gender ? "border-red-500" : "border-gray-300"
                        }`}
                      >
                        <option value="">انتخاب کنید</option>
                        <option value="1">مرد</option>
                        <option value="2">زن</option>
                      </select>
                      {errors.gender && <p className="mt-1 text-xs text-red-500">{errors.gender}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        کد ملی
                      </label>
                      <input
                        type="text"
                        name="national_code"
                        value={formData.national_code}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                          errors.national_code ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="۱۰ رقمی"
                        maxLength="10"
                      />
                      {errors.national_code && <p className="mt-1 text-xs text-red-500">{errors.national_code}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        تاریخ تولد
                      </label>
                      <input
                        type="date"
                        name="birth_date"
                        value={formData.birth_date}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                {/* بخش ۲: نوع مشتری */}
                <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                  <div className="flex items-center gap-2 mb-4">
                    <i className="fas fa-user-tag text-gray-500"></i>
                    <h3 className="font-bold text-gray-800">نوع مشتری</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="customer_type"
                          value="1"
                          checked={formData.customer_type === "1"}
                          onChange={handleChange}
                          className="w-4 h-4 text-indigo-600"
                        />
                        <span className="text-gray-700">حقیقی</span>
                      </label>
                      
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="customer_type"
                          value="2"
                          checked={formData.customer_type === "2"}
                          onChange={handleChange}
                          className="w-4 h-4 text-indigo-600"
                        />
                        <span className="text-gray-700">حقوقی</span>
                      </label>
                    </div>
                    
                    {/* اطلاعات حقوقی (فقط اگر نوع مشتری حقوقی باشد) */}
                    {formData.customer_type === "2" && (
                      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 className="font-medium text-blue-800 mb-3">اطلاعات حقوقی</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              شناسه ملی <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="national_id"
                              value={formData.national_id}
                              onChange={handleChange}
                              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                errors.national_id ? "border-red-500" : "border-gray-300"
                              }`}
                              placeholder="شناسه ملی شرکت"
                            />
                            {errors.national_id && <p className="mt-1 text-xs text-red-500">{errors.national_id}</p>}
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              نام شرکت <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="company_name"
                              value={formData.company_name}
                              onChange={handleChange}
                              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                errors.company_name ? "border-red-500" : "border-gray-300"
                              }`}
                              placeholder="نام شرکت"
                            />
                            {errors.company_name && <p className="mt-1 text-xs text-red-500">{errors.company_name}</p>}
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              تاریخ ثبت شرکت <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="date"
                              name="registration_date"
                              value={formData.registration_date}
                              onChange={handleChange}
                              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                errors.registration_date ? "border-red-500" : "border-gray-300"
                              }`}
                            />
                            {errors.registration_date && <p className="mt-1 text-xs text-red-500">{errors.registration_date}</p>}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* بخش ۳: آدرس‌ها */}
                <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <i className="fas fa-map-marker-alt text-gray-500"></i>
                      <h3 className="font-bold text-gray-800">آدرس‌ها</h3>
                    </div>
                    <button
                      type="button"
                      onClick={addAddress}
                      className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                    >
                      <i className="fas fa-plus"></i>
                      افزودن آدرس جدید
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {formData.addresses.map((address, index) => (
                      <div key={index} className="p-4 border border-gray-200 rounded-lg bg-white">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-gray-700">
                            آدرس {index + 1}
                          </h4>
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => removeAddress(index)}
                              className="text-red-500 hover:text-red-700 text-sm"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              عنوان آدرس
                            </label>
                            <input
                              type="text"
                              name={`addresses[${index}].title`}
                              value={address.title}
                              onChange={handleChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              placeholder="مثال: آدرس منزل"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              شهر <span className="text-red-500">*</span>
                            </label>
                            <select
                              name={`addresses[${index}].city_id`}
                              value={address.city_id}
                              onChange={handleChange}
                              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                errors[`addresses[${index}].city_id`] ? "border-red-500" : "border-gray-300"
                              }`}
                            >
                              <option value="">انتخاب شهر</option>
                              {cities.map(city => (
                                <option key={city.id} value={city.id}>
                                  {city.name}
                                </option>
                              ))}
                            </select>
                            {errors[`addresses[${index}].city_id`] && (
                              <p className="mt-1 text-xs text-red-500">{errors[`addresses[${index}].city_id`]}</p>
                            )}
                          </div>
                          
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              آدرس <span className="text-red-500">*</span>
                            </label>
                            <textarea
                              name={`addresses[${index}].address`}
                              value={address.address}
                              onChange={handleChange}
                              rows="2"
                              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                errors[`addresses[${index}].address`] ? "border-red-500" : "border-gray-300"
                              }`}
                              placeholder="آدرس کامل"
                            />
                            {errors[`addresses[${index}].address`] && (
                              <p className="mt-1 text-xs text-red-500">{errors[`addresses[${index}].address`]}</p>
                            )}
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              کد پستی
                            </label>
                            <input
                              type="text"
                              name={`addresses[${index}].postal_code`}
                              value={address.postal_code}
                              onChange={handleChange}
                              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                errors[`addresses[${index}].postal_code`] ? "border-red-500" : "border-gray-300"
                              }`}
                              placeholder="۱۰ رقمی"
                              maxLength="10"
                            />
                            {errors[`addresses[${index}].postal_code`] && (
                              <p className="mt-1 text-xs text-red-500">{errors[`addresses[${index}].postal_code`]}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* بخش ۴: اطلاعات کارشناس (اختیاری) */}
                <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <i className="fas fa-user-tie text-gray-500"></i>
                      <h3 className="font-bold text-gray-800">اطلاعات کارشناس (اختیاری)</h3>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="is_expert"
                        checked={formData.is_expert}
                        onChange={handleChange}
                        className="w-4 h-4 text-indigo-600 rounded"
                      />
                      <span className="text-sm text-gray-700">این کاربر کارشناس است</span>
                    </label>
                  </div>
                  
                  {formData.is_expert && (
                    <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                      <h4 className="font-medium text-purple-800 mb-3">اطلاعات کارشناس</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            سمت <span className="text-red-500">*</span>
                          </label>
                          <select
                            name="position_id"
                            value={formData.position_id}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                              errors.position_id ? "border-red-500" : "border-gray-300"
                            }`}
                          >
                            <option value="">انتخاب سمت</option>
                            {positions.map(position => (
                              <option key={position.id} value={position.id}>
                                {position.name}
                              </option>
                            ))}
                          </select>
                          {errors.position_id && <p className="mt-1 text-xs text-red-500">{errors.position_id}</p>}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            دپارتمان <span className="text-red-500">*</span>
                          </label>
                          <select
                            name="department_id"
                            value={formData.department_id}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                              errors.department_id ? "border-red-500" : "border-gray-300"
                            }`}
                          >
                            <option value="">انتخاب دپارتمان</option>
                            {departments.map(dept => (
                              <option key={dept.id} value={dept.id}>
                                {dept.name}
                              </option>
                            ))}
                          </select>
                          {errors.department_id && <p className="mt-1 text-xs text-red-500">{errors.department_id}</p>}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            کد داخلی <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="internal_code"
                            value={formData.internal_code}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                              errors.internal_code ? "border-red-500" : "border-gray-300"
                            }`}
                            placeholder="مثال: EXP-001"
                          />
                          {errors.internal_code && <p className="mt-1 text-xs text-red-500">{errors.internal_code}</p>}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* خطای کلی */}
                {errors.submit && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <i className="fas fa-exclamation-circle text-red-500"></i>
                      <p className="text-red-700">{errors.submit}</p>
                    </div>
                  </div>
                )}

                {/* دکمه‌های اقدام */}
                <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-gray-500">
                    <i className="fas fa-shield-alt ml-1"></i>
                    اطلاعات شما مطابق قوانین حریم خصوصی محافظت می‌شود
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center gap-2"
                    >
                      <i className="fas fa-redo"></i>
                      پاک کردن فرم
                    </button>
                    
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`px-6 py-2.5 rounded-lg flex items-center gap-2 ${
                        isSubmitting
                          ? "bg-indigo-400 cursor-not-allowed"
                          : "bg-indigo-600 hover:bg-indigo-700"
                      } text-white transition`}
                    >
                      {isSubmitting ? (
                        <>
                          <i className="fas fa-spinner fa-spin"></i>
                          در حال ثبت...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-user-plus"></i>
                          ثبت کاربر جدید
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* راهنما */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                  <i className="fas fa-info-circle"></i>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">مشتری حقیقی</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    برای ثبت افراد حقیقی، فقط اطلاعات پایه و آدرس کافی است
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                  <i className="fas fa-building"></i>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">مشتری حقوقی</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    برای شرکت‌ها، اطلاعات حقوقی نیز باید تکمیل شود
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}