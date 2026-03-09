<script setup>
    import { ref, computed, onMounted } from 'vue'
    import { useRouter } from 'vue-router'
    import { useDataStore } from '../stores/dataStore.js'
    import { useNotificationStore } from '../stores/notificationStore.js'
    import { appointmentService, doctorService } from '../services/api.js'
    import { useConfirmation } from '../composables/useConfirmation.js'

    const router = useRouter()
    const dataStore = useDataStore()
    const notificationStore = useNotificationStore()

    const filterStatus = ref('')
    const showAddForm = ref(false)
    const editingAppointment = ref(null)
    const searchQuery = ref('')

    const form = ref({
        patient_id: '',
        doctor_id: '',
        status: 'pending',
        appointment_date: '',
        notes: ''
    })

    const filteredAppointments = computed(() => {
        let list = dataStore.appointments || []
        if (filterStatus.value) {
            list = list.filter(a => a.status === filterStatus.value)
        }
        if (searchQuery.value) {
            const q = searchQuery.value.toLowerCase()
            list = list.filter(a => String(a.patient_id).includes(q) || String(a.doctor_id).includes(q) || (a.notes || '').toLowerCase().includes(q))
        }
        return list
    })

    const viewDetails = (apt) => {
        router.push(`/appointments/${apt.id}`)
    }

    const editAppointment = (apt) => {
        editingAppointment.value = apt
        form.value = { ...apt, status: apt.status || 'pending' }
        showAddForm.value = true
    }

    const { showConfirmModal, confirmMessage, confirm, handleConfirm, handleCancel } = useConfirmation()

    const deleteAppointment = (apt) => {
        confirm(`Supprimer le rendez-vous #${apt.id} ?`, async () => {
            try {
                await appointmentService.delete(apt.id)
                notificationStore.success('Rendez-vous supprimé')
                await dataStore.fetchAppointments()
            } catch (err) {
                notificationStore.error('Erreur lors de la suppression')
            }
        })
    }

    const saveAppointment = async () => {
        try {
            if (editingAppointment.value) {
                await appointmentService.update(editingAppointment.value.id, form.value)
                notificationStore.success('Rendez-vous modifié')
            } else {
                await appointmentService.create(form.value)
                notificationStore.success('Rendez-vous créé')
            }
            closeForm()
                await dataStore.fetchAppointments()
        } catch (err) {
            notificationStore.error('Erreur lors de l\'enregistrement')
        }
    }

    const closeForm = () => {
        showAddForm.value = false;
        editingAppointment.value = null;
        form.value = { patient_id: '', doctor_id: '', appointment_date: '', notes: '' }
    }

    onMounted(async () => {
        await dataStore.fetchAppointments()
        await dataStore.fetchPatients()
        if (dataStore.fetchDoctors && typeof dataStore.fetchDoctors === 'function') {
            await dataStore.fetchDoctors()
        } else {
            try {
                const res = await doctorService.getAll()
                dataStore.doctors = res.data || res
            } catch (err) {
                console.error('Error fetching doctors (fallback):', err)
            }
        }
    })
</script>

