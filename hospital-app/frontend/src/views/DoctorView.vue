<script setup>
    import { ref, computed, onMounted } from 'vue'
    import { useRouter } from 'vue-router'
    import { useDataStore } from '../stores/dataStore.js'
    import { useNotificationStore } from '../stores/notificationStore.js'
    import { doctorService } from '../services/api.js'
    import { useConfirmation } from '../composables/useConfirmation.js'

    const router = useRouter()
    const dataStore = useDataStore()
    const notificationStore = useNotificationStore()
    const { confirm } = useConfirmation()

    const searchQuery = ref('')
    const selectedFilter = ref('')
    const showAddForm = ref(false)
    const editingDoctor = ref(null)

    const form = ref({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        specialization: ''
    })

    const viewDetails = (doctor) => {
        router.push(`/doctors/${doctor.id}`)
    }

    const doctors = computed(() => {
        let filtered = dataStore.doctors || []

        if (searchQuery.value) {
            const q = searchQuery.value.toLowerCase()
            filtered = filtered.filter(d =>
                (d.username || '').toLowerCase().includes(q) ||
                (d.specialty || '').toLowerCase().includes(q)
            )
        }

        if (selectedFilter.value) {
            filtered = filtered.filter(d => d.specialization === selectedFilter.value)
        }

        return filtered
    })

    const fetchAllDoctors = async () => {
        if (dataStore.fetchDoctors && typeof dataStore.fetchDoctors === 'function') {
            await dataStore.fetchDoctors()
        } else {
            try {
                const res = await doctorService.getAll()
                dataStore.doctors = res.data || res
            } catch (err) {
                notificationStore.error('Erreur de synchronisation')
            }
        }
    }

    onMounted(fetchAllDoctors)

</script>

<template>
    <div class="space-y-6">
        <div class="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 class="text-2xl font-black text-slate-900 tracking-tight">Gestion des Docteurs</h1>
                    <p class="text-slate-500 text-sm font-medium">Annuaire et disponibilité du corps médical</p>
                </div>
                <button @click="router.push('/collaborators')" class="px-6 py-3 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all text-xs uppercase tracking-widest shadow-lg shadow-slate-200">
                    Gérer Collaborateurs
                </button>
            </div>

            <div class="flex flex-col md:flex-row gap-4 pt-4 border-t border-slate-50">
                <div class="relative flex-1">
                    <input v-model="searchQuery" type="text" placeholder="Rechercher un médecin ou une spécialité..." 
                           class="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none" />
                    <svg class="w-5 h-5 text-slate-400 absolute left-4 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-width="2.5"/></svg>
                </div>
                
                <select v-model="selectedFilter" class="px-6 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 outline-none focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer">
                    <option value="">Toutes les spécialités</option>
                    <option value="active">Actif</option>
                    <option value="treated">Traité</option>
                    <option value="discharged">Sorti</option>
                </select>
            </div>
        </div>

        <div class="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
            <table class="w-full border-collapse">
                <thead>
                    <tr class="bg-slate-50/50 border-b border-slate-200">
                        <th class="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">ID</th>
                        <th class="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Docteur</th>
                        <th class="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Spécialité</th>
                        <th class="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Disponibilité</th>
                        <th class="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                    <tr v-for="doctor in doctors" :key="doctor.id" class="hover:bg-slate-50/50 transition-colors group">
                        <td class="px-8 py-5 text-xs font-bold text-slate-400">#{{ doctor.id }}</td>
                        <td class="px-8 py-5">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xs uppercase shadow-sm">
                                    {{ (doctor.username || 'DR').substring(0, 2) }}
                                </div>
                                <span class="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Dr. {{ doctor.username }}</span>
                            </div>
                        </td>
                        <td class="px-8 py-5">
                            <span class="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-black rounded-lg uppercase tracking-wider">
                                {{ doctor.specialization || 'Généraliste' }}
                            </span>
                        </td>
                        <td class="px-8 py-5">
                            <div class="flex items-center gap-2">
                                <div :class="['w-2 h-2 rounded-full', doctor.available ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-400']"></div>
                                <span :class="['text-xs font-bold', doctor.available ? 'text-emerald-600' : 'text-red-400']">
                                    {{ doctor.available ? 'Disponible' : 'En consultation' }}
                                </span>
                            </div>
                        </td>
                        <td class="px-8 py-5">
                            <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button @click="viewDetails(doctor)" class="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all" title="Voir fiche">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke-width="2"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke-width="2"/></svg>
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            
            <div v-if="doctors.length === 0" class="py-24 text-center">
                <p class="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">Aucun docteur ne correspond à votre recherche</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
    /* Lissage du scrollbar pour le tableau */
    table { border-spacing: 0; }
    
    /* Animation subtile pour les boutons d'action au survol */
    button {
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }
</style>