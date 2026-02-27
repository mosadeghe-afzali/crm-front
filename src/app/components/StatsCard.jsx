export default function StatsCard({ title, value, icon, color, change }) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-800 dark:text-white">{value}</p>
            {change && (
              <div className="flex items-center gap-1 mt-2">
                <span className="text-green-600 dark:text-green-400 text-sm font-medium">{change}</span>
                <span className="text-gray-500 dark:text-gray-400 text-sm">نسبت به ماه قبل</span>
              </div>
            )}
          </div>
          <div className={`${color} p-3 rounded-lg`}>
            <div className="text-white">
              {icon}
            </div>
          </div>
        </div>
      </div>
    )
  }
