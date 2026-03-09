<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useDataStore } from '../stores/dataStore.js'

const dataStore = useDataStore()
const stats = ref({
    doctorsAvailable: 0,
    activePatients: 0,
    pendingAppointments: 0,
    totalRooms: 0
})

const userNotifications = ref([])

// --- LOGIQUE DYNAMIQUE DU TEMPS ---
const currentTime = ref(new Date())
let timer = null

onMounted(async () => {
    // Actualisation de l'heure chaque seconde
    timer = setInterval(() => {
        currentTime.value = new Date()
    }, 1000)

    await dataStore.fetchPatients()
    await dataStore.fetchRooms()
    stats.value = {
        doctorsAvailable: 5,
        activePatients: dataStore.patients.length,
        pendingAppointments: 3,
        totalRooms: dataStore.rooms.length
    }
})

onUnmounted(() => {
    clearInterval(timer)
})

const formattedDate = computed(() => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    return currentTime.value.toLocaleDateString('fr-FR', options)
})

const formattedTime = computed(() => {
    return currentTime.value.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
})

const markAsRead = (id) => {
    // Logique pour marquer comme lu
}
</script>

<template>
    <div class="space-y-8 animate-in fade-in duration-700">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
            <div>
                <h1 class="text-3xl font-black text-slate-900 tracking-tight">Tableau de Bord</h1>
                <p class="text-slate-500 font-medium">Bienvenue, voici l'état actuel de votre unité.</p>
            </div>
            
            <div class="bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
                <div class="h-10 w-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                    </svg>
                </div>
                <div class="text-right">
                    <p class="text-xs font-bold text-blue-600 uppercase tracking-widest">{{ formattedTime }}</p>
                    <p class="text-sm font-semibold text-slate-700 capitalize">{{ formattedDate }}</p>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
                <div class="flex justify-between items-start mb-4">
                    <div class="p-3 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:scale-110 transition-transform">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                        </svg>
                    </div>
                    <span class="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-1 rounded-lg uppercase">En ligne</span>
                </div>
                <h3 class="text-slate-500 text-sm font-semibold">Docteurs Disponibles</h3>
                <div class="text-3xl font-black text-slate-900 mt-1">{{ stats.doctorsAvailable }}</div>
            </div>

            <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
                <div class="flex justify-between items-start mb-4">
                    <div class="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:scale-110 transition-transform">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a5.97 5.97 0 0 0-.94 3.197M12 10.5a3.375 3.375 0 1 0 0-6.75 3.375 3.375 0 0 0 0 6.75Z" />
                        </svg>
                    </div>
                    <span class="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded-lg uppercase">Hospitalisés</span>
                </div>
                <h3 class="text-slate-500 text-sm font-semibold">Patients Actifs</h3>
                <div class="text-3xl font-black text-slate-900 mt-1">{{ stats.activePatients }}</div>
            </div>

            <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
                <div class="flex justify-between items-start mb-4">
                    <div class="p-3 bg-amber-50 text-amber-600 rounded-2xl group-hover:scale-110 transition-transform">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                    </div>
                    <span class="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-1 rounded-lg uppercase">Aujourd'hui</span>
                </div>
                <h3 class="text-slate-500 text-sm font-semibold">Rdv en Attente</h3>
                <div class="text-3xl font-black text-slate-900 mt-1">{{ stats.pendingAppointments }}</div>
            </div>

            <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
                <div class="flex justify-between items-start mb-4">
                    <div class="p-3 bg-slate-100 text-slate-600 rounded-2xl group-hover:scale-110 transition-transform">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
                        </svg>
                    </div>
                </div>
                <h3 class="text-slate-500 text-sm font-semibold">Capacité Totale</h3>
                <div class="text-3xl font-black text-slate-900 mt-1">{{ stats.totalRooms }} <span class="text-sm font-normal text-slate-400">unités</span></div>
            </div>
        </div>

        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div class="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <span class="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Notifications Système
                </h2>
                <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">{{ userNotifications.length }} alertes</span>
            </div>

            <div class="p-4">
                <div v-if="userNotifications.length === 0" class="flex flex-col items-center justify-center py-12 text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" class="w-16 h-16 mb-4 opacity-20">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                    </svg>
                    <p class="font-medium">Aucun incident à signaler</p>
                </div>

                <div v-else class="space-y-3">
                    <div v-for="notif in userNotifications" :key="notif.id" 
                         class="group flex items-center justify-between p-4 bg-slate-50 hover:bg-blue-50 rounded-2xl border border-transparent hover:border-blue-100 transition-all cursor-default">
                        <div class="flex items-center gap-4">
                            <div class="h-10 w-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                                </svg>
                            </div>
                            <span class="text-sm font-semibold text-slate-700">{{ notif.message }}</span>
                        </div>
                        <button @click="markAsRead(notif.id)" class="opacity-0 group-hover:opacity-100 px-4 py-1.5 bg-white text-blue-600 text-xs font-bold rounded-lg border border-blue-100 hover:bg-blue-600 hover:text-white transition-all">
                            Marquer lu
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>