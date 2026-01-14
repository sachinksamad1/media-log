<script setup lang="ts">
import { ref, reactive } from 'vue'
import { AnimeService } from '@/modules/media/anime/api/animeService'
import type { Anime } from '@/modules/media/anime/types/types'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'created', newAnime: Anime): void
}>()

const saving = ref(false)
const selectedFile = ref<File | null>(null)
const previewUrl = ref<string | null>(null)

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
  status: 'Planned',
  score: 0,
  totalSeasons: 0,
  isReleaseCompleted: false,
  genre: ''
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
  form.status = 'Planned'
  form.score = 0
  form.totalSeasons = 0
  form.isReleaseCompleted = false
  form.genre = ''
  selectedFile.value = null
  previewUrl.value = null
}

function close() {
  resetForm()
  emit('close')
}

async function handleSave() {
  if (!form.title) {
    alert('Title is required')
    return
  }

  saving.value = true
  try {
    const payload: Partial<Anime> = {
      title: form.title,
      userStats: {
        status: form.status,
        score: Number(form.score)
      },
      releaseStats: {
        totalSeasons: Number(form.totalSeasons),
        isCompleted: form.isReleaseCompleted
      },
      genre: form.genre.split(',').map(s => s.trim()).filter(s => s),
      // origin and language defaults handled by backend or can be added here
      origin: 'Anime', 
      language: 'Japanese'
    }

    let createData: Partial<Anime> | FormData = payload
    
    // If file selected, use FormData
    if (selectedFile.value) {
      const fd = new FormData()
      fd.append('imageUrl', selectedFile.value)
      fd.append('data', JSON.stringify(payload))
      createData = fd
    }

    const created = await AnimeService.create(createData)
    emit('created', created)
    close()
  } catch (err) {
    console.error('Failed to create', err)
    alert('Failed to add anime')
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
          <h2 class="text-xl font-bold">Add New Anime</h2>
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
              placeholder="Enter anime title"
              autofocus
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
                id="newIsCompleted"
                type="checkbox"
                v-model="form.isReleaseCompleted"
                class="w-4 h-4 rounded border-input bg-background text-primary focus:ring-ring"
              />
              <label for="newIsCompleted" class="text-sm font-medium cursor-pointer select-none">
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
             {{ saving ? 'Creating...' : 'Create Anime' }}
           </button>
        </div>

      </div>
    </div>
  </Teleport>
</template>
