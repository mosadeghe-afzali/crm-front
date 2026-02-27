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
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  useEffect(() => {
    setMounted(true);
    
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
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
      <div className="h-10 w-full bg-gray-100 dark:bg-gray-600 animate-pulse rounded-lg border border-gray-300 dark:border-gray-600" />
    );
  }

  const customStyles = {
    control: (base) => ({
      ...base,
      borderRadius: '0.5rem',
      padding: '2px',
      backgroundColor: isDark ? '#1f2937' : '#ffffff',
      borderColor: isDark ? '#4b5563' : '#9ca3af',
      color: isDark ? '#ffffff' : '#111827',
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: isDark ? '#1f2937' : '#ffffff',
      borderColor: isDark ? '#4b5563' : '#9ca3af',
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected 
        ? (isDark ? '#3b82f6' : '#3b82f6')
        : (isDark ? '#1f2937' : '#ffffff'),
      color: isDark ? '#ffffff' : '#111827',
    }),
    input: (base) => ({
      ...base,
      color: isDark ? '#ffffff' : '#111827',
    }),
    singleValue: (base) => ({
      ...base,
      color: isDark ? '#ffffff' : '#111827',
    }),
    placeholder: (base) => ({
      ...base,
      color: isDark ? '#9ca3af' : '#6b7280',
    }),
  };

  return (
    <SearchableSelect
      instanceId="ajax-select-unique-id"
      cacheOptions
      defaultOptions={false}
      loadOptions={loadOptions}
      onChange={onChange}
      value={value}
      placeholder={placeholder}
      noOptionsMessage={() => "موردی یافت نشد"}
      loadingMessage={() => "در حال جستجو..."}
      isClearable
      styles={customStyles}
    />
  );
}