<script setup>
    import { ref, computed, onMounted } from 'vue'
    import { useNotificationStore } from '../stores/notificationStore.js'
    import { useAuthStore } from '../stores/authStore.js'
    import { useDataStore } from '../stores/dataStore.js'
    import { useRouter } from 'vue-router'
    import { appointmentService } from '../services/api.js'

    const notificationStore = useNotificationStore()
    const authStore = useAuthStore()
    const dataStore = useDataStore()
    const router = useRouter()

    const showAddForm = ref(false)
    const searchQuery = ref('')
    const isLoading = ref(true)

    onMounted(async () => {
        const docId = authStore.user?.id
        try {
            await dataStore.fetchAppointments({ doctor_id: docId })
            await dataStore.fetchPatients()
        } finally {
            isLoading.value = false
        }
    })

    const appointments = computed(() => {
        const list = dataStore.appointments || []
        if (!searchQuery.value) return list
        const q = searchQuery.value.toLowerCase()
        return list.filter(a => String(a.patient_id).includes(q) || (a.notes || '').toLowerCase().includes(q))
    })

    const getStatusStyle = (status) => {
        const styles = {
            pending: 'bg-amber-50 text-amber-600 border-amber-100',
            confirmed: 'bg-blue-50 text-blue-600 border-blue-100',
            completed: 'bg-emerald-50 text-emerald-600 border-emerald-100',
            cancelled: 'bg-red-50 text-red-600 border-red-100'
        }
        return styles[status] || 'bg-slate-50 text-slate-600 border-slate-100'
    }

    const updateStatus = async (apt) => {
        const statuses = ['pending', 'confirmed', 'completed', 'cancelled']
        const idx = statuses.indexOf(apt.status || 'pending')
        const next = statuses[(idx + 1) % statuses.length]
        try {
            await appointmentService.update(apt.id, { status: next })
            notificationStore.success(`Statut mis à jour : ${next}`)
            const docId = authStore.user?.id
            await dataStore.fetchAppointments({ doctor_id: docId })
        } catch (err) {
            notificationStore.error('Erreur lors de la mise à jour du statut')
        }
    }

    const showAppointmentDetails = (apt) => {
        router.push(`/appointments/${apt.id}`)
    }

    const saveAppointment = () => {
        notificationStore.success('Rendez-vous ajouté')
        closeForm()
    }

    const closeForm = () => {
        showAddForm.value = false
    }
</script>

<template>
    <div class="space-y-6">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <div>
                <h1 class="text-2xl font-black text-slate-900 tracking-tight">Mes Rendez-vous</h1>
                <p class="text-slate-500 text-sm font-medium">Gestion de votre planning quotidien</p>
            </div>
            <div class="flex items-center gap-3">
                <div class="relative">
                    <input v-model="searchQuery" placeholder="Rechercher..." 
                           class="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none w-64" />
                    <svg class="w-4 h-4 text-slate-400 absolute left-3.5 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-width="2.5" stroke-linecap="round"/></svg>
                </div>
                <button @click="showAddForm = true" class="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 hover:scale-[1.02] active:scale-95 transition-all text-sm shadow-lg shadow-blue-500/20">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" stroke-width="2.5" stroke-linecap="round"/></svg>
                    Nouveau
                </button>
            </div>
        </div>

        <div class="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
            <table class="w-full border-collapse">
                <thead>
                    <tr class="bg-slate-50/50 border-b border-slate-200">
                        <th class="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient</th>
                        <th class="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Date prévue</th>
                        <th class="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Statut</th>
                        <th class="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                    <tr v-for="apt in appointments" :key="apt.id" class="hover:bg-slate-50/50 transition-colors group">
                        <td class="px-8 py-5">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xs">
                                    P{{ apt.patient_id }}
                                </div>
                                <span class="font-bold text-slate-700">Patient ID: {{ apt.patient_id }}</span>
                            </div>
                        </td>
                        <td class="px-8 py-5 text-sm font-semibold text-slate-600">
                            {{ new Date(apt.appointment_date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'long' }) }}
                        </td>
                        <td class="px-8 py-5">
                            <span :class="['px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border', getStatusStyle(apt.status)]">
                                {{ apt.status }}
                            </span>
                        </td>
                        <td class="px-8 py-5">
                            <div class="flex items-center justify-end gap-2">
                                <button @click="updateStatus(apt)" class="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all" title="Changer le statut">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                                </button>
                                <button @click="showAppointmentDetails(apt)" class="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all" title="Détails">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke-width="2"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke-width="2"/></svg>
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div v-if="appointments.length === 0" class="py-20 text-center">
                <div class="w-20 h-20 bg-slate-50 text-slate-300 rounded-[2rem] flex items-center justify-center mx-auto mb-4">
                    <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke-width="2"/></svg>
                </div>
                <p class="text-slate-400 font-bold uppercase text-xs tracking-widest">Aucun rendez-vous trouvé</p>
            </div>
        </div>

        <div v-if="showAddForm" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div class="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden scale-in">
                <div class="p-8">
                    <div class="flex items-center justify-between mb-8">
                        <div>
                            <h2 class="text-xl font-black text-slate-900 tracking-tight">Programmer un RDV</h2>
                            <p class="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Nouveau créneau</p>
                        </div>
                        <button @click="closeForm" class="p-2 text-slate-300 hover:text-slate-600 transition-colors text-2xl">×</button>
                    </div>

                    <form @submit.prevent="saveAppointment" class="space-y-6">
                        <div class="space-y-2">
                            <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Sélectionner la date</label>
                            <input type="date" required class="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-bold text-slate-700" />
                        </div>
                        
                        <div class="flex gap-3 pt-2">
                            <button type="button" @click="closeForm" class="flex-1 py-4 bg-white border border-slate-200 text-slate-500 font-black rounded-2xl hover:bg-slate-50 transition-all uppercase text-[10px] tracking-widest">
                                Annuler
                            </button>
                            <button type="submit" class="flex-1 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all uppercase text-[10px] tracking-widest">
                                Confirmer
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .scale-in {
        animation: scaleIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    @keyframes scaleIn {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
    }
</style>