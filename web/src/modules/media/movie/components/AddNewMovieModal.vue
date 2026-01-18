<script setup lang="ts">
import { ref, reactive } from 'vue'
import { MovieService } from '@modules/media/movie/api/movieService'
import type { Movie } from '@modules/media/movie/types/types'
import { useToast } from '@common/components/ui/toast/use-toast'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'created', newMovie: Movie): void
}>()

const { toast } = useToast()

const saving = ref(false)
const selectedFile = ref<File | null>(null)
const previewUrl = ref<string | null>(null)

// Local Mutable State
const form = reactive<{
  title: string
  director: string
  producer: string
  studio: string
  cast: string
  genres: string
  releaseDate: string
  duration: number
  language: string
  country: string
  status: string
  score: number
  watchedDate: string
  rewatchCount: number
}>({
  title: '',
  director: '',
  producer: '',
  studio: '',
  cast: '',
  genres: '',
  releaseDate: '',
  duration: 0,
  language: '',
  country: '',
  status: 'Plan to Watch',
  score: 0,
  watchedDate: '',
  rewatchCount: 0
})

function handleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    selectedFile.value = file
    previewUrl.value = URL.createObjectURL(file)
  }
}

function resetForm() {
    form.title = ''
    form.director = ''
    form.producer = ''
    form.studio = ''
    form.cast = ''
    form.genres = ''
    form.releaseDate = ''
    form.duration = 0
    form.language = ''
    form.country = ''
    form.status = 'Plan to Watch'
    form.score = 0
    form.watchedDate = ''
    form.rewatchCount = 0
  selectedFile.value = null
  previewUrl.value = null
}

function close() {
  resetForm()
  emit('close')
}

async function handleSave() {
  if (!form.title) {
    toast({
      title: 'Validation Error',
      description: 'Title is required',
      variant: 'destructive',
    })
    return
  }

  saving.value = true
  try {
    const payload: Partial<Movie> = {
      title: form.title,
      director: form.director,
      producer: form.producer,
      studio: form.studio,
      releaseDate: form.releaseDate,
      duration: Number(form.duration),
      language: form.language,
      country: form.country,
      userStats: {
        status: form.status,
        score: Number(form.score),
        watchedDate: form.watchedDate,
        rewatchCount: Number(form.rewatchCount)
      },
      cast: form.cast.split(',').map(s => s.trim()).filter(s => s),
      genres: form.genres.split(',').map(s => s.trim()).filter(s => s),
    }

    let createData: Partial<Movie> | FormData = payload
    
    // If file selected, use FormData
    if (selectedFile.value) {
      const fd = new FormData()
      fd.append('imageUrl', selectedFile.value)
      fd.append('data', JSON.stringify(payload))
      createData = fd
    }

    const created = await MovieService.create(createData)
    toast({
      title: 'Success',
      description: 'Movie added to your library',
    })
    emit('created', created)
    close()
  } catch (err) {
    console.error('Failed to create', err)
    toast({
      title: 'Error',
      description: 'Failed to add Movie',
      variant: 'destructive',
    })
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="close"></div>

      <!-- Modal Content -->
      <div class="relative bg-card text-card-foreground w-full max-w-2xl rounded-xl shadow-2xl border border-border flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-border bg-secondary/10">
          <h2 class="text-xl font-bold">Add New Movie</h2>
          <button 
            @click="close"
            class="text-muted-foreground hover:text-foreground transition-colors"
          >
            ✕
          </button>
        </div>

        <!-- Scrollable Body -->
        <div class="flex-1 overflow-y-auto p-6 space-y-4">
          
          <!-- Image Preview -->
          <div v-if="previewUrl" class="w-full h-48 rounded-lg overflow-hidden relative mb-4">
             <img :src="previewUrl" class="w-full h-full object-cover" />
             <button 
               @click="selectedFile = null; previewUrl = null"
               class="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-black/80"
             >✕</button>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium">Title <span class="text-destructive">*</span></label>
            <input 
              v-model="form.title"
              class="w-full px-3 py-2 rounded-md bg-background border border-input focus:ring-1 focus:ring-ring"
              placeholder="Enter title"
              autofocus
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <div class="space-y-2">
              <label class="text-sm font-medium">Director</label>
              <input 
                v-model="form.director"
                class="w-full px-3 py-2 rounded-md bg-background border border-input focus:ring-1 focus:ring-ring"
                placeholder="Director name"
              />
            </div>
             <div class="space-y-2">
              <label class="text-sm font-medium">Producer</label>
              <input 
                v-model="form.producer"
                class="w-full px-3 py-2 rounded-md bg-background border border-input focus:ring-1 focus:ring-ring"
                placeholder="Producer name"
              />
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium">Poster Image</label>
            <input 
              type="file"
              accept="image/*"
              @change="handleFileSelect"
              class="w-full px-3 py-2 rounded-md bg-background border border-input file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
            />
          </div>

          <!-- Extra Metadata -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <div class="space-y-2">
              <label class="text-sm font-medium">Cast (comma separated)</label>
              <input 
                v-model="form.cast"
                placeholder="Actor 1, Actor 2"
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

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
             <div class="space-y-2">
                <label class="text-sm font-medium">Duration (minutes)</label>
                <input 
                  v-model="form.duration"
                  type="number"
                  min="0"
                  class="w-full px-3 py-2 rounded-md bg-background border border-input focus:ring-1 focus:ring-ring"
                />
              </div>
              <div class="space-y-2">
                <label class="text-sm font-medium">Language</label>
                <input 
                  v-model="form.language"
                  class="w-full px-3 py-2 rounded-md bg-background border border-input focus:ring-1 focus:ring-ring"
                  placeholder="English, Japanese"
                />
              </div>
              <div class="space-y-2">
                <label class="text-sm font-medium">Country</label>
                <input 
                  v-model="form.country"
                  class="w-full px-3 py-2 rounded-md bg-background border border-input focus:ring-1 focus:ring-ring"
                  placeholder="USA, UK"
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
                <option value="Plan to Watch">Plan to Watch</option>
                <option value="Watching">Watching</option>
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
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium">Genres (comma separated)</label>
            <input 
              v-model="form.genres"
              placeholder="Action, Drama, Comedy"
              class="w-full px-3 py-2 rounded-md bg-background border border-input focus:ring-1 focus:ring-ring"
            />
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="p-4 border-t border-border bg-secondary/10 flex justify-end gap-3">
          <button 
             @click="close"
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
             {{ saving ? 'Creating...' : 'Add Movie' }}
           </button>
        </div>

      </div>
    </div>
  </Teleport>
</template>
