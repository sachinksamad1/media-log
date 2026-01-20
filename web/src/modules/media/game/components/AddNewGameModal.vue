<script setup lang="ts">
import { ref, reactive } from 'vue'
import { GameService } from '@modules/media/game/api/gameService'
import type { Game } from '@modules/media/game/types/types'
import { useToast } from '@common/components/ui/toast/use-toast'

defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'created', newGame: Game): void
}>()

const { toast } = useToast()

const saving = ref(false)
const selectedFile = ref<File | null>(null)
const previewUrl = ref<string | null>(null)

// Local Mutable State
const form = reactive<{
  title: string
  developers: string
  publishers: string
  platforms: string
  genres: string
  releaseDate: string
  language: string
  origin: string
  status: string
  score: number
  playTime: number
}>({
  title: '',
  developers: '',
  publishers: '',
  platforms: '',
  genres: '',
  releaseDate: '',
  language: '',
  origin: 'USA',
  status: 'Planned',
  score: 0,
  playTime: 0,
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
  form.developers = ''
  form.publishers = ''
  form.platforms = ''
  form.genres = ''
  form.releaseDate = ''
  form.language = ''
  form.origin = 'USA'
  form.status = 'Planned'
  form.score = 0
  form.playTime = 0
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
    const payload: Partial<Game> = {
      title: form.title,
      developers: form.developers
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s),
      publishers: form.publishers
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s),
      releaseDate: form.releaseDate,
      userStats: {
        status: form.status,
        score: Number(form.score),
        playTime: Number(form.playTime),
      },
      origin: form.origin,
      language: form.language,
      platforms: form.platforms
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s),
      genres: form.genres
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s),
    }

    let createData: Partial<Game> | FormData = payload

    // If file selected, use FormData
    if (selectedFile.value) {
      const fd = new FormData()
      fd.append('imageUrl', selectedFile.value)
      fd.append('data', JSON.stringify(payload))
      createData = fd
    }

    const created = await GameService.create(createData)
    toast({
      title: 'Success',
      description: 'Game added to your library',
    })
    emit('created', created)
    close()
  } catch (err) {
    console.error('Failed to create', err)
    toast({
      title: 'Error',
      description: 'Failed to add Game',
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
          <h2 class="text-xl font-bold">Add New Game</h2>
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
              <label class="text-sm font-medium">Developers (comma separated)</label>
              <input
                v-model="form.developers"
                class="w-full px-3 py-2 rounded-md bg-background border border-input focus:ring-1 focus:ring-ring"
                placeholder="Nintendo, Game Freak"
              />
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium">Publishers (comma separated)</label>
              <input
                v-model="form.publishers"
                class="w-full px-3 py-2 rounded-md bg-background border border-input focus:ring-1 focus:ring-ring"
                placeholder="Nintendo"
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

          <!-- Platforms and Release Date -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="text-sm font-medium">Platforms (comma separated)</label>
              <input
                v-model="form.platforms"
                placeholder="PC, PS5, Switch"
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
              <label class="text-sm font-medium">Status</label>
              <select
                v-model="form.status"
                class="w-full px-3 py-2 rounded-md bg-background border border-input focus:ring-1 focus:ring-ring"
              >
                <option value="Planned">Planned</option>
                <option value="Playing">Playing</option>
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

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="text-sm font-medium">Language</label>
              <input
                v-model="form.language"
                class="w-full px-3 py-2 rounded-md bg-background border border-input focus:ring-1 focus:ring-ring"
                placeholder="English"
              />
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium">Origin</label>
              <input
                v-model="form.origin"
                class="w-full px-3 py-2 rounded-md bg-background border border-input focus:ring-1 focus:ring-ring"
                placeholder="USA"
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
            {{ saving ? 'Creating...' : 'Add Game' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
