<script setup lang="ts">
import { onMounted } from 'vue'
import {
  Sparkles,
  ArrowRight,
  ChevronRight,
  ExternalLink,
  Info,
  Star,
  PlusCircle,
  BarChart2,
  Shuffle,
} from 'lucide-vue-next'
import { useRecommendationsStore } from '../store/recommendations.store'

const recommendationsStore = useRecommendationsStore()

onMounted(() => {
  recommendationsStore.fetchRecommendations(12)
})

const getRelevanceColor = (score: number) => {
  if (score >= 0.8) return 'text-green-500'
  if (score >= 0.5) return 'text-primary'
  return 'text-orange-500'
}
</script>

<template>
  <div class="p-6 max-w-7xl mx-auto space-y-10">
    <!-- Hero Header -->
    <header
      class="relative space-y-4 pt-10 overflow-hidden rounded-3xl bg-primary/5 p-12 border border-primary/10 shadow-[0_32px_120px_rgba(59,130,246,0.02)]"
    >
      <div
        class="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-[120px]"
      ></div>
      <div
        class="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/10 rounded-full blur-[80px]"
      ></div>

      <div class="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div class="space-y-3">
          <div
            class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider backdrop-blur-xl border border-primary/20"
          >
            <Sparkles class="w-3 h-3" />
            AI Discovery Engine
          </div>
          <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight">
            Personalized <span class="text-primary italic">Suggestions</span>
          </h1>
          <p class="text-muted-foreground text-lg max-w-xl">
            Our AI analyzes your favorite genres and scores to find your next obsession.
          </p>
        </div>

        <button
          class="flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-2xl hover:scale-105 transition-all duration-300 shadow-lg shadow-primary/20 active:scale-95 group"
          @click="recommendationsStore.fetchRecommendations(12)"
        >
          Refresh Feed
          <Sparkles class="w-4 h-4 group-hover:rotate-12 transition-transform" />
        </button>
      </div>
    </header>

    <!-- Content -->
    <main>
      <div
        v-if="recommendationsStore.loading"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <div
          v-for="i in 8"
          :key="i"
          class="h-96 rounded-3xl border border-primary/10 bg-card animate-pulse shadow-sm"
        ></div>
      </div>

      <div
        v-else-if="recommendationsStore.error"
        class="flex flex-col items-center justify-center p-24 text-center space-y-6 bg-red-500/5 rounded-3xl border border-red-500/10"
      >
        <div class="p-4 rounded-full bg-red-500/10 text-red-500">
          <Info class="w-8 h-8" />
        </div>
        <div>
          <h2 class="text-2xl font-bold">Something went wrong</h2>
          <p class="text-muted-foreground mt-2">{{ recommendationsStore.error }}</p>
        </div>
        <button
          class="px-6 py-2 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors"
          @click="recommendationsStore.fetchRecommendations(12)"
        >
          Retry
        </button>
      </div>

      <div
        v-else-if="recommendationsStore.recommendations.length === 0"
        class="flex flex-col items-center justify-center p-24 text-center space-y-6"
      >
        <div class="p-4 rounded-full bg-primary/10 text-primary">
          <ArrowRight class="w-8 h-8" />
        </div>
        <div>
          <h2 class="text-2xl font-bold italic">No recommendations found yet.</h2>
          <p class="text-muted-foreground mt-2 max-w-md mx-auto">
            Try adding and rating more media to help our engine understand your taste better!
          </p>
        </div>
      </div>

      <div
        v-else
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10"
      >
        <div
          v-for="(rec, index) in recommendationsStore.recommendations"
          :key="rec.id"
          class="group flex flex-col h-full bg-card rounded-[2.5rem] border border-transparent hover:border-primary/20 hover:bg-primary/5 transition-all duration-500 hover:shadow-[0_40px_80px_rgba(0,0,0,0.06)] overflow-hidden"
          :style="{ transitionDelay: `${index * 50}ms` }"
        >
          <!-- Media Cover -->
          <div
            class="relative aspect-[3/4] overflow-hidden rounded-[2rem] m-3 shadow-md group-hover:shadow-xl transition-all duration-500"
          >
            <img
              :src="rec.imageUrl || '/placeholder-cover.jpg'"
              :alt="rec.title"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />

            <!-- Tags Overlay -->
            <div class="absolute top-4 left-4 flex flex-wrap gap-2">
              <span
                class="px-3 py-1 bg-black/40 backdrop-blur-md rounded-full text-[10px] uppercase font-bold text-white border border-white/20"
              >
                {{ rec.origin || 'Anime' }}
              </span>
            </div>

            <!-- Score Badge Overlay -->
            <div
              class="absolute bottom-4 right-4 bg-white/90 dark:bg-black/80 backdrop-blur-md rounded-2xl p-3 shadow-lg border border-black/5 dark:border-white/5 flex flex-col items-end"
            >
              <div
                class="flex items-center gap-1.5 font-black text-xl tracking-tight"
                :class="getRelevanceColor(rec.score)"
              >
                <Star class="w-4 h-4 fill-current" />
                {{ Math.round(rec.score * 100) }}%
              </div>
              <span
                class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5"
                >Match Score</span
              >
            </div>

            <!-- Quick View Action -->
            <div
              class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center"
            >
              <button
                class="p-4 bg-primary text-white rounded-full scale-0 group-hover:scale-100 transition-transform duration-500 hover:scale-110 active:scale-95"
              >
                <PlusCircle class="w-6 h-6" />
              </button>
            </div>
          </div>

          <!-- Media Info -->
          <div class="p-6 flex flex-col flex-1 space-y-4">
            <div class="space-y-1">
              <h3
                class="text-xl font-black leading-none line-clamp-1 tracking-tight text-foreground transition-colors group-hover:text-primary"
              >
                {{ rec.title }}
              </h3>
              <p class="text-sm font-bold opacity-60">
                {{ rec.language || 'Japanese' }}
              </p>
            </div>

            <!-- Genre Bubbles -->
            <div class="flex flex-wrap gap-1.5">
              <span
                v-for="genre in rec.genres?.slice(0, 3)"
                :key="genre"
                class="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg bg-accent/50 text-accent-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors border border-accent"
              >
                {{ genre }}
              </span>
            </div>
          </div>

          <!-- Bottom Action -->
          <div class="px-6 pb-6 mt-auto">
            <button
              class="w-full flex items-center justify-between p-4 rounded-2xl bg-secondary group-hover:bg-primary text-secondary-foreground group-hover:text-white transition-all duration-300 font-bold group-hover:shadow-[0_20px_40px_rgba(59,130,246,0.3)]"
            >
              <span>See Details</span>
              <ChevronRight class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- Stats Section Footer -->
    <footer class="grid grid-cols-1 md:grid-cols-2 gap-10 pt-20 border-t border-primary/5">
      <div class="space-y-4">
        <h2 class="text-2xl font-black">How it Works</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="p-6 rounded-3xl bg-card border shadow-sm space-y-2">
            <div
              class="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center"
            >
              <BarChart2 class="w-5 h-5" />
            </div>
            <h4 class="font-bold">Content Vectors</h4>
            <p class="text-xs text-muted-foreground font-medium">
              Media genre profiles are mapped to high-dimensional space.
            </p>
          </div>
          <div class="p-6 rounded-3xl bg-card border shadow-sm space-y-2">
            <div
              class="w-10 h-10 rounded-2xl bg-green-500/10 text-green-500 flex items-center justify-center"
            >
              <Shuffle class="w-5 h-5" />
            </div>
            <h4 class="font-bold">Cosine Similarity</h4>
            <p class="text-xs text-muted-foreground font-medium">
              Your preference profile is compared against our database.
            </p>
          </div>
        </div>
      </div>

      <div
        class="p-8 rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-700 text-white flex flex-col justify-between overflow-hidden relative shadow-2xl"
      >
        <div
          class="absolute -bottom-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-[80px]"
        ></div>
        <div class="relative z-10 space-y-4">
          <h2 class="text-3xl font-black uppercase tracking-tighter">
            Stay <span class="text-white/40">Inspired</span>
          </h2>
          <p class="text-white/80 font-medium leading-relaxed">
            The more you track, the better we get. Keep logging your media to discover deeply
            resonant recommendations tailored just for you.
          </p>
          <div class="pt-4 flex items-center gap-4">
            <button
              class="px-6 py-3 rounded-2xl bg-white text-indigo-700 font-black flex items-center gap-2 hover:bg-white/90 transition-colors shadow-lg"
            >
              Check Stats
              <ExternalLink class="w-4 h-4" />
            </button>
            <span class="text-white/50 font-bold text-xs uppercase tracking-widest"
              >Powered by TF.js</span
            >
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.animate-fadeInUp {
  animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
