import { computed, nextTick } from 'vue'
import { useColorMode } from '#imports'

export function useTheme() {
  const colorMode = useColorMode()

  const isDark = computed({
    get: () => colorMode.value === 'dark',
    set: (val: boolean) => {
      colorMode.preference = val ? 'dark' : 'light'
    },
  })

  const toggleTheme = async (event?: MouseEvent) => {
    const isAppearanceTransition
      = typeof document !== 'undefined'
        && 'startViewTransition' in document
        && !window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!isAppearanceTransition || !event) {
      isDark.value = !isDark.value
      return
    }

    const x = event.clientX
    const y = event.clientY
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    )

    // Call document.startViewTransition directly on the document instance
    const transition = document.startViewTransition(async () => {
      isDark.value = !isDark.value
      await nextTick()
    })

    await transition.ready

    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: 400,
        easing: 'ease-in-out',
        pseudoElement: '::view-transition-new(root)',
      },
    )
  }

  return {
    colorMode,
    isDark,
    toggleTheme,
  }
}
