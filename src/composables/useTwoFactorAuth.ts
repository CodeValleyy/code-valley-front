import { useAuth } from './useAuth';
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/useUserStore'
import type { AxiosError } from 'axios'
import axiosInstance from '@/config/axiosInstance'

export const useTwoFactorAuth = () => {
    const userStore = useUserStore()
    const useAuthStore = useAuth()

    const showQrCodeModal = ref(false)
    const qrCodeUrl = ref('')
    const setupKey = ref('')
    const otpCode = ref('')

    const isTwoFactorEnabled = computed(() => userStore.isTwoFactorEnabled)

    const toggle2FA = async () => {
        const endpoint = isTwoFactorEnabled.value ? 'turn-off' : 'turn-on';
        try {
            await axiosInstance.post(`/auth/2fa/${endpoint}`);

            if (!isTwoFactorEnabled.value) {
                const generateResponse = await axiosInstance.post('/auth/2fa/generate');
                qrCodeUrl.value = generateResponse.data.qrCodeUrl;
                setupKey.value = generateResponse.data.setupKey;
                showQrCodeModal.value = true;
            } else if (userStore.user) {
                userStore.setUser({
                    ...userStore.user,
                    isTwoFactorAuthenticationEnabled: !isTwoFactorEnabled.value
                });
            }
        } catch (error) {
            const axiosError = error as AxiosError;
            if (axiosError.response?.status === 400) {
                otpCode.value = '';
                return;
            }
            console.error(`Error toggling 2FA: ${axiosError.response?.data}`);
        }
    };

    const authenticate2FA = async () => {
        try {
            const login2fa = await axiosInstance.post('/auth/2fa/authenticate', {
                twoFactorAuthenticationCode: otpCode.value
            });
            if (userStore.user) {
                userStore.setUser({ ...userStore.user, isTwoFactorAuthenticationEnabled: true });
                useAuthStore.setToken(login2fa.data.accessToken);
            }
            showQrCodeModal.value = false;
        } catch (error) {
            const axiosError = error as AxiosError;
            otpCode.value = '';
            if (axiosError.response?.status === 400) {
                return;
            }
            console.error('Error authenticating 2FA:', axiosError.response?.data);
        }
    };

    const handleModalClose = async (value: boolean) => {
        if (!value && !isTwoFactorEnabled.value) {
            await toggle2FA()
        }
    }

    return {
        showQrCodeModal,
        qrCodeUrl,
        setupKey,
        otpCode,
        isTwoFactorEnabled,
        toggle2FA,
        authenticate2FA,
        handleModalClose
    }
}
