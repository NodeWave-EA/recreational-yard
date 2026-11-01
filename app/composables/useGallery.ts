import type { GalleryItem } from '~~/shared/types/gallery'

export function useGallery() {
  const allImages = useState<GalleryItem[]>('gallery_all_images', () => [])
  const isLoading = useState<boolean>('gallery_loading', () => false)
  const error = useState<string | null>('gallery_error', () => null)

  async function fetchAllImages() {
    if (allImages.value.length > 0)
      return allImages.value

    isLoading.value = true
    error.value = null

    try {
      const res = await $fetch<{ success: boolean, images: GalleryItem[] }>('/api/gallery')
      if (res.success && res.images) {
        allImages.value = res.images
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch gallery images.'
    } finally {
      isLoading.value = false
    }

    return allImages.value
  }

  return {
    allImages,
    isLoading,
    error,
    fetchAllImages,
  }
}
