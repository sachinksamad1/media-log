<script setup lang="ts">
// No specific logic needed for the loader itself
</script>

<template>
  <div
    class="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[hsl(var(--background)/0.8)] backdrop-blur-md transition-all duration-500"
  >
    <div class="relative flex flex-col items-center justify-center gap-8">
      <!-- Animated Logo/Loader Container -->
      <div class="relative w-32 h-32 flex items-center justify-center">
        <!-- Outer Ring (Spinning Slow) -->
        <div
          class="absolute inset-0 rounded-full border-[3px] border-primary/20 animate-[spin_3s_linear_infinite]"
        ></div>

        <!-- Middle Ring (Spinning Fast Reverse) -->
        <div
          class="absolute inset-2 rounded-full border-t-[3px] border-primary/60 animate-[spin_2s_linear_infinite_reverse] shadow-[0_0_15px_hsl(var(--primary)/0.3)]"
        ></div>

        <!-- Inner Ring (Spinning Normal) -->
        <div
          class="absolute inset-4 rounded-full border-r-[3px] border-accent animate-[spin_1.5s_linear_infinite] shadow-[0_0_15px_hsl(var(--accent)/0.3)]"
        ></div>

        <!-- Core (Pulsing) -->
        <div
          class="relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 backdrop-blur-sm border border-primary/20 shadow-glow animate-pulse"
        >
          <div
            class="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-accent shadow-lg shadow-primary/50"
          ></div>
        </div>
      </div>

      <!-- Text Content -->
      <div class="flex flex-col items-center gap-3">
        <h2
          class="text-3xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] animate-[background-position_3s_linear_infinite] drop-shadow-sm"
        >
          MediaLog
        </h2>
        <div class="flex items-center gap-2">
          <span
            class="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]"
          ></span>
          <span
            class="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]"
          ></span>
          <span class="w-1.5 h-1.5 rounded-full bg-primary animate-bounce"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes background-position {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 200% 50%;
  }
}
</style>
