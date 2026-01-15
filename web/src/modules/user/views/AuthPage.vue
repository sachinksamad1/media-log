<script setup lang="ts">
import { ref, watch, onMounted } from "vue"
import { useRouter } from "vue-router"
import { storeToRefs } from "pinia"
import { useAuthStore } from "@/core/stores/useAuthStore"
import { z } from "zod"

import { Mail, Lock, Chrome, Loader2 } from "lucide-vue-next"
import { useToast } from "@/common/components/ui/toast/use-toast"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/common/components/ui/card"
import { Input } from "@/common/components/ui/input"
import { Button } from "@/common/components/ui/button"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/common/components/ui/tabs"

/* -----------------------------
   Validation
----------------------------- */

const emailSchema = z.string().email("Please enter a valid email address")
const passwordSchema = z.string().min(6, "Password must be at least 6 characters")
const usernameSchema = z.string().min(3, "Username must be at least 3 characters").max(25, "Username must be at most 25 characters")

/* -----------------------------
   State
----------------------------- */

const router = useRouter()
const { toast } = useToast()
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

/* Tabs */
const activeTab = ref<"signin" | "signup" | "recovery">("signin")
const recoveryType = ref<"password" | "username">("password")
const recoveryForm = ref({ email: "" })

/* Loading */
const isLoading = ref(false)
const isGoogleLoading = ref(false)

/* Form Models (ISOLATED) */
const signInForm = ref({
  email: "",
  password: "",
})

const signUpForm = ref({
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
})

/* -----------------------------
   Auth state
----------------------------- */

onMounted(() => {
  if (user.value) router.push("/")
})

watch(user, (newUser) => {
  if (newUser) router.push("/")
})

/* Clear form when switching tabs */
watch(activeTab, () => {
  signInForm.value = { email: "", password: "" }
  signUpForm.value = { username: "", email: "", password: "", confirmPassword: "" }
})

/* -----------------------------
   Validation
----------------------------- */

function validateInputs(isSignUp: boolean) {
  const form = isSignUp ? signUpForm.value : signInForm.value

  try {
    if (isSignUp) {
      usernameSchema.parse(signUpForm.value.username)
    }
    emailSchema.parse(form.email)
    passwordSchema.parse(form.password)
  } catch (e: any) {
    toast({
      title: "Invalid input",
      description: e.issues?.[0]?.message || "Invalid data",
      variant: "destructive",
    })
    return false
  }

  if (isSignUp && form.password !== signUpForm.value.confirmPassword) {
    toast({
      title: "Passwords do not match",
      description: "Please make sure both passwords are the same",
      variant: "destructive",
    })
    return false
  }

  return true
}

/* -----------------------------
   Actions
----------------------------- */

async function handleSignIn() {
  if (!validateInputs(false)) return
  isLoading.value = true

  try {
    await authStore.login(
      signInForm.value.email.trim(),
      signInForm.value.password
    )
  } catch (error: any) {
    toast({
      title: "Sign in failed",
      description:
        error.message === "Firebase: Error (auth/invalid-credential)."
          ? "Invalid email or password"
          : error.message,
      variant: "destructive",
    })
  } finally {
    isLoading.value = false
  }
}

async function handleSignUp() {
  if (!validateInputs(true)) return
  isLoading.value = true

  try {
    await authStore.register(
      signUpForm.value.email.trim(),
      signUpForm.value.password,
      signUpForm.value.username.trim()
    )

    toast({
      title: "Account created",
      description: "You are now signed in",
    })
  } catch (error: any) {
    toast({
      title: "Sign up failed",
      description: error.message,
      variant: "destructive",
    })
  } finally {
    isLoading.value = false
  }
}

async function handleGoogleSignIn() {
  isGoogleLoading.value = true
  try {
    await authStore.googleLogin()
  } catch (error: any) {
    toast({
      title: "Google sign in failed",
      description: error.message,
      variant: "destructive",
    })
  } finally {
    isGoogleLoading.value = false
  }
}

