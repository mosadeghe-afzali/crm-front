"use client";

import { useState, useEffect } from "react";
import {
  getUserById,
  updateAccount,
  getCountries,
  getSkills,
} from "../../../lib/app";

export default function EditAccountPage() {
  const [form, setForm] = useState({
    Name: "",
    UserName: "",
    Email: "",
    Phone: "",
    About: "",
    City: "",
    CountryID: "",
    role: "User",
  });

  const [countries, setCountries] = useState([]);
  const [skills, setSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const userId = "1991a212-0645-4003-9c36-fe9f382acdcc"; // موقت برای تست

  useEffect(() => {
    async function loadData() {
      try {
        const [countriesRes, skillsRes, userRes] = await Promise.all([
          getCountries(),
          getSkills(),
          getUserById(userId),
        ]);

        setCountries(countriesRes.data.data);
        setSkills(skillsRes.data.data);

        const user = userRes.data.data;

        setForm({
          Name: user.name || "",
          UserName: user.userName || "",
          Email: user.email || "",
          Phone: user.phone || "",
          About: user.about || "",
          City: user.city || "",
          CountryID: user.countryId || "",
          role: user.role || "User",
        });

        if (user.profileImageUrl) setAvatarPreview(user.profileImageUrl);

        if (user.userSkills)
          setSelectedSkills(
            user.userSkills.map((s) => ({
              skillsID: s.value,
              skillsTitle: s.title,
            }))
          );
      } catch (err) {
        console.error("Error loading user data:", err);
        setError("خطا در دریافت اطلاعات کاربر");
      }
    }

    loadData();
  }, [userId]);

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
      reader.onerror = (error) => reject(error);
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let profileImageBase64 = avatar ? await convertToBase64(avatar) : null;

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
      };

      console.log("📤 Updating account:", payload);

      await updateAccount(payload);

      alert("✅ اطلاعات شما با موفقیت به‌روزرسانی شد!");
    } catch (err) {
      console.error("❌ Update error:", err);
      setError(err.response?.data?.title || "خطا در ذخیره تغییرات");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#f3f3f3] p-4 font-vazir">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-lg p-8 md:p-12">
        <h1 className="text-3xl font-bold text-center mb-10">
          ویرایش حساب کاربری
        </h1>

        <div className="flex flex-col md:flex-row gap-10">
          {/* تصویر پروفایل */}
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

            {/* نقش */}
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

          {/* فرم */}
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-4 md:w-2/3 md:px-10"
          >
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <input
              type="text"
              placeholder="نام کامل"
              value={form.Name || ""}
              onChange={(e) => setForm({ ...form, Name: e.target.value })}
              className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring focus:ring-[#80bdff]"
              required
            />

            <input
              type="text"
              placeholder="نام کاربری"
              value={form.UserName || ""}
              onChange={(e) => setForm({ ...form, UserName: e.target.value })}
              className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring focus:ring-[#80bdff]"
              required
            />

            <input
              type="email"
              placeholder="ایمیل"
              value={form.Email || ""}
              onChange={(e) => setForm({ ...form, Email: e.target.value })}
              className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring focus:ring-[#80bdff]"
              required
            />

            <input
              type="text"
              placeholder="تلفن"
              value={form.Phone || ""}
              onChange={(e) => setForm({ ...form, Phone: e.target.value })}
              className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring focus:ring-[#80bdff]"
            />

            <input
              type="text"
              placeholder="شهر"
              value={form.City || ""}
              onChange={(e) => setForm({ ...form, City: e.target.value })}
              className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring focus:ring-[#80bdff]"
            />

            <select
              value={form.CountryID}
              onChange={(e) => setForm({ ...form, CountryID: e.target.value })}
              className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring focus:ring-[#80bdff]"
              required
            >
              <option value="">لطفاً کشور را انتخاب کنید</option>
              {countries.map((country) => (
                <option key={country.value} value={country.value}>
                  {country.title}
                </option>
              ))}
            </select>

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
              rows={4}
              value={form.About}
              onChange={(e) => setForm({ ...form, About: e.target.value })}
              className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring focus:ring-[#80bdff] resize-none"
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition cursor-pointer ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "در حال ذخیره..." : "ذخیره تغییرات"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
