<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/core/stores/useAuthStore'
import { useRouter } from 'vue-router'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/common/components/ui/card'
import { Button } from '@/common/components/ui/button'

const authStore = useAuthStore()
const { userProfile } = storeToRefs(authStore)
const router = useRouter()

function handleLogout() {
  authStore.logout()
  router.push('/auth')
}
</script>

<template>
  <div class="container py-10 max-w-2xl">
    <Card>
      <CardHeader>
        <CardTitle>User Profile</CardTitle>
        <CardDescription>Manage your account settings</CardDescription>
      </CardHeader>
      <CardContent class="space-y-6">
        <div v-if="userProfile" class="flex flex-col gap-6">
          <div class="flex items-center gap-4">
            <div
              class="w-20 h-20 rounded-full overflow-hidden bg-secondary flex items-center justify-center border-2 border-border"
            >
              <img
                v-if="userProfile.avatarImg"
                :src="userProfile.avatarImg"
                alt="Avatar"
                class="w-full h-full object-cover"
              />
              <span v-else class="text-3xl font-bold text-muted-foreground">
                {{ userProfile.username?.charAt(0).toUpperCase() || 'U' }}
              </span>
            </div>

            <div class="space-y-1">
              <h3 class="text-2xl font-bold">{{ userProfile.username }}</h3>
              <p class="text-muted-foreground">{{ userProfile.email }}</p>
              <p v-if="userProfile.displayName" class="text-sm font-medium">
                {{ userProfile.displayName }}
              </p>
            </div>
          </div>

          <div class="grid gap-4 pt-4 border-t">
            <div class="grid grid-cols-[100px_1fr] items-center">
              <span class="text-sm font-medium text-muted-foreground">User ID</span>
              <span class="text-sm font-mono truncate">{{ userProfile.uid }}</span>
            </div>
            <div class="grid grid-cols-[100px_1fr] items-center">
              <span class="text-sm font-medium text-muted-foreground">Joined</span>
              <span class="text-sm">{{ userProfile.joinedDate }}</span>
            </div>
          </div>

          <div class="pt-4 border-t flex justify-end">
            <Button variant="destructive" @click="handleLogout">Sign Out</Button>
          </div>
        </div>

        <div v-else class="flex flex-col items-center justify-center py-8 text-center space-y-4">
          <p class="text-muted-foreground">Loading profile information...</p>
          <Button variant="outline" @click="handleLogout">Sign Out</Button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
