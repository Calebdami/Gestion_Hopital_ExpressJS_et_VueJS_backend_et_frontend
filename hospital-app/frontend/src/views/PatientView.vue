<script setup>
    import { ref, computed, onMounted } from 'vue'
    import { useRouter } from 'vue-router'
    import { useDataStore } from '../stores/dataStore.js'
    import { useNotificationStore } from '../stores/notificationStore.js'
    import { patientService } from '../services/api.js'
    import { useConfirmation } from '../composables/useConfirmation.js'

    const router = useRouter()
    const dataStore = useDataStore()
    const notificationStore = useNotificationStore()

    const searchQuery = ref('')
    const selectedFilter = ref('')
    const showAddForm = ref(false)
    const editingPatient = ref(null)

    const form = ref({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        date_of_birth: '',
        address: '',
        assigned_doctor_id: '',
        birth_name: '',
        used_name: '',
        given_names: '',
        sex: '',
        nir: '',
        insurance: { name: '', member_number: '' },
        third_party_payer: false,
        emergency_contact: { name: '', phone: '' },
        treating_physician: '',
        blood_group: '',
        allergies_str: '',
        major_history_str: '',
        current_treatments_str: '',
        weight_kg: null,
        height_cm: null,
        vaccination_status: '',
        payment_method: '',
        rgpd_consent: false,
        assigned_room_id: '',
        status: ''
    })

    const filteredPatients = computed(() => {
        let filtered = dataStore.patients
        if (searchQuery.value) {
            filtered = filtered.filter(p =>
                p.first_name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                p.last_name.toLowerCase().includes(searchQuery.value.toLowerCase())
            )
        }
        if (selectedFilter.value) {
            filtered = filtered.filter(p => p.status === selectedFilter.value)
        }
        return filtered
    })

    onMounted(async () => {
        try {
            await dataStore.fetchDoctors()
            await dataStore.fetchRooms()
            await dataStore.fetchPatients()
        } catch (err) {
            console.error('Error loading patients/doctors:', err)
        }
    })

    const viewDetails = (patient) => {
        router.push(`/patients/${patient.id}`)
    }

    const editPatient = (patient) => {
        editingPatient.value = patient
        // populate form and convert arrays to comma-separated strings
        form.value = {
            ...patient,
            insurance: patient.insurance || { name: '', member_number: '' },
            emergency_contact: patient.emergency_contact || { name: '', phone: '' },
            allergies_str: Array.isArray(patient.allergies) ? patient.allergies.join(', ') : '',
            major_history_str: Array.isArray(patient.major_history) ? patient.major_history.join(', ') : '',
            current_treatments_str: Array.isArray(patient.current_treatments) ? patient.current_treatments.join(', ') : ''
        }
        showAddForm.value = true
    }

    const { showConfirmModal, confirmMessage, confirm, handleConfirm, handleCancel } = useConfirmation()

    const deletePatient = (patient) => {
    confirm(`Êtes-vous sûr de vouloir supprimer le patient ${patient.first_name} ${patient.last_name} ?`, async () => {
        try {
            await patientService.delete(patient.id)
            notificationStore.success('Patient supprimé avec succès')
            await dataStore.fetchPatients()
        } catch (err) {
            notificationStore.error('Erreur lors de la suppression')
        }
    })
    }

    const savePatient = async () => {
        try {
            // prepare payload: convert comma-separated strings into arrays
            const payload = { ...form.value }
            payload.allergies = (payload.allergies_str || '').split(',').map(s => s.trim()).filter(Boolean)
            payload.major_history = (payload.major_history_str || '').split(',').map(s => s.trim()).filter(Boolean)
            payload.current_treatments = (payload.current_treatments_str || '').split(',').map(s => s.trim()).filter(Boolean)
            // ensure numeric ids when possible
            if (payload.assigned_doctor_id === '') payload.assigned_doctor_id = null
            if (payload.assigned_room_id === '') payload.assigned_room_id = null

            if (editingPatient.value) {
                await patientService.update(editingPatient.value.id, payload)
                notificationStore.success('Patient modifié avec succès')
            } else {
                await patientService.create(payload)
                notificationStore.success('Patient créé avec succès')
            }
            closeForm()
                await dataStore.fetchPatients()
        } catch (err) {
            notificationStore.error('Erreur lors de l\'enregistrement')
        }
    }

    const closeForm = () => {
        showAddForm.value = false
        editingPatient.value = null
        form.value = {
            first_name: '',
            last_name: '',
            email: '',
            phone: '',
            date_of_birth: '',
            address: '',
            assigned_doctor_id: '',
            birth_name: '',
            used_name: '',
            given_names: '',
            sex: '',
            nir: '',
            insurance: { name: '', member_number: '' },
            third_party_payer: false,
            emergency_contact: { name: '', phone: '' },
            treating_physician: '',
            blood_group: '',
            allergies_str: '',
            major_history_str: '',
            current_treatments_str: '',
            weight_kg: null,
            height_cm: null,
            vaccination_status: '',
            payment_method: '',
            rgpd_consent: false,
            assigned_room_id: '',
            status: ''
        }
    }
</script>

