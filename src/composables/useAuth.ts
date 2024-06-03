import { ref } from 'vue';
import axiosInstance from '@/config/axiosInstance';

const token = ref(localStorage.getItem('token') ?? '');

const setToken = (newToken: string) => {
    token.value = newToken;
    localStorage.setItem('token', newToken);
};

const resetToken = () => {
    token.value = '';
    localStorage.removeItem('token');
}

const getToken = () => token.value;

const fetchMe = async () => {
    try {
        const response = await axiosInstance.get('/auth/me');
        return response.data;
    } catch (error) {
        console.error('Error fetching profile:', error);
        throw error;
    }
};

const fetchProfile = async (userId: number) => {
    try {
        const response = await axiosInstance.get(`/auth/profile/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching profile:', error);
        throw error;
    }
}

const logout = async () => {
    try {
        await axiosInstance.post('/auth/logout');
    } catch (error) {
        console.error('Error logging out:', error);
        throw error;
    } finally {
        resetToken();
    }
}

const getGoogleAuthUrl = async () => {
    try {
        const response = await axiosInstance.get('/auth/google');
        return response.data;
    } catch (error) {
        console.error('Error fetching Google Auth URL:', error);
        throw error;
    }
}

const uploadAvatar = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await axiosInstance.post('/auth/avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error uploading avatar:', error);
        throw error;
    }
};

export const useAuth = () => ({
    setToken,
    getToken,
    logout,
    fetchMe,
    getGoogleAuthUrl,
    fetchProfile,
    resetToken,
    uploadAvatar,
});