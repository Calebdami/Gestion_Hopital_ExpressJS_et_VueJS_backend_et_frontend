<script setup>
    import { ref } from 'vue'
    import { useNotificationStore } from '../stores/notificationStore.js'
    import { authService } from '../services/api.js'

    const notificationStore = useNotificationStore()
    const showAddForm = ref(false)

    const form = ref({
        username: '',
        password: '',
        role: '',
        first_name: '',
        last_name: '',
        gender: '',
        phone: '',
        recovery_question: '',
        profile_photo: '',
        status: 'active',
        specialization: '',
        rpps: '',
        availability: '',
        location: '',
        signature_image: '',
        assignment: '',
        languages: '',
        skills: '',
        shift: '',
        department: ''
    })

    const createAccount = async () => {
        try {
            const payload = { ...form.value }
            if (payload.role === 'doctor') {
                payload.doctorProfile = {
                    first_name: payload.first_name,
                    last_name: payload.last_name,
                    gender: payload.gender,
                    specialization: payload.specialization,
                    rpps: payload.rpps,
                    availability: payload.availability ? payload.availability.split(';') : [],
                    location: payload.location,
                    signature_image: payload.signature_image,
                    profile_photo: payload.profile_photo,
                    status: payload.status,
                    phone: payload.phone,
                    email: payload.username
                }
            }

            await authService.createUser(payload)
            notificationStore.success('Compte créé avec succès')
            closeForm()
        } catch (err) {
            console.error(err)
            notificationStore.error('Erreur lors de la création du compte')
        }
    }

    const initialState = {
        username: '', password: '', role: '', first_name: '', last_name: '',
        gender: '', phone: '', recovery_question: '', profile_photo: '',
        status: 'active', specialization: '', rpps: '', availability: '',
        location: '', signature_image: '', assignment: '', languages: '',
        skills: '', shift: '', department: ''
    }

    const closeForm = () => {
        showAddForm.value = false
        form.value = { ...initialState }
    }
</script>

