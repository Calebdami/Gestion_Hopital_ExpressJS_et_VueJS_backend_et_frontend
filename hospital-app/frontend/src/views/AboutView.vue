<template>
  <div class="min-h-screen bg-slate-50 pb-12">
    <div class="relative bg-hospital-900 py-20 px-6 overflow-hidden">
      <div class="absolute inset-0 opacity-10">
        <svg class="h-full w-full" fill="none" viewBox="0 0 400 400">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" stroke="white" stroke-width="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      
      <div class="relative max-w-5xl mx-auto text-center">
        <span class="inline-block px-4 py-1.5 mb-4 text-xs font-bold tracking-widest text-blue-400 uppercase bg-blue-400/10 rounded-full">
          Établissement de Classe Mondiale
        </span>
        <h1 class="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
          Hôpital de l'Excellence Médicale
        </h1>
        <p class="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Repousser les limites de la médecine pour offrir à chaque patient un avenir plus sain grâce à l'innovation et la compassion.
        </p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-6 -mt-10">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
        <div v-for="(stat, index) in stats" :key="index" 
             class="bg-white p-6 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 text-center transform hover:-translate-y-1 transition-transform duration-300">
          <p class="text-3xl font-bold text-blue-600 mb-1">{{ stat.value }}</p>
          <p class="text-sm font-medium text-slate-500 uppercase tracking-wide">{{ stat.label }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div class="lg:col-span-2 space-y-12">
          <section>
            <div class="flex items-center gap-3 mb-6">
              <div class="h-8 w-1.5 bg-blue-600 rounded-full"></div>
              <h2 class="text-2xl font-bold text-slate-900">Notre Engagement</h2>
            </div>
            <div class="prose prose-slate max-w-none">
              <p class="text-lg text-slate-600 leading-relaxed mb-6">
                Depuis plus de 50 ans, nous nous imposons comme le leader de l'innovation médicale. Notre approche holistique combine des soins de pointe avec une attention personnalisée, garantissant que chaque patient reçoive un traitement digne des plus hauts standards internationaux.
              </p>
              <div class="bg-blue-600 rounded-2xl p-8 text-white shadow-lg shadow-blue-200">
                <h3 class="text-xl font-bold mb-3 text-white">Notre Mission</h3>
                <p class="text-blue-50 leading-relaxed">
                  "Offrir des services de santé de qualité avec compassion et excellence, en utilisant les technologies médicales les plus avancées pour transformer la vie de nos communautés."
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-slate-900 mb-8">Pôles d'Excellence</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div v-for="spec in specialisations" :key="spec" 
                   class="flex items-center p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:bg-blue-50/50 transition-all group">
                <div class="h-10 w-10 rounded-lg bg-slate-100 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-colors text-slate-500 font-bold">
                  {{ spec.charAt(0) }}
                </div>
                <span class="ml-4 font-semibold text-slate-700">{{ spec }}</span>
              </div>
            </div>
          </section>
        </div>

        <div class="space-y-8">
          <div class="bg-slate-900 rounded-2xl p-8 text-white shadow-2xl">
            <h3 class="text-xl font-bold mb-6">Reconnaissance</h3>
            <ul class="space-y-6">
              <li class="flex gap-4">
                <div class="shrink-0 text-blue-400">
                  <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                </div>
                <div>
                  <p class="font-bold">ISO 9001:2026</p>
                  <p class="text-sm text-slate-400">Standard de qualité internationale pour les soins critiques.</p>
                </div>
              </li>
              <li class="flex gap-4">
                <div class="shrink-0 text-blue-400">
                   <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 20 20"><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <div>
                  <p class="font-bold">Prix de l'Innovation</p>
                  <p class="text-sm text-slate-400">Élu meilleur centre de recherche chirurgicale 2025.</p>
                </div>
              </li>
            </ul>
            <hr class="my-6 border-slate-800" />
            <div class="text-center">
              <p class="text-sm text-slate-400 mb-4">Besoin d'un devis ou d'une information tarifaire ?</p>
              <button class="w-full py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-blue-50 transition-colors">
                Consulter les tarifs
              </button>
            </div>
          </div>

          <div class="bg-white border border-slate-200 rounded-2xl p-6">
            <h4 class="font-bold text-slate-900 mb-4 text-center">Urgences 24/7</h4>
            <div class="text-3xl font-black text-center text-red-600 tracking-tighter">
              +33 1 23 45 67 89
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const stats = [
  { label: 'Années d’Expérience', value: '50+' },
  { label: 'Patients Annuels', value: '10k+' },
  { label: 'Satisfaction', value: '98%' },
  { label: 'Spécialistes', value: '120+' },
]

const specialisations = [
  'Cardiologie Avancée', 'Chirurgie Robotique', 'Pédiatrie & Néonatalogie', 
  'Orthopédie Sportive', 'Neurologie Complexe', 'Oncologie Précise'
]
</script>