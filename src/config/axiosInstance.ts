import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: `/url`,
});

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const createAxiosInstance = (contentType: string = 'application/json') => {
    const instance = axios.create({
        baseURL: `/url`,
        headers: {
            'Content-Type': contentType
        }
    });

    instance.interceptors.request.use((config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    return instance;
};
export default axiosInstance;