<template>
    <div class="p-6 bg-slate-50 min-h-screen">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
                <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">Gestion des Rendez-vous</h1>
                <p class="text-slate-500 font-medium">Planifiez et suivez les consultations médicales.</p>
            </div>
            <button @click="showAddForm = true" 
                class="inline-flex items-center justify-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-100 transition-all active:scale-95">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4.5v15m7.5-7.5h-15" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                Nouveau Rendez-vous
            </button>
        </div>

        <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 mb-6">
            <div class="flex-1 relative">
                <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </span>
                <input v-model="searchQuery" type="text" placeholder="Rechercher par patient, docteur ou notes..." 
                    class="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none text-sm" />
            </div>
            <select v-model="filterStatus" class="bg-slate-50 border border-slate-200 text-slate-600 text-sm rounded-xl focus:ring-2 focus:ring-emerald-500 block p-2.5 outline-none font-medium">
                <option value="">Tous les statuts</option>
                <option value="pending">⏳ En Attente</option>
                <option value="confirmed">✅ Confirmé</option>
                <option value="completed">🏆 Complété</option>
                <option value="cancelled">❌ Annulé</option>
            </select>
        </div>

        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-slate-50 border-b border-slate-200">
                            <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">ID</th>
                            <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Patient</th>
                            <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Docteur</th>
                            <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date & Heure</th>
                            <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Statut</th>
                            <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        <tr v-for="apt in filteredAppointments" :key="apt.id" class="hover:bg-slate-50/80 transition-colors">
                            <td class="px-6 py-4 text-sm font-mono text-slate-400">#{{ apt.id }}</td>
                            <td class="px-6 py-4 font-bold text-slate-900">{{ apt.patient_name || 'ID: ' + apt.patient_id }}</td>
                            <td class="px-6 py-4 font-medium text-slate-700">Dr. {{ apt.doctor_name || apt.doctor_id }}</td>
                            <td class="px-6 py-4">
                                <div class="text-sm font-semibold text-slate-900">{{ new Date(apt.appointment_date).toLocaleDateString() }}</div>
                                <div class="text-xs text-slate-500">{{ new Date(apt.appointment_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }}</div>
                            </td>
                            <td class="px-6 py-4">
                                <span :class="{
                                    'bg-amber-100 text-amber-700': apt.status === 'pending',
                                    'bg-blue-100 text-blue-700': apt.status === 'confirmed',
                                    'bg-emerald-100 text-emerald-700': apt.status === 'completed',
                                    'bg-red-100 text-red-700': apt.status === 'cancelled'
                                }" class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                                    {{ apt.status }}
                                </span>
                            </td>
                            <td class="px-6 py-4 text-right space-x-2">
                                <button @click="viewDetails(apt)" class="p-2 text-slate-400 hover:text-blue-600 transition-colors" title="Détails">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke-width="2"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke-width="2"/></svg>
                                </button>
                                <button @click="editAppointment(apt)" class="p-2 text-slate-400 hover:text-amber-600 transition-colors" title="Modifier">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" stroke-width="2"/></svg>
                                </button>
                                <button @click="deleteAppointment(apt)" class="p-2 text-slate-400 hover:text-red-600 transition-colors" title="Supprimer">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke-width="2"/></svg>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div v-if="showAddForm" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div class="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden">
                <div class="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h2 class="text-xl font-bold text-slate-800">{{ editingAppointment ? 'Modifier' : 'Nouveau' }} Rendez-vous</h2>
                    <button @click="closeForm" class="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-200 rounded-full transition-all">✕</button>
                </div>
                <form @submit.prevent="saveAppointment" class="p-8 space-y-5">
                    <div class="space-y-1">
                        <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Patient</label>
                        <select v-model="form.patient_id" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all font-semibold" required>
                            <option value="">Sélectionner un patient</option>
                            <option v-for="p in dataStore.patients" :key="p.id" :value="p.id">{{ p.first_name }} {{ p.last_name }}</option>
                        </select>
                    </div>

                    <div class="space-y-1">
                        <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Docteur</label>
                        <select v-model="form.doctor_id" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all font-semibold" required>
                            <option value="">Sélectionner un docteur</option>
                            <option v-for="d in dataStore.doctors" :key="d.id" :value="d.id">{{ d.first_name || d.username }} {{ d.last_name || '' }}</option>
                        </select>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-1">
                            <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Statut</label>
                            <select v-model="form.status" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all font-semibold">
                                <option value="pending">En attente</option>
                                <option value="confirmed">Confirmé</option>
                                <option value="completed">Complété</option>
                                <option value="cancelled">Annulé</option>
                            </select>
                        </div>
                        <div class="space-y-1">
                            <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date & Heure</label>
                            <input v-model="form.appointment_date" type="datetime-local" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all font-semibold" required />
                        </div>
                    </div>

                    <div class="space-y-1">
                        <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Notes cliniques</label>
                        <textarea v-model="form.notes" rows="3" placeholder="Symptômes, motif de consultation..." 
                            class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all font-medium"></textarea>
                    </div>

                    <div class="pt-4 flex gap-3">
                        <button type="button" @click="closeForm" class="flex-1 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-all">Annuler</button>
                        <button type="submit" class="flex-[2] px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 transition-all active:scale-95">
                            {{ editingAppointment ? 'Enregistrer les modifications' : 'Confirmer le rendez-vous' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <div v-if="showConfirmModal" class="fixed inset-0 z-[999] flex justify-center items-start pt-10 px-4 bg-slate-900/40 backdrop-blur-sm transition-all overflow-y-auto">
            <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-red-100 animate-in slide-in-from-top duration-300">
                <div class="p-6 text-center">
                    <div class="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </div>
                    <h2 class="text-xl font-black text-slate-900 mb-2">Suppression définitive</h2>
                    <p class="text-slate-600 mb-8 font-medium leading-relaxed">{{ confirmMessage }}</p>
                    <div class="flex gap-3">
                        <button @click="handleCancel" class="flex-1 py-3 text-slate-600 hover:bg-slate-100 font-bold rounded-xl transition-all border border-slate-200">Annuler</button>
                        <button @click="handleConfirm" class="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-200 transition-all active:scale-95">Supprimer</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.animate-in {
    animation-duration: 0.3s;
    animation-fill-mode: both;
}
.slide-in-from-top {
    animation-name: slideInTop;
}
@keyframes slideInTop {
    from { transform: translateY(-30px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
}
</style>