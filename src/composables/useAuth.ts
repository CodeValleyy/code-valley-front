import { ref } from 'vue';
import axios from 'axios';

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
        const response = await axios.get(`${import.meta.env.VITE_APP_USER_MANAGEMENT_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token.value}` },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching profile:', error);
        throw error;
    }
};

const fetchProfile = async (userId: number) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_APP_USER_MANAGEMENT_URL}/auth/profile/${userId}`, {
            headers: { Authorization: `Bearer ${token.value}` },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching profile:', error);
        throw error;
    }
}

const logout = async () => {
    try {
        await axios.post(
            `${import.meta.env.VITE_APP_USER_MANAGEMENT_URL}/auth/logout`,
            {},
            {
                headers: { Authorization: `Bearer ${token.value}` },
            }
        );
    } catch (error) {
        console.error('Error logging out:', error);
        throw error;
    } finally {
        resetToken();
    }
}

const getGoogleAuthUrl = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_APP_USER_MANAGEMENT_URL}/auth/google`);
        return response.data;
    } catch (error) {
        console.error('Error fetching Google Auth URL:', error);
        throw error;
    }
}

export const useAuth = () => ({
    setToken,
    getToken,
    logout,
    fetchMe,
    fetchProfile,
    resetToken,
    getGoogleAuthUrl,
});
