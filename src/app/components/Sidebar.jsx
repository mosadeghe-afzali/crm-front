'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
  { name: 'کارشناسان', href: '/dashboard/experts', icon: Users },
  { name: 'مشترکین', href: '/dashboard/customers', icon: Users },
  { name: 'شرکت‌ها', href: '/dashboard/companies', icon: Building },
  { name: 'درخواست‌ها', href: '/dashboard/requests', icon: FileText },
  { name: 'تنظیمات', href: '/dashboard/settings', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()

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
              <span className="font-bold">م</span>
            </div>
            <div>
              <p className="font-medium">مدیر سیستم</p>
              <p className="text-gray-400 text-sm">admin@crm.com</p>
            </div>
          </div>
          <button className="p-2 text-gray-400 hover:text-white">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}