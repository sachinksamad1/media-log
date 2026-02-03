<script setup lang="ts">
import { onMounted, computed } from 'vue'
import {
  Download,
  RefreshCw,
  Filter,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  FileText,
  FileJson,
} from 'lucide-vue-next'
import { useReportStore } from '../store/useReportStore'
import {
  MEDIA_TYPE_OPTIONS,
  TIME_RANGE_OPTIONS,
  STATUS_OPTIONS,
  SORT_OPTIONS,
} from '../types/types'
import ReportTable from '../components/ReportTable.vue'
import ReportSummaryCards from '../components/ReportSummaryCards.vue'

const store = useReportStore()

const showFilters = computed(() => true)

onMounted(() => {
  store.fetchReport()
})

function handleExport(format: 'csv' | 'json') {
  store.exportReport(format)
}

function formatDate(dateString: string): string {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-3xl font-bold">Reports</h1>
        <p class="text-muted-foreground mt-1">View and export your media library data</p>
      </div>

      <div class="flex items-center gap-3">
        <button
          class="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card hover:bg-accent transition-colors"
          :disabled="store.isLoading"
          @click="store.fetchReport"
        >
          <RefreshCw class="w-4 h-4" :class="{ 'animate-spin': store.isLoading }" />
          <span class="hidden sm:inline">Refresh</span>
        </button>

        <!-- Export Dropdown -->
        <div class="relative group">
          <button
            class="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            :disabled="store.isExporting || !store.hasItems"
          >
            <Download class="w-4 h-4" :class="{ 'animate-bounce': store.isExporting }" />
            <span>Export</span>
          </button>
          <div
            class="absolute right-0 mt-2 w-40 rounded-lg border border-border bg-card shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10"
          >
            <button
              class="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-accent transition-colors rounded-t-lg"
              @click="handleExport('csv')"
            >
              <FileText class="w-4 h-4" />
              Export CSV
            </button>
            <button
              class="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-accent transition-colors rounded-b-lg"
              @click="handleExport('json')"
            >
              <FileJson class="w-4 h-4" />
              Export JSON
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div
      v-if="showFilters"
      class="flex flex-wrap gap-3 p-4 rounded-xl border border-border bg-card/50"
    >
      <div class="flex items-center gap-2">
        <Filter class="w-4 h-4 text-muted-foreground" />
        <span class="text-sm font-medium text-muted-foreground">Filters:</span>
      </div>

      <!-- Media Type -->
      <select
        :value="store.filters.mediaType"
        class="px-3 py-1.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        @change="(e) => store.setMediaType((e.target as HTMLSelectElement).value as any)"
      >
        <option v-for="option in MEDIA_TYPE_OPTIONS" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>

      <!-- Status -->
      <select
        :value="store.filters.status"
        class="px-3 py-1.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        @change="(e) => store.setStatus((e.target as HTMLSelectElement).value)"
      >
        <option v-for="option in STATUS_OPTIONS" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>

      <!-- Time Range -->
      <select
        :value="store.filters.timeRange"
        class="px-3 py-1.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        @change="(e) => store.setTimeRange((e.target as HTMLSelectElement).value as any)"
      >
        <option v-for="option in TIME_RANGE_OPTIONS" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>

      <!-- Sort -->
      <div class="flex items-center gap-1">
        <ArrowUpDown class="w-4 h-4 text-muted-foreground" />
        <select
          :value="store.pagination.sortBy"
          class="px-3 py-1.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          @change="(e) => store.setSort((e.target as HTMLSelectElement).value as any)"
        >
          <option v-for="option in SORT_OPTIONS" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
        <button
          class="p-1.5 rounded-lg border border-border bg-background hover:bg-accent transition-colors"
          :title="store.pagination.sortOrder === 'asc' ? 'Ascending' : 'Descending'"
          @click="
            store.setSort(
              store.pagination.sortBy,
              store.pagination.sortOrder === 'asc' ? 'desc' : 'asc'
            )
          "
        >
          <ArrowUpDown
            class="w-4 h-4"
            :class="{ 'rotate-180': store.pagination.sortOrder === 'asc' }"
          />
        </button>
      </div>

      <!-- Reset -->
      <button
        class="px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        @click="store.resetFilters"
      >
        Reset
      </button>
    </div>

    <!-- Summary Cards -->
    <ReportSummaryCards v-if="store.summary" :summary="store.summary" />

    <!-- Loading State -->
    <div v-if="store.isLoading" class="flex items-center justify-center py-20">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="store.error"
      class="flex flex-col items-center justify-center py-20 text-muted-foreground"
    >
      <p class="text-lg mb-4">{{ store.error }}</p>
      <button
        class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        @click="store.fetchReport"
      >
        Try Again
      </button>
    </div>

    <!-- Data Table -->
    <template v-else>
      <ReportTable :items="store.items" :format-date="formatDate" />

      <!-- Pagination -->
      <div
        v-if="store.totalPages > 1"
        class="flex items-center justify-between p-4 rounded-xl border border-border bg-card/50"
      >
        <div class="text-sm text-muted-foreground">
          Showing {{ (store.currentPage - 1) * store.pagination.limit + 1 }} -
          {{ Math.min(store.currentPage * store.pagination.limit, store.totalItems) }} of
          {{ store.totalItems }} items
        </div>

        <div class="flex items-center gap-2">
          <button
            class="p-2 rounded-lg border border-border bg-background hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="store.currentPage <= 1"
            @click="store.prevPage"
          >
            <ChevronLeft class="w-4 h-4" />
          </button>

          <span class="px-3 py-1 text-sm">
            Page {{ store.currentPage }} of {{ store.totalPages }}
          </span>

          <button
            class="p-2 rounded-lg border border-border bg-background hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="!store.hasMore"
            @click="store.nextPage"
          >
            <ChevronRight class="w-4 h-4" />
          </button>
        </div>
      </div>
    </template>
  </div>
</template>
