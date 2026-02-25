"use client";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function PasswordInput({ label, value, onChange, error }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col">
      <label className="mb-2 text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        {/* Input */}
        <input
          type={showPassword ? "text" : "password"}
          placeholder={label}
          value={value}
          onChange={onChange}
          autoComplete="new-password"
          dir="rtl"
          className="w-full border border-gray-400 rounded-lg px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
        />

        {/* Eye Icon */}
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      {/* Error */}
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
}
