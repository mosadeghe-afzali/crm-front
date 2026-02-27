'use client'

import { Search, Bell, Menu, Sun, Moon } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Header({ sidebarOpen, toggleSidebar, darkMode, toggleDarkMode }) {
  const [searchQuery, setSearchQuery] = useState('')
  
  const [user, setUser] = useState(null)

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 md:px-6 md:py-4 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Right Side (بخش راست - دکمه منو و جستجو) */}
        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg lg:hidden"
          >
            <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          
          <div className="hidden md:block relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="جستجو در سیستم..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 lg:w-96 pr-10 pl-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        {/* Left Side (بخش چپ - پروفایل و نوتیفیکیشن) */}
        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={toggleDarkMode}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            {darkMode ? <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" /> : <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />}
          </button>
          
          <button className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <div className="flex items-center gap-2 md:gap-3 border-r pr-3 md:pr-4 mr-1 md:mr-2 border-gray-300 dark:border-gray-600">
            <div className="text-right hidden sm:block">
              <p className="font-medium text-sm text-gray-800 dark:text-gray-200">
                {user?.name || "در حال بارگذاری..."}
              </p>
              <p className="text-gray-500 text-xs hidden lg:block dark:text-gray-400">سطح دسترسی: مدیر کل</p>
            </div>
            <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center border border-blue-200 dark:border-blue-700">
              <span className="text-blue-600 dark:text-blue-300 font-bold text-sm md:text-base">
                {user?.name?.charAt(0) || "?"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}