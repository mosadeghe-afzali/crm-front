"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function UsersListPage() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // داده‌های نمونه
  const sampleUsers = [
    {
      id: 1,
      first_name: "علی",
      last_name: "محمدی",
      mobile: "09121234567",
      email: "ali.mohammadi@example.com",
      customer_type: "1",
      company_name: "",
      national_code: "0012345678",
      gender: "1",
      status: "active",
      registration_date: "2024-01-15",
      addresses: [{ city_id: 1, address: "تهران، میدان انقلاب" }],
      is_expert: false
    },
    {
      id: 2,
      first_name: "شرکت",
      last_name: "نوآوران",
      mobile: "09129876543",
      email: "info@novin-co.com",
      customer_type: "2",
      company_name: "شرکت نوآوران فناوری",
      national_id: "10123456789",
      national_code: "",
      gender: "",
      status: "active",
      registration_date: "2023-11-20",
      addresses: [{ city_id: 2, address: "مشهد، بلوار وکیل‌آباد" }],
      is_expert: false
    },
    {
      id: 3,
      first_name: "سمیرا",
      last_name: "کریمی",
      mobile: "09131234567",
      email: "samira.karimi@example.com",
      customer_type: "1",
      company_name: "",
      national_code: "0023456789",
      gender: "2",
      status: "inactive",
      registration_date: "2024-02-10",
      addresses: [{ city_id: 3, address: "اصفهان، خیابان چهارباغ" }],
      is_expert: true,
      position_id: 2,
      department_id: 3,
      internal_code: "EXP-001"
    },
    {
      id: 4,
      first_name: "رضا",
      last_name: "احمدی",
      mobile: "09351234567",
      email: "reza.ahmadi@example.com",
      customer_type: "1",
      company_name: "",
      national_code: "0034567890",
      gender: "1",
      status: "pending",
      registration_date: "2024-03-05",
      addresses: [{ city_id: 1, address: "تهران، پاسداران" }],
      is_expert: false
    },
    {
      id: 5,
      first_name: "شرکت",
      last_name: "توسعه",
      mobile: "09107654321",
      email: "sales@tose-co.com",
      customer_type: "2",
      company_name: "شرکت توسعه ارتباطات",
      national_id: "10234567890",
      national_code: "",
      gender: "",
      status: "active",
      registration_date: "2023-09-12",
      addresses: [{ city_id: 4, address: "شیراز، بلوار زند" }],
      is_expert: false
    },
    {
      id: 6,
      first_name: "مریم",
      last_name: "حسینی",
      mobile: "09181234567",
      email: "maryam.hosseini@example.com",
      customer_type: "1",
      company_name: "",
      national_code: "0045678901",
      gender: "2",
      status: "active",
      registration_date: "2024-01-28",
      addresses: [{ city_id: 2, address: "مشهد، احمدآباد" }],
      is_expert: true,
      position_id: 1,
      department_id: 2,
      internal_code: "EXP-002"
    },
    {
      id: 7,
      first_name: "امیر",
      last_name: "رضایی",
      mobile: "09191234567",
      email: "amir.rezaei@example.com",
      customer_type: "1",
      company_name: "",
      national_code: "0056789012",
      gender: "1",
      status: "suspended",
      registration_date: "2023-12-15",
      addresses: [{ city_id: 5, address: "تبریز، ارک" }],
      is_expert: false
    },
    {
      id: 8,
      first_name: "شرکت",
      last_name: "ایده",
      mobile: "09361234567",
      email: "contact@ideh-co.com",
      customer_type: "2",
      company_name: "شرکت ایده پردازان",
      national_id: "10345678901",
      national_code: "",
      gender: "",
      status: "active",
      registration_date: "2024-02-22",
      addresses: [{ city_id: 3, address: "اصفهان، جی" }],
      is_expert: false
    },
    {
      id: 9,
      first_name: "سارا",
      last_name: "نجفی",
      mobile: "09151234567",
      email: "sara.najafi@example.com",
      customer_type: "1",
      company_name: "",
      national_code: "0067890123",
      gender: "2",
      status: "active",
      registration_date: "2024-03-10",
      addresses: [{ city_id: 6, address: "کرج، مهرشهر" }],
      is_expert: false
    },
    {
      id: 10,
      first_name: "حسین",
      last_name: "مقدم",
      mobile: "09161234567",
      email: "hossein.moghaddam@example.com",
      customer_type: "1",
      company_name: "",
      national_code: "0078901234",
      gender: "1",
      status: "active",
      registration_date: "2024-02-28",
      addresses: [{ city_id: 7, address: "قم، بلوارامین" }],
      is_expert: true,
      position_id: 3,
      department_id: 1,
      internal_code: "EXP-003"
    },
  ];

  useEffect(() => {
    // شبیه‌سازی دریافت داده از API
    setTimeout(() => {
      setUsers(sampleUsers);
      setFilteredUsers(sampleUsers);
      setLoading(false);
    }, 1000);
  }, []);

  // فیلتر و جستجو
  useEffect(() => {
    let result = users;

    // جستجو
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(user =>
        user.first_name.toLowerCase().includes(term) ||
        user.last_name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.mobile.includes(term) ||
        (user.company_name && user.company_name.toLowerCase().includes(term))
      );
    }

    // فیلتر نوع
    if (selectedType !== "all") {
      result = result.filter(user => user.customer_type === selectedType);
    }

    // فیلتر وضعیت
    if (selectedStatus !== "all") {
      result = result.filter(user => user.status === selectedStatus);
    }

    setFilteredUsers(result);
    setCurrentPage(1);
  }, [searchTerm, selectedType, selectedStatus, users]);

  // مرتب‌سازی
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sorted = [...filteredUsers].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredUsers(sorted);
  };

  // حذف کاربر
  const handleDelete = () => {
    if (selectedUser) {
      setUsers(users.filter(user => user.id !== selectedUser.id));
      setShowDeleteModal(false);
      setSelectedUser(null);
    }
  };

  // بازگشت به حالت فعال
  const handleActivate = (userId) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: 'active' } : user
    ));
  };

  // غیرفعال کردن
  const handleDeactivate = (userId) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: 'inactive' } : user
    ));
  };

  // نمایش جزئیات
  const showUserDetails = (user) => {
    setSelectedUser(user);
    setShowDetailsModal(true);
  };

  // صفحه‌بندی
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // آمار
  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    inactive: users.filter(u => u.status === 'inactive').length,
    pending: users.filter(u => u.status === 'pending').length,
    suspended: users.filter(u => u.status === 'suspended').length,
    individual: users.filter(u => u.customer_type === '1').length,
    legal: users.filter(u => u.customer_type === '2').length,
    experts: users.filter(u => u.is_expert).length,
  };

  // ترجمه مقادیر
  const getGenderText = (gender) => {
    return gender === '1' ? 'مرد' : gender === '2' ? 'زن' : '---';
  };

  const getCustomerTypeText = (type) => {
    return type === '1' ? 'حقیقی' : 'حقوقی';
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: { text: 'فعال', class: 'bg-green-100 text-green-800' },
      inactive: { text: 'غیرفعال', class: 'bg-gray-100 text-gray-800' },
      pending: { text: 'در انتظار', class: 'bg-yellow-100 text-yellow-800' },
      suspended: { text: 'مسدود', class: 'bg-red-100 text-red-800' },
    };
    return badges[status] || { text: 'نامشخص', class: 'bg-gray-100 text-gray-800' };
  };

  const getExpertBadge = (isExpert) => {
    return isExpert 
      ? { text: 'کارشناس', class: 'bg-purple-100 text-purple-800' }
      : { text: 'کاربر', class: 'bg-blue-100 text-blue-800' };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-xl font-bold text-gray-900">مدیریت کاربران</h1>
                <p className="text-sm text-gray-600">لیست کامل کاربران سیستم</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Link
                href="/users/create"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
              >
                <i className="fas fa-user-plus"></i>
                کاربر جدید
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-6">
            <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                <p className="text-xs text-gray-500 mt-1">کل کاربران</p>
              </div>
            </div>
            
            <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                <p className="text-xs text-gray-500 mt-1">فعال</p>
              </div>
            </div>
            
            <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-600">{stats.inactive}</p>
                <p className="text-xs text-gray-500 mt-1">غیرفعال</p>
              </div>
            </div>
            
            <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                <p className="text-xs text-gray-500 mt-1">در انتظار</p>
              </div>
            </div>
            
            <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{stats.suspended}</p>
                <p className="text-xs text-gray-500 mt-1">مسدود</p>
              </div>
            </div>
            
            <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{stats.individual}</p>
                <p className="text-xs text-gray-500 mt-1">حقیقی</p>
              </div>
            </div>
            
            <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{stats.legal}</p>
                <p className="text-xs text-gray-500 mt-1">حقوقی</p>
              </div>
            </div>
            
            <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{stats.experts}</p>
                <p className="text-xs text-gray-500 mt-1">کارشناس</p>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="relative">
                  <i className="fas fa-search absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  <input
                    type="text"
                    placeholder="جستجوی کاربر (نام، ایمیل، موبایل، شرکت)..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                >
                  <option value="all">همه انواع</option>
                  <option value="1">حقیقی</option>
                  <option value="2">حقوقی</option>
                </select>
                
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                >
                  <option value="all">همه وضعیت‌ها</option>
                  <option value="active">فعال</option>
                  <option value="inactive">غیرفعال</option>
                  <option value="pending">در انتظار</option>
                  <option value="suspended">مسدود</option>
                </select>
                
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedType("all");
                    setSelectedStatus("all");
                  }}
                  className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm flex items-center gap-2"
                >
                  <i className="fas fa-filter"></i>
                  پاک کردن فیلترها
                </button>
              </div>
            </div>
            
            <div className="mt-4 text-sm text-gray-500">
              <i className="fas fa-info-circle ml-1"></i>
              نمایش {filteredUsers.length} کاربر از {users.length} کاربر
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Table Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
                    <i className="fas fa-users"></i>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">لیست کاربران</h2>
                    <p className="text-sm text-gray-600">مدیریت کامل اطلاعات کاربران</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                    <i className="fas fa-file-export ml-1"></i>
                    خروجی Excel
                  </button>
                </div>
              </div>
            </div>

            {/* Table Content */}
            {loading ? (
              <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                <p className="mt-2 text-gray-500">در حال بارگذاری کاربران...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-8 text-center">
                <i className="fas fa-users-slash text-4xl text-gray-300 mb-3"></i>
                <p className="text-gray-500">کاربری یافت نشد</p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedType("all");
                    setSelectedStatus("all");
                  }}
                  className="mt-3 text-sm text-indigo-600 hover:text-indigo-800"
                >
                  مشاهده همه کاربران
                </button>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th 
                          scope="col" 
                          className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSort('id')}
                        >
                          <div className="flex items-center gap-1">
                            ID
                            {sortConfig.key === 'id' && (
                              <i className={`fas fa-sort-${sortConfig.direction === 'asc' ? 'up' : 'down'}`}></i>
                            )}
                          </div>
                        </th>
                        <th 
                          scope="col" 
                          className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSort('first_name')}
                        >
                          <div className="flex items-center gap-1">
                            نام کاربر
                            {sortConfig.key === 'first_name' && (
                              <i className={`fas fa-sort-${sortConfig.direction === 'asc' ? 'up' : 'down'}`}></i>
                            )}
                          </div>
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          اطلاعات تماس
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          نوع / وضعیت
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          تاریخ ثبت
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          عملیات
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentItems.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">#{user.id}</div>
                            <div className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${
                              getExpertBadge(user.is_expert).class
                            }`}>
                              {getExpertBadge(user.is_expert).text}
                            </div>
                          </td>
                          
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                                  <i className="fas fa-user"></i>
                                </div>
                              </div>
                              <div className="mr-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {user.first_name} {user.last_name}
                                  {user.company_name && (
                                    <div className="text-xs text-gray-500 mt-1">
                                      <i className="fas fa-building ml-1"></i>
                                      {user.company_name}
                                    </div>
                                  )}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  <i className="fas fa-venus-mars ml-1"></i>
                                  {getGenderText(user.gender)}
                                </div>
                              </div>
                            </div>
                          </td>
                          
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              <div className="flex items-center gap-1 mb-1">
                                <i className="fas fa-phone text-gray-400"></i>
                                {user.mobile}
                              </div>
                              <div className="flex items-center gap-1">
                                <i className="fas fa-envelope text-gray-400"></i>
                                <span className="text-xs">{user.email}</span>
                              </div>
                              {user.national_code && (
                                <div className="text-xs text-gray-500 mt-1">
                                  <i className="fas fa-id-card ml-1"></i>
                                  کد ملی: {user.national_code}
                                </div>
                              )}
                            </div>
                          </td>
                          
                          <td className="px-6 py-4">
                            <div className="space-y-2">
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                user.customer_type === '1' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                              }`}>
                                {getCustomerTypeText(user.customer_type)}
                              </span>
                              <div className="mt-1">
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  getStatusBadge(user.status).class
                                }`}>
                                  {getStatusBadge(user.status).text}
                                </span>
                              </div>
                            </div>
                          </td>
                          
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {new Date(user.registration_date).toLocaleDateString('fa-IR')}
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(user.registration_date).toLocaleTimeString('fa-IR')}
                            </div>
                          </td>
                          
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center gap-2">
                              {/* دکمه جزئیات */}
                              <button
                                onClick={() => showUserDetails(user)}
                                className="text-indigo-600 hover:text-indigo-900 p-1"
                                title="مشاهده جزئیات"
                              >
                                <i className="fas fa-eye"></i>
                              </button>
                              
                              {/* دکمه ویرایش */}
                              <Link
                                href={`/users/edit/${user.id}`}
                                className="text-blue-600 hover:text-blue-900 p-1"
                                title="ویرایش کاربر"
                              >
                                <i className="fas fa-edit"></i>
                              </Link>
                              
                              {/* دکمه وضعیت */}
                              {user.status === 'active' ? (
                                <button
                                  onClick={() => handleDeactivate(user.id)}
                                  className="text-yellow-600 hover:text-yellow-900 p-1"
                                  title="غیرفعال کردن"
                                >
                                  <i className="fas fa-ban"></i>
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleActivate(user.id)}
                                  className="text-green-600 hover:text-green-900 p-1"
                                  title="فعال کردن"
                                >
                                  <i className="fas fa-check"></i>
                                </button>
                              )}
                              
                              {/* دکمه حذف */}
                              <button
                                onClick={() => {
                                  setSelectedUser(user);
                                  setShowDeleteModal(true);
                                }}
                                className="text-red-600 hover:text-red-900 p-1"
                                title="حذف کاربر"
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    نمایش {indexOfFirstItem + 1} تا {Math.min(indexOfLastItem, filteredUsers.length)} از {filteredUsers.length} کاربر
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className={`px-3 py-1 rounded-lg ${
                        currentPage === 1 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <i className="fas fa-chevron-right"></i>
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(page => 
                        page === 1 || 
                        page === totalPages || 
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      )
                      .map((page, index, array) => (
                        <div key={page} className="flex items-center">
                          {index > 0 && array[index - 1] !== page - 1 && (
                            <span className="px-2">...</span>
                          )}
                          <button
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-1 rounded-lg ${
                              currentPage === page
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {page}
                          </button>
                        </div>
                      ))}
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-1 rounded-lg ${
                        currentPage === totalPages
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <i className="fas fa-chevron-left"></i>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modal جزئیات کاربر */}
      {showDetailsModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
                    <i className="fas fa-user text-xl"></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      جزئیات کاربر: {selectedUser.first_name} {selectedUser.last_name}
                    </h3>
                    <p className="text-sm text-gray-600">مشاهده کامل اطلاعات کاربر</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* اطلاعات شخصی */}
                <div className="bg-gray-50 rounded-lg p-5">
                  <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <i className="fas fa-id-card text-gray-500"></i>
                    اطلاعات شخصی
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">نام کامل:</span>
                      <span className="font-medium">{selectedUser.first_name} {selectedUser.last_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">جنسیت:</span>
                      <span className="font-medium">{getGenderText(selectedUser.gender)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">کد ملی:</span>
                      <span className="font-medium">{selectedUser.national_code || '---'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">تاریخ تولد:</span>
                      <span className="font-medium">
                        {selectedUser.birth_date ? new Date(selectedUser.birth_date).toLocaleDateString('fa-IR') : '---'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* اطلاعات تماس */}
                <div className="bg-gray-50 rounded-lg p-5">
                  <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <i className="fas fa-phone text-gray-500"></i>
                    اطلاعات تماس
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">موبایل:</span>
                      <span className="font-medium">{selectedUser.mobile}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">ایمیل:</span>
                      <span className="font-medium">{selectedUser.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">نوع مشتری:</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        selectedUser.customer_type === '1' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {getCustomerTypeText(selectedUser.customer_type)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* اطلاعات حقوقی (اگر حقوقی باشد) */}
                {selectedUser.customer_type === '2' && (
                  <div className="bg-blue-50 rounded-lg p-5 md:col-span-2">
                    <h4 className="font-bold text-blue-800 mb-4 flex items-center gap-2">
                      <i className="fas fa-building text-blue-500"></i>
                      اطلاعات حقوقی
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <span className="text-gray-600 block mb-1">نام شرکت:</span>
                        <span className="font-medium">{selectedUser.company_name}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 block mb-1">شناسه ملی:</span>
                        <span className="font-medium">{selectedUser.national_id}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 block mb-1">تاریخ ثبت:</span>
                        <span className="font-medium">
                          {new Date(selectedUser.registration_date).toLocaleDateString('fa-IR')}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* اطلاعات کارشناس (اگر کارشناس باشد) */}
                {selectedUser.is_expert && (
                  <div className="bg-purple-50 rounded-lg p-5 md:col-span-2">
                    <h4 className="font-bold text-purple-800 mb-4 flex items-center gap-2">
                      <i className="fas fa-user-tie text-purple-500"></i>
                      اطلاعات کارشناس
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <span className="text-gray-600 block mb-1">کد داخلی:</span>
                        <span className="font-medium">{selectedUser.internal_code}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 block mb-1">سمت:</span>
                        <span className="font-medium">
                          {positions.find(p => p.id === selectedUser.position_id)?.name || '---'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600 block mb-1">دپارتمان:</span>
                        <span className="font-medium">
                          {departments.find(d => d.id === selectedUser.department_id)?.name || '---'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* آدرس‌ها */}
                <div className="bg-gray-50 rounded-lg p-5 md:col-span-2">
                  <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <i className="fas fa-map-marker-alt text-gray-500"></i>
                    آدرس‌ها
                  </h4>
                  <div className="space-y-4">
                    {selectedUser.addresses.map((address, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium">{address.title || `آدرس ${index + 1}`}</span>
                          <span className="text-sm text-gray-500">
                            شهر: {cities.find(c => c.id === address.city_id)?.name || '---'}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-2">{address.address}</p>
                        {address.postal_code && (
                          <div className="text-sm text-gray-500">
                            کد پستی: {address.postal_code}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end gap-3">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  بستن
                </button>
                <Link
                  href={`/users/edit/${selectedUser.id}`}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                >
                  <i className="fas fa-edit"></i>
                  ویرایش کاربر
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal حذف کاربر */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
            <div className="p-6">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <i className="fas fa-exclamation-triangle text-red-600 text-xl"></i>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">حذف کاربر</h3>
                <p className="text-gray-600 mb-4">
                  آیا از حذف کاربر <span className="font-bold">{selectedUser.first_name} {selectedUser.last_name}</span> اطمینان دارید؟
                </p>
                <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg mb-4">
                  <i className="fas fa-exclamation-circle ml-1"></i>
                  این عمل قابل بازگشت نیست!
                </p>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedUser(null);
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  انصراف
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                >
                  <i className="fas fa-trash"></i>
                  حذف کاربر
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}