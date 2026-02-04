import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
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

// 🔹 Login
export const login = async (username, password) => {
  return api.post("/auth/Login", { username, password });
};

// 🔹 Register
export const register = (typeName, data) =>
  api.post(`/auth/register/${typeName}`, {
    ...data,
});
export const getCustomers = () => api.get("/users/customers/1");

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
