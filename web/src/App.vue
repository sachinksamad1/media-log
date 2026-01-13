<script setup lang="ts">
import { RouterView } from 'vue-router';
import AppShell from './common/components/layout/AppShell.vue';
</script>

<template>
<AppShell>
    <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RouterView />
    </div>
</AppShell>
</template>
