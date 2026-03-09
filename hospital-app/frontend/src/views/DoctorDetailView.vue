<script setup>
    import { ref, onMounted } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import { patientService, doctorService } from '../services/api.js'
    import { formatDate } from '../utils/helpers.js'

    const route = useRoute()
    const router = useRouter()
    const doctor = ref(null)
    const patients = ref([]);
    const assignedPatients = ref([]);
    const isLoading = ref(true)

    onMounted(async () => {
        const doctorId = parseInt(route.params.id)
        try {
            const response = await doctorService.getById(doctorId)
            const result = await patientService.getAll();
            doctor.value = response.data
            const allPatients = result.data || result
            patients.value = allPatients.filter(p => parseInt(p.assigned_doctor_id) === doctorId);
            assignedPatients.value = patients.value;
        } catch (err) {
            console.error('Erreur lors de la récupération du docteur :', err)
        } finally {
            isLoading.value = false
        }
    })

    const goBack = () => {
        router.back()
    }
</script>

<template>
    <div class="max-w-5xl mx-auto space-y-6">
        <div class="flex items-center justify-between">
            <button @click="goBack" class="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-600 font-black rounded-2xl hover:bg-slate-50 transition-all text-[11px] uppercase tracking-widest shadow-sm">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 19l-7-7m0 0l7-7m-7 7h18" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                Retour
            </button>
            <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Profil Vérifié</span>
            </div>
        </div>

        <div v-if="doctor" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <div class="lg:col-span-1 space-y-6">
                <div class="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm text-center">
                    <div class="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-[2rem] flex items-center justify-center font-black text-2xl mx-auto mb-6 shadow-xl shadow-blue-100 border-4 border-white">
                        {{ doctor.first_name?.charAt(0) }}{{ doctor.last_name?.charAt(0) }}
                    </div>
                    <h2 class="text-xl font-black text-slate-900 tracking-tight">Dr. {{ doctor.first_name }} {{ doctor.last_name }}</h2>
                    <p class="text-blue-600 font-bold text-xs uppercase tracking-widest mt-2">{{ doctor.specialization }}</p>
                    
                    <div class="mt-8 pt-8 border-t border-slate-50 grid grid-cols-2 gap-4">
                        <div class="text-center">
                            <p class="text-xl font-black text-slate-900">{{ assignedPatients.length }}</p>
                            <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Patients</p>
                        </div>
                        <div class="text-center border-l border-slate-50">
                            <p class="text-xl font-black text-slate-900">#{{ doctor.id }}</p>
                            <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest">ID Interne</p>
                        </div>
                    </div>
                </div>

                <div class="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-lg">
                    <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Contact & Urgences</h3>
                    <div class="space-y-4">
                        <div class="flex items-center gap-4">
                            <div class="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke-width="2"/></svg></div>
                            <span class="text-xs font-bold truncate">{{ doctor.email }}</span>
                        </div>
                        <div class="flex items-center gap-4">
                            <div class="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" stroke-width="2"/></svg></div>
                            <span class="text-xs font-bold">{{ doctor.phone }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="lg:col-span-2 space-y-6">
                <div class="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                    <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Informations Administratives</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div class="space-y-1">
                            <p class="text-[10px] font-black text-slate-400 uppercase">Date d'intégration</p>
                            <p class="text-sm font-bold text-slate-700">{{ formatDate(doctor.created_at) }}</p>
                        </div>
                        <div class="space-y-1">
                            <p class="text-[10px] font-black text-slate-400 uppercase">Dernière modification</p>
                            <p class="text-sm font-bold text-slate-700">{{ formatDate(doctor.updated_at) }}</p>
                        </div>
                    </div>
                </div>

                <div class="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                    <div class="flex items-center justify-between mb-8">
                        <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Patients sous responsabilité</h3>
                        <span class="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-lg">{{ assignedPatients.length }}</span>
                    </div>
                    
                    <div v-if="assignedPatients.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div v-for="p in assignedPatients" :key="p.id" class="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-blue-200 transition-all">
                            <div class="w-8 h-8 rounded-xl bg-white text-blue-600 flex items-center justify-center font-black text-[10px] shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                {{ p.last_name?.charAt(0) }}
                            </div>
                            <span class="text-xs font-bold text-slate-700">{{ p.first_name }} {{ p.last_name }}</span>
                        </div>
                    </div>
                    
                    <div v-else class="text-center py-10">
                        <p class="text-xs font-bold text-slate-400 italic uppercase tracking-widest">Aucun patient assigné actuellement</p>
                    </div>
                </div>

                <div class="flex justify-end pt-4">
                    <button @click="goBack" class="px-8 py-4 bg-slate-100 text-slate-500 font-black rounded-2xl hover:bg-slate-200 transition-all uppercase text-[10px] tracking-widest">
                        Fermer la fiche
                    </button>
                </div>
            </div>
        </div>

        <div v-else class="bg-white p-20 rounded-[2.5rem] border border-slate-200 shadow-sm text-center">
            <div class="w-12 h-12 border-4 border-blue-50 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p class="text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">Chargement du profil...</p>
        </div>
    </div>
</template>

<style scoped>
    /* Optionnel : effet de flottement léger pour la carte profil */
    .bg-white {
        transition: transform 0.3s ease;
    }
</style>