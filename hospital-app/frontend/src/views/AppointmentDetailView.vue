<script setup>
    import { ref, onMounted } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import { appointmentService } from '../services/api.js'
    import { formatDate } from '../utils/helpers.js'

    const route = useRoute()
    const router = useRouter()
    const appointment = ref(null)

    onMounted(async () => {
        const appointmentId = route.params.id
        try {
            const response = await appointmentService.getById(appointmentId)
            appointment.value = response.data
        } catch (err) {
            console.error('Erreur lors de la récupération du rendez-vous:', err)
        }
    })

    const goBack = () => {
        router.back()
    }

    // Transformation de la fonction pour retourner des classes Tailwind
    const getStatusClasses = (status) => {
        const base = 'px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border '
        const colors = {
            confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-100',
            pending: 'bg-amber-50 text-amber-700 border-amber-100',
            cancelled: 'bg-red-50 text-red-700 border-red-100',
            completed: 'bg-indigo-50 text-indigo-700 border-indigo-100'
        }
        return base + (colors[status] || 'bg-slate-50 text-slate-700 border-slate-100')
    }
</script>

<template>
    <div class="p-6 bg-slate-50 min-h-screen animate-in fade-in duration-500">
        <div class="max-w-3xl mx-auto mb-8 flex items-center justify-between">
            <div class="flex items-center gap-4">
                <button @click="goBack" 
                    class="flex items-center justify-center w-10 h-10 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-all shadow-sm">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
                <h1 class="text-2xl font-black text-slate-900 tracking-tight">Détails du Rendez-vous</h1>
            </div>
            <div v-if="appointment">
                <span :class="getStatusClasses(appointment.status)">
                    {{ appointment.status }}
                </span>
            </div>
        </div>

        <div class="max-w-3xl mx-auto">
            <div v-if="appointment" class="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
                <div class="bg-indigo-600 p-8 text-white flex flex-col md:flex-row justify-between items-center gap-6">
                    <div class="flex items-center gap-5">
                        <div class="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                            <svg class="w-8 h-8 text-indigo-100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        </div>
                        <div>
                            <p class="text-indigo-200 text-xs font-bold uppercase tracking-widest mb-1">Date prévue</p>
                            <p class="text-2xl font-black">{{ formatDate(appointment.appointment_date) }}</p>
                        </div>
                    </div>
                    <div class="text-center md:text-right">
                        <p class="text-indigo-200 text-xs font-bold uppercase tracking-widest mb-1">Heure</p>
                        <p class="text-3xl font-black">{{ appointment.appointment_time || '--:--' }}</p>
                    </div>
                </div>

                <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div class="space-y-6">
                        <div class="flex items-start gap-4">
                            <div class="mt-1 p-2 bg-slate-100 rounded-lg text-slate-500">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke-width="2"/></svg>
                            </div>
                            <div>
                                <label class="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Patient concerné</label>
                                <p class="text-slate-900 font-bold text-lg">Patient #{{ appointment.patient_id }}</p>
                            </div>
                        </div>

                        <div class="flex items-start gap-4">
                            <div class="mt-1 p-2 bg-slate-100 rounded-lg text-slate-500">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.675.337a2 2 0 01-1.789 0l-.675-.337a6 6 0 00-3.86-.517l-2.387.477a2 2 0 00-1.022.547l-1.162 1.162a2 2 0 00.597 3.301l1.544.515a4.8 4.8 0 003.585-.351l2.29-1.145a2.4 2.4 0 012.145 0l2.29 1.145a4.8 4.8 0 003.585.351l1.544-.515a2 2 0 00.597-3.301l-1.162-1.162z" stroke-width="2"/><path d="M12 7V3m0 0L10 5m2-2l2 2" stroke-width="2"/></svg>
                            </div>
                            <div>
                                <label class="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Praticien assigné</label>
                                <p class="text-slate-900 font-bold text-lg">Docteur #{{ appointment.doctor_id }}</p>
                            </div>
                        </div>
                    </div>

                    <div class="space-y-6">
                        <div class="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                            <label class="block text-[10px] font-black text-indigo-400 uppercase tracking-wider mb-2">Motif de consultation</label>
                            <p class="text-slate-700 font-semibold italic">"{{ appointment.reason || 'Non spécifié' }}"</p>
                        </div>
                        
                        <div class="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                            <label class="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Notes cliniques</label>
                            <p class="text-slate-600 text-sm leading-relaxed">{{ appointment.notes || 'Aucune note additionnelle.' }}</p>
                        </div>
                    </div>
                </div>

                <div class="px-8 py-4 bg-slate-50 border-t border-slate-100 flex flex-wrap justify-between gap-4">
                    <div class="text-[10px] font-medium text-slate-400">
                        RÉFÉRENCE UNIQUE : <span class="font-mono font-bold">RDV-{{ appointment.id }}</span>
                    </div>
                    <div class="flex gap-6">
                        <div class="text-[10px] text-slate-400">CRÉÉ LE : <span class="text-slate-600 font-bold">{{ formatDate(appointment.created_at) }}</span></div>
                        <div class="text-[10px] text-slate-400">DERNIÈRE MAJ : <span class="text-slate-600 font-bold">{{ formatDate(appointment.updated_at) }}</span></div>
                    </div>
                </div>
            </div>

            <div v-else class="bg-white p-20 rounded-3xl border border-slate-200 text-center animate-pulse">
                <div class="w-16 h-16 bg-slate-100 rounded-full mx-auto mb-4"></div>
                <p class="text-slate-400 font-bold uppercase tracking-widest text-xs">Synchronisation des données...</p>
            </div>

            <div class="mt-8">
                <button @click="goBack" 
                    class="w-full py-4 bg-white border-2 border-slate-200 text-slate-600 rounded-2xl font-black hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-[0.98]">
                    FERMER LE DOSSIER
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.animate-in {
    animation: slideUp 0.4s ease-out forwards;
}
@keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}
</style>