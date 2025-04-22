import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true
});



// Add a request interceptor
instance.interceptors.request.use(function (config) {
  // Do something before request is sent
  const token = localStorage.getItem('access_token');
    const auth = token ? `Bearer ${token}` : '';
    config.headers['Authorization'] = auth;
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

// Add a response interceptor
instance.interceptors.response.use(
  (response) => {
    if (response && response.data) return response.data;
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi 401 và chưa retry → gọi refresh
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/users/refresh/`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = res.data.access_token;
        localStorage.setItem("access_token", newAccessToken);

        // Gắn token mới vào headers
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Gửi lại request
        return instance(originalRequest);
      } catch (refreshErr) {
        console.error("❌ Refresh token failed, logging out...");
        localStorage.removeItem("access_token"); // ✅ Xoá token lỗi
        window.location.href = "/login"; // ✅ Chuyển về login
        return Promise.reject(refreshErr); // ❌ Không gọi lại nữa
      }
    }

    // Nếu đã retry hoặc lỗi khác → trả lỗi
    return Promise.reject(error);
  }
);

export default instance