<script setup>
    import { ref, onMounted } from 'vue'
    import { useNotificationStore } from '../stores/notificationStore.js'
    import { userService } from '../services/api.js'
    import { useConfirmation } from '../composables/useConfirmation.js'

    const notificationStore = useNotificationStore()
    const collaborators = ref([])

    onMounted(async () => {
        try {
            const res = await userService.getAll()
            collaborators.value = res.data || res
        } catch (err) {
            console.error('Erreur récupération utilisateurs', err)
        }
    })

    const viewDetails = (user) => {
        // Remplacement de window.location par le router pour une SPA fluide
        window.location.href = `/users/${user.id}`
    }

    const { showConfirmModal, confirmMessage, confirm, handleConfirm, handleCancel } = useConfirmation()

    const deleteUser = (user) => {
        confirm(`Voulez-vous vraiment révoquer les accès de ${user.username} ?`, async () => {
            try {
                await userService.delete(user.id)
                notificationStore.success('Collaborateur retiré avec succès')
                const res = await userService.getAll()
                collaborators.value = res.data || res
            } catch (err) {
                notificationStore.error('Erreur lors de la suppression')
            }
        })
    }

    // Helper pour le style des badges de rôles
    const getRoleStyle = (role) => {
        const roles = {
            admin: 'bg-purple-100 text-purple-700 border-purple-200',
            doctor: 'bg-blue-100 text-blue-700 border-blue-200',
            receptionist: 'bg-amber-100 text-amber-700 border-amber-200'
        }
        return roles[role.toLowerCase()] || 'bg-slate-100 text-slate-700 border-slate-200'
    }
</script>

<template>
    <div class="p-6 bg-slate-50 min-h-screen">
        <div class="max-w-6xl mx-auto mb-10">
            <h1 class="text-3xl font-black text-slate-900 tracking-tight">Annuaire des Collaborateurs</h1>
            <p class="text-slate-500 font-medium">Liste des comptes actifs et gestion des accès système.</p>
        </div>

        <div class="max-w-6xl mx-auto">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div v-for="user in collaborators" :key="user.id" 
                    class="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all group">
                    
                    <div class="flex items-center gap-4 mb-6">
                        <div class="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke-width="2"/></svg>
                        </div>
                        <div class="overflow-hidden">
                            <h3 class="font-black text-slate-900 truncate">{{ user.username }}</h3>
                            <span :class="['px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider border', getRoleStyle(user.role)]">
                                {{ user.role }}
                            </span>
                        </div>
                    </div>

                    <div class="flex gap-2">
                        <button @click="viewDetails(user)" 
                            class="flex-1 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold text-xs rounded-xl transition-all border border-slate-200">
                            Fiche Profil
                        </button>
                        <button v-if="user.id !== 1" @click="deleteUser(user)" 
                            class="px-4 py-2.5 bg-white hover:bg-red-50 text-red-400 hover:text-red-600 rounded-xl transition-all border border-transparent hover:border-red-100">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke-width="2"/></svg>
                        </button>
                    </div>
                </div>
            </div>

            <div v-if="collaborators.length === 0" class="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                <p class="text-slate-400 font-bold uppercase tracking-widest text-xs">Aucun collaborateur trouvé</p>
            </div>
        </div>

        <div v-if="showConfirmModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div class="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center animate-in zoom-in duration-200">
                <div class="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </div>
                <h3 class="text-xl font-black text-slate-900 mb-2">Confirmation</h3>
                <p class="text-slate-500 text-sm mb-8">{{ confirmMessage }}</p>
                <div class="flex gap-3">
                    <button @click="handleCancel" class="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-all">
                        Annuler
                    </button>
                    <button @click="handleConfirm" class="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-200 transition-all">
                        Supprimer
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.animate-in {
    animation: zoomIn 0.2s ease-out;
}
@keyframes zoomIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
}
</style>