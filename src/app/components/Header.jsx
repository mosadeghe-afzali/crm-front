"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // در CRM معمولاً کاربر لاگین است
  const [userName, setUserName] = useState("مدیر سیستم");
  const [userAvatar, setUserAvatar] = useState("/images/default-avatar.jpg");
  const [searchQuery, setSearchQuery] = useState("");

 
  const notifications = [
    { id: 1, text: 'مشتری جدید اضافه شد', time: '۵ دقیقه پیش', read: false },
    { id: 2, text: 'فاکتور #۱۲۳۴ پرداخت شد', time: '۱ ساعت پیش', read: false },
    { id: 3, text: 'کار جدید اختصاص داده شد', time: '۲ ساعت پیش', read: true },
    { id: 4, text: 'یادآوری جلسه فردا', time: '۱ روز پیش', read: true },
    { id: 5, text: 'گزارش ماهانه آماده است', time: '۲ روز پیش', read: true },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;


  useEffect(() => {
    const storedUser = localStorage.getItem("crm_user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserName(user.name || "مدیر سیستم");
        setUserAvatar(user.avatar || "/images/default-avatar.jpg");
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    }
  }, []);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileDropdownOpen && !event.target.closest('.profile-dropdown')) {
        setIsProfileDropdownOpen(false);
      }
      if (isNotificationsOpen && !event.target.closest('.notifications-dropdown')) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileDropdownOpen, isNotificationsOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('جستجوی:', searchQuery);
  };

  const handleLogout = () => {
    localStorage.removeItem("crm_token");
    localStorage.removeItem("crm_user");
    setIsLoggedIn(false);
    window.location.href = "/login";
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              className="lg:hidden text-gray-600 hover:text-gray-900 p-2 rounded-md"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <i className={`fas ${isMenuOpen ? "fa-times" : "fa-bars"} text-xl`}></i>
            </button>

            <div className="flex items-center mr-4 lg:mr-8">
              <Link href="/" className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white w-10 h-10 rounded-lg flex items-center justify-center">
                  <i className="fas fa-chart-line text-lg"></i>
                </div>
                <div className="hidden md:block">
                  <div className="text-xl font-bold text-gray-900">داشبورد CRM</div>
                  <div className="text-xs text-gray-500">مدیریت ارتباط با مشتریان</div>
                </div>
              </Link>
            </div>

{/* 
            <div className="hidden lg:block flex-1 max-w-2xl">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="جستجوی مشتری، پروژه، فاکتور..."
                  className="w-full pr-10 pl-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
                  <i className="fas fa-search"></i>
                </button>
              </form>
            </div> */}
          </div>


          <div className="flex items-center gap-3 sm:gap-4">
            <button className="lg:hidden text-gray-600 hover:text-gray-900 p-2">
              <i className="fas fa-search text-lg"></i>
            </button>


            {/* <button className="hidden md:flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg transition-colors">
              <i className="fas fa-plus"></i>
              <span className="text-sm font-medium">ایجاد جدید</span>
            </button> */}

   
            <div className="relative notifications-dropdown">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100"
              >
                <i className="fas fa-bell text-lg"></i>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {isNotificationsOpen && (
                <div className="absolute left-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-gray-800">اعلان‌ها</h3>
                      <button className="text-sm text-indigo-600 hover:text-indigo-800">
                        مشاهده همه
                      </button>
                    </div>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                          !notification.read ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex items-start">
                          <div className={`ml-3 p-2 rounded-full ${
                            !notification.read ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                          }`}>
                            <i className="fas fa-bell text-sm"></i>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-800">{notification.text}</p>
                            <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 text-center border-t border-gray-200">
                    <button className="text-sm text-gray-600 hover:text-gray-800">
                      علامت‌گذاری همه به عنوان خوانده شده
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <button className="text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100">
                <i className="fas fa-envelope text-lg"></i>
              </button>
            </div>

   
            <div className="relative profile-dropdown">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-3 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
              >
          
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                  {userName.charAt(0)}
                </div>
                
        
                <div className="hidden md:block text-right">
                  <div className="text-sm font-medium text-gray-800">{userName}</div>
                  <div className="text-xs text-gray-500">مدیر کل</div>
                </div>
                
                <i className={`fas fa-chevron-down text-xs text-gray-500 transition-transform duration-200 ${
                  isProfileDropdownOpen ? 'rotate-180' : ''
                }`}></i>
              </button>

       
              {isProfileDropdownOpen && (
                <div className="absolute left-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="font-semibold text-gray-800">{userName}</p>
                    <p className="text-sm text-gray-500">admin@crm.com</p>
                  </div>
                  
            
                  <Link
                    href="/profile"
                    className="block px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors font-medium"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    <div className="flex items-center gap-2">
                      <i className="fas fa-user text-sm"></i>
                      <span>پروفایل من</span>
                    </div>
                  </Link>
                  
                  <Link
                    href="/settings"
                    className="block px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors font-medium"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    <div className="flex items-center gap-2">
                      <i className="fas fa-cog text-sm"></i>
                      <span>تنظیمات</span>
                    </div>
                  </Link>
                  
                  <Link
                    href="/help"
                    className="block px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors font-medium"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    <div className="flex items-center gap-2">
                      <i className="fas fa-question-circle text-sm"></i>
                      <span>راهنما و پشتیبانی</span>
                    </div>
                  </Link>
       
                  <div className="border-t border-gray-200 my-2"></div>
       
                  <button
                    onClick={handleLogout}
                    className="w-full text-right px-4 py-3 text-red-600 hover:bg-red-50 transition-colors font-medium"
                  >
                    <div className="flex items-center gap-2">
                      <i className="fas fa-sign-out-alt text-sm"></i>
                      <span>خروج از سیستم</span>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4 bg-white">
            {/* Mobile Search */}
            <div className="px-4 mb-4">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="جستجوی مشتری، پروژه، فاکتور..."
                  className="w-full pr-10 pl-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
                  <i className="fas fa-search"></i>
                </button>
              </form>
            </div>

            {/* Mobile Menu Items */}
            <div className="px-4 space-y-1">
              <button className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors mb-4">
                <i className="fas fa-plus"></i>
                <span>ایجاد جدید</span>
              </button>
              
              <Link
                href="/dashboard"
                className="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center gap-2">
                  <i className="fas fa-tachometer-alt"></i>
                  <span>داشبورد</span>
                </div>
              </Link>
              
              <Link
                href="/customers"
                className="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center gap-2">
                  <i className="fas fa-users"></i>
                  <span>مشتریان</span>
                </div>
              </Link>
              
              <Link
                href="/sales"
                className="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center gap-2">
                  <i className="fas fa-chart-line"></i>
                  <span>فروش‌ها</span>
                </div>
              </Link>
              
              <Link
                href="/tasks"
                className="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center gap-2">
                  <i className="fas fa-tasks"></i>
                  <span>کارها</span>
                </div>
              </Link>
              
              <Link
                href="/reports"
                className="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center gap-2">
                  <i className="fas fa-file-alt"></i>
                  <span>گزارش‌ها</span>
                </div>
              </Link>
              
              {/* Divider */}
              <div className="border-t border-gray-200 pt-4 mt-2">
                <Link
                  href="/profile"
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center gap-2">
                    <i className="fas fa-user"></i>
                    <span>پروفایل من</span>
                  </div>
                </Link>
                
                <Link
                  href="/settings"
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center gap-2">
                    <i className="fas fa-cog"></i>
                    <span>تنظیمات</span>
                  </div>
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="w-full text-right px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg font-medium"
                >
                  <div className="flex items-center gap-2">
                    <i className="fas fa-sign-out-alt"></i>
                    <span>خروج از سیستم</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* تاریخ و وضعیت سیستم */}
        <div className="hidden md:flex items-center justify-between px-6 py-2 bg-gray-50 border-t border-gray-200 text-xs">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <i className="fas fa-calendar-alt text-gray-500"></i>
              <span className="text-gray-700">
                {new Date().toLocaleDateString('fa-IR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <i className="fas fa-clock text-gray-500"></i>
              <span className="text-gray-700">
                {new Date().toLocaleTimeString('fa-IR', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-gray-600">وضعیت سیستم:</span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-green-600 font-medium">آنلاین</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">کاربران آنلاین:</span>
              <span className="font-medium">۱۲ نفر</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}