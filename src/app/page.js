import Header from "./components/Header";
import Sidebar from "./components/Sidebar";


export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex flex-1">
        {/* سایدبار سمت راست */}
        <div className="w-64 bg-white border-l border-gray-200 shadow-sm">
          <Sidebar />
        </div>

        {/* محتوای اصلی */}
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">داشبورد CRM</h1>
            <p className="text-gray-600 mt-1">مدیریت ارتباط با مشتریان</p>
          </div>

          {/* آمارهای کلی */}
          {/* <DashboardStats /> */}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* نمودار فروش */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">نمودار فروش</h2>
                <select className="border border-gray-300 rounded px-3 py-1 text-sm">
                  <option>ماه جاری</option>
                  <option>سه ماه گذشته</option>
                  <option>سال جاری</option>
                </select>
              </div>
              {/* <SalesChart /> */}
            </div>

            {/* مشتریان برتر */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold text-gray-800 mb-4">مشتریان برتر</h2>
              {/* <TopCustomers /> */}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {/* فعالیت‌های اخیر */}
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold text-gray-800 mb-4">فعالیت‌های اخیر</h2>
              {/* <RecentActivities /> */}
            </div>

            {/* وضعیت فرصت‌های فروش */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold text-gray-800 mb-4">وضعیت فرصت‌های فروش</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">در حال مذاکره</span>
                    <span className="text-sm font-bold">۱۲ مورد</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '40%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">پیشنهاد ارسال شده</span>
                    <span className="text-sm font-bold">۸ مورد</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">بسته شده</span>
                    <span className="text-sm font-bold">۲۰ مورد</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}