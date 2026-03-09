<script setup>
    import { ref, computed, onMounted } from 'vue'
    import { useAuthStore } from '../stores/authStore.js'
    import { useDataStore } from '../stores/dataStore.js'
    import { useRouter } from 'vue-router'

    const authStore = useAuthStore()
    const dataStore = useDataStore()
    const router = useRouter()

    const searchQuery = ref('')
    const isLoading = ref(true)

    onMounted(async () => {
        try {
            await dataStore.fetchPatients()
        } finally {
            isLoading.value = false
        }
    })

    const myPatients = computed(() => {
        const docId = authStore.user?.id
        if (!docId) return []
        
        // Filtrage par docteur assigné
        let list = (dataStore.patients || []).filter(p => parseInt(p.assigned_doctor_id) === parseInt(docId))
        
        // Recherche textuelle
        if (searchQuery.value) {
            const q = searchQuery.value.toLowerCase()
            list = list.filter(p => 
                (p.first_name || '').toLowerCase().includes(q) || 
                (p.last_name || '').toLowerCase().includes(q)
            )
        }
        return list
    })

    const viewPatient = (patient) => {
        router.push(`/patients/${patient.id}`)
    }

    const getStatusClass = (status) => {
        const s = (status || '').toLowerCase()
        if (s === 'hospitalisé' || s === 'inpatient') return 'bg-blue-50 text-blue-600 border-blue-100'
        if (s === 'sorti' || s === 'outpatient') return 'bg-slate-50 text-slate-500 border-slate-100'
        return 'bg-emerald-50 text-emerald-600 border-emerald-100'
    }
</script>

<template>
    <div class="space-y-6">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <div>
                <h1 class="text-2xl font-black text-slate-900 tracking-tight">Ma Patientèle</h1>
                <p class="text-slate-500 text-sm font-medium mt-1">Liste des patients sous votre responsabilité directe</p>
            </div>

            <div class="relative group">
                <input 
                    v-model="searchQuery" 
                    type="text" 
                    placeholder="Chercher un nom..." 
                    class="w-full md:w-80 pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-medium"
                />
                <svg class="w-5 h-5 text-slate-400 absolute left-4 top-3.5 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-width="2.5" stroke-linecap="round"/>
                </svg>
            </div>
        </div>

        <div class="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
            <div v-if="!isLoading" class="overflow-x-auto">
                <table class="w-full border-collapse">
                    <thead>
                        <tr class="bg-slate-50/50 border-b border-slate-200">
                            <th class="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Identité du Patient</th>
                            <th class="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Status Actuel</th>
                            <th class="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        <tr v-for="patient in myPatients" :key="patient.id" class="hover:bg-slate-50/50 transition-colors group">
                            <td class="px-8 py-5">
                                <div class="flex items-center gap-4">
                                    <div class="w-11 h-11 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600 flex items-center justify-center font-black text-xs border border-slate-200">
                                        {{ patient.last_name?.charAt(0) }}{{ patient.first_name?.charAt(0) }}
                                    </div>
                                    <div>
                                        <p class="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                            {{ patient.last_name }} {{ patient.first_name }}
                                        </p>
                                        <p class="text-[11px] text-slate-400 font-medium">ID Dossier: #{{ patient.id }}</p>
                                    </div>
                                </div>
                            </td>
                            <td class="px-8 py-5">
                                <span :class="['px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border', getStatusClass(patient.status)]">
                                    {{ patient.status || 'Suivi standard' }}
                                </span>
                            </td>
                            <td class="px-8 py-5">
                                <div class="flex items-center justify-end gap-2">
                                    <button 
                                        @click="viewPatient(patient)" 
                                        class="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all text-xs"
                                    >
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke-width="2"/>
                                            <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke-width="2"/>
                                        </svg>
                                        Dossier Complet
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div v-if="myPatients.length === 0" class="py-24 text-center">
                    <div class="w-20 h-20 bg-slate-50 text-slate-300 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
                        <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" stroke-width="2"/>
                        </svg>
                    </div>
                    <p class="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">Aucun patient trouvé dans votre liste</p>
                </div>
            </div>

            <div v-else class="p-24 flex justify-center">
                <div class="flex flex-col items-center gap-4">
                    <div class="w-10 h-10 border-4 border-blue-50 border-t-blue-600 rounded-full animate-spin"></div>
                    <p class="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Synchronisation...</p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    /* Optionnel : ajout d'une ombre douce sur les avatars au survol de la ligne */
    tr:hover .w-11 {
        @apply shadow-md border-blue-100 bg-blue-50 text-blue-600 transition-all duration-300;
    }
</style>