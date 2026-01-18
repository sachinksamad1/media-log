<script setup lang="ts">
import { ref, watch, reactive } from 'vue'
import { GameService } from '@modules/media/game/api/gameService'
import type { Game } from '@modules/media/game/types/types'
import { Check, Play } from 'lucide-vue-next'
import { useToast } from '@common/components/ui/toast/use-toast'

const props = defineProps<{
  game: Game | null
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'update', updatedGame: Game): void
  (e: 'delete', id: string): void
}>()

const { toast } = useToast()

const isEditing = ref(false)
const saving = ref(false)
const selectedFile = ref<File | null>(null)
const previewUrl = ref<string | null>(null)

// Local Mutable State
const form = reactive<{
  title: string
  developer: string
  publisher: string
  platforms: string
  genres: string
  releaseDate: string
  status: string
  score: number
  playTime: number
}>({
  title: '',
  developer: '',
  publisher: '',
  platforms: '',
  genres: '',
  releaseDate: '',
  status: '',
  score: 0,
  playTime: 0
})

// Sync props to form when opened
function syncForm(data: Game) {
  selectedFile.value = null
  previewUrl.value = null
  
  form.title = data.title
  form.developer = data.developer
  form.publisher = data.publisher
  form.status = data.userStats?.status ?? ''
  form.score = data.userStats?.score ?? 0
  form.playTime = data.userStats?.playTime ?? 0
  form.releaseDate = data.releaseDate ?? ''
  form.genres = data.genres ? data.genres.join(', ') : ''
  form.platforms = data.platforms ? data.platforms.join(', ') : ''
}

watch(() => props.game, (newVal) => {
  if (newVal) {
    syncForm(newVal)
    isEditing.value = false 
  }
}, { immediate: true })

function cancelEdit() {
  if (props.game) syncForm(props.game)
  isEditing.value = false
}

function handleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    selectedFile.value = file
    previewUrl.value = URL.createObjectURL(file)
  }
}

async function updateStatus(newStatus: string) {
  if (!props.game) return
  
  saving.value = true
  
  try {
    const payload = {
      userStats: {
        ...(props.game.userStats || {}),
        status: newStatus
      }
    }

    const updated = await GameService.update(props.game.id, payload)
    
    toast({
      title: 'Status Updated',
      description: `Game marked as ${newStatus}`,
    })
    
    emit('update', updated)
  } catch (err) {
    console.error('Failed to update status', err)
    toast({
      title: 'Error',
      description: 'Failed to update status',
      variant: 'destructive',
    })
  } finally {
    saving.value = false
  }
}

async function handleSave() {
  if (!props.game) return
  
  saving.value = true
  try {
    const payload: Partial<Game> = {
      title: form.title,
      developer: form.developer,
      publisher: form.publisher,
      releaseDate: form.releaseDate,
      userStats: {
        ...props.game.userStats,
        status: form.status,
        score: Number(form.score),
        playTime: Number(form.playTime)
      },
      platforms: form.platforms.split(',').map(s => s.trim()).filter(s => s),
      genres: form.genres.split(',').map(s => s.trim()).filter(s => s),
    }

    let updateData: Partial<Game> | FormData = payload
    
    // If file selected, use FormData
    if (selectedFile.value) {
      const fd = new FormData()
      fd.append('imageUrl', selectedFile.value)
      fd.append('data', JSON.stringify(payload))
      updateData = fd
    }

    const updated = await GameService.update(props.game.id, updateData)
    
    toast({
      title: 'Success',
      description: 'Details updated',
    })
    
    emit('update', updated) // Notify parent to update list
    isEditing.value = false
  } catch (err) {
    console.error('Failed to update', err)
    toast({
      title: 'Error',
      description: 'Failed to save changes',
      variant: 'destructive',
    })
  } finally {
    saving.value = false
  }
}

const isDeleting = ref(false)

