import type { PageCollections } from '@nuxt/content'

export interface SearchCollectionMeta {
  key: keyof PageCollections
  label: string
  icon: string
  defaultBadge: string
}

export const SEARCH_COLLECTION_CONFIGS: SearchCollectionMeta[] = [
  { key: 'facilities', label: 'Facilities', icon: 'i-tabler-trees', defaultBadge: 'Facility' },
  { key: 'pricing', label: 'Pricing Passes', icon: 'i-tabler-ticket', defaultBadge: 'Pass' },
  { key: 'shop', label: 'Shop Merchandise', icon: 'i-tabler-shopping-bag', defaultBadge: 'Product' },
  { key: 'events', label: 'Events & Tournaments', icon: 'i-tabler-calendar-event', defaultBadge: 'Event' },
  { key: 'gallery', label: 'Gallery', icon: 'i-tabler-photo', defaultBadge: 'Gallery' },
  { key: 'faqs', label: 'FAQs & Help', icon: 'i-tabler-help-circle', defaultBadge: 'FAQ' },
  { key: 'testimonials', label: 'Testimonials', icon: 'i-tabler-message-heart', defaultBadge: 'Review' },
]

export interface NormalizedSearchResult {
  id: string
  collectionKey: string
  collectionLabel: string
  collectionIcon: string
  title: string
  description: string
  path: string
  icon: string
  badge: string
  image?: string
  meta?: string
}

export function cleanPath(pathStr: string): string {
  if (!pathStr)
    return ''
  let cleaned = pathStr.split('#')[0]?.split('?')[0] || ''
  if (!cleaned.startsWith('/')) {
    cleaned = `/${cleaned}`
  }
  if (cleaned.length > 1 && cleaned.endsWith('/')) {
    cleaned = cleaned.slice(0, -1)
  }
  return cleaned
}

/**
 * Normalizes text to prevent concatenated words from AST sections/lists
 */
export function sanitizeBodyText(text: string): string {
  if (!text)
    return ''
  return text
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/(\S)([•\-*])/g, '$1 $2')
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Extracts clean snippet context without squished formatting
 */
export function getMatchingSnippet(fullText: string, query: string, maxLength = 140): string {
  if (!fullText || !query)
    return ''

  const cleanText = sanitizeBodyText(fullText)
  const qLower = query.toLowerCase().trim()
  const textLower = cleanText.toLowerCase()
  const index = textLower.indexOf(qLower)

  if (index === -1) {
    const tokens = qLower.split(/\s+/).filter(Boolean)
    for (const token of tokens) {
      const tokenIdx = textLower.indexOf(token)
      if (tokenIdx !== -1) {
        return extractAround(cleanText, tokenIdx, token.length, maxLength)
      }
    }
    return ''
  }

  return extractAround(cleanText, index, query.length, maxLength)
}

function extractAround(text: string, index: number, matchLen: number, maxLength: number): string {
  const start = Math.max(0, index - Math.floor((maxLength - matchLen) / 2))
  const end = Math.min(text.length, start + maxLength)
  let snippet = text.slice(start, end).trim()
  if (start > 0)
    snippet = `...${snippet}`
  if (end < text.length)
    snippet = `${snippet}...`
  return snippet
}

export function normalizeContentItem(item: Record<string, unknown>, collectionKey: string): NormalizedSearchResult {
  // Title extraction supporting standard documents, FAQs (question), and Testimonials (author)
  let title = ''
  if (typeof item.question === 'string') {
    title = item.question
  } else if (typeof item.author === 'string') {
    title = item.author
  } else if (typeof item.title === 'string') {
    title = item.title
  } else if (typeof item.name === 'string') {
    title = item.name
  } else {
    title = 'Untitled'
  }

  // Description extraction supporting standard documents, FAQs (answer), and Testimonials (comment)
  let description = ''
  if (typeof item.answer === 'string') {
    description = item.answer
  } else if (typeof item.comment === 'string') {
    description = item.comment
  } else if (typeof item.description === 'string') {
    description = item.description
  }

  // Path routing mapping
  let path = cleanPath(typeof item.path === 'string' ? item.path : '/')
  if (collectionKey === 'faqs') {
    path = item.category === 'Pricing & Passes' ? '/pricing' : '/contact'
  } else if (collectionKey === 'testimonials') {
    path = item.category === 'Pricing & Passes' ? '/pricing' : '/'
  }

  // Image extraction supporting cover images and testimonial avatars
  let image = ''
  if (typeof item.avatar === 'string') {
    image = item.avatar
  } else if (typeof item.coverImage === 'string') {
    image = item.coverImage
  } else if (item.coverImage && typeof item.coverImage === 'object' && 'src' in item.coverImage && typeof item.coverImage.src === 'string') {
    image = item.coverImage.src
  } else if (typeof item.image === 'string') {
    image = item.image
  } else if (item.image && typeof item.image === 'object' && 'src' in item.image && typeof item.image.src === 'string') {
    image = item.image.src
  }

  // Meta string context
  let meta = ''
  if (typeof item.rating === 'number') {
    meta = `${'★'.repeat(item.rating)} (${typeof item.role === 'string' ? item.role : 'Member Review'})`
  } else if (item.price !== undefined && typeof item.price === 'number') {
    const currency = typeof item.currency === 'string' ? item.currency : 'KES'
    meta = `${currency} ${item.price.toLocaleString()}`
    if (typeof item.billingCycle === 'string') {
      meta += ` / ${item.billingCycle}`
    }
  } else if (typeof item.date === 'string' && typeof item.location === 'string') {
    meta = `${item.date} • ${item.location}`
  } else if (typeof item.category === 'string') {
    meta = `Category: ${item.category}`
  } else if (typeof item.capacity === 'string') {
    meta = `Capacity: ${item.capacity}`
  }

  const config = SEARCH_COLLECTION_CONFIGS.find(c => c.key === collectionKey)

  return {
    id: typeof item.id === 'string' ? cleanPath(item.id) : path,
    collectionKey,
    collectionLabel: config?.label || collectionKey,
    collectionIcon: config?.icon || 'i-tabler-file',
    title,
    description,
    path,
    icon: typeof item.icon === 'string' ? item.icon : config?.icon || 'i-tabler-file',
    badge: typeof item.badge === 'string'
      ? item.badge
      : typeof item.category === 'string'
        ? item.category
        : typeof item.role === 'string'
          ? item.role
          : config?.defaultBadge || collectionKey,
    image,
    meta,
  }
}
