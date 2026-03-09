<script setup>
    import { ref } from 'vue'
    import { useRouter } from 'vue-router'
    import { useAuthStore } from '../stores/authStore.js'
    import { useNotificationStore } from '../stores/notificationStore.js'
    import { authService } from '../services/api.js'

    const router = useRouter()
    const authStore = useAuthStore()
    const notificationStore = useNotificationStore()

    const username = ref('')
    const password = ref('')
    const loading = ref(false)
    const error = ref('')

    const handleLogin = async () => {
        error.value = ''
        loading.value = true
        try {
            const response = await authService.login(username.value, password.value)
            authStore.setUser(response.data.user, response.data.token)
            notificationStore.success('Connexion réussie!')
            router.push('/dashboard')
        } catch (err) {
            error.value = err.response?.data?.message || 'Erreur de connexion'
            notificationStore.error(error.value)
        } finally {
            loading.value = false
        }
    }
</script>

<template>
    <div class="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div class="w-full max-w-md">
            
            <div class="text-center mb-8">
                <div class="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.618.309a6 6 0 01-3.86.517l-2.387-.477a2 2 0 00-1.022.547l-1.168 1.168a2 2 0 00-.566 1.414l.046.908 2.274 2.274a2 2 0 001.414.586h10.586a2 2 0 001.414-.586l2.274-2.274.046-.908a2 2 0 00-.566-1.414l-1.168-1.168z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                    </svg>
                </div>
                <h1 class="text-2xl font-bold text-slate-900 tracking-tight">MedCore Portal</h1>
                <p class="text-slate-500 mt-1">Système de Gestion Hospitalière</p>
            </div>

            <div class="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8">
                <form @submit.prevent="handleLogin" class="space-y-6">
                    
                    <div class="space-y-1.5">
                        <label for="username" class="text-sm font-semibold text-slate-700 ml-1">Nom d'utilisateur</label>
                        <div class="relative">
                            <input
                                v-model="username"
                                id="username"
                                type="text"
                                placeholder="Nom d'utilisateur"
                                class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 focus:bg-white outline-none transition-all duration-200 placeholder:text-slate-400"
                                required
                            />
                        </div>
                    </div>

                    <div class="space-y-1.5">
                        <div class="flex justify-between items-center ml-1">
                            <label for="password" class="text-sm font-semibold text-slate-700">Mot de passe</label>
                            <a href="#" class="text-xs font-medium text-blue-600 hover:text-blue-700">Oublié ?</a>
                        </div>
                        <input
                            v-model="password"
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 focus:bg-white outline-none transition-all duration-200 placeholder:text-slate-400"
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        :disabled="loading"
                        class="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-semibold shadow-lg shadow-blue-200 transition-all duration-200 transform active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                        <svg v-if="loading" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {{ loading ? 'Authentification...' : 'Se connecter au portail' }}
                    </button>
                </form>

                <div v-if="error" class="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    <svg class="h-5 w-5 text-red-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p class="text-sm text-red-800 font-medium">{{ error }}</p>
                </div>
            </div>

            <p class="text-center text-slate-400 text-xs mt-8">
                &copy; 2026 MedCore Health Systems. Accès restreint au personnel autorisé.
            </p>
        </div>
    </div>
</template>