<template>
    <div class="p-6 bg-slate-50 min-h-screen">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
                <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">Gestion des Patients</h1>
                <p class="text-slate-500 font-medium">Consultez et gérez les dossiers médicaux de l'établissement.</p>
            </div>
            <button @click="showAddForm = true" 
                class="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-95">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4.5v15m7.5-7.5h-15" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                Ajouter Patient
            </button>
        </div>

        <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 mb-6">
            <div class="flex-1 relative">
                <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </span>
                <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="Chercher par nom ou prénom..."
                    class="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none text-sm"
                />
            </div>
            <select v-model="selectedFilter" class="bg-slate-50 border border-slate-200 text-slate-600 text-sm rounded-xl focus:ring-2 focus:ring-indigo-500 block p-2.5 outline-none font-medium">
                <option value="">Tous les statuts</option>
                <option value="active">Actif</option>
                <option value="treated">Traité</option>
                <option value="discharged">Sorti</option>
            </select>
        </div>

        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-slate-50 border-b border-slate-200">
                            <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">ID</th>
                            <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Identité</th>
                            <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Contact</th>
                            <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Docteur</th>
                            <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Statut</th>
                            <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        <tr v-for="patient in filteredPatients" :key="patient.id" class="hover:bg-indigo-50/30 transition-colors">
                            <td class="px-6 py-4 text-sm font-mono text-slate-400">#{{ patient.id }}</td>
                            <td class="px-6 py-4">
                                <div class="font-bold text-slate-900">{{ patient.last_name }}</div>
                                <div class="text-sm text-slate-500">{{ patient.first_name }}</div>
                            </td>
                            <td class="px-6 py-4">
                                <div class="text-sm text-slate-700 font-medium">{{ patient.email }}</div>
                                <div class="text-xs text-slate-400">{{ patient.phone }}</div>
                            </td>
                            <td class="px-6 py-4">
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-50 text-blue-700">
                                    Dr. {{ patient.assigned_doctor_id || 'N/A' }}
                                </span>
                            </td>
                            <td class="px-6 py-4">
                                <span :class="{
                                    'bg-emerald-100 text-emerald-700': patient.status === 'active',
                                    'bg-blue-100 text-blue-700': patient.status === 'treated',
                                    'bg-slate-100 text-slate-600': patient.status === 'discharged',
                                    'bg-gray-100 text-gray-500': !patient.status
                                }" class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                                    {{ patient.status || 'Inconnu' }}
                                </span>
                            </td>
                            <td class="px-6 py-4 text-right space-x-2">
                                <button @click="viewDetails(patient)" class="inline-flex items-center p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors shadow-sm bg-indigo-50" title="Détails">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke-width="2"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke-width="2"/></svg>
                                </button>
                                <button @click="editPatient(patient)" class="inline-flex items-center p-2 text-amber-600 hover:bg-amber-100 rounded-lg transition-colors shadow-sm bg-amber-50" title="Modifier">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" stroke-width="2"/></svg>
                                </button>
                                <button @click="deletePatient(patient)" class="inline-flex items-center p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors shadow-sm bg-red-50" title="Supprimer">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke-width="2"/></svg>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div v-if="showAddForm" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity">
            <div class="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden transform transition-all scale-100 animate-in zoom-in duration-200">
                
                <div class="sticky top-0 z-10 px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white">
                    <h2 class="text-2xl font-black text-slate-800 tracking-tight">
                        {{ editingPatient ? 'Modifier Patient' : 'Ajouter un nouveau Patient' }}
                    </h2>
                    <button @click="closeForm" class="text-slate-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-full transition-all">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke-width="2.5" stroke-linecap="round"/></svg>
                    </button>
                </div>

                <div class="overflow-y-auto p-8 custom-scrollbar">
                    <form @submit.prevent="savePatient" class="space-y-6">
                        <div class="grid grid-cols-2 gap-4">
                            <input v-model="form.first_name" type="text" placeholder="Prénom" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all" required />
                            <input v-model="form.last_name" type="text" placeholder="Nom" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all" required />
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <input v-model="form.given_names" type="text" placeholder="Prénoms complets" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all" />
                            <input v-model="form.birth_name" type="text" placeholder="Nom de naissance" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all" />
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <input v-model="form.used_name" type="text" placeholder="Nom d'usage" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all" />
                            <select v-model="form.sex" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all">
                                <option value="">Sexe</option>
                                <option value="male">Homme</option>
                                <option value="female">Femme</option>
                                <option value="other">Autre</option>
                            </select>
                        </div>

                        <div class="grid grid-cols-2 gap-4">
                            <input v-model="form.email" type="email" placeholder="Email" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all" />
                            <input v-model="form.phone" type="text" placeholder="Téléphone" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all" />
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div class="space-y-1">
                                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date de naissance</label>
                                <input v-model="form.date_of_birth" type="date" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all" />
                            </div>
                            <div class="space-y-1">
                                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">NIR (Sécurité Sociale)</label>
                                <input v-model="form.nir" type="text" placeholder="NIR" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all" />
                            </div>
                        </div>
                        <input v-model="form.address" type="text" placeholder="Adresse" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all" />

                        <div class="grid grid-cols-2 gap-4">
                            <input v-model="form.insurance.name" type="text" placeholder="Assurance (nom)" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all" />
                            <input v-model="form.insurance.member_number" type="text" placeholder="N° membre assurance" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all" />
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <input v-model="form.emergency_contact.name" type="text" placeholder="Contact urgence - nom" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all" />
                            <input v-model="form.emergency_contact.phone" type="text" placeholder="Contact urgence - téléphone" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all" />
                        </div>

                        <div class="grid grid-cols-2 gap-4">
                            <input v-model="form.treating_physician" type="text" placeholder="Médecin traitant" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all" />
                            <input v-model="form.blood_group" type="text" placeholder="Groupe sanguin" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all" />
                        </div>
                        
                        <div class="space-y-2">
                            <label class="text-sm font-bold text-slate-600">Allergies (séparées par une virgule)</label>
                            <textarea v-model="form.allergies_str" rows="2" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"></textarea>
                        </div>
                        <div class="space-y-2">
                            <label class="text-sm font-bold text-slate-600">Antécédents majeurs</label>
                            <textarea v-model="form.major_history_str" rows="2" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"></textarea>
                        </div>
                        <div class="space-y-2">
                            <label class="text-sm font-bold text-slate-600">Traitements en cours</label>
                            <textarea v-model="form.current_treatments_str" rows="2" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"></textarea>
                        </div>

                        <div class="grid grid-cols-2 gap-4">
                            <input v-model.number="form.weight_kg" type="number" step="0.1" placeholder="Poids (kg)" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all" />
                            <input v-model.number="form.height_cm" type="number" step="0.1" placeholder="Taille (cm)" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all" />
                        </div>

                        <div class="space-y-4 pt-4 border-t border-slate-100">
                             <select v-model="form.assigned_doctor_id" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-700">
                                <option value="">Sélectionner un docteur</option>
                                <option v-for="d in dataStore.doctors" :key="d.id" :value="d.id">Dr. {{ d.first_name }} {{ d.last_name }}</option>
                            </select>
                            <select v-model="form.assigned_room_id" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-700">
                                <option value="">Aucune chambre assignée</option>
                                <option v-for="r in dataStore.rooms" :key="r.id" :value="r.id">{{ r.name || ('Chambre ' + r.id) }}</option>
                            </select>
                            <select v-model="form.status" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-700">
                                <option value="">Statut</option>
                                <option value="active">Actif</option>
                                <option value="treated">Traité</option>
                                <option value="discharged">Sorti</option>
                            </select>
                        </div>

                        <div class="flex items-center gap-6 p-4 bg-slate-50 rounded-2xl">
                            <label class="inline-flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" v-model="form.third_party_payer" class="w-5 h-5 accent-indigo-600" />
                                <span class="text-sm font-bold text-slate-700">Tiers payant</span>
                            </label>
                            <label class="inline-flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" v-model="form.rgpd_consent" class="w-5 h-5 accent-indigo-600" />
                                <span class="text-sm font-bold text-slate-700">Consentement RGPD</span>
                            </label>
                        </div>

                        <div class="pt-6 flex gap-4">
                            <button type="button" @click="closeForm" class="flex-1 px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-black rounded-2xl transition-all uppercase tracking-widest text-xs">
                                Annuler
                            </button>
                            <button type="submit" class="flex-[2] px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 transition-all active:scale-95 uppercase tracking-widest text-xs">
                                {{ editingPatient ? 'Mettre à Jour' : 'Ajouter le Patient' }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <div v-if="showConfirmModal" class="fixed inset-0 z-[999] flex justify-center items-start pt-10 px-4 bg-slate-900/40 backdrop-blur-sm transition-all overflow-y-auto">
            <div class="bg-white rounded-3xl shadow-2xl max-w-md w-full border border-red-100 animate-in slide-in-from-top duration-300 overflow-hidden">
                <div class="p-8">
                    <div class="flex items-center gap-4 mb-4 text-red-600">
                        <div class="p-3 bg-red-50 rounded-2xl">
                            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        </div>
                        <h2 class="text-xl font-black">Confirmation</h2>
                    </div>
                    <p class="text-slate-600 mb-8 font-medium leading-relaxed">{{ confirmMessage }}</p>
                    <div class="flex gap-3">
                        <button @click="handleCancel" class="flex-1 px-5 py-3 text-slate-500 hover:bg-slate-100 font-bold rounded-xl transition-all">Annuler</button>
                        <button @click="handleConfirm" class="flex-[2] px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-200 transition-all active:scale-95">Supprimer</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    /* Animation d'entrée */
    .animate-in {
        animation: modalIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    
    @keyframes modalIn {
        from { opacity: 0; transform: scale(0.95) translateY(10px); }
        to { opacity: 1; transform: scale(1) translateY(0); }
    }

    /* Scrollbar personnalisée pour la modal */
    .custom-scrollbar::-webkit-scrollbar {
        width: 8px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
        background: #f8fafc;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #e2e8f0;
        border-radius: 20px;
        border: 2px solid #f8fafc;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #cbd5e1;
    }
</style>