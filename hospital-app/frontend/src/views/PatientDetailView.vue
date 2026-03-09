<script setup>
    import { ref, onMounted, computed } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import { patientService } from '../services/api.js'
    import { formatDate } from '../utils/helpers.js'
    import { useAuthStore } from '../stores/authStore.js'
    import { useDataStore } from '../stores/dataStore.js'
    import { useNotificationStore } from '../stores/notificationStore.js'

    const route = useRoute()
    const router = useRouter()
    const authStore = useAuthStore()
    const dataStore = useDataStore()
    const notificationStore = useNotificationStore()

    const patient = ref(null)
    const isLoading = ref(true)

    const showEditForm = ref(false)
    const form = ref({})

    const canEdit = computed(() => {
        if (!authStore.user) return false
        const role = authStore.user.role
        if (role === 'admin') return true
        if (role === 'doctor' && patient.value) {
            return parseInt(authStore.user.id) === parseInt(patient.value.assigned_doctor_id)
        }
        return false
    })

    const roomEditAllowed = computed(() => {
        const role = authStore.user?.role
        return role === 'admin' || role === 'doctor'
    })

    onMounted(async () => {
        const patientId = route.params.id
        try {
            await Promise.all([dataStore.fetchRooms(), dataStore.fetchDoctors()])
            const response = await patientService.getById(patientId)
            patient.value = response.data
        } catch (err) {
            console.error('Erreur lors de la récupération du patient:', err)
        } finally {
            isLoading.value = false
        }
    })

    const goBack = () => {
        router.back()
    }

    const openEdit = () => {
        form.value = {
            ...patient.value,
            insurance: patient.value.insurance || { name: '', member_number: '' },
            emergency_contact: patient.value.emergency_contact || { name: '', phone: '' },
            allergies_str: Array.isArray(patient.value.allergies) ? patient.value.allergies.join(', ') : '',
            major_history_str: Array.isArray(patient.value.major_history) ? patient.value.major_history.join(', ') : '',
            current_treatments_str: Array.isArray(patient.value.current_treatments) ? patient.value.current_treatments.join(', ') : ''
        }
        showEditForm.value = true
    }

    const closeEdit = () => {
        showEditForm.value = false
        form.value = {}
    }

    const savePatient = async () => {
        try {
            const payload = { ...form.value }
            payload.allergies = (payload.allergies_str || '').split(',').map(s => s.trim()).filter(Boolean)
            payload.major_history = (payload.major_history_str || '').split(',').map(s => s.trim()).filter(Boolean)
            payload.current_treatments = (payload.current_treatments_str || '').split(',').map(s => s.trim()).filter(Boolean)
            if (payload.assigned_doctor_id === '') payload.assigned_doctor_id = null
            if (payload.assigned_room_id === '') payload.assigned_room_id = null
            await patientService.update(patient.value.id, payload)
            notificationStore.success('Patient mis à jour')
            const resp = await patientService.getById(patient.value.id)
            patient.value = resp.data
            await dataStore.fetchPatients()
            closeEdit()
        } catch (err) {
            console.error(err)
            notificationStore.error('Impossible de sauvegarder le patient')
        }
    }
</script>

