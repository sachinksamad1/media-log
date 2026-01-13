import { ref } from 'vue'

const sidebarOpen = ref(false)
const sidebarCollapsed = ref(false)

export function useLayout() {
  const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value
  }

  const closeSidebar = () => {
    sidebarOpen.value = false
  }

  const toggleCollapse = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  return {
    sidebarOpen,
    sidebarCollapsed,
    toggleSidebar,
    closeSidebar,
    toggleCollapse,
  }
}
