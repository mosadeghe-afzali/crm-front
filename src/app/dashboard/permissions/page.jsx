'use client'

import { useState, useEffect } from "react";
import DataTable from '../../components/DataTable'
import { getCustomers, createRole, createPermission, getRoles, getPermissions, assignPermissionToRole } from "../../../../lib/app";
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast';

export default function CustomerPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [showRoleModal, setShowRoleModal] = useState(false);
  const [roleName, setRoleName] = useState('');
  const [roleLoading, setRoleLoading] = useState(false);

  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [permissionName, setPermissionName] = useState('');
  const [permissionLoading, setPermissionLoading] = useState(false);

  const [showAssignModal, setShowAssignModal] = useState(false);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedPermission, setSelectedPermission] = useState('');
  const [assignLoading, setAssignLoading] = useState(false);


  const handleCreateRole = async () => {
    if (!roleName.trim()) return;

    try {
      setRoleLoading(true);
      const res = await createRole(roleName);

      console.log(res)
      if (res.data.success) {
        toast.success(res.data.message);
        setShowRoleModal(false);
        setRoleName('');
      } else {
        toast.error(res.data.message || 'خطا در ثبت نقش');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRoleLoading(false);
    }
  };


  const handleCreatePermission = async () => {
    if (!permissionName.trim()) return;

    try {
      setPermissionLoading(true);
      const res = await createPermission(permissionName);

      console.log(res)
      if (res.data.success) {
        toast.success(res.data.message);
        setShowPermissionModal(false);
        setPermissionName('');
      } else {
        toast.error(res.data.message || 'خطا در ثبت نقش');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPermissionLoading(false);
    }
  };

  const openAssignModal = async () => {
    try {
      const [rolesRes, permissionsRes] = await Promise.all([
        getRoles(),
        getPermissions(),
      ]);

      setRoles(rolesRes.data.data || []);
      setPermissions(permissionsRes.data.data || []);
      setShowAssignModal(true);

    } catch (err) {
      toast.error('خطا در دریافت اطلاعات');
    }
  };

  const handleAssignPermission = async () => {
    if (!selectedRole || !selectedPermission) {
      toast.error('نقش و دسترسی را انتخاب کنید');
      return;
    }

    const loadingToast = toast.loading('در حال ثبت...');

    try {
      const res = await assignPermissionToRole(
        selectedRole,
        selectedPermission,
      );

      if (res.data.success) {
        toast.success(res.data.message, { id: loadingToast });
        setShowAssignModal(false);
        setSelectedRole('');
        setSelectedPermission('');
      } else {
        toast.error(res.data.message, { id: loadingToast });
      }

    } catch (err) {
      toast.error('خطای سرور', { id: loadingToast });
    } finally {
      setAssignLoading(false);
    }
  };



  useEffect(() => {
    async function fetchCustomers() {
      try {
        const res = await getCustomers();
        console.log(res, 'resssssss')
        setCustomers(res.data.data || []); // همیشه آرایه بده
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchCustomers();
  }, []);

  const columns = [
    { key: 'id', label: '#' },
    { key: 'permission', label: 'نام دسترسی' },
    { key: 'role', label: 'نقش' },
    { key: 'has_permission', label: 'وضعیت' },

  ];

  if (loading) return <p>در حال بارگذاری...</p>;

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">مدیریت دسترس ها</h1>
        <div className="flex flex-row gap-2" >
          <button
            className="mt-3 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
            onClick={() => setShowRoleModal(true)}
          >
            ایجاد نقش
          </button>

          <button
            className="mt-3 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
            onClick={() => setShowPermissionModal(true)}
          >
            ایجاد دسترسی
          </button>

          <button
            className="mt-3 md:mt-0 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
            onClick={openAssignModal}
          >
            تخصیص دسترسی
          </button>

        </div>
      </div>

      <DataTable
        columns={columns}
        data={[]}
        title="مدیریت دسترسی ها "
      />

      {showRoleModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-lg">

            <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">ایجاد نقش جدید</h2>

            <input
              type="text"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              placeholder="نام نقش"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />

            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-900 dark:text-white"
                onClick={() => setShowRoleModal(false)}
                disabled={roleLoading}
              >
                انصراف
              </button>

              <button
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                onClick={handleCreateRole}
                disabled={roleLoading}
              >
                {roleLoading ? 'در حال ثبت...' : 'ثبت'}
              </button>
            </div>

          </div>
        </div>
      )}


      {showPermissionModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-lg">

            <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">ایجاد دسترسی جدید</h2>

            <input
              type="text"
              value={permissionName}
              onChange={(e) => setPermissionName(e.target.value)}
              placeholder="نام دسترسی"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />

            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-900 dark:text-white"
                onClick={() => setShowPermissionModal(false)}
                disabled={permissionLoading}
              >
                انصراف
              </button>

              <button
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                onClick={handleCreatePermission}
                disabled={permissionLoading}
              >
                {permissionLoading ? 'در حال ثبت...' : 'ثبت'}
              </button>
            </div>

          </div>
        </div>
      )}


      {showAssignModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-lg">

            <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">تخصیص دسترسی به نقش</h2>

            {/* انتخاب نقش */}
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 mb-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">انتخاب نقش</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>

            {/* انتخاب دسترسی */}
            <select
              value={selectedPermission}
              onChange={(e) => setSelectedPermission(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 mb-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">انتخاب دسترسی</option>
              {permissions.map((permission) => (
                <option key={permission.id} value={permission.id}>
                  {permission.name}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-900 dark:text-white"
                onClick={() => setShowAssignModal(false)}
              >
                انصراف
              </button>

              <button
                className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
                onClick={handleAssignPermission}
              >
                ثبت
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
