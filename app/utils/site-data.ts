import type { NavigationMenuItem } from '@nuxt/ui'

export const SITE_NAME = 'Recreation Yard Limited'
export const SITE_DESCRIPTION = 'Move. Play. Connect. Thrive.'

export const CONTACTS = {
  phone: '0792035035',
  whatsapp: '0792035035',
  email: 'relax@recreationyard.com',
} as const

export const SOCIAL_LINKS: NavigationMenuItem[] = []

export const ANNOUNCEMENT_BAR = {
  text: 'Move. Play. Connect. Thrive. Recreation Yard Limited brings recreation, running, sportswear and shared experiences together in Kericho.',
  ctaText: 'Plan Your Visit',
  ctaLink: '/contact',
} as const

export const HIGHLIGHTS = [
  { text: 'Welcoming outdoor recreation', icon: 'i-tabler-trees' },
  { text: 'Running and walking community', icon: 'i-tabler-run' },
  { text: 'Sports kits and equipment', icon: 'i-tabler-shirt-sport' },
] as const

export const LOCATION_DETAILS = {
  company: 'RECREATION YARD LIMITED',
  parentCompany: 'RECREATION YARD LIMITED',
  tagline: 'Your space for recreation, active living, sports and shared experiences.',
  address: 'KOOMA, along Kericho–Kisumu Highway, Kericho, Kenya',
  phone: '0792035035',
  phoneSecondary: '0792035035',
  email: 'relax@recreationyard.com',
  hours: 'Please confirm availability when booking',
  googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Kooma%2C%20Kericho%2C%20Kenya',
  embedLink: '',
  socials: {},
} as const

export const NAV_LINKS: NavigationMenuItem[] = [
  { label: 'Home', to: '/', icon: 'i-tabler-home' },
  { label: 'Recreation', to: '/facilities', icon: 'i-tabler-trees' },
  { label: 'Services', to: '/pricing', icon: 'i-tabler-briefcase' },
  { label: 'Sportswear', to: '/shop', icon: 'i-tabler-shirt-sport' },
  { label: 'Events', to: '/events', icon: 'i-tabler-calendar-event' },
  { label: 'Gallery', to: '/gallery', icon: 'i-tabler-photo' },
  { label: 'Contact', to: '/contact', icon: 'i-tabler-phone' },
]

export interface FooterCategory {
  title: string
  links: NavigationMenuItem[]
}

export const FOOTER_LINKS: FooterCategory[] = [
  {
    title: 'Explore',
    links: [
      { label: 'Recreation Yard Kericho', to: '/facilities', icon: 'i-tabler-trees' },
      { label: 'Recreation Yard Runners', to: '/events', icon: 'i-tabler-run' },
      { label: 'Sports kits & equipment', to: '/shop', icon: 'i-tabler-shirt-sport' },
      { label: 'Group experiences', to: '/contact?type=group-booking', icon: 'i-tabler-users-group' },
    ],
  },
  {
    title: 'Information',
    links: [
      { label: 'Gallery', to: '/gallery', icon: 'i-tabler-photo' },
      { label: 'Testimonials', to: '/testimonials', icon: 'i-tabler-message-circle' },
      { label: 'FAQs', to: '/faqs', icon: 'i-tabler-help' },
      { label: 'Contact us', to: '/contact', icon: 'i-tabler-phone' },
    ],
  },
]

export const RECREATION_PILLARS = [
  {
    id: 'lawn-and-outdoor-games',
    title: 'Lawn & Outdoor Games',
    tagline: 'Relaxed play in a welcoming green space.',
    description: 'Enjoy badminton, lawn tennis, cornhole and selected outdoor activities with family, friends or a group.',
    icon: 'i-tabler-ball-tennis',
    features: ['Badminton', 'Lawn tennis', 'Cornhole and selected games'],
  },
  {
    id: 'board-and-social-games',
    title: 'Board & Social Games',
    tagline: 'Connect over friendly games.',
    description: 'Spend quality time together with chess, darts subject to venue arrangements, and other social activities.',
    icon: 'i-tabler-chess',
    features: ['Chess', 'Darts subject to safety arrangements', 'Social group play'],
  },
  {
    id: 'recreation-yard-runners',
    title: 'Recreation Yard Runners',
    tagline: 'Run. Jog. Walk. Enjoy the journey.',
    description: 'Join a welcoming physical and virtual community that supports consistency, personal progress and connection.',
    icon: 'i-tabler-run',
    features: ['Physical meet-ups in Kericho', 'Virtual participation', 'Community challenges'],
  },
  {
    id: 'group-experiences',
    title: 'Group Experiences',
    tagline: 'Make time together count.',
    description: 'Plan outdoor birthdays, graduations, meetings and team-building activities around your group’s needs.',
    icon: 'i-tabler-users-group',
    features: ['Prior booking and planning', 'Flexible outdoor setting', 'Corporate and school enquiries'],
  },
] as const

export const PRICING_PASSES = [] as const
export const SHOP_HIGHLIGHTS = [] as const
export const FAQ_ITEMS = [] as const
export const FEATURED_EVENTS = [] as const
