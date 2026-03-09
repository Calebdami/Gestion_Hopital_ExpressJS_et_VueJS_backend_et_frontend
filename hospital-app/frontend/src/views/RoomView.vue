<script setup>
    import { ref, computed, onMounted } from 'vue'
    import { useRouter } from 'vue-router'
    import { useAuthStore } from '../stores/authStore.js'
    import { useDataStore } from '../stores/dataStore.js'
    import { useNotificationStore } from '../stores/notificationStore.js'
    import { roomService } from '../services/api.js'
    import { useConfirmation } from '../composables/useConfirmation.js'

    const router = useRouter()
    const authStore = useAuthStore()
    const dataStore = useDataStore()
    const notificationStore = useNotificationStore()

    const userRole = ref(authStore.user?.role || '')
    const showAddForm = ref(false)
    const editingRoom = ref(null)
    const searchQuery = ref('')
    const selectedFilter = ref('')

    const form = ref({
        name: '',
        total_capacity: ''
    })

    const viewDetails = (room) => {
        router.push(`/rooms/${room.id}`)
    }

    const editRoom = (room) => {
        editingRoom.value = room
        form.value = { ...room }
        showAddForm.value = true
    }

    const { showConfirmModal, confirmMessage, confirm, handleConfirm, handleCancel } = useConfirmation()

    const deleteRoom = (room) => {
        confirm(`Supprimer la chambre ${room.name} ?`, async () => {
            try {
                await roomService.delete(room.id)
                notificationStore.success('Chambre supprimée')
                await dataStore.fetchRooms()
            } catch (err) {
                notificationStore.error('Erreur lors de la suppression')
            }
        })
    }

    const saveRoom = async () => {
        try {
            if (editingRoom.value) {
                await roomService.update(editingRoom.value.id, form.value)
                notificationStore.success('Chambre modifiée')
            } else {
                await roomService.create(form.value)
                notificationStore.success('Chambre créée')
            }
            closeForm()
            await dataStore.fetchRooms()
        } catch (err) {
            notificationStore.error('Erreur lors de l\'enregistrement: verifier que le nom soit different des noms existants.')
        }
    }

    const closeForm = () => {
        showAddForm.value = false
        editingRoom.value = null
        form.value = { name: '', total_capacity: '' }
    }

    const filteredRooms = computed(() => {
        let list = dataStore.rooms || []
        if (searchQuery.value) {
            list = list.filter(r => (r.name || '').toLowerCase().includes(searchQuery.value.toLowerCase()))
        }
        if (selectedFilter.value === 'available') list = list.filter(r => (r.total_capacity - r.occupied_capacity) > 0)
        if (selectedFilter.value === 'full') list = list.filter(r => (r.total_capacity - r.occupied_capacity) <= 0)
        return list
    })

    // Helper pour calculer le pourcentage d'occupation
    const getOccupancyRate = (room) => {
        return Math.min(Math.round((room.occupied_capacity / room.total_capacity) * 100), 100)
    }

    onMounted(async () => {
        await dataStore.fetchRooms()
    })
</script>

<template>
    <div class="p-6 bg-slate-50 min-h-screen">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
                <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">Unités d'Hébergement</h1>
                <p class="text-slate-500 font-medium">Gestion des lits et disponibilités en temps réel.</p>
            </div>
            <button v-if="userRole === 'admin'" @click="showAddForm = true" 
                class="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 transition-all active:scale-95">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                Ajouter une Chambre
            </button>
        </div>

        <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 mb-6">
            <div class="flex-1 relative">
                <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </span>
                <input v-model="searchQuery" type="text" placeholder="Rechercher une chambre par son nom..." 
                    class="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none text-sm" />
            </div>
            <select v-model="selectedFilter" class="bg-slate-50 border border-slate-200 text-slate-600 text-sm rounded-xl focus:ring-2 focus:ring-indigo-500 block p-2.5 outline-none font-medium">
                <option value="">Tous les états</option>
                <option value="available">🟢 Disponibles</option>
                <option value="full">🔴 Pleines</option>
            </select>
        </div>

        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-slate-50 border-b border-slate-200">
                            <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">ID</th>
                            <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Chambre</th>
                            <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Occupation</th>
                            <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Détails lits</th>
                            <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        <tr v-for="room in filteredRooms" :key="room.id" class="hover:bg-slate-50/80 transition-colors">
                            <td class="px-6 py-4 text-sm font-mono text-slate-400">#{{ room.id }}</td>
                            <td class="px-6 py-4">
                                <div class="font-bold text-slate-900">{{ room.name }}</div>
                            </td>
                            <td class="px-6 py-4 w-64">
                                <div class="flex items-center gap-3">
                                    <div class="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div class="h-full transition-all duration-500" 
                                            :class="getOccupancyRate(room) >= 100 ? 'bg-red-500' : 'bg-indigo-500'"
                                            :style="{ width: getOccupancyRate(room) + '%' }"></div>
                                    </div>
                                    <span class="text-xs font-black text-slate-500 w-10">{{ getOccupancyRate(room) }}%</span>
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                <div class="flex gap-2">
                                    <span class="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-[10px] font-bold">Total: {{ room.total_capacity }}</span>
                                    <span class="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-md text-[10px] font-bold">Libres: {{ room.total_capacity - room.occupied_capacity }}</span>
                                </div>
                            </td>
                            <td class="px-6 py-4 text-right space-x-2">
                                <button @click="viewDetails(room)" class="p-2 text-slate-400 hover:text-indigo-600 transition-colors" title="Voir détails">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke-width="2"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke-width="2"/></svg>
                                </button>
                                <button v-if="userRole === 'admin'" @click="editRoom(room)" class="p-2 text-slate-400 hover:text-amber-600 transition-colors" title="Modifier">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" stroke-width="2"/></svg>
                                </button>
                                <button v-if="userRole === 'admin'" @click="deleteRoom(room)" class="p-2 text-slate-400 hover:text-red-600 transition-colors" title="Supprimer">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke-width="2"/></svg>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div v-if="showAddForm" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div class="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
                <div class="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h2 class="text-xl font-bold text-slate-800">{{ editingRoom ? 'Modifier' : 'Ajouter' }} une Chambre</h2>
                    <button @click="closeForm" class="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-200 rounded-full transition-all">✕</button>
                </div>
                <form @submit.prevent="saveRoom" class="p-8 space-y-6">
                    <div class="space-y-1">
                        <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Désignation</label>
                        <input v-model="form.name" type="text" placeholder="Ex: Chambre 302, Unité A..." 
                            class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all font-semibold uppercase" required />
                    </div>

                    <div class="space-y-1">
                        <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Capacité Maximale (Lits)</label>
                        <input v-model="form.total_capacity" type="number" placeholder="Nombre de lits" 
                            class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all font-semibold" required />
                    </div>

                    <div class="pt-4 flex gap-3">
                        <button type="button" @click="closeForm" class="flex-1 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-all">Annuler</button>
                        <button type="submit" class="flex-[2] px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-95">
                            {{ editingRoom ? 'Mettre à jour' : 'Enregistrer la chambre' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <div v-if="showConfirmModal" class="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div class="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center border border-slate-100">
                <div class="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </div>
                <h3 class="text-lg font-bold text-slate-900 mb-2">Confirmation</h3>
                <p class="text-slate-500 text-sm mb-6">{{ confirmMessage }}</p>
                <div class="flex gap-3">
                    <button @click="handleCancel" class="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-all">Non</button>
                    <button @click="handleConfirm" class="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all">Oui, Supprimer</button>
                </div>
            </div>
        </div>
    </div>
</template>