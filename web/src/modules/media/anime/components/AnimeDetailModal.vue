<script setup lang="ts">
import { ref, watch, reactive } from 'vue'
import { AnimeService } from '@/modules/media/anime/api/animeService'
import type { Anime } from '@/modules/media/anime/types/types'
import { Check, RotateCcw } from 'lucide-vue-next'
import { useToast } from '@/common/components/ui/toast/use-toast'

const props = defineProps<{
  anime: Anime | null
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'update', updatedAnime: Anime): void
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
  imageUrl: string
  status: string
  score: number
  totalSeasons: number
  totalEpisodes: number
  airingStarted: string
  airingEnded: string
  isReleaseCompleted: boolean
  genre: string
}>({
  title: '',
  imageUrl: '',
  status: '',
  score: 0,
  totalSeasons: 1,
  totalEpisodes: 1,
  airingStarted: '',
  airingEnded: '',
  isReleaseCompleted: false,
  genre: '',
})

// Sync props to form when opened
function syncForm(data: Anime) {
  selectedFile.value = null
  previewUrl.value = null

  form.title = data.title
  form.status = data.userStats?.status ?? ''
  form.score = data.userStats?.score ?? 0
  form.totalSeasons = data.releaseStats?.totalSeasons ?? 0
  form.totalEpisodes = data.releaseStats?.totalEpisodes ?? 0
  form.airingStarted = data.releaseStats?.airingStarted ?? ''
  form.airingEnded = data.releaseStats?.airingEnded ?? ''
  form.isReleaseCompleted = data.releaseStats?.isCompleted ?? false
  form.genre = data.genres ? data.genres.join(', ') : ''
}

watch(
  () => props.anime,
  (newVal) => {
    if (newVal) {
      syncForm(newVal)
      isEditing.value = false
    }
  },
  { immediate: true }
)

function cancelEdit() {
  if (props.anime) syncForm(props.anime)
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
  if (!props.anime) return

  const newStatus = form.status === 'Completed' ? 'Ongoing' : 'Completed'
  saving.value = true

  try {
    const payload = {
      userStats: {
        ...(props.anime.userStats || {}),
        status: newStatus,
      },
    }

    const updated = await AnimeService.update(props.anime.id, payload)

    toast({
      title: 'Status Updated',
      description: `Anime marked as ${newStatus}`,
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
  if (!props.anime) return

  saving.value = true
  try {
    const payload: Partial<Anime> = {
      title: form.title,
      // userStats and releaseStats logic...
      userStats: {
        ...props.anime.userStats,
        status: form.status,
        score: Number(form.score),
      },
      releaseStats: {
        ...props.anime.releaseStats,
        totalSeasons: Number(form.totalSeasons),
        totalEpisodes: Number(form.totalEpisodes),
        airingStarted: form.airingStarted,
        airingEnded: form.airingEnded,
        isCompleted: form.isReleaseCompleted,
      },
      genres: form.genre
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s),
    }

    let updateData: Partial<Anime> | FormData = payload

    // If file selected, use FormData
    if (selectedFile.value) {
      const fd = new FormData()
      fd.append('imageUrl', selectedFile.value)
      fd.append('data', JSON.stringify(payload))
      updateData = fd
    }

    const updated = await AnimeService.update(props.anime.id, updateData)

    toast({
      title: 'Success',
      description: 'Anime details updated',
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
  if (!props.anime) return

  if (!confirm('Are you sure you want to delete this anime? This action cannot be undone.')) {
    return
  }

  isDeleting.value = true
  try {
    await AnimeService.delete(props.anime.id)
    toast({
      title: 'Deleted',
      description: 'Anime removed from library',
    })
    emit('delete', props.anime.id)
  } catch (err) {
    console.error('Failed to delete', err)
    toast({
      title: 'Error',
      description: 'Failed to delete anime',
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
            v-if="previewUrl || anime?.imageUrl"
            :src="previewUrl || anime?.imageUrl"
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
            <h2 class="text-2xl sm:text-3xl font-bold line-clamp-2">{{ anime?.title }}</h2>
            <div class="flex gap-2 mt-2 text-sm opacity-90">
              <span
                class="px-2 py-0.5 rounded bg-primary/20 border border-primary/30 backdrop-blur-sm"
              >
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
                <div class="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                  Status
                </div>
                <div class="font-medium">{{ form.status }}</div>
              </div>
              <div class="p-3 bg-secondary/30 rounded-lg">
                <div class="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                  Seasons / Eps
                </div>
                <div class="font-medium">{{ form.totalSeasons }} / {{ form.totalEpisodes }}</div>
              </div>
              <div class="p-3 bg-secondary/30 rounded-lg">
                <div class="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                  Released
                </div>
                <div
                  class="font-medium"
                  :class="form.isReleaseCompleted ? 'text-green-500' : 'text-amber-500'"
                >
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

              <div class="text-muted-foreground">Airing Started</div>
              <div>{{ form.airingStarted }}</div>

              <div class="text-muted-foreground">Airing Ended</div>
              <div>{{ form.airingEnded }}</div>

              <div class="text-muted-foreground">Added to Library</div>
              <div>{{ new Date(anime?.createdAt || '').toLocaleDateString() }}</div>

              <div class="text-muted-foreground">Last Updated</div>
              <div>{{ new Date(anime?.updatedAt || '').toLocaleDateString() }}</div>
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

              <div class="space-y-2">
                <label class="text-sm font-medium">Total Episodes</label>
                <input
                  v-model="form.totalEpisodes"
                  type="number"
                  min="0"
                  class="w-full px-3 py-2 rounded-md bg-background border border-input focus:ring-1 focus:ring-ring"
                />
              </div>

              <div class="space-y-2">
                <label class="text-sm font-medium">Airing Started</label>
                <input
                  v-model="form.airingStarted"
                  type="text"
                  placeholder="YYYY"
                  maxlength="4"
                  class="w-full px-3 py-2 rounded-md bg-background border border-input focus:ring-1 focus:ring-ring"
                />
              </div>

              <div class="space-y-2">
                <label class="text-sm font-medium">Airing Ended</label>
                <input
                  v-model="form.airingEnded"
                  type="text"
                  placeholder="YYYY"
                  maxlength="4"
                  class="w-full px-3 py-2 rounded-md bg-background border border-input focus:ring-1 focus:ring-ring"
                />
              </div>

              <div class="flex items-center gap-3 pt-8">
                <input
                  id="isCompleted"
                  v-model="form.isReleaseCompleted"
                  type="checkbox"
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
          <div v-if="!isEditing" class="flex gap-3">
            <button
              v-if="form.status !== 'Completed'"
              class="px-5 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
              :disabled="saving"
              @click="toggleStatus"
            >
              <Check class="w-4 h-4" />
              <span>Mark Complete</span>
            </button>
            <button
              v-else
              class="px-5 py-2 rounded-lg border border-green-200 text-green-700 hover:bg-green-50 transition-colors flex items-center gap-2"
              :disabled="saving"
              @click="toggleStatus"
            >
              <RotateCcw class="w-4 h-4" />
              <span>Mark Ongoing</span>
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
