import axios from 'axios';

const setupAxios = () => {
  axios.defaults.baseURL = 'http://localhost:8000/api/';
  axios.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    config.headers.Authorization = token ? `Bearer ${token}` : '';
    return config;
  }, error => {
    return Promise.reject(error);
  });

  axios.interceptors.response.use(response => response, error => {
    if (error.response && error.response.status === 401) {
      if (error.response.data.detail === "Token expired") {
        localStorage.removeItem('token'); 
        window.location = '/login';
      }
    }
    return Promise.reject(error);
  });
};

export default setupAxios;

