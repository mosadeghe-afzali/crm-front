"use client";

import { useState } from "react";
import { login, forgotPassword } from "../../../lib/app";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleForgotPassword = async () => {
    try {
      const res = await forgotPassword(forgotEmail);
      console.log("Forgot password response:", res.data);
      setForgotMessage("✅ لینک بازیابی رمز عبور به ایمیل شما ارسال شد.");
    } catch (err) {
      console.error(err);
      setForgotMessage(
        err.response?.data?.title ||
        "❌ خطایی در ارسال درخواست رخ داد، لطفاً ایمیل را بررسی کنید."
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data } = await login(username, password);
      console.log("Login success:", data);

      // ذخیره token در localStorage
      const token = data?.accessToken || data?.data?.accessToken;
      if (token) {
        localStorage.setItem("token", token);
        document.cookie = `token=${token}; path=/; max-age=86400`;
      }

      // ذخیره اطلاعات کاربر در localStorage
      const userData = {
        name: data?.data.first_name + " " + data?.data.last_name,
        mobile: data?.data?.mobile || mobile,
        id: data?.data?.userId || null,
      };

      localStorage.setItem("user", JSON.stringify(userData));

      // Redirect به صفحه اصلی
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err.response?.data?.message || "خطایی رخ داد");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#f3f3f3] p-4 font-vazir">
      <div className="bg-white w-full max-w-md rounded shadow-lg p-4 md:p-12 py-sm-5 px-sm-5 my-4">
        <h1 className="text-2xl font-bold text-center mb-6">
          ورود به حساب کاربری
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}


          <div className="relative">
            <input
              placeholder="نام کاربری (موبایل)"
              className="w-full border border-gray-300 rounded p-3 pl-10 focus:outline-none focus:ring focus:ring-[#80bdff]"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <span className="absolute left-3 top-4 text-gray-500">
              <i className="fas fa-envelope"></i>
            </span>
          </div>

          <div className="relative">
            <input
              type="password"
              placeholder="رمز عبور"
              className="w-full border border-gray-300 rounded p-3 pl-10 focus:outline-none focus:ring focus:ring-[#80bdff]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span className="absolute left-3 top-4 text-gray-500">
              <i className="fas fa-lock"></i>
            </span>
          </div>

          {/* Remember & Forgot */}
          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span>به خاطر سپردن</span>
            </label>
            <a
              href="#"
              onClick={() => setShowForgotModal(true)}
              className="text-blue-600 hover:underline"
            >
              فراموشی رمز عبور؟
            </a>
          </div>

          {showForgotModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg w-80">
                <h2 className="text-lg font-bold mb-4">فراموشی رمز عبور</h2>
                <input
                  placeholder="ایمیل خود را وارد کنید"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full border rounded p-2 mb-4"
                />
                <button
                  onClick={handleForgotPassword}
                  disabled={forgotLoading}
                  className="w-full bg-blue-600 text-white p-2 rounded mb-2"
                >
                  {forgotLoading ? "در حال ارسال..." : "ارسال لینک"}
                </button>
                {forgotMessage && (
                  <p className="text-sm text-center">{forgotMessage}</p>
                )}
                <button
                  onClick={() => setShowForgotModal(false)}
                  className="w-full mt-2 border rounded p-2"
                >
                  بستن
                </button>
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition cursor-pointer ${
              loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            disabled={loading}
          >
            {loading ? "در حال ورود..." : "ورود"}
          </button>
        </form>

        {/* Social */}
        <div className="mt-8">
          <div className="flex items-center justify-center mb-4">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-2 text-sm text-gray-500">ورود با</span>
            <hr className="flex-grow border-gray-300" />
          </div>
          <div className="flex justify-center gap-4">
            <a
              href="#"
              className="block w-[38px] h-[38px] leading-[38px] text-[18px] text-center bg-[#1874eb] text-white rounded no-underline transition-all duration-200 ease-linear hover:bg-[#155dbd]"
            >
              <i className="fab fa-facebook-f"></i>
            </a>

            <a
              href="#"
              className="block w-[38px] h-[38px] leading-[38px] text-[18px] text-center bg-[#00ACEE] text-white rounded no-underline transition-all duration-200 ease-linear hover:bg-[#0086c1]"
            >
              <i className="fab fa-twitter"></i>
            </a>

            <a
              href="#"
              className="block w-[38px] h-[38px] leading-[38px] text-[18px] text-center bg-[#DB4437] text-white rounded no-underline transition-all duration-200 ease-linear hover:bg-[#b3362c]"
            >
              <i className="fab fa-google"></i>
            </a>

            <a
              href="#"
              className="block w-[38px] h-[38px] leading-[38px] text-[18px] text-center bg-[#0E76A8] text-white rounded no-underline transition-all duration-200 ease-linear hover:bg-[#0c5d89]"
            >
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          حساب ندارید؟{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            ثبت نام
          </a>
        </p>
      </div>
    </div>
  );
}