<template>
    <div class="p-6 bg-slate-50 min-h-screen">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 max-w-5xl mx-auto">
            <div>
                <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">Sécurité & Utilisateurs</h1>
                <p class="text-slate-500 font-medium">Gérez les accès et les permissions du personnel médical.</p>
            </div>
            <button @click="showAddForm = true" 
                class="inline-flex items-center justify-center px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-xl shadow-slate-200 transition-all active:scale-95">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                Créer un compte
            </button>
        </div>

        <div class="max-w-5xl mx-auto">
            <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-6">
                <div class="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke-width="2"/></svg>
                </div>
                <div>
                    <h3 class="text-lg font-bold text-slate-800">Système d'authentification actif</h3>
                    <p class="text-slate-500 text-sm">Tous les comptes créés sont immédiatement opérationnels.</p>
                </div>
            </div>
        </div>

        <div v-if="showAddForm" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all">
            <div class="bg-white rounded-[2.5rem] shadow-2xl flex flex-col w-full max-w-4xl max-h-[90vh] overflow-hidden animate-in">
                
                <div class="sticky top-0 z-10 px-8 py-6 bg-white border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h2 class="text-2xl font-black text-slate-900 tracking-tight">Nouvel Utilisateur</h2>
                        <p class="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Configuration des accès système</p>
                    </div>
                    <button @click="closeForm" class="p-3 bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all font-bold">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke-width="2.5" stroke-linecap="round"/></svg>
                    </button>
                </div>

                <div class="overflow-y-auto p-8 custom-scrollbar">
                    <form @submit.prevent="createAccount" class="space-y-10">
                        
                        <div class="space-y-6">
                            <div class="flex items-center gap-3 mb-2">
                                <span class="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-xs font-black">01</span>
                                <h3 class="font-black text-slate-900 uppercase text-xs tracking-widest">Identifiants de connexion</h3>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div class="space-y-2">
                                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Rôle Système</label>
                                    <select v-model="form.role" class="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-slate-900/5 focus:bg-white outline-none transition-all font-bold text-slate-700" required>
                                        <option value="">Sélectionner un rôle</option>
                                        <option value="admin">Administrateur</option>
                                        <option value="doctor">Docteur</option>
                                        <option value="receptionist">Réceptionniste</option>
                                    </select>
                                </div>
                                <div class="space-y-2">
                                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nom d'utilisateur</label>
                                    <input v-model="form.username" type="text" placeholder="ex: j.dupont" class="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-slate-900/5 focus:bg-white outline-none transition-all font-bold" required />
                                </div>
                                <div class="space-y-2">
                                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mot de passe</label>
                                    <input v-model="form.password" type="password" placeholder="••••••••" class="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-slate-900/5 focus:bg-white outline-none transition-all font-bold" required />
                                </div>
                            </div>
                        </div>

                        <div class="space-y-6 pt-6 border-t border-slate-50">
                            <div class="flex items-center gap-3 mb-2">
                                <span class="w-8 h-8 rounded-lg bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-black">02</span>
                                <h3 class="font-black text-slate-900 uppercase text-xs tracking-widest">Informations Personnelles</h3>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div class="space-y-2">
                                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Prénom</label>
                                    <input v-model="form.first_name" type="text" class="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl" />
                                </div>
                                <div class="space-y-2">
                                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nom</label>
                                    <input v-model="form.last_name" type="text" class="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl" />
                                </div>
                                <div class="space-y-2">
                                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Genre</label>
                                    <select v-model="form.gender" class="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
                                        <option value="">--</option>
                                        <option value="female">Femme</option>
                                        <option value="male">Homme</option>
                                    </select>
                                </div>
                                <div class="space-y-2">
                                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Téléphone</label>
                                    <input v-model="form.phone" type="text" class="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl" />
                                </div>
                            </div>
                        </div>

                        <div v-if="form.role" class="space-y-6 pt-6 border-t border-slate-50 animate-in">
                            <div class="flex items-center gap-3 mb-2">
                                <span class="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-black">03</span>
                                <h3 class="font-black text-slate-900 uppercase text-xs tracking-widest">Détails du profil {{ form.role }}</h3>
                            </div>

                            <div v-if="form.role === 'doctor'" class="grid grid-cols-1 md:grid-cols-2 gap-6 bg-blue-50/30 p-6 rounded-3xl border border-blue-100">
                                <input v-model="form.specialization" placeholder="Spécialisation (ex: Cardiologie)" class="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-2xl font-bold" />
                                <input v-model="form.rpps" placeholder="Numéro RPPS" class="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-2xl font-bold" />
                                <input v-model="form.availability" placeholder="Disponibilités (Lundi 8h-12h; ...)" class="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-2xl font-bold" />
                                <input v-model="form.location" placeholder="Cabinet / Service" class="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-2xl font-bold" />
                            </div>

                            <div v-if="form.role === 'receptionist'" class="grid grid-cols-1 md:grid-cols-2 gap-6 bg-emerald-50/30 p-6 rounded-3xl border border-emerald-100">
                                <input v-model="form.assignment" placeholder="Affectation Accueil" class="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-2xl font-bold" />
                                <input v-model="form.languages" placeholder="Langues parlées" class="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-2xl font-bold" />
                                <select v-model="form.shift" class="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-2xl font-bold">
                                    <option value="">Sélectionner un shift</option>
                                    <option value="morning">Matin</option>
                                    <option value="afternoon">Après-midi</option>
                                    <option value="night">Nuit</option>
                                </select>
                            </div>

                            <div v-if="form.role === 'admin'" class="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-100/50 p-6 rounded-3xl border border-slate-200">
                                <input v-model="form.department" placeholder="Département (RH, Direction, IT)" class="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-2xl font-bold" />
                            </div>
                        </div>

                        <div class="pt-10">
                            <button type="submit" class="w-full py-5 bg-slate-900 hover:bg-black text-white font-black rounded-[2rem] shadow-2xl shadow-slate-300 transition-all active:scale-[0.98] uppercase tracking-widest text-sm">
                                Finaliser la création du compte
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .animate-in {
        animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    
    @keyframes slideIn {
        from { opacity: 0; transform: translateY(20px) scale(0.98); }
        to { opacity: 1; transform: translateY(0) scale(1); }
    }

    /* Personnalisation du scroll interne */
    .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #e2e8f0;
        border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #cbd5e1;
    }
</style>