<script setup lang="ts">
import { ref, reactive } from 'vue'
import { TvSeriesService } from '@modules/media/tvSeries/api/tvSeriesService'
import type { TvSeries } from '@modules/media/tvSeries/types/types'
import { useToast } from '@common/components/ui/toast/use-toast'

defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'created', newShow: TvSeries): void
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
  network: string
  cast: string
  genres: string
  releaseDate: string
  endDate: string
  episodes: number
  language: string
  country: string
  status: string
  score: number
  watchedEpisodes: number
  rewatchCount: number
}>({
  title: '',
  director: '',
  producer: '',
  studio: '',
  network: '',
  cast: '',
  genres: '',
  releaseDate: '',
  endDate: '',
  episodes: 0,
  language: '',
  country: '',
  status: 'Planned',
  score: 0,
  watchedEpisodes: 0,
  rewatchCount: 0,
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
  form.network = ''
  form.cast = ''
  form.genres = ''
  form.releaseDate = ''
  form.endDate = ''
  form.episodes = 0
  form.language = ''
  form.country = ''
  form.status = 'Planned'
  form.score = 0
  form.watchedEpisodes = 0
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
    const payload: Partial<TvSeries> = {
      title: form.title,
      directors: form.director
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s),
      tvSeriesStats: {
        airingYear: form.releaseDate.split('-')[0] || '2000',
        currentSeason: 1, // Default or add input
        totalSeasons: 1, // Default or add input
        totalEpisodes: Number(form.episodes) > 0 ? Number(form.episodes) : undefined,
        isCompleted: form.status === 'Completed',
        // endDate mapping if needed? No endDate in TvSeriesStats schema shown in Step 197.
      },
      origin: form.country,
      language: form.language,
      network: form.network,
      studio: form.studio,
      userStats: {
        status: form.status,
        score: Number(form.score),
        watchedEpisodes: Number(form.watchedEpisodes),
        rewatchCount: Number(form.rewatchCount),
      },
      cast: form.cast
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s),
      genres: form.genres
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s),
    }

    let createData: Partial<TvSeries> | FormData = payload

    // If file selected, use FormData
    if (selectedFile.value) {
      const fd = new FormData()
      fd.append('imageUrl', selectedFile.value)
      fd.append('data', JSON.stringify(payload))
      createData = fd
    }

    const created = await TvSeriesService.create(createData)
    toast({
      title: 'Success',
      description: 'TV Series added to your library',
    })
    emit('created', created)
    close()
  } catch (err) {
    console.error('Failed to create', err)
    toast({
      title: 'Error',
      description: 'Failed to add TV Series',
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
          <h2 class="text-xl font-bold">Add New TV Series</h2>
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
              @click="
                selectedFile = null,
                previewUrl = null
              "
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
              <label class="text-sm font-medium">Network</label>
              <input
                v-model="form.network"
                class="w-full px-3 py-2 rounded-md bg-background border border-input focus:ring-1 focus:ring-ring"
                placeholder="Netflix, HBO"
              />
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium">Studio</label>
              <input
                v-model="form.studio"
                class="w-full px-3 py-2 rounded-md bg-background border border-input focus:ring-1 focus:ring-ring"
                placeholder="Studio name"
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

          <!-- Extra Metadata -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="text-sm font-medium">Creator/Director</label>
              <input
                v-model="form.director"
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
              <label class="text-sm font-medium">Total Episodes</label>
              <input
                v-model="form.episodes"
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
                placeholder="English"
              />
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium">Country</label>
              <input
                v-model="form.country"
                class="w-full px-3 py-2 rounded-md bg-background border border-input focus:ring-1 focus:ring-ring"
                placeholder="USA"
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
                <option value="Watching">Watching</option>
                <option value="Completed">Completed</option>
                <option value="Dropped">Dropped</option>
                <option value="On-Hold">On-Hold</option>
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
            <label class="text-sm font-medium">Watched Episodes</label>
            <input
              v-model="form.watchedEpisodes"
              type="number"
              min="0"
              class="w-full px-3 py-2 rounded-md bg-background border border-input focus:ring-1 focus:ring-ring"
            />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium">Genres (comma separated)</label>
            <input
              v-model="form.genres"
              placeholder="Drama, Sci-Fi, Crime"
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
            {{ saving ? 'Creating...' : 'Add Show' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
