export const expertsData = [
    {
      id: 1,
      name: "علی محمدی",
      email: "ali@example.com",
      phone: "09123456789",
      specialty: "فروش",
      status: "فعال",
      joinDate: "1402/01/15",
      completedProjects: 24,
      rating: 4.8
    },
    {
      id: 2,
      name: "سارا احمدی",
      email: "sara@example.com",
      phone: "09129876543",
      specialty: "پشتیبانی",
      status: "فعال",
      joinDate: "1402/03/22",
      completedProjects: 18,
      rating: 4.6
    },
    {
      id: 3,
      name: "رضا کریمی",
      email: "reza@example.com",
      phone: "09131234567",
      specialty: "مدیریت",
      status: "غیرفعال",
      joinDate: "1401/11/05",
      completedProjects: 32,
      rating: 4.9
    },
    {
      id: 4,
      name: "فاطمه نوری",
      email: "fatemeh@example.com",
      phone: "09145678901",
      specialty: "فروش",
      status: "فعال",
      joinDate: "1402/05/18",
      completedProjects: 12,
      rating: 4.4
    },
    {
      id: 5,
      name: "محمد صالحی",
      email: "mohammad@example.com",
      phone: "09156789012",
      specialty: "فنی",
      status: "مرخصی",
      joinDate: "1401/09/30",
      completedProjects: 28,
      rating: 4.7
    }
  ];
  
  export const companiesData = [
    {
      id: 1,
      name: "شرکت فن‌آوران نوین",
      industry: "فناوری اطلاعات",
      contactPerson: "محمد رضایی",
      email: "info@techco.com",
      phone: "021-12345678",
      status: "فعال",
      joinDate: "1401/05/12",
      totalDeals: 15,
      totalValue: "2,500,000,000 تومان"
    },
    {
      id: 2,
      name: "صنایع سبک البرز",
      industry: "تولیدی",
      contactPerson: "سعید کریمی",
      email: "contact@alborz.com",
      phone: "026-87654321",
      status: "فعال",
      joinDate: "1402/02/28",
      totalDeals: 8,
      totalValue: "1,200,000,000 تومان"
    },
    {
      id: 3,
      name: "خدمات مالی سپهر",
      industry: "مالی",
      contactPerson: "مریم موسوی",
      email: "support@sepehr.com",
      phone: "031-11223344",
      status: "در انتظار",
      joinDate: "1402/07/15",
      totalDeals: 3,
      totalValue: "450,000,000 تومان"
    },
    {
      id: 4,
      name: "تجارت الکترونیک آرمان",
      industry: "تجارت الکترونیک",
      contactPerson: "احمد حسینی",
      email: "sales@armane.com",
      phone: "044-55667788",
      status: "غیرفعال",
      joinDate: "1401/12/03",
      totalDeals: 22,
      totalValue: "3,800,000,000 تومان"
    },
    {
      id: 5,
      name: "پیمانکاری سازه گستر",
      industry: "ساختمان",
      contactPerson: "رضا محمدی",
      email: "admin@sazehgostar.com",
      phone: "021-99887766",
      status: "فعال",
      joinDate: "1402/04/19",
      totalDeals: 11,
      totalValue: "1,750,000,000 تومان"
    }
  ];
  
  export const requestsData = [
    {
      id: 1,
      title: "درخواست پشتیبانی نرم‌افزار",
      company: "شرکت فن‌آوران نوین",
      expert: "علی محمدی",
      category: "پشتیبانی",
      priority: "بالا",
      status: "در حال انجام",
      createdDate: "1402/10/05",
      dueDate: "1402/10/12",
      description: "رفع مشکل در ماژول گزارش‌گیری"
    },
    {
      id: 2,
      title: "نصب و راه‌اندازی سیستم",
      company: "صنایع سبک البرز",
      expert: "سارا احمدی",
      category: "نصب",
      priority: "متوسط",
      status: "جدید",
      createdDate: "1402/10/06",
      dueDate: "1402/10/20",
      description: "راه‌اندازی سیستم CRM جدید"
    },
    {
      id: 3,
      title: "مشاوره فروش",
      company: "خدمات مالی سپهر",
      expert: "رضا کریمی",
      category: "مشاوره",
      priority: "پایین",
      status: "انجام شده",
      createdDate: "1402/10/01",
      dueDate: "1402/10/08",
      description: "بررسی استراتژی‌های فروش"
    },
    {
      id: 4,
      title: "آموزش کاربران",
      company: "تجارت الکترونیک آرمان",
      expert: "فاطمه نوری",
      category: "آموزش",
      priority: "بالا",
      status: "در انتظار",
      createdDate: "1402/10/07",
      dueDate: "1402/10/15",
      description: "آموزش کار با پنل مدیریت"
    },
    {
      id: 5,
      title: "بررسی فنی سرور",
      company: "پیمانکاری سازه گستر",
      expert: "محمد صالحی",
      category: "فنی",
      priority: "متوسط",
      status: "در حال انجام",
      createdDate: "1402/10/04",
      dueDate: "1402/10/11",
      description: "بررسی عملکرد و امنیت سرور"
    }
  ];
  
  export const dashboardStats = {
    totalExperts: 24,
    totalCompanies: 156,
    activeRequests: 42,
    completedRequests: 189,
    monthlyGrowth: 12.5
  };