async function handleRecovery() {
  try {
    emailSchema.parse(recoveryForm.value.email)
  } catch (e: any) {
    toast({
      title: "Invalid email",
      description: e.issues?.[0]?.message || "Please enter a valid email",
      variant: "destructive",
    })
    return
  }

  isLoading.value = true
  try {
    if (recoveryType.value === "password") {
      await authStore.resetPassword(recoveryForm.value.email)
      toast({
        title: "Email sent",
        description: "Check your email for password reset instructions.",
      })
    } else {
      await authStore.recoverUsername(recoveryForm.value.email)
      toast({
        title: "Email sent",
        description: "If an account exists, the username has been sent.",
      })
    }
  } catch (error: any) {
    toast({
      title: "Recovery failed",
      description: error.message,
      variant: "destructive",
    })
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-background p-4">
    <div class="w-full max-w-md">
      <div class="flex items-center justify-center gap-3 mb-8">
        <div class="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
          <span class="font-bold text-sm">M</span>
        </div>
        <h1 class="text-xl font-display font-bold text-foreground hidden sm:block">
          Media<span class="text-gradient">Log</span>
        </h1>
      </div>

      <Card>
        <CardHeader class="text-center">
          <CardTitle>Welcome</CardTitle>
          <CardDescription>Sign in or create an account</CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs v-model="activeTab" class="w-full">
            <TabsList v-if="activeTab !== 'recovery'" class="grid grid-cols-2 mb-6">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <!-- SIGN IN -->
            <TabsContent value="signin">
              <form @submit.prevent="handleSignIn" class="space-y-4">
                <Input v-model="signInForm.email" placeholder="Email" />
                <Input v-model="signInForm.password" type="password" placeholder="Password" />

                <div class="flex justify-between text-xs text-muted-foreground">
                  <a href="#" @click.prevent="activeTab = 'recovery'; recoveryType = 'password'" class="hover:underline hover:text-primary">
                    Forgot Password?
                  </a>
                  <a href="#" @click.prevent="activeTab = 'recovery'; recoveryType = 'username'" class="hover:underline hover:text-primary">
                    Forgot Username?
                  </a>
                </div>

                <Button class="w-full" :disabled="isLoading">
                  <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
                  Sign In
                </Button>
              </form>
            </TabsContent>

            <!-- SIGN UP -->
            <TabsContent value="signup">
              <form @submit.prevent="handleSignUp" class="space-y-4">
                <Input v-model="signUpForm.username" placeholder="Username" />
                <Input v-model="signUpForm.email" placeholder="Email" />
                <Input v-model="signUpForm.password" type="password" placeholder="Password" />
                <Input v-model="signUpForm.confirmPassword" type="password" placeholder="Confirm Password" />

                <Button class="w-full" :disabled="isLoading">
                  <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
                  Sign Up
                </Button>
              </form>
            </TabsContent>

            <!-- RECOVERY -->
            <TabsContent value="recovery">
              <div class="mb-6 text-center">
                <h3 class="text-sm font-medium mb-4">
                  Recover {{ recoveryType === 'password' ? 'Password' : 'Username' }}
                </h3>
                <div class="flex gap-2 justify-center mb-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    :class="recoveryType === 'password' ? 'bg-primary/10 border-primary text-primary' : ''"
                    @click="recoveryType = 'password'">
                    Password
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    size="sm" 
                    :class="recoveryType === 'username' ? 'bg-primary/10 border-primary text-primary' : ''"
                    @click="recoveryType = 'username'">
                    Username
                  </Button>
                </div>
              </div>

              <form @submit.prevent="handleRecovery" class="space-y-4">
                <Input v-model="recoveryForm.email" placeholder="Enter your email" />
                
                <Button class="w-full" :disabled="isLoading">
                  <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
                  Send {{ recoveryType === 'password' ? 'Reset Link' : 'My Username' }}
                </Button>
              </form>

              <div class="mt-4 text-center">
                <Button variant="link" size="sm" @click="activeTab = 'signin'">
                  Back to Sign In
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          <div class="my-6 border-t" />

          <Button variant="outline" class="w-full" @click="handleGoogleSignIn">
            <Loader2 v-if="isGoogleLoading" class="mr-2 h-4 w-4 animate-spin" />
            <Chrome v-else class="mr-2 h-4 w-4" />
            Google
          </Button>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
