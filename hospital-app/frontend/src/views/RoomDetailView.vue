<script setup>
    import { ref, onMounted } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import { roomService } from '../services/api.js'

    const route = useRoute()
    const router = useRouter()
    const room = ref(null)

    onMounted(async () => {
        const roomId = route.params.id
        try {
            const response = await roomService.getById(roomId)
            room.value = response.data
        } catch (err) {
            console.error('Erreur lors de la récupération de la chambre:', err)
        }
    })

    const goBack = () => {
        router.back()
    }
</script>

<template>
    <div class="p-6 bg-slate-50 min-h-screen animate-in fade-in duration-500">
        <div class="max-w-5xl mx-auto mb-8 flex items-center gap-4">
            <button @click="goBack" 
                class="flex items-center justify-center w-10 h-10 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-all shadow-sm">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <div>
                <h1 class="text-2xl font-black text-slate-900 tracking-tight">Détails de l'Unité</h1>
                <p class="text-xs text-slate-500 font-bold uppercase tracking-widest">Localisation & Gestion des lits</p>
            </div>
        </div>

        <div class="max-w-5xl mx-auto">
            <div v-if="room" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                <div class="lg:col-span-1 space-y-6">
                    <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center">
                        <div class="inline-flex items-center justify-center w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl mb-4 border border-indigo-100">
                            <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" stroke-width="2"/></svg>
                        </div>
                        <h2 class="text-2xl font-black text-slate-900 uppercase tracking-tight">{{ room.name }}</h2>
                        <p class="text-sm text-slate-400 font-mono italic mb-6">ID: #ROOM-{{ room.id }}</p>

                        <div class="relative w-32 h-32 mx-auto mb-6">
                            <svg class="w-full h-full transform -rotate-90">
                                <circle cx="64" cy="64" r="58" stroke="currentColor" stroke-width="8" fill="transparent" class="text-slate-100" />
                                <circle cx="64" cy="64" r="58" stroke="currentColor" stroke-width="10" fill="transparent" 
                                    :stroke-dasharray="364.4" 
                                    :stroke-dashoffset="364.4 - (364.4 * (room.occupied_capacity / room.total_capacity))"
                                    class="text-indigo-600 transition-all duration-1000 ease-out" />
                            </svg>
                            <div class="absolute inset-0 flex flex-col items-center justify-center">
                                <span class="text-xl font-black text-slate-900">{{ Math.round((room.occupied_capacity / room.total_capacity) * 100) }}%</span>
                                <span class="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Occupé</span>
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-2">
                            <div class="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                                <p class="text-[10px] font-black text-slate-400 uppercase">Total lits</p>
                                <p class="text-lg font-bold text-slate-700">{{ room.total_capacity }}</p>
                            </div>
                            <div class="p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
                                <p class="text-[10px] font-black text-emerald-500 uppercase">Disponibles</p>
                                <p class="text-lg font-bold text-emerald-700">{{ room.total_capacity - room.occupied_capacity }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="lg:col-span-2">
                    <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
                        <div class="px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <h3 class="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" stroke-width="2"/></svg>
                                Patients actuellement en chambre
                            </h3>
                            <span class="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-500">
                                {{ room.patients?.length || 0 }} Occupant(s)
                            </span>
                        </div>

                        <div v-if="room.patients && room.patients.length > 0" class="overflow-x-auto">
                            <table class="w-full text-left">
                                <thead>
                                    <tr class="text-[10px] font-black text-slate-400 uppercase tracking-wider bg-slate-50/30">
                                        <th class="px-8 py-4">Nom du Patient</th>
                                        <th class="px-8 py-4">Contact</th>
                                        <th class="px-8 py-4 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-100">
                                    <tr v-for="p in room.patients" :key="p.id" class="group hover:bg-slate-50 transition-colors">
                                        <td class="px-8 py-5">
                                            <div class="flex items-center gap-3">
                                                <div class="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center font-bold text-xs uppercase">
                                                    {{ p.last_name.charAt(0) }}{{ p.first_name.charAt(0) }}
                                                </div>
                                                <div>
                                                    <p class="font-bold text-slate-900 leading-none">{{ p.first_name }} {{ p.last_name }}</p>
                                                    <p class="text-[10px] text-slate-400 mt-1 uppercase font-semibold">Dossier #{{ p.id }}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="px-8 py-5">
                                            <div class="text-xs font-medium text-slate-600 mb-1 flex items-center gap-1">
                                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke-width="2"/></svg>
                                                {{ p.email }}
                                            </div>
                                            <div class="text-xs text-slate-400 flex items-center gap-1">
                                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" stroke-width="2"/></svg>
                                                {{ p.phone }}
                                            </div>
                                        </td>
                                        <td class="px-8 py-5 text-right">
                                            <button @click="router.push(`/patients/${p.id}`)" 
                                                class="px-4 py-2 bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-600 text-xs font-bold rounded-xl transition-all">
                                                Voir Dossier
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div v-else class="flex flex-col items-center justify-center h-64 text-center p-8">
                            <div class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                                <svg class="w-8 h-8 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" stroke-width="2"/></svg>
                            </div>
                            <p class="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Aucun patient affecté</p>
                        </div>
                    </div>

                    <div class="mt-6">
                        <button @click="goBack" class="w-full py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black hover:bg-slate-50 transition-all">
                            QUITTER LA VUE DÉTAILLÉE
                        </button>
                    </div>
                </div>
            </div>

            <div v-else class="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-slate-200 animate-pulse">
                <div class="w-12 h-12 bg-slate-100 rounded-2xl mb-4"></div>
                <p class="text-slate-300 font-black uppercase tracking-[0.2em] text-[10px]">Chargement des données chambre...</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .animate-in {
        animation: slideIn 0.5s ease-out;
    }
    @keyframes slideIn {
        from { opacity: 0; transform: translateY(15px); }
        to { opacity: 1; transform: translateY(0); }
    }
</style>