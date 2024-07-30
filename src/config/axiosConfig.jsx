import axios from 'axios';
import { refreshAuthToken } from './auth';

const setupAxios = () => {
  axios.defaults.baseURL = 'http://localhost:8000/api/';

  axios.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    config.headers.Authorization = token ? `Bearer ${token}` : '';
    return config;
  }, error => {
    return Promise.reject(error);
  });

  axios.interceptors.response.use(response => response, async error => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      if (error.response.data.detail === "Token expired") {
        originalRequest._retry = true;
        const newAccessToken = await refreshAuthToken();
        if (newAccessToken) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axios(originalRequest);
        } else {
          window.location = '/login';
        }
      }
    }
    return Promise.reject(error);
  });
};

export default setupAxios;
