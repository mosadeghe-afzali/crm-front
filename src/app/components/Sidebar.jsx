export default function Sidebar() {
    const menuItems = [
      { icon: "fas fa-tachometer-alt", label: "داشبورد", active: true },
      { icon: "fas fa-users", label: "مشتریان" },
      { icon: "fas fa-chart-line", label: "تحلیل‌ها" },
      { icon: "fas fa-shopping-cart", label: "فروش‌ها" },
      { icon: "fas fa-tasks", label: "کارها" },
      { icon: "fas fa-calendar-alt", label: "تقویم" },
      { icon: "fas fa-file-invoice", label: "صورتحساب‌ها" },
      { icon: "fas fa-cog", label: "تنظیمات" },
    ];
  
    return (
      <div className="h-full py-6 px-4">
        <nav>
          <ul className="space-y-1">
            {menuItems.map((item, index) => (
              <li key={index}>
                <a
                  href="#"
                  className={`flex items-center px-4 py-3 rounded-lg transition ${
                    item.active
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <i className={`${item.icon} ml-3`}></i>
                  <span>{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    );
  }