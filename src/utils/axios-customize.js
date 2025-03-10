import axios from "axios";
import { handleRefreshToken } from "../service/auth-service";
import NProgress from "nprogress";

NProgress.configure({
  showSpinner: false,
  trickleSpeed: 100,
  minimum: 0.3,
  easing: "ease",
  speed: 500,
});

const baseURL = import.meta.env.VITE_BACKEND_URL;
const instance = axios.create({
  baseURL: baseURL,
  // tự động lưu cookie nếu backend có trả về refresh_token
  withCredentials: true,
});

// const handleRefreshToken = async () => {
//   try {
//     const res = await instance.get("/api/v1/auth/refresh");
//     if (res && res.data) {
//       const newToken = res.data.access_token;
//       // Lưu token mới vào localStorage
//       localStorage.setItem("access_token", newToken);
//       return newToken;
//     }
//     return null;
//   } catch (error) {
//     console.error("Refresh token failed:", error);
//     return null;
//   }
// };

// Add a request interceptor
instance.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    NProgress.start();
    // Lấy token từ localStorage
    const accessToken = localStorage.getItem("access_token");

    // Nếu có token, thêm vào headers
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  function (error) {
    // Do something with request error
    NProgress.done();
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    NProgress.done();
    if (response.data && response.data.data) return response.data;
    return response;
  },
  async function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    NProgress.done();

    const originalRequest = error.config;

    // Nếu lỗi là do token hết hạn và chưa từng thử refresh
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry // => false
    ) {
      // Thực hiện gọi refresh token
      const newToken = await handleRefreshToken();

      originalRequest._retry = true; // Đánh dấu là đã thử refresh

      if (newToken) {
        // Cập nhật token mới vào headers
        // instance.defaults.headers.common[
        //   "Authorization"
        // ] = `Bearer ${newToken}`;
        // originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        // Thử gửi lại request ban đầu với token mới
        return instance(originalRequest);
      }
    }

    //nếu refresh token cũng hết hạn, chuyển người dùng đến login
    if (
      error?.config?.url === "/api/v1/auth/refresh" &&
      +error?.response?.status === 400 &&
      window.location.pathname !== "/"
    ) {
      window.location.href = "/login";
    }

    if (error.response && error.response.data) return error.response.data;
    return Promise.reject(error);
  }
);

export default instance;
