<script setup>
    import { ref, onMounted } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import { userService, doctorService } from '../services/api.js'
    import { formatDate } from '../utils/helpers.js'
    import { useNotificationStore } from '../stores/notificationStore.js'
    import { useConfirmation } from '../composables/useConfirmation.js'

    const route = useRoute()
    const router = useRouter()
    const notificationStore = useNotificationStore()
    const { confirm } = useConfirmation()

    const user = ref(null)
    const profile = ref(null)
    const isLoading = ref(true)

    onMounted(async () => {
        const id = route.params.id
        try {
            const res = await userService.getById(id)
            user.value = res.data
            if (user.value.role === 'doctor') {
                const p = await doctorService.getById(id)
                profile.value = p.data || p
            }
        } catch (err) {
            notificationStore.error("Erreur lors de la récupération des détails")
        } finally {
            isLoading.value = false
        }
    })

    const goBack = () => router.back()
    const editUser = () => router.push(`/users/${user.value.id}/edit`)

    const removeUser = () => {
        confirm('Voulez-vous vraiment supprimer cet utilisateur ? Cette action est irréversible.', async () => {
            try {
                await userService.delete(user.value.id)
                notificationStore.success('Utilisateur supprimé avec succès')
                router.push('/accounts')
            } catch (err) {
                notificationStore.error('Erreur lors de la suppression')
            }
        })
    }
</script>

<template>
    <div class="max-w-5xl mx-auto space-y-6">
        <div class="flex items-center justify-between bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div class="flex items-center gap-5">
                <button @click="goBack" class="p-3 hover:bg-slate-50 rounded-2xl text-slate-400 hover:text-blue-600 transition-all border border-slate-100 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                </button>
                <div>
                    <h1 class="text-xl font-black text-slate-900 tracking-tight">Fiche Utilisateur</h1>
                    <p class="text-xs text-slate-500 font-bold uppercase tracking-widest mt-0.5">ID: #{{ $route.params.id }}</p>
                </div>
            </div>
            
            <div class="flex gap-3">
                <button @click="editUser" class="flex items-center gap-2 px-5 py-2.5 bg-blue-50 text-blue-600 font-bold rounded-xl hover:bg-blue-100 transition-all text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                    </svg>
                    Modifier
                </button>
                <button v-if="user && user.id !== 1" @click="removeUser" class="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-all text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                    Supprimer
                </button>
            </div>
        </div>

        <div v-if="user" class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="space-y-6">
                <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
                    <div class="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl shadow-lg shadow-blue-200 flex items-center justify-center text-white text-3xl font-black mb-4">
                        {{ user.username.substring(0, 2).toUpperCase() }}
                    </div>
                    <h2 class="text-xl font-bold text-slate-900">{{ user.username }}</h2>
                    <div :class="[
                        'mt-3 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.15em] border',
                        user.role === 'admin' ? 'bg-purple-50 text-purple-600 border-purple-100' : 
                        user.role === 'doctor' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                    ]">
                        {{ user.role }}
                    </div>
                </div>

                <div class="bg-slate-900 p-6 rounded-3xl text-white shadow-xl shadow-slate-200">
                    <h3 class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Activité du compte</h3>
                    <div class="space-y-4">
                        <div class="flex justify-between items-center">
                            <span class="text-xs text-slate-400">Créé le</span>
                            <span class="text-xs font-bold">{{ formatDate(user.created_at) }}</span>
                        </div>
                        <div class="h-px bg-slate-800"></div>
                        <div class="flex justify-between items-center">
                            <span class="text-xs text-slate-400">Dernière modif.</span>
                            <span class="text-xs font-bold">{{ formatDate(user.updated_at) }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="md:col-span-2 space-y-6">
                <div v-if="profile" class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                    <div class="bg-slate-50 px-8 py-4 border-b border-slate-200">
                        <h3 class="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                            <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                            Informations Professionnelles
                        </h3>
                    </div>
                    <div class="p-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div v-for="(val, key) in profile" :key="key" class="space-y-1">
                            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">{{ key.replace('_', ' ') }}</p>
                            <p class="text-slate-900 font-semibold">{{ val || '—' }}</p>
                        </div>
                    </div>
                </div>

                <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                    <h3 class="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">Paramètres Système</h3>
                    <div class="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div class="flex items-center gap-4">
                            <div class="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-emerald-500 shadow-sm">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke-width="2"/></svg>
                            </div>
                            <div>
                                <p class="text-sm font-bold text-slate-900">État du compte</p>
                                <p class="text-xs text-slate-500">Compte actif et vérifié</p>
                            </div>
                        </div>
                        <span class="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-lg">ACTIF</span>
                    </div>
                </div>
            </div>
        </div>

        <div v-else class="flex flex-col items-center justify-center p-20 bg-white rounded-3xl border border-slate-200 shadow-sm animate-pulse">
            <div class="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
            <p class="mt-4 text-slate-400 font-bold tracking-widest text-xs uppercase">Chargement des données...</p>
        </div>
    </div>
</template>

<style scoped>
    .animate-in {
        animation: fadeIn 0.4s ease-out forwards;
    }
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
</style>