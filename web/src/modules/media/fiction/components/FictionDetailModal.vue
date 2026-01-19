<script setup lang="ts">
import { ref, watch, reactive } from 'vue'
import { FictionService } from '@modules/media/fiction/api/fictionService'
import type { Fiction } from '@modules/media/fiction/types/types'
import { Check, RotateCcw } from 'lucide-vue-next'
import { useToast } from '@common/components/ui/toast/use-toast'

const props = defineProps<{
  fiction: Fiction | null
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'update', updatedFiction: Fiction): void
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
  status: '',
  score: 0,
  volumes: 0,
  releaseStatus: '',
  genre: '',
  type: '',
  format: '',
  origin: '',
})

// Sync props to form when opened
function syncForm(data: Fiction) {
  selectedFile.value = null
  previewUrl.value = null

  form.title = data.title
  form.author = data.author
  form.illustrator = data.illustrator ?? ''
  form.status = data.userStats?.status ?? ''
  form.score = data.userStats?.score ?? 0
  form.volumes = data.publicationInfo?.volumes ?? 0
  form.releaseStatus = data.publicationInfo?.status ?? 'Ongoing'
  form.genre = data.genres ? data.genres.join(', ') : ''
  form.type = data.type
  form.format = data.format
  form.origin = data.origin
}

watch(
  () => props.fiction,
  (newVal) => {
    if (newVal) {
      syncForm(newVal)
      isEditing.value = false
    }
  },
  { immediate: true }
)

function cancelEdit() {
  if (props.fiction) syncForm(props.fiction)
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
  if (!props.fiction) return

  const newStatus = form.status === 'Completed' ? 'Ongoing' : 'Completed'
  saving.value = true

  try {
    const payload = {
      userStats: {
        ...(props.fiction.userStats || {}),
        status: newStatus,
      },
    }

    const updated = await FictionService.update(props.fiction.id, payload)

    toast({
      title: 'Status Updated',
      description: `Fiction marked as ${newStatus}`,
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
  if (!props.fiction) return

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
        ...props.fiction.userStats,
        status: form.status,
        score: Number(form.score),
      },
      publicationInfo: {
        ...props.fiction.publicationInfo,
        volumes: Number(form.volumes),
        status: form.releaseStatus,
      },
      genres: form.genre
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s),
    }

    let updateData: Partial<Fiction> | FormData = payload

    // If file selected, use FormData
    if (selectedFile.value) {
      const fd = new FormData()
      fd.append('imageUrl', selectedFile.value)
      fd.append('data', JSON.stringify(payload))
      updateData = fd
    }

    const updated = await FictionService.update(props.fiction.id, updateData)

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
  if (!props.fiction) return

  if (!confirm('Are you sure you want to delete this Fiction? This action cannot be undone.')) {
    return
  }

  isDeleting.value = true
  try {
    await FictionService.delete(props.fiction.id)
    toast({
      title: 'Deleted',
      description: 'Removed from library',
    })
    emit('delete', props.fiction.id)
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
            v-if="previewUrl || fiction?.imageUrl"
            :src="previewUrl || fiction?.imageUrl"
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
            <h2 class="text-2xl sm:text-3xl font-bold line-clamp-2">{{ fiction?.title }}</h2>
            <div class="flex gap-2 mt-2 text-sm opacity-90">
              <span
                class="px-2 py-0.5 rounded bg-primary/20 border border-primary/30 backdrop-blur-sm"
              >
                {{ fiction?.origin || 'USA' }}
              </span>
              <span
                class="px-2 py-0.5 rounded bg-primary/20 border border-primary/30 backdrop-blur-sm"
              >
                {{ fiction?.type }}
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
                  Volumes
                </div>
                <div class="font-medium">{{ form.volumes }}</div>
              </div>
              <div class="p-3 bg-secondary/30 rounded-lg">
                <div class="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                  Released
                </div>
                <div
                  class="font-medium"
                  :class="form.releaseStatus === 'Completed' ? 'text-green-500' : 'text-amber-500'"
                >
                  {{ form.releaseStatus }}
                </div>
              </div>
            </div>

            <div v-if="form.author || form.illustrator" class="grid grid-cols-2 gap-4">
              <div v-if="form.author" class="p-3 bg-secondary/30 rounded-lg">
                <div class="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                  Author
                </div>
                <div class="font-medium">{{ form.author }}</div>
              </div>
              <div v-if="form.illustrator" class="p-3 bg-secondary/30 rounded-lg">
                <div class="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                  Illustrator
                </div>
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
              <div class="text-muted-foreground">Origin</div>
              <div>{{ form.origin }}</div>

              <div class="text-muted-foreground">Format</div>
              <div>{{ form.format }}</div>

              <div class="text-muted-foreground">Added to Library</div>
              <div>{{ new Date(fiction?.createdAt || '').toLocaleDateString() }}</div>
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
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="text-sm font-medium">Status</label>
                <select
                  v-model="form.status"
                  class="w-full px-3 py-2 rounded-md bg-background border border-input focus:ring-1 focus:ring-ring"
                >
                  <option value="Planned">Planned</option>
                  <option value="Reading">Reading</option>
                  <option value="Ongoing">Ongoing</option>
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
                placeholder="Fantasy, Sci-Fi, Mystery"
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
