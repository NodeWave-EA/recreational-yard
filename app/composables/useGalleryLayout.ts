import { computed, ref } from 'vue'

interface GalleryLayoutPhoto {
  url: string
  caption?: string
  aspect?: 'portrait' | 'landscape' | 'square' | 'tall'
  [key: string]: any
}

export type GridDensity = 'S' | 'M' | 'L'

export function useGalleryLayout() {
  const density = ref<GridDensity>('M')
  const bgIntervalSeconds = ref(5)

  const masonryContainerClasses = computed(() => {
    switch (density.value) {
      case 'S':
        return 'columns-2 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-6 2xl:columns-7 gap-2 sm:gap-3 lg:gap-4'
      case 'L':
        return 'columns-1 sm:columns-2 lg:columns-3 gap-4 sm:gap-6 lg:gap-8'
      case 'M':
      default:
        return 'columns-1 xs:columns-2 sm:columns-2 md:columns-3 lg:columns-4 2xl:columns-5 gap-3 sm:gap-4 lg:gap-5'
    }
  })

  const masonryItemClasses = computed(() => {
    switch (density.value) {
      case 'S':
        return 'break-inside-avoid mb-2 sm:mb-3 lg:mb-4'
      case 'L':
        return 'break-inside-avoid mb-4 sm:mb-6 lg:mb-8'
      case 'M':
      default:
        return 'break-inside-avoid mb-3 sm:mb-4 lg:mb-5'
    }
  })

  const aspectRhythms = [
    'aspect-3/4',
    'aspect-16/10',
    'aspect-square',
    'aspect-4/5',
    'aspect-16/9',
    'aspect-2/3',
  ]

  function getPhotoAspectClass(index: number, photo?: GalleryLayoutPhoto) {
    if (photo?.aspect) {
      if (photo.aspect === 'portrait')
        return 'aspect-3/4'
      if (photo.aspect === 'tall')
        return 'aspect-2/3'
      if (photo.aspect === 'square')
        return 'aspect-square'
      if (photo.aspect === 'landscape')
        return 'aspect-16/9'
    }
    return aspectRhythms[index % aspectRhythms.length]
  }

  return {
    density,
    bgIntervalSeconds,
    masonryContainerClasses,
    masonryItemClasses,
    getPhotoAspectClass,
  }
}
