import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '../services/api.js'

export const useAuthStore = defineStore('auth', () => {
    const user = ref(null);
    const token = ref(localStorage.getItem('token') || null);

    const isAuthenticated = computed(() => !!token.value && !!user.value);

    const setUser = (userData, authToken) => {
        user.value = userData
        token.value = authToken
        localStorage.setItem('token', authToken)
        localStorage.setItem('user', JSON.stringify(userData))
    };

    const logout = () => {
        user.value = null
        token.value = null
        localStorage.removeItem('token')
        localStorage.removeItem('user')
    };

    const initializeFromStorage = async () => {
        const storedToken = localStorage.getItem('token')
        if (!storedToken) return
        token.value = storedToken
        try {
            const res = await authService.me()
            const serverUser = res.data || res
            user.value = serverUser
            // sync stored user
            localStorage.setItem('user', JSON.stringify(serverUser))
        } catch (err) {
            // token invalid or server unreachable: clear stored auth
            user.value = null
            token.value = null
            localStorage.removeItem('token')
            localStorage.removeItem('user')
        }
    };

    return {
        user,
        token,
        isAuthenticated,
        setUser,
        logout,
        initializeFromStorage
    }
}, {
    persist: false
})
