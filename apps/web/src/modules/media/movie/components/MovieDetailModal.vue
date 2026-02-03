<script setup lang="ts">
import { ref, watch, reactive } from 'vue'
import { MovieService } from '@modules/media/movie/api/movieService'
import type { Movie } from '@modules/media/movie/types/types'
import { Check, Play } from 'lucide-vue-next'
import { useToast } from '@common/components/ui/toast/use-toast'

const props = defineProps<{
  movie: Movie | null
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'update', updatedMovie: Movie): void
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
  director: string
  producer: string
  studio: string
  cast: string
  genres: string
  releaseDate: string
  duration: number
  language: string
  origin: string
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
  origin: '',
  status: '',
  score: 0,
  watchedDate: '',
  rewatchCount: 0,
})

// Sync props to form when opened
function syncForm(data: Movie) {
  selectedFile.value = null
  previewUrl.value = null

  form.title = data.title
  form.director = data.director ?? ''
  form.producer = data.movieStats?.productionCompany ?? ''
  form.studio = '' // Deprecated/merged
  form.status = data.userStats?.status ?? ''
  form.score = data.userStats?.score ?? 0
  form.watchedDate = '' // Not in schema
  form.rewatchCount = 0 // Not in schema
  form.releaseDate = data.movieStats?.releaseDate ?? ''
  form.duration = data.movieStats?.runtimeMinutes ?? 0
  form.language = data.language ?? ''
  form.origin = data.origin ?? ''

  form.genres = data.genres ? data.genres.join(', ') : ''
  form.cast = data.cast ? data.cast.join(', ') : ''
}

watch(
  () => props.movie,
  (newVal) => {
    if (newVal) {
      syncForm(newVal)
      isEditing.value = false
    }
  },
  { immediate: true }
)

