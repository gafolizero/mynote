import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use( (config) => {
    const token = localStorage.getItem('token');
    console.log('Interceptor - Token found:', !!token);

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
}, (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const currentPath = window.location.pathname;
            if (currentPath !== '/login' && currentPath !== '/signup') {
                localStorage.removeItem('token');
                localStorage.removeItem('user');

                toast.error('Your session has expired. Please login again.');

                window.dispatchEvent(new CustomEvent('auth:logout', { detail: { reason: 'token_expired' } }));

                setTimeout(() => {
                    window.location.href = '/login';
                }, 500);
            }
        }
        return Promise.reject(error);
    }
);

export default api;

