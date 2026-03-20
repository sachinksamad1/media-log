<script setup lang="ts">
import { onMounted, ref } from 'vue'
import {
  Shuffle,
  RotateCcw,
  Calendar,
  Info,
  ChevronRight,
  Tv,
  BookOpen,
  Book,
  BookText,
  GraduationCap,
  Film,
  Tv2,
  Gamepad2,
  AlertCircle,
} from 'lucide-vue-next'
import { useRandomPickStore } from '../store/random-pick.store'
import { MEDIA_CATEGORIES } from '@/common/types/media'
import LazyImage from '@/common/components/ui/LazyImage.vue'
import { Button } from '@/common/components/ui'

const store = useRandomPickStore()
const selectedType = ref('all')

const categories = [
  { type: 'all', label: 'All Media', icon: Shuffle },
  ...MEDIA_CATEGORIES.map((c) => ({
    ...c,
    icon: getIcon(c.icon),
  })),
]

function getIcon(name: string) {
  const icons: Record<string, any> = {
    Tv,
    BookOpen,
    Book,
    BookText,
    GraduationCap,
    Film,
    Tv2,
    Gamepad2,
  }
  return icons[name] || Info
}

function handlePick() {
  store.fetchRandom(selectedType.value)
}

function setFilter(type: string) {
  selectedType.value = type
  handlePick()
}

onMounted(() => {
  if (!store.result) {
    handlePick()
  }
})

function formatType(type: string) {
  return type.charAt(0).toUpperCase() + type.slice(1)
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>

<template>
  <div class="p-6 max-w-5xl mx-auto space-y-8 min-h-[80vh] flex flex-col">
    <!-- Header -->
    <div class="text-center space-y-2">
      <h1 class="text-4xl font-bold tracking-tight">Random Pick</h1>
      <p class="text-muted-foreground text-lg">
        Can't decide? Let us pick something from your library for you.
      </p>
    </div>

    <!-- Filters -->
    <div
      class="flex flex-wrap justify-center gap-2 p-1.5 bg-secondary/30 rounded-2xl backdrop-blur-sm mx-auto w-fit border border-white/5"
    >
      <button
        v-for="cat in categories"
        :key="cat.type"
        class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
        :class="[
          selectedType === cat.type
            ? 'bg-primary text-primary-foreground shadow-lg scale-105 active:scale-95'
            : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground',
        ]"
        @click="setFilter(cat.type)"
      >
        <component :is="cat.icon" class="w-4 h-4" />
        {{ cat.label }}
      </button>
    </div>

    <!-- Content -->
    <div class="flex-1 flex flex-col items-center justify-center py-10">
      <!-- Loading State -->
      <div v-if="store.loading" class="flex flex-col items-center space-y-6">
        <div
          class="relative w-64 h-96 rounded-2xl bg-secondary/20 flex items-center justify-center overflow-hidden border border-white/10"
        >
          <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          <RotateCcw class="w-12 h-12 text-primary animate-spin" />
        </div>
        <div class="space-y-2 text-center">
          <h3 class="text-xl font-semibold animate-pulse">Shuffling your library...</h3>
          <p class="text-muted-foreground">Finding the perfect match</p>
        </div>
      </div>

      <!-- Error State -->
      <div
        v-else-if="store.error"
        class="max-w-md text-center space-y-6 p-8 rounded-3xl bg-destructive/5 border border-destructive/20"
      >
        <div class="p-4 rounded-full bg-destructive/10 w-fit mx-auto">
          <AlertCircle class="w-10 h-10 text-destructive" />
        </div>
        <div class="space-y-2">
          <h3 class="text-xl font-bold text-destructive">Oops! Something went wrong</h3>
          <p class="text-muted-foreground leading-relaxed">{{ store.error }}</p>
        </div>
        <Button
          variant="outline"
          class="rounded-xl px-8 h-12 border-destructive/20 hover:bg-destructive/10"
          @click="handlePick"
        >
          Try Again
        </Button>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="!store.result"
        class="max-w-md text-center space-y-6 p-10 rounded-3xl bg-secondary/20 border border-white/5"
      >
        <div class="p-4 rounded-full bg-primary/10 w-fit mx-auto">
          <Shuffle class="w-12 h-12 text-primary" />
        </div>
        <div class="space-y-2 text-center">
          <h3 class="text-2xl font-bold">No items found</h3>
          <p class="text-muted-foreground">
            Try choosing a different category or add some items to your library first.
          </p>
        </div>
        <Button variant="default" class="rounded-xl px-8 h-12" @click="handlePick">
          Retry Random Pick
        </Button>
      </div>

      <!-- Result Card -->
      <div
        v-else
        class="w-full max-w-4xl grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8 bg-card border border-white/10 rounded-[32px] overflow-hidden shadow-2xl"
      >
        <!-- Cover Image -->
        <div class="relative group aspect-[3/4] md:aspect-auto">
          <LazyImage
            :src="store.result.imageUrl"
            :alt="store.result.title"
            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
          ></div>
          <div class="absolute top-4 left-4">
            <span
              class="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-primary/90 text-primary-foreground backdrop-blur-md shadow-lg"
            >
              {{ formatType(store.result.mediaType) }}
            </span>
          </div>
        </div>

        <!-- Details -->
        <div
          class="p-8 md:p-12 flex flex-col justify-center space-y-8 bg-gradient-to-br from-card to-secondary/10"
        >
          <div class="space-y-4">
            <h2 class="text-3xl md:text-5xl font-black leading-tight tracking-tight text-balance">
              {{ store.result.title }}
            </h2>
            <div
              class="flex flex-wrap gap-4 text-sm text-muted-foreground uppercase tracking-widest font-semibold"
            >
              <div class="flex items-center gap-2">
                <Calendar class="w-4 h-4 text-primary" />
                <span>Added {{ formatDate(store.result.createdAt) }}</span>
              </div>
              <div class="flex items-center gap-2">
                <Info class="w-4 h-4 text-primary" />
                <span
                  >Status:
                  <span class="text-foreground">{{ store.result.userStats.status }}</span></span
                >
              </div>
            </div>
          </div>

          <div class="flex flex-wrap gap-4 pt-4">
            <Button
              size="lg"
              class="rounded-2xl px-10 h-14 bg-primary hover:bg-primary/90 shadow-[0_8px_16px_rgba(var(--primary),0.2)] transition-all active:scale-95 text-lg font-bold gap-3 group"
              @click="handlePick"
            >
              <RotateCcw class="w-5 h-5 transition-transform group-hover:rotate-180 duration-500" />
              Pick Another
            </Button>

            <router-link
              :to="`/${store.result.mediaType}/${store.result.id}`"
              class="inline-flex items-center justify-center rounded-2xl px-10 h-14 bg-secondary/80 hover:bg-secondary text-secondary-foreground transition-all active:scale-95 text-lg font-bold gap-3 border border-white/10 whitespace-nowrap"
            >
              View Details
              <ChevronRight class="w-5 h-5" />
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.text-balance {
  text-wrap: balance;
}
</style>
