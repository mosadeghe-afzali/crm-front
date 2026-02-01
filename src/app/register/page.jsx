"use client";

import { useState, useEffect } from "react";
import { register } from "../../../lib/app";
import PasswordInput from "../components/PasswordInput";

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
  });
  // const [avatar, setAvatar] = useState(null);
  // const [avatarPreview, setAvatarPreview] = useState(null);
  // const [countries, setCountries] = useState([]);
  // const [skills, setSkills] = useState([]);
  // const [selectedSkills, setSelectedSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!form.first_name) newErrors.Name = "نام الزامی است";
    if (!form.last_name) newErrors.UserName = "نام خانوادگی الزامی است";

    // if (!form.email) {
    //   newErrors.email = "ایمیل الزامی است";
    // } else {
    //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //   if (!emailRegex.test(form.Email)) newErrors.email = "ایمیل معتبر نیست";
    // }

    if (!form.password) newErrors.password = "رمز عبور الزامی است";
    // if (!form.ConfirmPassword)
    //   newErrors.ConfirmPassword = "تایید رمز عبور الزامی است";
    // if (
    //   form.Password &&
    //   form.ConfirmPassword &&
    //   form.Password !== form.ConfirmPassword
    // )
    //   newErrors.ConfirmPassword = "رمز عبور و تایید آن مطابقت ندارند";

    // if (!form.CountryID) newErrors.CountryID = "انتخاب کشور الزامی است";

    return newErrors;
  };

  // useEffect(() => {
  //   getCountries().then((res) => setCountries(res.data.data));
  //   getSkills()
  //     .then((res) => setSkills(res.data.data))
  //     .catch(console.error);
  // }, []);

  // const handleAvatarChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     setAvatar(file);
  //     setAvatarPreview(URL.createObjectURL(file));
  //   }
  // };

  // const convertToBase64 = (file) =>
  //   new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onload = () => resolve(reader.result);
  //     reader.onerror = (err) => reject(err);
  //   });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1️⃣ بررسی خطاهای client-side
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      // const profileImageBase64 = avatar ? await convertToBase64(avatar) : null;
      // const userSkills = selectedSkills.map((s) => ({
      //   Title: s.skillsTitle,
      //   Value: Number(s.skillsID),
      //   IsSelected: true,
      // }));

      const payload = {
        ...form,
      };

      // await register(payload);

      console.log("📤 Sending to API:", payload);

const res = await register("employee", payload);

      console.log("✅ Registration successful:", res.data);
      alert(
        "ثبت‌نام با موفقیت انجام شد! لطفاً ایمیل خود را برای تأیید باز کنید."
      );
      // Reset form
      setForm({
        Name: "",
        UserName: "",
        Email: "",
        Password: "",
        ConfirmPassword: "",
        Phone: "",
        About: "",
        City: "",
        CountryID: "",
        role: "User",
      });
      setAvatar(null);
      setAvatarPreview(null);
      setSelectedSkills([]);
    } catch (err) {
      console.error("❌ Registration error:", err.response?.data);

      // 2️⃣ دریافت خطاهای validation API
      const apiErrors = err.response?.data?.errors || {};
      const formattedErrors = {};

      // تبدیل structure API به فرم { fieldName: "error message" }
      Object.keys(apiErrors).forEach((key) => {
        formattedErrors[key] = apiErrors[key].join(", ");
      });

      setErrors(formattedErrors);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#f3f3f3] p-4 font-vazir">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-lg p-8 md:p-12">
        <h1 className="text-3xl font-bold text-center mb-10">ثبت‌نام</h1>
        <div className="flex flex-col md:flex-row gap-10">
          <div className="flex flex-col items-center md:w-1/3">
          </div>
          <form
            onSubmit={handleSubmit}

            className="grid grid-cols-1 gap-4 md:w-2/3 md:px-10"
          >

            <input
              className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring focus:ring-[#80bdff]"
              placeholder="نام"
              onChange={e => setForm({ ...form, first_name: e.target.value })}
            />
            {errors.first_name && (
              <p className="text-red-500 text-sm">{errors.Name}</p>
            )}
            <input
              className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring focus:ring-[#80bdff]"
              placeholder="نام خانوادگی"
              onChange={e => setForm({ ...form, last_name: e.target.value })} />
            <input
              className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring focus:ring-[#80bdff]"
              placeholder="موبایل" onChange={e => setForm({ ...form, mobile: e.target.value })}
            />
            <PasswordInput
              label="رمز عبور"
              onChange={e => setForm({ ...form, password: e.target.value })}
            />

            <select
              className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring focus:ring-[#80bdff]"
              value={form.customer_type}
              onChange={e => setForm({ ...form, customer_type: Number(e.target.value) })}
            >
              <option value={1}>حقیقی</option>
              <option value={2}>حقوقی</option>
            </select>

            {form.customer_type === 2 && (
              <>
                <input className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring focus:ring-[#80bdff]" placeholder="شناسه ملی" onChange={e => setForm({ ...form, national_id: e.target.value })} />
                <input className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring focus:ring-[#80bdff]" placeholder="نام شرکت" onChange={e => setForm({ ...form, company_name: e.target.value })} />
                <input className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring focus:ring-[#80bdff]" type="date" onChange={e => setForm({ ...form, registeration_date: e.target.value })} />
              </>
            )}

            <button
              type="submit"
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition ${loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              disabled={loading}
            >ثبت‌نام
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
