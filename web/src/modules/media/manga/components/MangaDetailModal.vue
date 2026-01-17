<script setup lang="ts">
import { ref, watch, reactive } from 'vue'
import { MangaService } from '@/modules/media/manga/api/manga.service'
import type { Manga } from '@/modules/media/manga/types/types'
import { Check, RotateCcw } from 'lucide-vue-next'
import { useToast } from '@/common/components/ui/toast/use-toast'

const props = defineProps<{
  manga: Manga | null
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'update', updatedManga: Manga): void
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
  author: string
  illustrator: string
  status: string
  score: number
  volumePublished: number
  chapterPublished: number
  releaseStatus: string
  genre: string
  type: string
  format: string
}>({
  title: '',
  author: '',
  illustrator: '',
  status: '',
  score: 0,
  volumePublished: 0,
  chapterPublished: 0,
  releaseStatus: '',
  genre: '',
  type: '',
  format: ''
})

// Sync props to form when opened
function syncForm(data: Manga) {
  selectedFile.value = null
  previewUrl.value = null
  
  form.title = data.title
  form.author = data.author
  form.illustrator = data.illustrator
  form.status = data.userStats?.status ?? ''
  form.score = data.userStats?.score ?? 0
  form.volumePublished = data.releaseStats?.volumePublished ?? 0
  form.chapterPublished = data.releaseStats?.chapterPublished ?? 0
  form.releaseStatus = data.releaseStats?.releaseStatus ?? 'Ongoing'
  form.genre = data.genres ? data.genres.join(', ') : ''
  form.type = data.type
  form.format = data.format
}

watch(() => props.manga, (newVal) => {
  if (newVal) {
    syncForm(newVal)
    isEditing.value = false 
  }
}, { immediate: true })

