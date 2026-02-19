'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logout } from "../../../lib/app";

import {
  Home,
  Users,
  Building,
  FileText,
  Settings,
  LogOut
} from 'lucide-react'

const menuItems = [
  { name: 'داشبورد', href: '/dashboard', icon: Home },
  { name: 'کارشناسان', href: '/dashboard/employees', icon: Users },
  { name: 'مشترکین', href: '/dashboard/customers', icon: Users },
  { name: 'مدیریت دسترسی ها', href: '/dashboard/permissions', icon: Users },
  { name: 'شرکت‌ها', href: '/dashboard/companies', icon: Building },
  { name: 'درخواست‌ها', href: '/dashboard/requests', icon: FileText },
  { name: 'تنظیمات', href: '/dashboard/settings', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()
  const user = JSON.parse(localStorage.getItem("user"));

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
    <div className="w-64 bg-gray-900 text-white h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-xl font-bold">CRM System</h1>
        <p className="text-gray-400 text-sm">پنل مدیریت</p>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
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
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="font-bold">
                {user?.name?.charAt(0) || ""}
              </span>
            </div>
            <div>
              <p className="font-medium">{user?.name}</p>
              <p className="text-gray-400 text-sm">{user?.mobile}</p>
            </div>
          </div>
          <button
            className="p-2 text-gray-400 hover:text-white cursor-pointer"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}