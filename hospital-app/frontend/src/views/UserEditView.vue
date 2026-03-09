<script setup>
    import { ref, onMounted } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import { userService, doctorService } from '../services/api.js'
    import { useNotificationStore } from '../stores/notificationStore.js'

    const route = useRoute()
    const router = useRouter()
    const notificationStore = useNotificationStore()

    const user = ref(null)
    const form = ref({})
    const isLoading = ref(true)

    onMounted(async () => {
        const id = route.params.id
        try {
            const res = await userService.getById(id)
            user.value = res.data
            form.value = { username: user.value.username, role: user.value.role }
            
            if (user.value.role === 'doctor') {
                const p = await doctorService.getById(id)
                const profile = p.data || p
                form.value = { ...form.value, ...profile }
            }
        } catch (err) {
            notificationStore.error("Impossible de charger l'utilisateur")
            console.error(err)
        } finally {
            isLoading.value = false
        }
    })

    const goBack = () => router.back()

    const submit = async () => {
        try {
            // Update user basic info
            await userService.update(user.value.id, { 
                username: form.value.username, 
                role: form.value.role 
            })

            // If doctor, update doctor profile too
            if (form.value.role === 'doctor') {
                const payload = {
                    first_name: form.value.first_name,
                    last_name: form.value.last_name,
                    specialization: form.value.specialization,
                    email: form.value.email,
                    phone: form.value.phone
                }
                await doctorService.update(user.value.id, payload)
            }

            notificationStore.success('Modifications enregistrées avec succès')
            router.push(`/accounts`) // Redirection vers la liste des comptes
        } catch (err) {
            notificationStore.error('Erreur lors de la sauvegarde')
        }
    }
</script>

<template>
    <div class="max-w-4xl mx-auto space-y-6">
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
                <button @click="goBack" class="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-blue-600 transition-all border border-transparent hover:border-slate-200 shadow-sm group">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 group-hover:-translate-x-1 transition-transform">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                </button>
                <div>
                    <h1 class="text-2xl font-black text-slate-900 tracking-tight">Modifier le profil</h1>
                    <p class="text-sm text-slate-500 font-medium">Mise à jour des accès et informations système</p>
                </div>
            </div>
        </div>

        <div v-if="!isLoading && user" class="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div class="md:col-span-1 space-y-6">
                <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-center">
                    <div class="w-20 h-20 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-black border border-blue-100 uppercase">
                        {{ form.username?.substring(0, 2) }}
                    </div>
                    <h2 class="font-bold text-slate-900 uppercase tracking-wide">{{ form.username }}</h2>
                    <span class="inline-block px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-widest mt-2 border border-slate-200">
                        {{ form.role }}
                    </span>
                </div>
            </div>

            <div class="md:col-span-2">
                <form @submit.prevent="submit" class="space-y-6">
                    
                    <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
                        <h3 class="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke-width="2" stroke-linecap="round"/></svg>
                            Informations d'authentification
                        </h3>
                        
                        <div class="grid grid-cols-1 gap-4">
                            <div class="space-y-1.5">
                                <label class="text-xs font-bold text-slate-700 ml-1">Nom d'utilisateur</label>
                                <input v-model="form.username" required class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-medium text-slate-900" />
                            </div>

                            <div class="space-y-1.5">
                                <label class="text-xs font-bold text-slate-700 ml-1">Niveau d'accès (Rôle)</label>
                                <select v-model="form.role" required class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-medium text-slate-900 appearance-none">
                                    <option value="admin">Administrateur</option>
                                    <option value="doctor">Médecin / Docteur</option>
                                    <option value="receptionist">Réceptionniste</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div v-if="user.role === 'doctor'" class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 animate-in slide-in-from-top-4 duration-500">
                        <h3 class="text-sm font-black text-blue-500 uppercase tracking-widest flex items-center gap-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.628.283a2 2 0 01-1.186.127l-1.314-.328a2 2 0 00-1.668.277l-1.671 1.173a2 2 0 01-2.583-.277l-1.065-1.065a2 2 0 00-3.146 2.407l1.493 2.24c.08.12.19.22.31.3l2.48 1.657a8 8 0 007.307 0l2.48-1.657a1 1 0 01.554-.15h.027a2 2 0 001.538-.72l1.414-1.697a2 2 0 000-2.546l-1.414-1.697z" stroke-width="2"/></svg>
                            Détails du Profil Médical
                        </h3>
                        
                        <div class="grid grid-cols-2 gap-4">
                            <div class="space-y-1.5">
                                <label class="text-xs font-bold text-slate-700 ml-1">Prénom</label>
                                <input v-model="form.first_name" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 transition-all outline-none font-medium" placeholder="Ex: Jean" />
                            </div>
                            <div class="space-y-1.5">
                                <label class="text-xs font-bold text-slate-700 ml-1">Nom</label>
                                <input v-model="form.last_name" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 transition-all outline-none font-medium" placeholder="Ex: Dupont" />
                            </div>
                            <div class="col-span-2 space-y-1.5">
                                <label class="text-xs font-bold text-slate-700 ml-1">Spécialisation</label>
                                <input v-model="form.specialization" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 transition-all outline-none font-medium text-blue-600" placeholder="Ex: Cardiologue" />
                            </div>
                            <div class="space-y-1.5">
                                <label class="text-xs font-bold text-slate-700 ml-1">Email professionnel</label>
                                <input v-model="form.email" type="email" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 transition-all outline-none font-medium" placeholder="dr.dupont@clinique.fr" />
                            </div>
                            <div class="space-y-1.5">
                                <label class="text-xs font-bold text-slate-700 ml-1">Téléphone</label>
                                <input v-model="form.phone" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 transition-all outline-none font-medium" placeholder="01 23 45 67 89" />
                            </div>
                        </div>
                    </div>

                    <div class="flex items-center justify-end gap-3 pt-4">
                        <button type="button" @click="goBack" class="px-8 py-4 bg-white border border-slate-200 text-slate-600 font-black rounded-2xl hover:bg-slate-50 transition-all uppercase text-xs tracking-widest">
                            Annuler
                        </button>
                        <button type="submit" class="px-8 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 hover:bg-blue-700 hover:scale-[1.02] active:scale-95 transition-all uppercase text-xs tracking-widest">
                            Sauvegarder les changements
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <div v-else class="animate-pulse flex flex-col items-center justify-center p-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <div class="h-12 w-12 bg-slate-100 rounded-xl mb-4"></div>
            <div class="h-4 w-48 bg-slate-100 rounded-full"></div>
        </div>
    </div>
</template>

<style scoped>
    /* Pour supprimer la flèche par défaut du select sur certains navigateurs */
    select {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 1rem center;
        background-size: 1.25rem;
    }
</style>