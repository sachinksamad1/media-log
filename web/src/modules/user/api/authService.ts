import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth'

import { auth, googleProvider } from '@/core/auth/firebase'

export const authService = {
  async signIn(email: string, pass: string) {
    const userCredential = await signInWithEmailAndPassword(auth, email, pass)
    return userCredential.user
  },

  async signUp(email: string, pass: string, displayName?: string) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass)

    if (displayName) {
      await updateProfile(userCredential.user, { displayName })
    }

    return userCredential.user
  },

  async googleSignIn() {
    const userCredential = await signInWithPopup(auth, googleProvider)
    return userCredential.user
  },

  async resetPassword(email: string) {
    await sendPasswordResetEmail(auth, email)
  },

  async logout() {
    await signOut(auth)
  },

  async getToken(): Promise<string | null> {
    const user = auth.currentUser
    if (!user) return null
    return await user.getIdToken(true)
  },
}
