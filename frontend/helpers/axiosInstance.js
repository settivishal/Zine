import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '${API_BASE_URL}', // Replace with your API's base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include tokens (if needed)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); // Retrieve token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
