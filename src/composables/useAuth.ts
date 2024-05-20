import { ref } from 'vue';
import axios from 'axios';

const token = ref(localStorage.getItem('token') || '');

const setToken = (newToken: string) => {
    token.value = newToken;
    localStorage.setItem('token', newToken);
};

const getToken = () => token.value;

const fetchProfile = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_APP_USER_MANAGEMENT_URL}/auth/profile`, {
            headers: { Authorization: `Bearer ${token.value}` },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching profile:', error);
        throw error;
    }
};

export const useAuth = () => ({
    setToken,
    getToken,
    fetchProfile,
});
