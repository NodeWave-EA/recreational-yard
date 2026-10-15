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
    const startViewTransition = Reflect.get(document, 'startViewTransition') as
      | ((callback: () => Promise<void>) => ViewTransition)
      | undefined
    const isAppearanceTransition = typeof startViewTransition === 'function'
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

    const transition = startViewTransition(async () => {
      isDark.value = !isDark.value
      await nextTick()
    })

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ]
      document.documentElement.animate(
        {
          clipPath: isDark.value ? clipPath : [...clipPath].reverse(),
        },
        {
          duration: 400,
          easing: 'ease-in-out',
          pseudoElement: isDark.value
            ? '::view-transition-new(root)'
            : '::view-transition-old(root)',
        },
      )
    })
  }

  return {
    colorMode,
    isDark,
    toggleTheme,
  }
}
