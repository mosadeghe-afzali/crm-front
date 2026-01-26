import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          سیستم CRM با Next.js
        </h1>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          مدیریت کارشناسان، شرکت‌ها و درخواست‌ها
        </p>
        <Link
          href="/dashboard"
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          ورود به پنل مدیریت
        </Link>
      </div>
    </div>
  )
}