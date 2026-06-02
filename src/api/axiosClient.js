import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
});

const AUTH_SKIP_REFRESH = ['/auth/login', '/auth/register', '/auth/refresh', '/auth/me', '/auth/logout'];

function shouldSkipRefresh(url = '') {
  return AUTH_SKIP_REFRESH.some((path) => url.includes(path));
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;

    if (status !== 401 || !original || original._retry || shouldSkipRefresh(original.url)) {
      return Promise.reject(error);
    }

    original._retry = true;

    try {
      const { data } = await api.post('/auth/refresh');
      if (data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
      }
      return api(original);
    } catch {
      localStorage.removeItem('accessToken');
      const onAuthPage = ['/login', '/register'].some((p) => window.location.pathname.startsWith(p));
      if (!onAuthPage) {
        window.location.replace('/login');
      }
      return Promise.reject(error);
    }
  }
);

export default api;