function cancelEdit() {
  if (props.manga) syncForm(props.manga)
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

async function toggleStatus() {
  if (!props.manga) return
  
  const newStatus = form.status === 'Completed' ? 'Ongoing' : 'Completed'
  saving.value = true
  
  try {
    const payload = {
      userStats: {
        ...(props.manga.userStats || {}),
        status: newStatus
      }
    }

    const updated = await MangaService.update(props.manga.id, payload)
    
    toast({
      title: 'Status Updated',
      description: `Manga marked as ${newStatus}`,
    })
    
    emit('update', updated)
  } catch (err) {
    console.error('Failed to toggle status', err)
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
  if (!props.manga) return
  
  saving.value = true
  try {
    const payload: Partial<Manga> = {
      title: form.title,
      author: form.author,
      illustrator: form.illustrator,
      type: form.type,
      format: form.format,
      userStats: {
        ...props.manga.userStats,
        status: form.status,
        score: Number(form.score)
      },
      releaseStats: {
        ...props.manga.releaseStats,
        volumePublished: Number(form.volumePublished),
        chapterPublished: Number(form.chapterPublished),
        releaseStatus: form.releaseStatus
      },
      genres: form.genre.split(',').map(s => s.trim()).filter(s => s)
    }

    let updateData: Partial<Manga> | FormData = payload
    
    // If file selected, use FormData
    if (selectedFile.value) {
      const fd = new FormData()
      fd.append('imageUrl', selectedFile.value)
      fd.append('data', JSON.stringify(payload))
      updateData = fd
    }

    const updated = await MangaService.update(props.manga.id, updateData)
    
    toast({
      title: 'Success',
      description: 'Manga details updated',
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
  if (!props.manga) return
  
  if (!confirm('Are you sure you want to delete this manga? This action cannot be undone.')) {
    return
  }
  
  isDeleting.value = true
  try {
    await MangaService.delete(props.manga.id)
    toast({
      title: 'Deleted',
      description: 'Manga removed from library',
    })
    emit('delete', props.manga.id)
  } catch (err) {
    console.error('Failed to delete', err)
    toast({
      title: 'Error',
      description: 'Failed to delete manga',
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
             v-if="previewUrl || manga?.imageUrl" 
             :src="previewUrl || manga?.imageUrl" 
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
             <h2 class="text-2xl sm:text-3xl font-bold line-clamp-2">{{ manga?.title }}</h2>
             <div class="flex gap-2 mt-2 text-sm opacity-90">
               <span class="px-2 py-0.5 rounded bg-primary/20 border border-primary/30 backdrop-blur-sm">
                 {{ manga?.origin || 'Japan' }}
               </span>
               <span class="px-2 py-0.5 rounded bg-primary/20 border border-primary/30 backdrop-blur-sm">
                 {{ manga?.type }}
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
                 <div class="text-xs text-muted-foreground uppercase tracking-wider mb-1">Vol / Ch</div>
                 <div class="font-medium">{{ form.volumePublished }} / {{ form.chapterPublished }}</div>
               </div>
               <div class="p-3 bg-secondary/30 rounded-lg">
                 <div class="text-xs text-muted-foreground uppercase tracking-wider mb-1">Released</div>
                 <div class="font-medium" :class="form.releaseStatus === 'Completed' ? 'text-green-500' : 'text-amber-500'">
                   {{ form.releaseStatus }}
                 </div>
               </div>
            </div>

            <div v-if="form.author || form.illustrator" class="grid grid-cols-2 gap-4">
                <div v-if="form.author" class="p-3 bg-secondary/30 rounded-lg">
                    <div class="text-xs text-muted-foreground uppercase tracking-wider mb-1">Author</div>
                    <div class="font-medium">{{ form.author }}</div>
                </div>
                 <div v-if="form.illustrator" class="p-3 bg-secondary/30 rounded-lg">
                    <div class="text-xs text-muted-foreground uppercase tracking-wider mb-1">Illustrator</div>
                    <div class="font-medium">{{ form.illustrator }}</div>
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
              <div>Japanese</div> <!-- Hardcoded for now, or match Origin -->
              
              <div class="text-muted-foreground">Format</div>
              <div>{{ form.format }}</div>

              <div class="text-muted-foreground">Added to Library</div>
              <div>{{ new Date(manga?.createdAt || '').toLocaleDateString() }}</div>
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
                    <label class="text-sm font-medium">Author</label>
                    <input 
                        v-model="form.author"
                        class="w-full px-3 py-2 rounded-md bg-background border border-input focus:ring-1 focus:ring-ring"
                    />
                </div>
                 <div class="space-y-2">
                    <label class="text-sm font-medium">Illustrator</label>
                    <input 
                        v-model="form.illustrator"
                        class="w-full px-3 py-2 rounded-md bg-background border border-input focus:ring-1 focus:ring-ring"
                    />
                </div>
             </div>

             <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label class="text-sm font-medium">Type</label>
                  <select 
                    v-model="form.type"
                    class="w-full px-3 py-2 rounded-md bg-background border border-input focus:ring-1 focus:ring-ring"
                  >
                    <option value="Manga">Manga</option>
                    <option value="Manhwa">Manhwa</option>
                    <option value="Manhua">Manhua</option>
                    <option value="One-shot">One-shot</option>
                    <option value="Doujinshi">Doujinshi</option>
                  </select>
                </div>
                 <div class="space-y-2">
                  <label class="text-sm font-medium">Format</label>
                   <select 
                    v-model="form.format"
                    class="w-full px-3 py-2 rounded-md bg-background border border-input focus:ring-1 focus:ring-ring"
                  >
                    <option value="Digital">Digital</option>
                    <option value="Physical">Physical</option>
                    <option value="Magazine">Magazine</option>
                  </select>
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
                 <label class="text-sm font-medium">Volumes Published</label>
                 <input 
                   v-model="form.volumePublished"
                   type="number"
                   min="0"
                   class="w-full px-3 py-2 rounded-md bg-background border border-input focus:ring-1 focus:ring-ring"
                 />
               </div>
                <div class="space-y-2">
                 <label class="text-sm font-medium">Chapters Published</label>
                 <input 
                   v-model="form.chapterPublished"
                   type="number"
                   min="0"
                   class="w-full px-3 py-2 rounded-md bg-background border border-input focus:ring-1 focus:ring-ring"
                 />
               </div>

                <div class="space-y-2">
                  <label class="text-sm font-medium">Release Status</label>
                   <select 
                    v-model="form.releaseStatus"
                    class="w-full px-3 py-2 rounded-md bg-background border border-input focus:ring-1 focus:ring-ring"
                  >
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                    <option value="Hiatus">Hiatus</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
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
          <div v-if="!isEditing" class="flex gap-3">
             <button 
               v-if="form.status !== 'Completed'"
               @click="toggleStatus"
               class="px-5 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
               :disabled="saving"
             >
               <Check class="w-4 h-4" />
               <span>Mark Complete</span>
             </button>
             <button 
               v-else
               @click="toggleStatus"
               class="px-5 py-2 rounded-lg border border-green-200 text-green-700 hover:bg-green-50 transition-colors flex items-center gap-2"
               :disabled="saving"
             >
               <RotateCcw class="w-4 h-4" />
               <span>Mark Ongoing</span>
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
