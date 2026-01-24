"use client";

import { useState, useEffect } from "react";
import { register, getCountries, getSkills } from "../../../lib/app";
import PasswordInput from "../components/PasswordInput";

export default function RegisterPage() {
  const [form, setForm] = useState({
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
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [countries, setCountries] = useState([]);
  const [skills, setSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!form.Name) newErrors.Name = "نام کامل الزامی است";
    if (!form.UserName) newErrors.UserName = "نام کاربری الزامی است";

    if (!form.Email) {
      newErrors.Email = "ایمیل الزامی است";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.Email)) newErrors.Email = "ایمیل معتبر نیست";
    }

    if (!form.Password) newErrors.Password = "رمز عبور الزامی است";
    if (!form.ConfirmPassword)
      newErrors.ConfirmPassword = "تایید رمز عبور الزامی است";
    if (
      form.Password &&
      form.ConfirmPassword &&
      form.Password !== form.ConfirmPassword
    )
      newErrors.ConfirmPassword = "رمز عبور و تایید آن مطابقت ندارند";

    if (!form.CountryID) newErrors.CountryID = "انتخاب کشور الزامی است";

    return newErrors;
  };

  useEffect(() => {
    getCountries().then((res) => setCountries(res.data.data));
    getSkills()
      .then((res) => setSkills(res.data.data))
      .catch(console.error);
  }, []);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const convertToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
    });

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
      const profileImageBase64 = avatar ? await convertToBase64(avatar) : null;
      const userSkills = selectedSkills.map((s) => ({
        Title: s.skillsTitle,
        Value: Number(s.skillsID),
        IsSelected: true,
      }));

      const payload = {
        ...form,
        CountryID: Number(form.CountryID),
        ProfileImage: profileImageBase64,
        UserSkills: userSkills,
        AvatarSourceName: avatar?.name || "default-avatar",

        // اضافه کردن فیلدهای اجباری API
        LoginId: form.Email,
        StoredSalt: "AAAAGQ==",

        ClientUri: "https://yourdomain.ir/confirm-email",
      };

      await register(payload);

      console.log("📤 Sending to API:", payload);

      const res = await register(payload);

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
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="پروفایل"
                className="w-40 h-40 rounded-full object-cover mb-4"
              />
            ) : (
              <div className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center mb-4 text-gray-500">
                عکس پروفایل
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              id="avatarUpload"
              className="hidden"
            />
            <label
              htmlFor="avatarUpload"
              className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition"
            >
              انتخاب عکس پروفایل
            </label>

            <div className="flex gap-6 mt-4">
              {["User", "Master"].map((role) => (
                <label
                  key={role}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="role"
                    value={role}
                    checked={form.role === role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="w-4 h-4"
                  />
                  <span>{role === "User" ? "کاربر" : "مدیر"}</span>
                </label>
              ))}
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-4 md:w-2/3 md:px-10"
          >
            {errors.apiError && (
              <p className="text-red-500 text-center">{errors.apiError}</p>
            )}

            <input
              type="text"
              placeholder="نام کامل"
              value={form.Name}
              onChange={(e) => setForm({ ...form, Name: e.target.value })}
              className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring focus:ring-[#80bdff]"
            />
            {errors.Name && (
              <p className="text-red-500 text-sm">{errors.Name}</p>
            )}

            <input
              type="text"
              placeholder="نام کاربری"
              value={form.UserName}
              onChange={(e) => setForm({ ...form, UserName: e.target.value })}
              className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring focus:ring-[#80bdff]"
            />
            {errors.UserName && (
              <p className="text-red-500 text-sm">{errors.UserName}</p>
            )}

            <input
              type="email"
              placeholder="ایمیل"
              value={form.Email}
              onChange={(e) => setForm({ ...form, Email: e.target.value })}
              className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring focus:ring-[#80bdff]"
            />
            {errors.Email && (
              <p className="text-red-500 text-sm">{errors.Email}</p>
            )}

            <PasswordInput
              label="رمز عبور"
              value={form.Password}
              onChange={(e) => setForm({ ...form, Password: e.target.value })}
              error={errors.Password}
            />

            <PasswordInput
              label="تایید رمز عبور"
              value={form.ConfirmPassword}
              onChange={(e) =>
                setForm({ ...form, ConfirmPassword: e.target.value })
              }
              error={errors.ConfirmPassword}
            />

            <input
              type="text"
              placeholder="تلفن"
              value={form.Phone}
              onChange={(e) => setForm({ ...form, Phone: e.target.value })}
              className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring focus:ring-[#80bdff]"
            />

            <input
              type="text"
              placeholder="شهر"
              value={form.City}
              onChange={(e) => setForm({ ...form, City: e.target.value })}
              className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring focus:ring-[#80bdff]"
            />

            <select
              value={form.CountryID}
              onChange={(e) => setForm({ ...form, CountryID: e.target.value })}
              className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring focus:ring-[#80bdff]"
            >
              <option value="">لطفاً کشور را انتخاب کنید</option>
              {countries.map((country) => (
                <option key={country.value} value={country.value}>
                  {country.title}
                </option>
              ))}
            </select>
            {errors.CountryID && (
              <p className="text-red-500 text-sm">{errors.CountryID}</p>
            )}

            <select
              onChange={(e) => {
                const skillId = e.target.value;
                const skillTitle = skills.find(
                  (s) => s.skillsID == skillId
                )?.skillsTitle;
                if (
                  skillId &&
                  !selectedSkills.some((s) => s.skillsID == skillId)
                ) {
                  setSelectedSkills([
                    ...selectedSkills,
                    { skillsID: skillId, skillsTitle: skillTitle },
                  ]);
                }
              }}
              className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring focus:ring-[#80bdff]"
            >
              <option value="">انتخاب مهارت</option>
              {skills.map((skill) => (
                <option key={skill.skillsID} value={skill.skillsID}>
                  {skill.skillsTitle}
                </option>
              ))}
            </select>

            <div className="flex flex-wrap gap-2 mt-2">
              {selectedSkills.map((skill) => (
                <div
                  key={skill.skillsID}
                  className="flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                >
                  {skill.skillsTitle}
                  <button
                    type="button"
                    className="mr-2 text-red-500 hover:text-red-700"
                    onClick={() =>
                      setSelectedSkills(
                        selectedSkills.filter(
                          (s) => s.skillsID !== skill.skillsID
                        )
                      )
                    }
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <textarea
              placeholder="درباره من"
              value={form.About}
              onChange={(e) => setForm({ ...form, About: e.target.value })}
              rows={4}
              className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring focus:ring-[#80bdff] resize-none"
            />

            <button
              type="submit"
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "در حال ثبت‌نام..." : "ثبت‌نام"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
