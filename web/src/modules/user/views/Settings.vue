<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useAuthStore } from "@/core/stores/useAuthStore"
import { userService } from "@/modules/user/api/userService"
import { useToast } from "@/common/components/ui/toast/use-toast"
import { storeToRefs } from "pinia"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/common/components/ui/card"
import { Input } from "@/common/components/ui/input"
import { Button } from "@/common/components/ui/button"
import { Loader2 } from "lucide-vue-next"

const authStore = useAuthStore()
const { userProfile } = storeToRefs(authStore)
const { toast } = useToast()

const isLoading = ref(false)
const formData = ref({
  displayName: '',
  avatarImg: '',
})

// Initialize form data when profile is available
const initForm = () => {
  if (userProfile.value) {
    formData.value.displayName = userProfile.value.displayName || ''
    formData.value.avatarImg = userProfile.value.avatarImg || ''
  }
}

onMounted(() => {
  initForm()
})

// Watch for profile changes (e.g. if page loads before profile sync)
watch(userProfile, () => {
  initForm()
})

async function handleUpdateProfile() {
  isLoading.value = true
  try {
    const updatedProfile = await userService.updateMe({
        displayName: formData.value.displayName,
    })
    
    // Update store
    authStore.profile = updatedProfile

    toast({
      title: "Settings updated",
      description: "Your profile settings have been successfully saved.",
    })
  } catch (error: any) {
    toast({
      title: "Update failed",
      description: error.message || "Could not update settings",
      variant: "destructive",
    })
  } finally {
    isLoading.value = false
  }
}

// Handle avatar upload
async function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  if (!input.files || input.files.length === 0) return
  const file = input.files[0]
  if (!file) return

  // Ideally, add client-side validation for size/type here too
  isLoading.value = true
  try {
    const updatedProfile = await userService.uploadAvatar(file)
    
    // Update store and local form state
    authStore.profile = updatedProfile
    formData.value.avatarImg = updatedProfile.avatarImg || ''

    toast({
      title: "Avatar updated",
      description: "Your profile picture has been updated successfully.",
    })
  } catch (error: any) {
    toast({
      title: "Upload failed",
      description: error.message || "Could not upload image",
      variant: "destructive",
    })
    // Reset input
    input.value = ''
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="container py-10 max-w-2xl">
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>Manage your account settings and preferences.</CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="handleUpdateProfile" class="space-y-6">
            <div class="space-y-2">
                <label for="displayName" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Display Name
                </label>
                <Input id="displayName" v-model="formData.displayName" placeholder="Enter your display name" />
                <p class="text-sm text-muted-foreground">
                    This is your public display name. It can be your real name or a pseudonym.
                </p>
            </div>

            <div class="space-y-4">
                <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Avatar
                </label>
                
                <div class="flex items-center gap-4">
                    <div class="w-16 h-16 rounded-full overflow-hidden bg-secondary border border-border flex items-center justify-center">
                        <img v-if="formData.avatarImg" :src="formData.avatarImg" alt="Avatar" class="w-full h-full object-cover" />
                        <span v-else class="text-xl font-bold text-muted-foreground">
                            {{ formData.displayName?.charAt(0).toUpperCase() || 'U' }}
                        </span>
                    </div>

                    <div class="flex-1 space-y-2">
                        <Input 
                          id="avatarUpload" 
                          type="file" 
                          accept="image/*"
                          @change="handleFileChange"
                          class="cursor-pointer"
                        />
                        <p class="text-xs text-muted-foreground">
                            Upload a new profile picture. Max size 5MB.
                        </p>
                    </div>
                </div>
            </div>

            <div class="flex justify-end pt-4">
                <Button type="submit" :disabled="isLoading">
                    <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
                    Save Changes
                </Button>
            </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
