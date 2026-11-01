import fs from 'node:fs'
import path from 'node:path'
import { defineEventHandler, getRouterParam } from 'h3'
import { useStorage } from 'nitropack/runtime/internal/storage'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) {
    return { success: false, images: [], coverImage: null }
  }

  const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif', '.svg']
  const images: Array<{ url: string, caption: string }> = []
  let coverImage: string | null = null
  const seenFileNames = new Set<string>()

  try {
    const storage = useStorage('assets:gallery')
    const keys = await storage.getKeys()

    const matchingKeys = keys.filter((k) => {
      const normalized = k.replace(/\\/g, '/').replace(/:/g, '/')
      return normalized.startsWith(`${slug}/`)
    })

    matchingKeys.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))

    for (const key of matchingKeys) {
      const normalized = key.replace(/\\/g, '/').replace(/:/g, '/')
      const fileName = normalized.split('/').pop() || ''
      const extIndex = fileName.lastIndexOf('.')
      const ext = extIndex !== -1 ? fileName.substring(extIndex).toLowerCase() : ''

      if (validExtensions.includes(ext) && !seenFileNames.has(fileName)) {
        seenFileNames.add(fileName)
        const publicUrl = `/content/gallery/${slug}/${fileName}`
        const baseName = extIndex !== -1 ? fileName.substring(0, extIndex) : fileName

        if (baseName.toLowerCase() === 'cover') {
          coverImage = publicUrl
          images.unshift({ url: publicUrl, caption: 'Cover Photo' })
        } else {
          const cleanCaption = baseName.replace(/[-_]/g, ' ')
          images.push({
            url: publicUrl,
            caption: cleanCaption.charAt(0).toUpperCase() + cleanCaption.slice(1),
          })
        }
      }
    }
  } catch {
  }

  if (images.length === 0) {
    const possiblePaths = [
      path.join(process.cwd(), 'public', 'content', 'gallery', slug),
      path.join(process.cwd(), '.output', 'public', 'content', 'gallery', slug),
    ]

    let galleryDir: string | null = null
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        galleryDir = p
        break
      }
    }

    if (galleryDir) {
      try {
        const files = fs.readdirSync(galleryDir)
        files.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))

        files.forEach((file) => {
          const ext = path.extname(file).toLowerCase()
          if (validExtensions.includes(ext) && !seenFileNames.has(file)) {
            seenFileNames.add(file)
            const publicUrl = `/content/gallery/${slug}/${file}`
            const baseName = path.basename(file, ext)

            if (baseName.toLowerCase() === 'cover') {
              coverImage = publicUrl
              images.unshift({ url: publicUrl, caption: 'Cover Photo' })
            } else {
              const cleanCaption = baseName.replace(/[-_]/g, ' ')
              images.push({
                url: publicUrl,
                caption: cleanCaption.charAt(0).toUpperCase() + cleanCaption.slice(1),
              })
            }
          }
        })
      } catch {
      }
    }
  }

  return {
    success: true,
    slug,
    coverImage: coverImage || images[0]?.url || null,
    images,
  }
})
