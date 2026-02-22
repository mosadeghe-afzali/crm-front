import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

const apiFormData = axios.create({
  baseURL: API_BASE_URL,
  headers: {
  },
  timeout: 10000,
});

// ✅ attach کردن توکن به همه‌ی درخواست‌ها
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ handle کردن خطاها
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);



// 🔹 Register
export const register = (typeName, data) =>
  api.post(`/auth/register/${typeName}`, {
    ...data,
  });

// 🔹 Login
export const login = (mobile, password) => {
  return api.post("/auth/login", { mobile, password });
};
export const logout = () => api.post("/auth/logout");

export const getCustomers = () => api.get("/users/customers/1");
export const getEmployees = () => api.get("/users/employees");

export const getCities = (provinceId) =>
  api.get("/cities", {
    params: {
      province_id: provinceId,
    },
  });
export const getProvinces = () => api.get("/provinces");
export const getDepartments = () => api.get("/departments");
export const getPositions = (departmentId) =>
  api.get("/positions", {
    params: {
      department_id: departmentId,
    },
  });
export const getRoles = () => api.get("/roles");
export const getPosissionPermissions = () => api.get(`/users/employees/${position_id}/permissions`);
export const getPermissions = () => api.get("/permissions");
export const createRole = (name) => {
  return api.post("/roles", { name });
};
export const createPermission = (name) => {
  return api.post("/permissions", { name });
};

export const assignPermissionToRole = (roleId, permissionId) => {
  return api.post(`/roles/${roleId}/permissions/${permissionId}`);
};

export const createTicket = (formData) => apiFormData.post(`/tickets`, formData);
export const getTicketPriorities = () => api.get("/tickets/priorities");
export const getTickets = () => api.get("/tickets");
export const showTicket = async (ticket_id) => api.get(`/tickets/${ticket_id}`);
export const updateTicket = async (ticket_id, data) => api.put(`/tickets/${ticket_id}`, data);
export const getTicketStatuses = () => api.get("/tickets/statuses");
export const replyTicket = async (ticket_id, formData) => apiFormData.post(`/tickets/${ticket_id}/reply`, formData);

export const getUserById = async (id) => api.post("/Account/Search", { id });

// 🔹 Update Account
export const updateAccount = async (data) => {
  return api.put("/Account/Update", data);
};

// 🔹 Get Countries & Skills
export const getCountries = () => api.get("/Country/GetAllCountry");
export const getSkills = () => api.get("/Skills/GetAllSkills");

// 🔹 Forgot Password
export const forgotPassword = async (email) => {
  return api.post("/Account/ForgotPassword", { Email: email });
};

// 🔹 Reset Password
export const resetPassword = async ({
  email,
  token,
  password,
  confirmPassword,
}) => {
  return api.post("/Account/SaveResetPassword", {
    email,
    token,
    password,
    confirmPassword,
  });
};

export default api;
