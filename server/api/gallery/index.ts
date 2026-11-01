import type { GalleryItem } from '../../../shared/types/gallery'
import fs from 'node:fs'
import path from 'node:path'
import { defineEventHandler } from 'h3'
import { useStorage } from 'nitropack/runtime/internal/storage'

export default defineEventHandler(async () => {
  const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif', '.svg']
  const images: GalleryItem[] = []
  const seenUrls = new Set<string>()

  const formatCaption = (fileName: string) => {
    const extIndex = fileName.lastIndexOf('.')
    const baseName = extIndex !== -1 ? fileName.substring(0, extIndex) : fileName
    if (baseName.toLowerCase() === 'cover')
      return 'Cover Photo'
    const clean = baseName.replace(/[-_]/g, ' ')
    return clean.charAt(0).toUpperCase() + clean.slice(1)
  }

  try {
    const storage = useStorage('assets:gallery')
    const keys = await storage.getKeys()

    const sortedKeys = keys.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))

    for (const key of sortedKeys) {
      const normalized = key.replace(/\\/g, '/').replace(/:/g, '/')
      const parts = normalized.split('/')
      if (parts.length < 2)
        continue

      const category = parts[0]
      const fileName = parts.at(-1)
      if (!category || !fileName)
        continue
      const extIndex = fileName.lastIndexOf('.')
      const ext = extIndex !== -1 ? fileName.substring(extIndex).toLowerCase() : ''

      if (validExtensions.includes(ext)) {
        const publicUrl = `/content/gallery/${category}/${fileName}`
        if (!seenUrls.has(publicUrl)) {
          seenUrls.add(publicUrl)
          images.push({
            url: publicUrl,
            caption: formatCaption(fileName),
            category: category.replace(/[-_]/g, ' ').toUpperCase(),
            fileName,
          })
        }
      }
    }
  } catch {
  }

  if (images.length === 0) {
    const possiblePaths = [
      path.join(process.cwd(), 'public', 'content', 'gallery'),
      path.join(process.cwd(), '.output', 'public', 'content', 'gallery'),
    ]

    let baseDir: string | null = null
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        baseDir = p
        break
      }
    }

    if (baseDir) {
      try {
        const scanDirRecursively = (dir: string, relPath = '') => {
          const items = fs.readdirSync(dir, { withFileTypes: true })
          for (const item of items) {
            if (item.isDirectory()) {
              scanDirRecursively(path.join(dir, item.name), path.join(relPath, item.name))
            } else if (item.isFile()) {
              const ext = path.extname(item.name).toLowerCase()
              if (validExtensions.includes(ext)) {
                const category = relPath.split(path.sep)[0] || 'General'
                const publicUrl = `/content/gallery/${relPath.replace(/\\/g, '/')}/${item.name}`

                if (!seenUrls.has(publicUrl)) {
                  seenUrls.add(publicUrl)
                  images.push({
                    url: publicUrl,
                    caption: formatCaption(item.name),
                    category: category.replace(/[-_]/g, ' ').toUpperCase(),
                    fileName: item.name,
                  })
                }
              }
            }
          }
        }

        scanDirRecursively(baseDir)
      } catch {
      }
    }
  }

  return {
    success: true,
    total: images.length,
    images,
  }
})
