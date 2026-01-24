"use client";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function PasswordInput({ label, value, onChange, error }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative w-full">
      {/* Input */}
      <input
        type={showPassword ? "text" : "password"}
        placeholder={label}
        value={value}
        onChange={onChange}
        dir="rtl" // placeholder سمت راست
        className="w-full border border-gray-300 rounded p-3 pl-10 pr-3 focus:outline-none focus:ring focus:ring-[#80bdff]"
      />

      {/* Eye Icon */}
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>

      {/* خطای input */}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
