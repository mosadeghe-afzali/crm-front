'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logout } from "../../../lib/app";
import { Menu, X, Home, Users, Building, FileText, Settings, LogOut } from 'lucide-react'

const menuItems = [
  { name: 'داشبورد', href: '/dashboard', icon: Home },
  { name: 'کارشناسان', href: '/dashboard/employees', icon: Users },
  { name: 'مشترکین', href: '/dashboard/customers', icon: Users },
  { name: 'مدیریت دسترسی ها', href: '/dashboard/permissions', icon: Users },
  { name: 'شرکت‌ها', href: '/dashboard/companies', icon: Building },
  { name: 'درخواست‌ها', href: '/dashboard/requests', icon: FileText },
  { name: 'تنظیمات', href: '/dashboard/settings', icon: Settings },
]

export default function Sidebar({ isOpen = true, toggleSidebar }) {
  const pathname = usePathname()
  
  const [user, setUser] = useState(null)

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Error parsing user from localStorage", error);
      }
    }
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("user");
      localStorage.removeItem("token");

      document.cookie = "token=; Max-Age=0; path=/";
      window.location.href = "/login";
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Mobile drawer */}
      <div className={`
        fixed lg:static z-50 top-0 right-0 h-full w-64 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out
        lg:hidden
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="flex flex-col h-full p-4">
          {/* Logo */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-bold">CRM System</h1>
              <p className="text-gray-400 text-sm">پنل مدیریت</p>
            </div>
            <button onClick={toggleSidebar} className="p-2">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Menu */}
          <nav className="flex-1">
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={toggleSidebar}
                      className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all ${isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                        }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* User Profile */}
          <div className="pt-4 border-t border-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="font-bold">
                    {user?.name ? user.name.charAt(0) : "U"}
                  </span>
                </div>
                <div>
                  <p className="font-medium">{user?.name || "کاربر"}</p>
                  <p className="text-gray-400 text-sm">{user?.mobile || "---"}</p>
                </div>
              </div>
              <button
                className="p-2 text-gray-400 hover:text-white"
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop horizontal nav */}
      <div className="hidden lg:block bg-gray-900 text-white">
        <div className="flex items-center justify-between px-6">
          {/* Logo */}
          <div className="py-4 border-b border-gray-800">
            <h1 className="text-xl font-bold">CRM System</h1>
            <p className="text-gray-400 text-sm">پنل مدیریت</p>
          </div>

          {/* Menu */}
          <nav className="flex-1 px-6">
            <ul className="flex items-center gap-2">
              {menuItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all ${isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                        }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* User Profile */}
          <div className="flex items-center gap-3 py-2 border-t border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="font-bold">
                  {user?.name ? user.name.charAt(0) : "U"}
                </span>
              </div>
              <div>
                <p className="font-medium">{user?.name || "کاربر"}</p>
                <p className="text-gray-400 text-sm">{user?.mobile || "---"}</p>
              </div>
            </div>
            <button
              className="p-2 text-gray-400 hover:text-white"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
