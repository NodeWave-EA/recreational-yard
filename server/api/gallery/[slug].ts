import fs from 'node:fs'
import path from 'node:path'

export default defineEventHandler((event) => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) {
    return { success: false, images: [], coverImage: null }
  }

  // Look for the directory across standard local and production paths
  const possiblePaths = [
    path.join(process.cwd(), 'public', 'content', 'gallery', slug),
    path.join(process.cwd(), '.output', 'public', 'content', 'gallery', slug),
    path.resolve('./public/content/gallery', slug),
    path.resolve('./.output/public/content/gallery', slug),
  ]

  let galleryDir: string | null = null
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      galleryDir = p
      break
    }
  }

  if (!galleryDir) {
    return { success: false, images: [], coverImage: null }
  }

  try {
    const files = fs.readdirSync(galleryDir)
    const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif', '.svg']

    let coverImage: string | null = null
    const images: Array<{ url: string, caption: string }> = []

    // Natural sort order (e.g. gallery-1.jpeg, gallery-2.jpeg)
    files.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))

    files.forEach((file) => {
      const ext = path.extname(file).toLowerCase()
      if (validExtensions.includes(ext)) {
        const publicUrl = `/content/gallery/${slug}/${file}`
        const baseName = path.basename(file, ext)

        if (baseName.toLowerCase() === 'cover') {
          coverImage = publicUrl
          // Include cover photo in gallery photo stream
          images.unshift({
            url: publicUrl,
            caption: 'Cover Photo',
          })
        } else {
          const cleanCaption = baseName.replace(/[-_]/g, ' ')
          images.push({
            url: publicUrl,
            caption: cleanCaption.charAt(0).toUpperCase() + cleanCaption.slice(1),
          })
        }
      }
    })

    return {
      success: true,
      slug,
      coverImage: coverImage || (images.length > 0 ? images[0].url : null),
      images,
    }
  } catch {
    return { success: false, images: [], coverImage: null }
  }
})
