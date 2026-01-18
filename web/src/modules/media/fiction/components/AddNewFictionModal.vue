<script setup lang="ts">
import { ref, reactive } from 'vue'
import { FictionService } from '@modules/media/fiction/api/fictionService'
import type { Fiction } from '@modules/media/fiction/types/types'
import { useToast } from '@common/components/ui/toast/use-toast'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'created', newFiction: Fiction): void
}>()

const { toast } = useToast()

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
  volumes: number
  releaseStatus: string
  genre: string
  type: string
  format: string
  origin: string
}>({
  title: '',
  author: '',
  illustrator: '',
  status: 'Planned',
  score: 0,
  volumes: 0,
  releaseStatus: 'Ongoing',
  genre: '',
  type: 'Series',
  format: 'Physical',
  origin: 'USA'
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
  form.author = ''
  form.illustrator = ''
  form.status = 'Planned'
  form.score = 0
  form.volumes = 0
  form.releaseStatus = 'Ongoing'
  form.genre = ''
  form.type = 'Series'
  form.format = 'Physical'
  form.origin = 'USA'
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
    const payload: Partial<Fiction> = {
      title: form.title,
      author: form.author,
      illustrator: form.illustrator,
      type: form.type,
      format: form.format,
      origin: form.origin,
      userStats: {
        status: form.status,
        score: Number(form.score)
      },
      releaseStats: {
        volumes: Number(form.volumes),
        releaseStatus: form.releaseStatus
      },
      genres: form.genre.split(',').map(s => s.trim()).filter(s => s),
    }

    let createData: Partial<Fiction> | FormData = payload
    
    // If file selected, use FormData
    if (selectedFile.value) {
      const fd = new FormData()
      fd.append('imageUrl', selectedFile.value)
      fd.append('data', JSON.stringify(payload))
      createData = fd
    }

    const created = await FictionService.create(createData)
    toast({
      title: 'Success',
      description: 'Fiction added to your library',
    })
    emit('created', created)
    close()
  } catch (err) {
    console.error('Failed to create', err)
    toast({
      title: 'Error',
      description: 'Failed to add Fiction',
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
          <h2 class="text-xl font-bold">Add New Fiction</h2>
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
              <label class="text-sm font-medium">Author</label>
              <input 
                v-model="form.author"
                class="w-full px-3 py-2 rounded-md bg-background border border-input focus:ring-1 focus:ring-ring"
                placeholder="Author name"
              />
            </div>
             <div class="space-y-2">
              <label class="text-sm font-medium">Illustrator</label>
              <input 
                v-model="form.illustrator"
                class="w-full px-3 py-2 rounded-md bg-background border border-input focus:ring-1 focus:ring-ring"
                placeholder="Illustrator name"
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

          <!-- Type and Format -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="text-sm font-medium">Type</label>
              <select 
                v-model="form.type"
                class="w-full px-3 py-2 rounded-md bg-background border border-input focus:ring-1 focus:ring-ring"
              >
                <option value="Series">Series</option>
                <option value="Standalone">Standalone</option>
              </select>
            </div>
             <div class="space-y-2">
              <label class="text-sm font-medium">Format</label>
               <select 
                v-model="form.format"
                class="w-full px-3 py-2 rounded-md bg-background border border-input focus:ring-1 focus:ring-ring"
              >
                <option value="Physical">Physical</option>
                <option value="Digital">Digital</option>
                <option value="Audiobook">Audiobook</option>
                <option value="Hardcover">Hardcover</option>
                <option value="Paperback">Paperback</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <div class="space-y-2">
              <label class="text-sm font-medium">Origin</label>
               <select 
                v-model="form.origin"
                class="w-full px-3 py-2 rounded-md bg-background border border-input focus:ring-1 focus:ring-ring"
              >
                <option value="USA">USA</option>
                <option value="UK">UK</option>
                <option value="Japan">Japan</option>
                <option value="Other">Other</option>
              </select>
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

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div class="space-y-2">
              <label class="text-sm font-medium">Status (My List)</label>
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
              <label class="text-sm font-medium">Volumes</label>
              <input 
                v-model="form.volumes"
                type="number"
                min="0"
                class="w-full px-3 py-2 rounded-md bg-background border border-input focus:ring-1 focus:ring-ring"
              />
            </div>

          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium">Genres (comma separated)</label>
            <input 
              v-model="form.genre"
              placeholder="Fantasy, Sci-Fi, Mystery"
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
             {{ saving ? 'Creating...' : 'Add Fiction' }}
           </button>
        </div>

      </div>
    </div>
  </Teleport>
</template>
