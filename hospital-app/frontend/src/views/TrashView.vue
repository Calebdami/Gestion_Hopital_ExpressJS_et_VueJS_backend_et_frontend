<script setup>
    import { ref } from 'vue'
    import { useNotificationStore } from '../stores/notificationStore.js'
    import { useConfirmation } from '../composables/useConfirmation.js'

    const notificationStore = useNotificationStore()

    // Simulation de données pour la démo si vide (à connecter à votre API plus tard)
    const trashItems = ref([])

    const { showConfirmModal, confirmMessage, confirm, handleConfirm, handleCancel } = useConfirmation()

    const permanentlyDelete = (item) => {
        confirm('Attention : Cette action est irréversible. Les données seront définitivement effacées du serveur.', () => {
            const index = trashItems.value.findIndex(t => t.id === item.id)
            if (index > -1) {
                trashItems.value.splice(index, 1)
                notificationStore.success('Élément purgé avec succès')
            }
        })
    }

    const getTypeLabel = (type) => {
        const types = {
            'patient': 'Fiche Patient',
            'appointment': 'Rendez-vous',
            'room': 'Chambre',
            'user': 'Utilisateur'
        }
        return types[type?.toLowerCase()] || type
    }
</script>

<template>
    <div class="p-6 bg-slate-50 min-h-screen">
        <div class="max-w-6xl mx-auto mb-8 flex items-center justify-between">
            <div>
                <h1 class="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                    <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    Corbeille Système
                </h1>
                <p class="text-slate-500 font-medium mt-1">Gérez les éléments supprimés et libérez de l'espace disque.</p>
            </div>
            
            <button v-if="trashItems.length > 0" class="px-4 py-2 bg-red-50 text-red-600 text-xs font-black uppercase tracking-widest rounded-xl border border-red-100 hover:bg-red-100 transition-all">
                Vider la corbeille
            </button>
        </div>

        <div class="max-w-6xl mx-auto">
            <div v-if="trashItems.length > 0" class="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-slate-50 border-b border-slate-200">
                            <th class="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nature de l'objet</th>
                            <th class="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Référence ID</th>
                            <th class="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date de suppression</th>
                            <th class="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        <tr v-for="item in trashItems" :key="item.id" class="hover:bg-red-50/30 transition-colors group">
                            <td class="px-8 py-5">
                                <span class="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold border border-slate-200 uppercase">
                                    {{ getTypeLabel(item.item_type) }}
                                </span>
                            </td>
                            <td class="px-8 py-5 font-mono text-sm text-slate-400">#{{ item.item_id }}</td>
                            <td class="px-8 py-5 text-sm text-slate-600 font-medium">
                                {{ new Date(item.deleted_at).toLocaleString() }}
                            </td>
                            <td class="px-8 py-5 text-right">
                                <div class="flex justify-end gap-2">
                                    <button class="p-2 text-slate-400 hover:text-indigo-600 transition-colors" title="Restaurer">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                                    </button>
                                    <button @click="permanentlyDelete(item)" class="p-2 text-slate-400 hover:text-red-600 transition-colors" title="Supprimer définitivement">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2"/></svg>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div v-else class="bg-white p-20 rounded-3xl border-2 border-dashed border-slate-200 text-center">
                <div class="w-20 h-20 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </div>
                <h3 class="text-xl font-bold text-slate-900 mb-2">Votre corbeille est vide</h3>
                <p class="text-slate-400 max-w-sm mx-auto text-sm">Il n'y a aucun élément en attente de suppression définitive pour le moment.</p>
            </div>
        </div>

        <div v-if="showConfirmModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div class="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in duration-200 border border-red-100">
                <div class="p-8 text-center">
                    <div class="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </div>
                    <h2 class="text-2xl font-black text-slate-900 mb-4 text-balance">Action Irréversible</h2>
                    <p class="text-slate-500 text-sm leading-relaxed mb-8">
                        {{ confirmMessage }}
                    </p>
                    <div class="flex gap-4">
                        <button @click="handleCancel" class="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-black rounded-2xl transition-all">
                            ANNULER
                        </button>
                        <button @click="handleConfirm" class="flex-1 py-4 bg-red-600 hover:bg-red-700 text-white font-black rounded-2xl shadow-lg shadow-red-200 transition-all active:scale-95">
                            PURGER
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.animate-in {
    animation: zoomIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes zoomIn {
    from { opacity: 0; transform: scale(0.95) translateY(10px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
}
</style>