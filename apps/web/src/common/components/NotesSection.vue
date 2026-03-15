<script setup lang="ts">
import { ref, watch } from 'vue'
import { NoteService, type NoteResponse } from '@/common/services/noteService'
import { useToast } from '@/common/components/ui/toast/use-toast'

const props = defineProps<{
  mediaId: string
  mediaType: string
  isOpen: boolean
}>()

const { toast } = useToast()

const notes = ref<NoteResponse[]>([])
const loading = ref(false)
const newNoteTitle = ref('')
const newNoteContent = ref('')
const addingNote = ref(false)

// Sub-modal state
const viewingNote = ref<NoteResponse | null>(null)
const isEditingInModal = ref(false)
const editingTitle = ref('')
const editingContent = ref('')

async function fetchNotes() {
  if (!props.mediaId) return
  loading.value = true
  try {
    notes.value = await NoteService.getByMediaId(props.mediaId)
  } catch (err) {
    console.error('Failed to fetch notes', err)
  } finally {
    loading.value = false
  }
}

watch(
  () => props.isOpen && props.mediaId,
  (shouldFetch) => {
    if (shouldFetch) {
      fetchNotes()
    } else {
      notes.value = []
      newNoteTitle.value = ''
      newNoteContent.value = ''
      closeNoteModal()
    }
  },
  { immediate: true }
)

async function addNote() {
  if (!newNoteTitle.value.trim() || !newNoteContent.value.trim()) return
  addingNote.value = true
  try {
    const note = await NoteService.create(
      props.mediaId,
      props.mediaType,
      newNoteTitle.value.trim(),
      newNoteContent.value.trim()
    )
    notes.value.unshift(note)
    newNoteTitle.value = ''
    newNoteContent.value = ''
    toast({ title: 'Note Added', description: 'Your note has been saved' })
  } catch (err) {
    console.error('Failed to add note', err)
    toast({ title: 'Error', description: 'Failed to add note', variant: 'destructive' })
  } finally {
    addingNote.value = false
  }
}

// Sub-modal actions
function openNoteModal(note: NoteResponse) {
  viewingNote.value = note
  isEditingInModal.value = false
}

function closeNoteModal() {
  viewingNote.value = null
  isEditingInModal.value = false
  editingTitle.value = ''
  editingContent.value = ''
}

function startEditingInModal() {
  if (!viewingNote.value) return
  editingTitle.value = viewingNote.value.title
  editingContent.value = viewingNote.value.content
  isEditingInModal.value = true
}

function cancelEditingInModal() {
  isEditingInModal.value = false
  editingTitle.value = ''
  editingContent.value = ''
}

async function saveEditInModal() {
  if (!viewingNote.value || !editingTitle.value.trim() || !editingContent.value.trim()) return
  const id = viewingNote.value.id
  try {
    const updated = await NoteService.update(
      id,
      editingContent.value.trim(),
      editingTitle.value.trim()
    )
    const idx = notes.value.findIndex((n) => n.id === id)
    if (idx !== -1) notes.value[idx] = updated
    viewingNote.value = updated
    isEditingInModal.value = false
    editingTitle.value = ''
    editingContent.value = ''
    toast({ title: 'Note Updated' })
  } catch (err) {
    console.error('Failed to update note', err)
    toast({ title: 'Error', description: 'Failed to update note', variant: 'destructive' })
  }
}

