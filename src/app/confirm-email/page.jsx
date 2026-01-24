"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";

export default function ConfirmEmailPage() {
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("در حال تأیید ایمیل...");
  const [loading, setLoading] = useState(true);

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const res = await axios.post(
          "https://panjareapp.ir/api/Account/ConfirmEmail",
          { token, email }
        );

        setMessage("✅ ایمیل شما با موفقیت تأیید شد!");
      } catch (err) {
        console.error(err);
        setMessage(
          err.response?.data?.title ||
            "❌ خطا در تأیید ایمیل، ممکن است لینک منقضی شده باشد."
        );
      } finally {
        setLoading(false);
      }
    };

    if (token && email) confirmEmail();
  }, [token, email]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-md p-8 rounded-xl max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">تأیید ایمیل</h1>
        {loading ? (
          <p>در حال بررسی لینک...</p>
        ) : (
          <p className="text-gray-700">{message}</p>
        )}
      </div>
    </div>
  );
}
