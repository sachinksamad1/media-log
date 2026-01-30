<script setup lang="ts">
import { ref, reactive } from 'vue'
import { NonFictionService } from '@modules/media/nonFiction/api/nonFictionService'
import type { NonFiction } from '@modules/media/nonFiction/types/types'
import { useToast } from '@common/components/ui/toast/use-toast'
import { AxiosError } from 'axios'

defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'created', newNonFiction: NonFiction): void
}>()

const { toast } = useToast()

const saving = ref(false)
const selectedFile = ref<File | null>(null)
const previewUrl = ref<string | null>(null)

// Local Mutable State
const form = reactive<{
  title: string
  author: string
  // illustrator removed
  status: string
  score: number
  volumes: number
  releaseStatus: string // Used for computing isCompleted
  genre: string
  type: string
  format: string
  origin: string
  published: string // YYYY-MM-DD or string
}>({
  title: '',
  author: '',
  // illustrator removed
  status: 'Planned',
  score: 0,
  volumes: 0,
  releaseStatus: 'Ongoing',
  genre: '',
  type: 'Series',
  format: 'Physical',
  origin: '',
  published: '',
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
  form.status = 'Planned'
  form.score = 0
  form.volumes = 0
  form.releaseStatus = 'Ongoing'
  form.genre = ''
  form.type = 'Series'
  form.format = 'Physical'
  form.origin = ''
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
    const payload: Partial<NonFiction> = {
      title: form.title,
      author: form.author,
      format: form.format,
      origin: form.origin,
      published: form.published,
      userStats: {
        status: form.status,
        score: Number(form.score),
      },
      volumes: [
        {
          standalone: form.type === 'Standalone',
          seriesName: form.type === 'Series' ? form.title : undefined,
          order: 1,
          total: Number(form.volumes),
          isCompleted: form.releaseStatus === 'Completed',
        },
      ],
      genres: form.genre
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s),
    }

    let createData: Partial<NonFiction> | FormData = payload

    // If file selected, use FormData
    if (selectedFile.value) {
      const fd = new FormData()
      fd.append('imageUrl', selectedFile.value)
      fd.append('data', JSON.stringify(payload))
      createData = fd
    }

    const created = await NonFictionService.create(createData)
    toast({
      title: 'Success',
      description: 'Non-Fiction added to your library',
    })
    emit('created', created)
    close()
  } catch (err) {
    console.error('Failed to create', err)
    let message = 'Failed to add Non-Fiction'
    if (err instanceof AxiosError && err.response?.data?.message) {
      message = err.response.data.message
    }
    toast({
      title: 'Error',
      description: message,
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
      <div
        class="relative bg-card text-card-foreground w-full max-w-2xl rounded-xl shadow-2xl border border-border flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-border bg-secondary/10">
          <h2 class="text-xl font-bold">Add New Non-Fiction</h2>
          <button
            class="text-muted-foreground hover:text-foreground transition-colors"
            @click="close"
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
              class="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-black/80"
              @click="((selectedFile = null), (previewUrl = null))"
            >
              ✕
            </button>
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
              <label class="text-sm font-medium">Published Date</label>
              <input
                v-model="form.published"
                type="date"
                class="w-full px-3 py-2 rounded-md bg-background border border-input focus:ring-1 focus:ring-ring"
              />
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium">Poster Image</label>
            <input
              type="file"
              accept="image/*"
              class="w-full px-3 py-2 rounded-md bg-background border border-input file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              @change="handleFileSelect"
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
              <input
                v-model="form.origin"
                class="w-full px-3 py-2 rounded-md bg-background border border-input focus:ring-1 focus:ring-ring"
                placeholder="Origin"
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

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="text-sm font-medium">Status (My List)</label>
              <select
                v-model="form.status"
                class="w-full px-3 py-2 rounded-md bg-background border border-input focus:ring-1 focus:ring-ring"
              >
                <option value="Planned">Planned</option>
                <option value="Reading">Reading</option>
                <option value="Completed">Completed</option>
                <option value="Dropped">Dropped</option>
                <option value="On-Hold">On-Hold</option>
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
              placeholder="Biography, History, Science"
              class="w-full px-3 py-2 rounded-md bg-background border border-input focus:ring-1 focus:ring-ring"
            />
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="p-4 border-t border-border bg-secondary/10 flex justify-end gap-3">
          <button
            class="px-4 py-2 rounded-lg border border-input hover:bg-accent hover:text-accent-foreground transition-colors"
            :disabled="saving"
            @click="close"
          >
            Cancel
          </button>
          <button
            class="px-5 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
            :disabled="saving"
            @click="handleSave"
          >
            <span v-if="saving" class="animate-spin">⟳</span>
            {{ saving ? 'Creating...' : 'Add Non-Fiction' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
