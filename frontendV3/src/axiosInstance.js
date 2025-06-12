import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // ← هنا A كبيرة ✅
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