async function handleDelete() {
  if (!props.game) return
  
  if (!confirm('Are you sure you want to delete this Game? This action cannot be undone.')) {
    return
  }
  
  isDeleting.value = true
  try {
    await GameService.delete(props.game.id)
    toast({
      title: 'Deleted',
      description: 'Removed from library',
    })
    emit('delete', props.game.id)
  } catch (err) {
    console.error('Failed to delete', err)
    toast({
      title: 'Error',
      description: 'Failed to delete',
      variant: 'destructive',
    })
    isDeleting.value = false
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
             v-if="previewUrl || game?.imageUrl" 
             :src="previewUrl || game?.imageUrl" 
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
             <h2 class="text-2xl sm:text-3xl font-bold line-clamp-2">{{ game?.title }}</h2>
             <div class="flex flex-wrap gap-2 mt-2 text-sm opacity-90">
               <span 
                v-for="p in (game?.platforms || [])"
                :key="p"
                class="px-2 py-0.5 rounded bg-primary/20 border border-primary/30 backdrop-blur-sm"
               >
                 {{ p }}
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
                 <div class="text-xs text-muted-foreground uppercase tracking-wider mb-1">Hours Played</div>
                 <div class="font-medium">{{ form.playTime }} h</div>
               </div>
               <div class="p-3 bg-secondary/30 rounded-lg">
                 <div class="text-xs text-muted-foreground uppercase tracking-wider mb-1">Released</div>
                 <div class="font-medium">
                   {{ form.releaseDate ? new Date(form.releaseDate).getFullYear() : 'TBA' }}
                 </div>
               </div>
            </div>

            <div v-if="form.developer || form.publisher" class="grid grid-cols-2 gap-4">
                <div v-if="form.developer" class="p-3 bg-secondary/30 rounded-lg">
                    <div class="text-xs text-muted-foreground uppercase tracking-wider mb-1">Developer</div>
                    <div class="font-medium">{{ form.developer }}</div>
                </div>
                 <div v-if="form.publisher" class="p-3 bg-secondary/30 rounded-lg">
                    <div class="text-xs text-muted-foreground uppercase tracking-wider mb-1">Publisher</div>
                    <div class="font-medium">{{ form.publisher }}</div>
                </div>
            </div>

            <div v-if="form.genres" class="space-y-2">
              <h4 class="text-sm font-semibold text-muted-foreground">Genres</h4>
              <div class="flex flex-wrap gap-2">
                <span 
                  v-for="g in form.genres.split(', ')" 
                  :key="g"
                  class="px-2 py-1 text-xs rounded-md bg-secondary text-secondary-foreground"
                >
                  {{ g }}
                </span>
              </div>
            </div>

             <!-- Metadata Grid -->
             <div class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div class="text-muted-foreground">Platforms</div>
              <div>{{ form.platforms }}</div>
             
              <div class="text-muted-foreground">Added to Library</div>
              <div>{{ new Date(game?.createdAt || '').toLocaleDateString() }}</div>
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

             <div class="space-y-2">
               <label class="text-sm font-medium">Poster Image</label>
               <input 
                 type="file"
                 accept="image/*"
                 @change="handleFileSelect"
                 class="w-full px-3 py-2 rounded-md bg-background border border-input file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
               />
               <p class="text-xs text-muted-foreground">Max 5MB. Supports JPG, PNG, WEBP.</p>
             </div>

             <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="space-y-2">
                    <label class="text-sm font-medium">Developer</label>
                    <input 
                        v-model="form.developer"
                        class="w-full px-3 py-2 rounded-md bg-background border border-input focus:ring-1 focus:ring-ring"
                    />
                </div>
                 <div class="space-y-2">
                    <label class="text-sm font-medium">Publisher</label>
                    <input 
                        v-model="form.publisher"
                        class="w-full px-3 py-2 rounded-md bg-background border border-input focus:ring-1 focus:ring-ring"
                    />
                </div>
             </div>

             <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div class="space-y-2">
                 <label class="text-sm font-medium">Platforms (comma separated)</label>
                 <input 
                   v-model="form.platforms"
                   class="w-full px-3 py-2 rounded-md bg-background border border-input focus:ring-1 focus:ring-ring"
                 />
               </div>
                <div class="space-y-2">
                 <label class="text-sm font-medium">Release Date</label>
                  <input 
                   v-model="form.releaseDate"
                   type="date"
                   class="w-full px-3 py-2 rounded-md bg-background border border-input focus:ring-1 focus:ring-ring"
                 />
               </div>
             </div>

             <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
               
               <div class="space-y-2">
                 <label class="text-sm font-medium">Status</label>
                 <select 
                   v-model="form.status"
                   class="w-full px-3 py-2 rounded-md bg-background border border-input focus:ring-1 focus:ring-ring"
                 >
                   <option value="Planned">Planned</option>
                   <option value="Playing">Playing</option>
                   <option value="Completed">Completed</option>
                   <option value="Dropped">Dropped</option>
                 </select>
               </div>

               <div class="space-y-2">
                 <label class="text-sm font-medium">Score (0-10)</label>
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
                 <label class="text-sm font-medium">Hours Played</label>
                 <input 
                   v-model="form.playTime"
                   type="number"
                   min="0"
                   class="w-full px-3 py-2 rounded-md bg-background border border-input focus:ring-1 focus:ring-ring"
                 />
               </div>

             </div>

             <div class="space-y-2">
               <label class="text-sm font-medium">Genres (comma separated)</label>
               <input 
                 v-model="form.genres"
                 placeholder="RPG, Action, Simulation"
                 class="w-full px-3 py-2 rounded-md bg-background border border-input focus:ring-1 focus:ring-ring"
               />
             </div>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="p-4 border-t border-border bg-secondary/10 flex justify-end gap-3">
          <div v-if="!isEditing" class="flex gap-3">
             <!-- Status Buttons -->
             <button 
               v-if="form.status !== 'Completed'"
               @click="updateStatus('Completed')"
               class="px-5 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
               :disabled="saving"
             >
               <Check class="w-4 h-4" />
               <span>Complete</span>
             </button>
             
             <button 
                v-if="form.status !== 'Playing'"
                @click="updateStatus('Playing')"
                class="px-5 py-2 rounded-lg bg-amber-600 text-white font-medium hover:bg-amber-700 transition-colors flex items-center gap-2"
                :disabled="saving"
              >
                <Play class="w-4 h-4 fill-current" />
                <span>Play</span>
              </button>

             <button 
               @click="isEditing = true"
               class="px-5 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
             >
               Edit Details
             </button>
          </div>
          <div v-else class="flex gap-3">
             <button 
               @click="cancelEdit"
               class="px-4 py-2 rounded-lg border border-input hover:bg-accent hover:text-accent-foreground transition-colors"
               :disabled="saving || isDeleting"
             >
               Cancel
             </button>
             <button 
                @click="handleDelete"
                class="px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                :disabled="saving || isDeleting"
              >
                {{ isDeleting ? 'Deleting...' : 'Delete' }}
              </button>
             <button 
               @click="handleSave"
               class="px-5 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
               :disabled="saving || isDeleting"
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
