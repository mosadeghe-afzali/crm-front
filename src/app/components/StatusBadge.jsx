export default function StatusBadge({ status }) {
    const statusConfig = {
      'فعال': { color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300', dot: 'bg-green-500' },
      'غیرفعال': { color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300', dot: 'bg-red-500' },
      'در حال انجام': { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300', dot: 'bg-blue-500' },
      'جدید': { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300', dot: 'bg-yellow-500' },
      'انجام شده': { color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300', dot: 'bg-green-500' },
      'در انتظار': { color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300', dot: 'bg-gray-500' },
      'مرخصی': { color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300', dot: 'bg-purple-500' },
      'بالا': { color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300', dot: 'bg-red-500' },
      'متوسط': { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300', dot: 'bg-yellow-500' },
      'پایین': { color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300', dot: 'bg-green-500' },
    };
  
    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300', dot: 'bg-gray-500' };
  
    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${config.color}`}>
        <span className={`w-2 h-2 rounded-full ${config.dot}`}></span>
        <span className="text-sm font-medium">{status}</span>
      </div>
    );
  }
