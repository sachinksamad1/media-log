<script setup lang="ts">
import { ref, watch } from 'vue'
import { Calendar as CalendarIcon } from 'lucide-vue-next'
import { DateFormatter, type DateValue, getLocalTimeZone, today } from '@internationalized/date'
import { RangeCalendarRoot, PopoverRoot, PopoverContent, PopoverTrigger } from 'radix-vue'
import { cn } from '@/lib/utils'
import { type Ref } from 'vue'

const df = new DateFormatter('en-US', {
  dateStyle: 'medium',
})

const value = ref({
  start: today(getLocalTimeZone()),
  end: today(getLocalTimeZone()).add({ days: 7 }),
}) as Ref<{ start: DateValue; end: DateValue }>

const emit = defineEmits<{
  (e: 'update:modelValue', value: { start: Date; end: Date }): void
}>()

watch(value, (newValue) => {
  if (newValue.start && newValue.end) {
    emit('update:modelValue', {
      start: newValue.start.toDate(getLocalTimeZone()),
      end: newValue.end.toDate(getLocalTimeZone()),
    })
  }
})
</script>

<template>
  <PopoverRoot>
    <PopoverTrigger as-child>
      <button
        :class="
          cn(
            'w-[280px] justify-start text-left font-normal flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card hover:bg-accent transition-colors',
            !value && 'text-muted-foreground'
          )
        "
      >
        <CalendarIcon class="mr-2 h-4 w-4" />
        <template v-if="value.start">
          <template v-if="value.end">
            {{ df.format(value.start.toDate(getLocalTimeZone())) }} -
            {{ df.format(value.end.toDate(getLocalTimeZone())) }}
          </template>
          <template v-else>
            {{ df.format(value.start.toDate(getLocalTimeZone())) }}
          </template>
        </template>
        <template v-else> Pick a date </template>
      </button>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0" align="start">
      <RangeCalendarRoot v-model="value" initial-focus />
    </PopoverContent>
  </PopoverRoot>
</template>
