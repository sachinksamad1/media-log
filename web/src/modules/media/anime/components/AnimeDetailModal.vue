<script setup lang="ts">
import { ref, watch, reactive } from 'vue'
import { AnimeService } from '../api/anime.service'
import type { Anime } from '../types/types'

const props = defineProps<{
  anime: Anime | null
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'update', updatedAnime: Anime): void
}>()

const isEditing = ref(false)
const saving = ref(false)

// Local Mutable State
const form = reactive<{
  title: string
  status: string
  score: number
  totalSeasons: number
  isReleaseCompleted: boolean
  genre: string
}>({
  title: '',
  status: '',
  score: 0,
  totalSeasons: 0,
  isReleaseCompleted: false,
  genre: ''
})

// Sync props to form when opened
watch(() => props.anime, (newVal) => {
  if (newVal) {
    form.title = newVal.title
    form.status = newVal.userStats.status
    form.score = newVal.userStats.score
    form.totalSeasons = newVal.releaseStats.totalSeasons
    form.isReleaseCompleted = newVal.releaseStats.isCompleted
    form.genre = newVal.genre.join(', ')
    
    // Default to view mode when opening a new item
    isEditing.value = false 
  }
}, { immediate: true })

async function handleSave() {
  if (!props.anime) return
  
  saving.value = true
  try {
    const payload: Partial<Anime> = {
      title: form.title,
      // We reconstruct the nested objects merging with existing to avoid data loss if we didn't map everything
      userStats: {
        ...props.anime.userStats,
        status: form.status,
        score: Number(form.score)
      },
      releaseStats: {
        ...props.anime.releaseStats,
        totalSeasons: Number(form.totalSeasons),
        isCompleted: form.isReleaseCompleted
      },
      genre: form.genre.split(',').map(s => s.trim()).filter(s => s)
    }

    const updated = await AnimeService.update(props.anime.id, payload)
    emit('update', updated) // Notify parent to update list
    isEditing.value = false
  } catch (err) {
    console.error('Failed to update', err)
    alert('Failed to save changes')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="emit('close')"></div>

      <!-- Modal Content -->
      <div class="relative bg-card text-card-foreground w-full max-w-2xl rounded-xl shadow-2xl border border-border flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <!-- Header Image & Close -->
        <div class="relative h-48 sm:h-64 shrink-0 overflow-hidden bg-muted">
           <img 
             v-if="anime?.imageUrl" 
             :src="anime.imageUrl" 
             class="w-full h-full object-cover"
           />
           <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
           
           <button 
             @click="emit('close')"
             class="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full transition-colors z-10"
           >
             ✕
           </button>

           <div class="absolute bottom-4 left-6 right-6 text-white">
             <h2 class="text-2xl sm:text-3xl font-bold line-clamp-2">{{ anime?.title }}</h2>
             <div class="flex gap-2 mt-2 text-sm opacity-90">
               <span class="px-2 py-0.5 rounded bg-primary/20 border border-primary/30 backdrop-blur-sm">
                 {{ anime?.origin || 'Anime' }}
               </span>
               <span v-if="!isEditing" class="px-2 py-0.5 rounded bg-white/20 backdrop-blur-sm">
                 {{ form.status }}
               </span>
             </div>
           </div>
        </div>

        <!-- Scrollable Body -->
        <div class="flex-1 overflow-y-auto p-6">
          
          <!-- VIEW MODE -->
          <div v-if="!isEditing" class="space-y-6">
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
               <div class="p-3 bg-secondary/30 rounded-lg">
                 <div class="text-xs text-muted-foreground uppercase tracking-wider mb-1">Score</div>
                 <div class="text-xl font-bold text-accent">⭐ {{ form.score }}</div>
               </div>
               <div class="p-3 bg-secondary/30 rounded-lg">
                 <div class="text-xs text-muted-foreground uppercase tracking-wider mb-1">Status</div>
                 <div class="font-medium">{{ form.status }}</div>
               </div>
               <div class="p-3 bg-secondary/30 rounded-lg">
                 <div class="text-xs text-muted-foreground uppercase tracking-wider mb-1">Seasons</div>
                 <div class="font-medium">{{ form.totalSeasons }}</div>
               </div>
               <div class="p-3 bg-secondary/30 rounded-lg">
                 <div class="text-xs text-muted-foreground uppercase tracking-wider mb-1">Released</div>
                 <div class="font-medium" :class="form.isReleaseCompleted ? 'text-green-500' : 'text-amber-500'">
                   {{ form.isReleaseCompleted ? 'Finished' : 'Ongoing' }}
                 </div>
               </div>
            </div>

            <div v-if="form.genre" class="space-y-2">
              <h4 class="text-sm font-semibold text-muted-foreground">Genres</h4>
              <div class="flex flex-wrap gap-2">
                <span 
                  v-for="g in form.genre.split(', ')" 
                  :key="g"
                  class="px-2 py-1 text-xs rounded-md bg-secondary text-secondary-foreground"
                >
                  {{ g }}
                </span>
              </div>
            </div>

             <!-- Metadata Grid -->
             <div class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div class="text-muted-foreground">Original Language</div>
              <div>{{ anime?.language || 'Japanese' }}</div>
              
              <div class="text-muted-foreground">Added to Library</div>
              <div>{{ new Date(anime?.createdAt || '').toLocaleDateString() }}</div>
            </div>
          </div>

          <!-- EDIT MODE -->
          <div v-else class="space-y-4">
             <div class="space-y-2">
               <label class="text-sm font-medium">Title</label>
               <input 
                 v-model="form.title"
                 class="w-full px-3 py-2 rounded-md bg-background border border-input focus:ring-1 focus:ring-ring"
               />
             </div>

             <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
               
               <div class="space-y-2">
                 <label class="text-sm font-medium">Status</label>
                 <select 
                   v-model="form.status"
                   class="w-full px-3 py-2 rounded-md bg-background border border-input focus:ring-1 focus:ring-ring"
                 >
                   <option value="Planned">Planned</option>
                   <option value="Ongoing">Ongoing</option>
                   <option value="Completed">Completed</option>
                   <option value="Dropped">Dropped</option>
                 </select>
               </div>

               <div class="space-y-2">
                 <label class="text-sm font-medium">My Score (0-10)</label>
                 <input 
                   v-model="form.score"
                   type="number"
                   min="0"
                   max="10"
                   step="0.5"
                   class="w-full px-3 py-2 rounded-md bg-background border border-input focus:ring-1 focus:ring-ring"
                 />
               </div>

                <div class="space-y-2">
                 <label class="text-sm font-medium">Total Seasons</label>
                 <input 
                   v-model="form.totalSeasons"
                   type="number"
                   min="0"
                   class="w-full px-3 py-2 rounded-md bg-background border border-input focus:ring-1 focus:ring-ring"
                 />
               </div>

               <div class="flex items-center gap-3 pt-8">
                 <input 
                   id="isCompleted"
                   type="checkbox"
                   v-model="form.isReleaseCompleted"
                   class="w-4 h-4 rounded border-input bg-background text-primary focus:ring-ring"
                 />
                 <label for="isCompleted" class="text-sm font-medium cursor-pointer select-none">
                   Is Release Finished?
                 </label>
               </div>

             </div>

             <div class="space-y-2">
               <label class="text-sm font-medium">Genres (comma separated)</label>
               <input 
                 v-model="form.genre"
                 placeholder="Action, Adventure, Fantasy"
                 class="w-full px-3 py-2 rounded-md bg-background border border-input focus:ring-1 focus:ring-ring"
               />
             </div>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="p-4 border-t border-border bg-secondary/10 flex justify-end gap-3">
          <div v-if="!isEditing">
             <button 
               @click="isEditing = true"
               class="px-5 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
             >
               Edit Details
             </button>
          </div>
          <div v-else class="flex gap-3">
            <button 
               @click="isEditing = false"
               class="px-4 py-2 rounded-lg border border-input hover:bg-accent hover:text-accent-foreground transition-colors"
               :disabled="saving"
             >
               Cancel
             </button>
             <button 
               @click="handleSave"
               class="px-5 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
               :disabled="saving"
             >
               <span v-if="saving" class="animate-spin">⟳</span>
               {{ saving ? 'Saving...' : 'Save Changes' }}
             </button>
          </div>
        </div>

      </div>
    </div>
  </Teleport>
</template>