function cancelEdit() {
  if (props.movie) syncForm(props.movie)
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
  if (!props.movie) return

  saving.value = true

  try {
    const payload = {
      userStats: {
        ...(props.movie.userStats || {}),
        status: newStatus,
      },
    }

    const updated = await MovieService.update(props.movie.id, payload)

    toast({
      title: 'Status Updated',
      description: `Movie marked as ${newStatus}`,
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
  if (!props.movie) return

  saving.value = true
  try {
    const payload: Partial<Movie> = {
      title: form.title,
      director: form.director || undefined,
      // producer/studio mapped to productionCompany
      movieStats: {
        ...props.movie.movieStats,
        // Only include releaseDate if it has a value (empty string fails date coercion)
        releaseDate: form.releaseDate || undefined,
        runtimeMinutes: form.duration ? Number(form.duration) : undefined,
        productionCompany: form.producer || form.studio || undefined,
      },
      origin: form.origin || undefined,
      language: form.language || undefined,

      userStats: {
        ...props.movie.userStats,
        status: form.status,
        score: Number(form.score),
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

    let updateData: Partial<Movie> | FormData = payload

    // If file selected, use FormData
    if (selectedFile.value) {
      const fd = new FormData()
      fd.append('imageUrl', selectedFile.value)
      fd.append('data', JSON.stringify(payload))
      updateData = fd
    }

    const updated = await MovieService.update(props.movie.id, updateData)

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
  if (!props.movie) return

  if (!confirm('Are you sure you want to delete this Movie? This action cannot be undone.')) {
    return
  }

  isDeleting.value = true
  try {
    await MovieService.delete(props.movie.id)
    toast({
      title: 'Deleted',
      description: 'Removed from library',
    })
    emit('delete', props.movie.id)
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
      <div
        class="relative bg-card text-card-foreground w-full max-w-2xl rounded-xl shadow-2xl border border-border flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        <!-- Header Image & Close -->
        <div class="relative h-48 sm:h-64 shrink-0 overflow-hidden bg-muted">
          <img
            v-if="previewUrl || movie?.imageUrl"
            :src="previewUrl || movie?.imageUrl"
            class="w-full h-full object-cover"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>

          <button
            class="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full transition-colors z-10"
            @click="emit('close')"
          >
            ✕
          </button>

          <div class="absolute bottom-4 left-6 right-6 text-white">
            <h2 class="text-2xl sm:text-3xl font-bold line-clamp-2">{{ movie?.title }}</h2>
            <div class="flex flex-wrap gap-2 mt-2 text-sm opacity-90">
              <span
                v-for="c in movie?.cast?.slice(0, 3) || []"
                :key="c"
                class="px-2 py-0.5 rounded bg-primary/20 border border-primary/30 backdrop-blur-sm"
              >
                {{ c }}
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
                <div class="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                  Status
                </div>
                <div class="font-medium">{{ form.status }}</div>
              </div>
              <div class="p-3 bg-secondary/30 rounded-lg">
                <div class="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                  Duration
                </div>
                <div class="font-medium">{{ form.duration }}m</div>
              </div>
              <div class="p-3 bg-secondary/30 rounded-lg">
                <div class="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                  Released
                </div>
                <div class="font-medium">
                  {{ form.releaseDate ? new Date(form.releaseDate).getFullYear() : 'TBA' }}
                </div>
              </div>
            </div>

            <div v-if="form.director || form.producer" class="grid grid-cols-2 gap-4">
              <div v-if="form.director" class="p-3 bg-secondary/30 rounded-lg">
                <div class="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                  Director
                </div>
                <div class="font-medium">{{ form.director }}</div>
              </div>
              <div v-if="form.producer" class="p-3 bg-secondary/30 rounded-lg">
                <div class="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                  Producer
                </div>
                <div class="font-medium">{{ form.producer }}</div>
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
              <div class="text-muted-foreground">Language</div>
              <div>{{ form.language }}</div>

              <div class="text-muted-foreground">Country</div>
              <div>{{ form.origin }}</div>

              <div class="text-muted-foreground">Added to Library</div>
              <div>{{ new Date(movie?.createdAt || '').toLocaleDateString() }}</div>
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
                class="w-full px-3 py-2 rounded-md bg-background border border-input file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                @change="handleFileSelect"
              />
              <p class="text-xs text-muted-foreground">Max 5MB. Supports JPG, PNG, WEBP.</p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="text-sm font-medium">Director</label>
                <input
                  v-model="form.director"
                  class="w-full px-3 py-2 rounded-md bg-background border border-input focus:ring-1 focus:ring-ring"
                />
              </div>
              <div class="space-y-2">
                <label class="text-sm font-medium">Producer</label>
                <input
                  v-model="form.producer"
                  class="w-full px-3 py-2 rounded-md bg-background border border-input focus:ring-1 focus:ring-ring"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="text-sm font-medium">Cast (comma separated)</label>
                <input
                  v-model="form.cast"
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
                />
              </div>
              <div class="space-y-2">
                <label class="text-sm font-medium">Country</label>
                <input
                  v-model="form.origin"
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
              <label class="text-sm font-medium">Genres (comma separated)</label>
              <input
                v-model="form.genres"
                placeholder="Action, Drama, Comedy"
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
              class="px-5 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
              :disabled="saving"
              @click="updateStatus('Completed')"
            >
              <Check class="w-4 h-4" />
              <span>Complete</span>
            </button>

            <button
              v-if="form.status !== 'Watching'"
              class="px-5 py-2 rounded-lg bg-amber-600 text-white font-medium hover:bg-amber-700 transition-colors flex items-center gap-2"
              :disabled="saving"
              @click="updateStatus('Watching')"
            >
              <Play class="w-4 h-4 fill-current" />
              <span>Watch</span>
            </button>

            <button
              class="px-5 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
              @click="isEditing = true"
            >
              Edit Details
            </button>
          </div>
          <div v-else class="flex gap-3">
            <button
              class="px-4 py-2 rounded-lg border border-input hover:bg-accent hover:text-accent-foreground transition-colors"
              :disabled="saving || isDeleting"
              @click="cancelEdit"
            >
              Cancel
            </button>
            <button
              class="px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
              :disabled="saving || isDeleting"
              @click="handleDelete"
            >
              {{ isDeleting ? 'Deleting...' : 'Delete' }}
            </button>
            <button
              class="px-5 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
              :disabled="saving || isDeleting"
              @click="handleSave"
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
