import { ref, computed } from 'vue'
import axios from 'axios'
import { useAuth } from './useAuth'
import { useUserStore } from '@/stores/userStore'

export const useTwoFactorAuth = () => {
    const { getToken } = useAuth()
    const userStore = useUserStore()

    const showQrCodeModal = ref(false)
    const qrCodeUrl = ref('')
    const otpCode = ref('')

    const isTwoFactorEnabled = computed(() => userStore.isTwoFactorEnabled)

    const toggle2FA = async () => {
        const endpoint = isTwoFactorEnabled.value ? 'turn-off' : 'turn-on'
        try {
            const token = getToken()
            await axios.post(
                `${import.meta.env.VITE_APP_USER_MANAGEMENT_URL}/auth/2fa/${endpoint}`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            )

            if (!isTwoFactorEnabled.value) {
                const generateResponse = await axios.post(
                    `${import.meta.env.VITE_APP_USER_MANAGEMENT_URL}/auth/2fa/generate`,
                    {},
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                )
                qrCodeUrl.value = generateResponse.data
                showQrCodeModal.value = true
            } else {
                userStore.setUser({ ...userStore.user, isTwoFactorAuthenticationEnabled: false })
            }
        } catch (error) {
            console.error(`Error toggling 2FA: ${error.response.data}`)
        }
    }

    const authenticate2FA = async () => {
        try {
            const token = getToken()
            await axios.post(
                `${import.meta.env.VITE_APP_USER_MANAGEMENT_URL}/auth/2fa/authenticate`,
                { twoFactorAuthenticationCode: otpCode.value },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            )
            userStore.setUser({ ...userStore.user, isTwoFactorAuthenticationEnabled: true })
            showQrCodeModal.value = false
        } catch (error) {
            console.error('Error authenticating 2FA:', error.response.data)
        }
    }

    const handleModalClose = async (value: boolean) => {
        if (!value && !isTwoFactorEnabled.value) {
            await toggle2FA()
        }
    }

    return {
        showQrCodeModal,
        qrCodeUrl,
        otpCode,
        isTwoFactorEnabled,
        toggle2FA,
        authenticate2FA,
        handleModalClose
    }
}
