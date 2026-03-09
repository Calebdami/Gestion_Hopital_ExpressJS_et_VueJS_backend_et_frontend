<script setup>
    import { useAuthStore } from './stores/authStore.js'
    import { useNotificationStore } from './stores/notificationStore.js'
    import LoginView from './views/LoginView.vue'

    const authStore = useAuthStore()
    const notificationStore = useNotificationStore()

    import { useConfirmation } from './composables/useConfirmation.js'

    const { showConfirmModal, confirmMessage, confirm, handleConfirm, handleCancel } = useConfirmation()

    const logout = () => {
        confirm('Voulez-vous vraiment vous déconnecter ?', () => {
            authStore.logout()
        })
    }
</script>

<template>
    <div v-if="!authStore.isAuthenticated" class="min-h-screen bg-slate-50">
        <LoginView />
    </div>

    <div v-else class="flex min-h-screen bg-[#F8FAFC]">
        
        <nav class="w-64 bg-white border-r border-slate-200 flex flex-col sticky top-0 h-screen transition-all duration-300">
            <div class="p-6 border-b border-slate-50">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-200">
                        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </div>
                    <span class="text-lg font-black text-slate-900 tracking-tight">MedCore <span class="text-blue-600 font-extrabold">Pro</span></span>
                </div>
            </div>

            <div class="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                <router-link to="/dashboard" class="nav-link flex items-center gap-3">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    Dashboard
                </router-link>
                
                <template v-if="authStore.user.role === 'admin'">
                    <router-link to="/patients" class="nav-link flex items-center gap-3">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        Patients
                    </router-link>
                    <router-link to="/doctors" class="nav-link flex items-center gap-3">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        Docteurs
                    </router-link>
                    <router-link to="/appointments" class="nav-link flex items-center gap-3">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        Rendez-vous
                    </router-link>
                    <router-link to="/rooms" class="nav-link flex items-center gap-3">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        Chambres
                    </router-link>
                    <router-link to="/accounts" class="nav-link flex items-center gap-3">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        Gestion Comptes
                    </router-link>
                    <router-link to="/collaborators" class="nav-link flex items-center gap-3">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        Collaborateurs
                    </router-link>
                    <router-link to="/trash" class="nav-link text-red-400 flex items-center gap-3">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        Corbeille
                    </router-link>
                </template>

                <template v-if="authStore.user.role === 'receptionist'">
                    <router-link to="/patients" class="nav-link flex items-center gap-3">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        Patients
                    </router-link>
                    <router-link to="/appointments" class="nav-link flex items-center gap-3">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        Rendez-vous
                    </router-link>
                    <router-link to="/rooms" class="nav-link flex items-center gap-3">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        Chambres
                    </router-link>
                </template>

                <template v-if="authStore.user.role === 'doctor'">
                    <router-link to="/my-appointments" class="nav-link flex items-center gap-3">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        Mes Rendez-vous
                    </router-link>
                    <router-link to="/my-patients" class="nav-link flex items-center gap-3">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        Mes Patients
                    </router-link>
                    <router-link to="/rooms" class="nav-link flex items-center gap-3">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        Chambres
                    </router-link>
                </template>

                <div class="h-px bg-slate-100 my-4 mx-2"></div>
                <router-link to="/about" class="nav-link flex items-center gap-3">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    À Propos
                </router-link>
            </div>

            <div class="p-4 border-t border-slate-50 bg-slate-50/50">
                <button @click="logout" class="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all font-bold text-sm group">
                    <svg class="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Déconnexion
                </button>
            </div>
        </nav>

        <div class="flex-1 flex flex-col h-screen overflow-hidden">
            
            <header class="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between z-40">
                <div class="flex items-center gap-2">
                    <span class="text-xs font-black text-slate-400 uppercase tracking-widest">Interface /</span>
                    <span class="text-xs font-black text-blue-600 uppercase tracking-widest">{{ $route.name || 'Application' }}</span>
                </div>

                <div class="flex items-center gap-6">
                    <div class="flex items-center gap-3">
                        <div class="text-right">
                            <p class="text-[11px] font-black text-slate-900 leading-none uppercase">{{ authStore.user.username }}</p>
                            <p class="text-[9px] font-bold text-blue-500 uppercase tracking-[0.1em] mt-1">{{ authStore.user.role }}</p>
                        </div>
                        <div class="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-xs border-2 border-slate-50 shadow-sm">
                            {{ authStore.user.username.substring(0,2).toUpperCase() }}
                        </div>
                    </div>
                    <button @click="logout" class="p-2.5 text-slate-300 hover:text-red-500 transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </button>
                </div>
            </header>

            <main class="flex-1 overflow-y-auto bg-[#F8FAFC] p-8">
                <div class="max-w-7xl mx-auto">
                    <div class="fixed top-24 right-8 z-[60] space-y-3 w-80">
                        <div v-for="notif in notificationStore.notifications" :key="notif.id" 
                             :class="['notification shadow-xl flex items-center justify-between p-4 rounded-2xl border-l-4 animate-in slide-in-from-right-4 duration-300', 
                                       notif.type === 'success' ? 'bg-white border-emerald-500 text-emerald-900' : 'bg-white border-red-500 text-red-900']">
                            <span class="text-sm font-bold">{{ notif.message }}</span>
                            <button @click="notificationStore.removeNotification(notif.id)" class="text-slate-300 hover:text-slate-600 font-black text-xl">×</button>
                        </div>
                    </div>

                    <div v-if="showConfirmModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                        <div class="bg-white rounded-[2rem] w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden scale-in">
                            <div class="p-8 text-center">
                                <h2 class="text-xl font-black text-slate-900 tracking-tight mb-3">Confirmation</h2>
                                <p class="text-slate-500 text-sm font-medium leading-relaxed">{{ confirmMessage }}</p>
                            </div>
                            <div class="flex gap-2 p-6 bg-slate-50 border-t border-slate-100">
                                <button @click="handleCancel" class="flex-1 py-3.5 bg-white border border-slate-200 text-slate-600 font-black rounded-xl hover:bg-slate-100 transition-all uppercase text-[10px] tracking-widest">Annuler</button>
                                <button @click="handleConfirm" class="flex-1 py-3.5 bg-red-600 text-white font-black rounded-xl hover:bg-red-700 transition-all uppercase text-[10px] tracking-widest shadow-lg shadow-red-200">Confirmer</button>
                            </div>
                        </div>
                    </div>

                    <router-view />
                </div>
            </main>
        </div>
    </div>
</template>

<style scoped>
    .nav-link {
        @apply flex items-center px-4 py-3 text-sm font-bold text-slate-500 rounded-xl transition-all hover:bg-slate-50 hover:text-blue-600;
    }
    .router-link-active {
        @apply bg-blue-50 text-blue-600 shadow-sm;
    }
    .scale-in {
        animation: scaleIn 0.2s ease-out;
    }
    @keyframes scaleIn {
        from { opacity: 0; transform: scale(0.98); }
        to { opacity: 1; transform: scale(1); }
    }
</style>