<template>
    <div class="p-6 bg-slate-50 min-h-screen animate-in fade-in duration-500">
        <div class="max-w-4xl mx-auto mb-8 flex items-center justify-between">
            <div class="flex items-center gap-4">
                <button @click="goBack" 
                    class="group flex items-center justify-center w-12 h-12 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:text-indigo-600 hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-100 transition-all">
                    <svg class="w-6 h-6 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
                <div>
                    <h1 class="text-2xl font-black text-slate-900 tracking-tight">Dossier Patient</h1>
                    <p class="text-sm text-slate-500 font-medium italic">Consultation détaillée des informations médicales.</p>
                </div>
            </div>
            
            <div v-if="patient" class="hidden sm:block">
                <span :class="{
                    'bg-emerald-50 text-emerald-700 border-emerald-100': patient.status === 'active',
                    'bg-blue-50 text-blue-700 border-blue-100': patient.status === 'treated',
                    'bg-slate-100 text-slate-600 border-slate-200': patient.status === 'discharged'
                }" class="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border">
                    Statut : {{ patient.status || 'Indéfini' }}
                </span>
            </div>
        </div>
        <div v-if="showEditForm" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity">
            <div class="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden transform transition-all scale-100">
                <div class="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h2 class="text-xl font-bold text-slate-800">Modifier le Patient</h2>
                    <button @click="closeEdit" class="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-200 rounded-full transition-all">✕</button>
                </div>
                <form @submit.prevent="savePatient" class="p-6 space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                        <input v-model="form.first_name" type="text" placeholder="Prénom" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all" required />
                        <input v-model="form.last_name" type="text" placeholder="Nom" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all" required />
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <input v-model="form.given_names" type="text" placeholder="Prénoms complets" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all" />
                        <input v-model="form.birth_name" type="text" placeholder="Nom de naissance" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all" />
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <input v-model="form.email" type="email" placeholder="Email" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                        <input v-model="form.phone" type="text" placeholder="Téléphone" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="text-xs font-bold text-slate-400 uppercase ml-1">Date de naissance</label>
                            <input v-model="form.date_of_birth" type="date" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                        </div>
                        <input v-model="form.nir" type="text" placeholder="NIR" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                    </div>
                    <input v-model="form.address" type="text" placeholder="Adresse" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                    <div class="grid grid-cols-2 gap-4">
                        <input v-model="form.insurance.name" type="text" placeholder="Assurance (nom)" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                        <input v-model="form.insurance.member_number" type="text" placeholder="N° membre assurance" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <input v-model="form.emergency_contact.name" type="text" placeholder="Contact urgence - nom" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                        <input v-model="form.emergency_contact.phone" type="text" placeholder="Contact urgence - téléphone" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                    </div>
                    <div>
                        <label class="text-sm font-medium text-slate-600">Allergies (séparées par une virgule)</label>
                        <textarea v-model="form.allergies_str" rows="2" class="w-full mt-2 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"></textarea>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <select v-model="form.assigned_doctor_id" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none">
                            <option value="">Aucun</option>
                            <option v-for="d in dataStore.doctors" :key="d.id" :value="d.id">Dr. {{ d.first_name }} {{ d.last_name }}</option>
                        </select>
                        <select v-model="form.assigned_room_id" :disabled="!roomEditAllowed" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none">
                            <option value="">Aucune</option>
                            <option v-for="r in dataStore.rooms" :key="r.id" :value="r.id">{{ r.name || ('Chambre ' + r.id) }}</option>
                        </select>
                    </div>
                    <div class="pt-4 flex gap-3 justify-end">
                        <button type="button" @click="closeEdit" class="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl">Annuler</button>
                        <button type="submit" class="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl">Enregistrer</button>
                    </div>
                </form>
            </div>
        </div>

        <div class="max-w-4xl mx-auto">
            <div v-if="patient" class="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div class="md:col-span-1 space-y-6">
                    <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center">
                        <div class="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center text-3xl font-black mx-auto mb-4 border-4 border-white shadow-inner">
                            {{ patient.last_name.charAt(0) }}{{ patient.first_name.charAt(0) }}
                        </div>
                        <h2 class="text-xl font-bold text-slate-900 leading-tight">
                            {{ patient.last_name.toUpperCase() }} <br/> {{ patient.first_name }}
                        </h2>
                        <p class="text-sm text-slate-400 font-mono mt-2 italic">#PAT-{{ patient.id }}</p>
                    </div>

                    <div class="bg-indigo-600 p-6 rounded-3xl text-white shadow-lg shadow-indigo-100">
                        <p class="text-indigo-100 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Assignation</p>
                        <div class="space-y-4">
                            <div class="flex items-center gap-3">
                                <div class="p-2 bg-indigo-500/50 rounded-lg">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke-width="2"/></svg>
                                </div>
                                <div>
                                    <p class="text-xs text-indigo-200 font-medium">Médecin référent</p>
                                    <p class="font-bold">Dr. {{ patient.assigned_doctor_id || 'Non assigné' }}</p>
                                </div>
                            </div>
                            <div class="flex items-center gap-3">
                                <div class="p-2 bg-indigo-500/50 rounded-lg">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" stroke-width="2"/></svg>
                                </div>
                                <div>
                                    <p class="text-xs text-indigo-200 font-medium">Localisation</p>
                                    <p class="font-bold">Chambre {{ patient.assigned_room_id || 'En attente' }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="md:col-span-2 space-y-6">
                    <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                        <div class="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                            <h3 class="text-xs font-black text-slate-400 uppercase tracking-widest">Coordonnées & État Civil</h3>
                            <svg class="w-4 h-4 text-slate-300" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/></svg>
                        </div>
                        <div class="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div class="space-y-1">
                                <label class="text-[10px] font-black text-indigo-400 uppercase tracking-wider">Email</label>
                                <p class="text-slate-700 font-semibold">{{ patient.email || '—' }}</p>
                            </div>
                            <div class="space-y-1">
                                <label class="text-[10px] font-black text-indigo-400 uppercase tracking-wider">Téléphone</label>
                                <p class="text-slate-700 font-semibold">{{ patient.phone || '—' }}</p>
                            </div>
                            <div class="space-y-1">
                                <label class="text-[10px] font-black text-indigo-400 uppercase tracking-wider">Date de naissance</label>
                                <p class="text-slate-700 font-semibold">{{ patient.date_of_birth || 'Non renseignée' }}</p>
                            </div>
                            <div class="space-y-1">
                                <label class="text-[10px] font-black text-indigo-400 uppercase tracking-wider">Adresse résidentielle</label>
                                <p class="text-slate-700 font-semibold leading-snug">{{ patient.address || 'Non renseignée' }}</p>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                        <div class="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                            <h3 class="text-xs font-black text-slate-400 uppercase tracking-widest">Historique du dossier</h3>
                        </div>
                        <div class="p-6 flex flex-col sm:flex-row gap-6 justify-between">
                            <div class="flex items-center gap-4">
                                <div class="w-1.5 h-10 bg-emerald-400 rounded-full"></div>
                                <div>
                                    <p class="text-[10px] font-black text-slate-400 uppercase">Créé le</p>
                                    <p class="text-sm font-bold text-slate-700">{{ formatDate(patient.created_at) }}</p>
                                </div>
                            </div>
                            <div class="flex items-center gap-4">
                                <div class="w-1.5 h-10 bg-amber-400 rounded-full"></div>
                                <div>
                                    <p class="text-[10px] font-black text-slate-400 uppercase">Dernière modification</p>
                                    <p class="text-sm font-bold text-slate-700">{{ formatDate(patient.updated_at) }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="flex gap-4 pt-4">
                        <button v-if="canEdit" @click="openEdit" class="px-6 py-3 bg-amber-50 text-amber-700 font-bold rounded-2xl hover:bg-amber-100 transition-all">Modifier le dossier</button>
                        <button @click="goBack" class="flex-1 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all shadow-sm">
                            Fermer le dossier
                        </button>
                    </div>
                </div>
            </div>

            <div v-else class="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-slate-200 shadow-sm animate-pulse">
                <div class="w-16 h-16 bg-slate-100 rounded-2xl mb-4"></div>
                <p class="text-slate-400 font-bold tracking-widest uppercase text-xs">Récupération des données cliniques...</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .animate-in {
        animation: fadeIn 0.5s ease-out;
    }
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
</style>