import { ref, onMounted } from "vue"

type Theme = "light" | "dark"

const theme = ref<Theme>("light")

export function useTheme() {
  const apply = (t: Theme) => {
    theme.value = t
    document.documentElement.classList.toggle("dark", t === "dark")
    localStorage.setItem("theme", t)
  }

  const toggle = () => {
    apply(theme.value === "dark" ? "light" : "dark")
  }

  onMounted(() => {
    const saved = localStorage.getItem("theme") as Theme | null
    if (saved) {
      apply(saved)
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      apply("dark")
    }
  })

  return { theme, toggle }
}
