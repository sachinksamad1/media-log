import { ref, type Component, type VNode } from 'vue'

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 5000

export type ToastVariant = 'default' | 'destructive'

export interface ToastProps {
  id: string
  title?: string
  description?: string
  action?: Component | VNode
  variant?: ToastVariant
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const toasts = ref<ToastProps[]>([])

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

function addToast(props: Omit<ToastProps, 'id'>) {
  const id = genId()

  const update = (props: ToastProps) => {
    const index = toasts.value.findIndex((t) => t.id === id)
    if (index !== -1) {
      toasts.value[index] = { ...toasts.value[index], ...props }
    }
  }

  const dismiss = () => {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  const newToast = {
    ...props,
    id,
    open: true,
    onOpenChange: (open: boolean) => {
      if (!open) dismiss()
    },
  }

  toasts.value = [newToast, ...toasts.value].slice(0, TOAST_LIMIT)

  setTimeout(() => {
    dismiss()
  }, TOAST_REMOVE_DELAY)

  return {
    id,
    dismiss,
    update,
  }
}

function useToast() {
  return {
    toasts,
    toast: addToast,
    dismiss: (toastId?: string) => {
      if (toastId) {
        toasts.value = toasts.value.filter((t) => t.id !== toastId)
      } else {
        toasts.value = []
      }
    },
  }
}

export { useToast }
