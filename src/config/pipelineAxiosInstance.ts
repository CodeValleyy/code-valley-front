import axios from 'axios';

const pipelineAxiosInstance = axios.create({
    baseURL: `/pipeline-ms`,
});

export const createAxiosInstance = (contentType: string = 'application/json') => {
    const instance = axios.create({
        baseURL: `/pipeline-ms`,
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
export default pipelineAxiosInstance;
