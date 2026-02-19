'use client'

import { useState, useEffect } from "react";
import SearchableSelect from "react-select/async";

export default function AjaxSelect({
  placeholder = "انتخاب کنید...",
  fetchUrl,
  searchField = "full_name",
  onChange,
  value,
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const loadOptions = async (inputValue) => {
    if (!inputValue) return [];

    try {
      const res = await fetch(
        `http://localhost:8000/api/v1/${fetchUrl}?${searchField}=${inputValue}`
      );

      const data = await res.json();

      return data?.data?.map((item) => ({
        value: item.user_id,
        label: item.full_name ?? item.name ?? item.title ?? "بدون نام",
      })) || [];
    } catch (err) {
      console.error("Fetch error:", err);
      return [];
    }
  };

  if (!mounted) {
    return (
      <div className="h-10 w-full bg-gray-100 animate-pulse rounded-lg border border-gray-300" />
    );
  }

  return (
    <SearchableSelect
      instanceId="ajax-select-unique-id" // اضافه کردن این فیلد ضروری است
      cacheOptions
      defaultOptions={false}
      loadOptions={loadOptions}
      onChange={onChange}
      value={value}
      placeholder={placeholder}
      noOptionsMessage={() => "موردی یافت نشد"}
      loadingMessage={() => "در حال جستجو..."}
      isClearable
      styles={{
        control: (base) => ({
          ...base,
          borderRadius: '0.5rem',
          padding: '2px'
        })
      }}
    />
  );
}