'use client'

import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <Header sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}