async function deleteNoteFromModal() {
  if (!viewingNote.value) return
  if (!confirm('Delete this note? This action cannot be undone.')) return
  const id = viewingNote.value.id
  try {
    await NoteService.delete(id)
    notes.value = notes.value.filter((n) => n.id !== id)
    closeNoteModal()
    toast({ title: 'Note Deleted' })
  } catch (err) {
    console.error('Failed to delete note', err)
    toast({ title: 'Error', description: 'Failed to delete note', variant: 'destructive' })
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<template>
  <div class="space-y-4">
    <h4 class="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Notes</h4>

    <!-- Add Note -->
    <div class="space-y-2 p-3 rounded-lg border border-dashed border-border/70 bg-secondary/10">
      <input
        v-model="newNoteTitle"
        placeholder="Note title..."
        class="w-full px-3 py-2 rounded-md bg-background border border-input focus:ring-1 focus:ring-ring text-sm font-medium"
      />
      <textarea
        v-model="newNoteContent"
        placeholder="Write your note..."
        class="w-full px-3 py-2 rounded-md bg-background border border-input focus:ring-1 focus:ring-ring text-sm resize-none min-h-[60px]"
        @keydown.meta.enter="addNote"
        @keydown.ctrl.enter="addNote"
      />
      <div class="flex justify-end">
        <button
          class="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          :disabled="!newNoteTitle.trim() || !newNoteContent.trim() || addingNote"
          @click="addNote"
        >
          {{ addingNote ? 'Adding...' : 'Add Note' }}
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-sm text-muted-foreground text-center py-4">
      Loading notes...
    </div>

    <!-- Empty -->
    <div
      v-else-if="notes.length === 0"
      class="text-sm text-muted-foreground text-center py-4 opacity-60"
    >
      No notes yet
    </div>

    <!-- Notes List (compact cards) -->
    <div v-else class="space-y-2 max-h-[250px] overflow-y-auto pr-1">
      <button
        v-for="note in notes"
        :key="note.id"
        class="w-full text-left p-3 rounded-lg bg-secondary/30 border border-border/50 hover:bg-secondary/50 hover:border-border transition-all cursor-pointer group"
        @click="openNoteModal(note)"
      >
        <h5 class="text-sm font-semibold truncate">{{ note.title }}</h5>
        <p class="text-xs text-muted-foreground mt-0.5 line-clamp-2">{{ note.content }}</p>
        <span class="text-[10px] text-muted-foreground/60 mt-1 block">{{
          formatDate(note.createdAt)
        }}</span>
      </button>
    </div>

    <!-- ==================== NOTE SUB-MODAL ==================== -->
    <Teleport to="body">
      <Transition name="note-modal">
        <div
          v-if="viewingNote"
          class="fixed inset-0 z-[60] flex items-center justify-center p-4"
          @click.self="closeNoteModal"
        >
          <!-- Backdrop -->
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeNoteModal"></div>

          <!-- Modal panel -->
          <div
            class="relative bg-card text-card-foreground w-full max-w-lg rounded-xl shadow-2xl border border-border flex flex-col max-h-[80vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
          >
            <!-- Header -->
            <div class="flex items-start justify-between p-5 pb-3 border-b border-border/50">
              <div class="flex-1 min-w-0 pr-4">
                <!-- View title -->
                <h3 v-if="!isEditingInModal" class="text-lg font-bold leading-tight">
                  {{ viewingNote.title }}
                </h3>
                <!-- Edit title -->
                <input
                  v-else
                  v-model="editingTitle"
                  class="w-full px-3 py-1.5 rounded-md bg-background border border-input focus:ring-1 focus:ring-ring text-base font-semibold"
                />
                <span class="text-xs text-muted-foreground/70 mt-1 block">
                  {{ formatDate(viewingNote.createdAt) }}
                  <template v-if="viewingNote.updatedAt !== viewingNote.createdAt">
                    · edited {{ formatDate(viewingNote.updatedAt) }}
                  </template>
                </span>
              </div>
              <button
                class="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors shrink-0"
                @click="closeNoteModal"
              >
                ✕
              </button>
            </div>

            <!-- Body -->
            <div class="flex-1 overflow-y-auto p-5">
              <!-- View content -->
              <p
                v-if="!isEditingInModal"
                class="text-sm whitespace-pre-wrap break-words leading-relaxed"
              >
                {{ viewingNote.content }}
              </p>
              <!-- Edit content -->
              <textarea
                v-else
                v-model="editingContent"
                class="w-full px-3 py-2 rounded-md bg-background border border-input focus:ring-1 focus:ring-ring text-sm resize-none min-h-[140px]"
              />
            </div>

            <!-- Footer Actions -->
            <div
              class="p-4 border-t border-border/50 bg-secondary/10 flex justify-between items-center"
            >
              <!-- Left: Delete -->
              <button
                v-if="!isEditingInModal"
                class="px-3 py-1.5 rounded-lg text-xs font-medium text-red-500/80 border border-red-200/50 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 transition-colors"
                @click="deleteNoteFromModal"
              >
                Delete Note
              </button>
              <div v-else></div>

              <!-- Right: Edit / Save / Cancel -->
              <div class="flex gap-2">
                <template v-if="!isEditingInModal">
                  <button
                    class="px-4 py-1.5 rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                    @click="startEditingInModal"
                  >
                    Edit
                  </button>
                </template>
                <template v-else>
                  <button
                    class="px-3 py-1.5 rounded-lg text-xs font-medium border border-input hover:bg-accent transition-colors"
                    @click="cancelEditingInModal"
                  >
                    Cancel
                  </button>
                  <button
                    class="px-4 py-1.5 rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
                    :disabled="!editingTitle.trim() || !editingContent.trim()"
                    @click="saveEditInModal"
                  >
                    Save
                  </button>
                </template>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.note-modal-enter-active,
.note-modal-leave-active {
  transition: opacity 0.15s ease;
}
.note-modal-enter-from,
.note-modal-leave-to {
  opacity: 0;
}
</style>
