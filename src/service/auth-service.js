import axios from "../utils/axios-customize";

const registerUser = (fullName, email, password, phone) => {
  const API_URL = "/api/v1/user/register";

  const data = {
    fullName: fullName,
    email: email,
    password: password,
    phone: phone,
  };

  return axios.post(API_URL, data);
};

const loginUser = (username, password) => {
  const API_URL = "/api/v1/auth/login";

  const data = {
    username: username,
    password: password,
  };

  return axios.post(API_URL, data);
};

const fetchAccount = () => {
  const API_URL = "/api/v1/auth/account";
  return axios.get(API_URL);
};
const logoutAccount = () => {
  const API_URL = "/api/v1/auth/logout";
  return axios.post(API_URL);
};

const handleRefreshToken = async () => {
  try {
    const res = await axios.get("/api/v1/auth/refresh");
    if (res && res.data) {
      const newToken = res.data.access_token;

      // Lưu token mới vào localStorage
      localStorage.setItem("access_token", newToken);

      if (newToken) {
        // Cập nhật token mới vào headers
        axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

        // Thử gửi lại request ban đầu với token mới
        // Ở đây bạn có thể thử gửi lại request cần thiết với axios nếu cần
        // ví dụ: return axios.request(originalRequest);
      }

      return newToken;
    }
    return null;
  } catch (error) {
    console.error("Refresh token failed:", error);
    return null;
  }
};

export {
  registerUser,
  loginUser,
  fetchAccount,
  logoutAccount,
  handleRefreshToken,
};
