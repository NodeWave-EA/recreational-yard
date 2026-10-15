import type { NavigationMenuItem } from '@nuxt/ui'

export const SITE_NAME = 'Recreation Yard Limited'
export const SITE_DESCRIPTION = 'MOVE. PLAY. CONNECT. THRIVE. Your space for recreation, active living, sports and shared experiences.'

export const CONTACTS = {
  phone: '0792035035',
  whatsapp: '0792035035',
  email: 'relax@recreationyard.com',
} as const

export const SOCIAL_LINKS: NavigationMenuItem[] = []

export const ANNOUNCEMENT_BAR = {
  text: 'MOVE. PLAY. CONNECT. THRIVE. Prior booking is mandatory for park visits, lawn games and group experiences. Call/WhatsApp: 0792035035',
  ctaText: 'Book Your Visit',
  ctaLink: '/contact',
} as const

export const HIGHLIGHTS = [
  { text: 'Recreation Yard Kericho: Lawn & board games, picnics and outdoor experiences', icon: 'i-tabler-trees' },
  { text: 'Recreation Yard Runners: Run, jog, walk — physical meet-ups & virtual community', icon: 'i-tabler-run' },
  { text: 'Sports Merchandise: Running kits, school games uniforms, corporate sportswear & gear', icon: 'i-tabler-shirt-sport' },
] as const

export const LOCATION_DETAILS = {
  company: 'RECREATION YARD LIMITED',
  parentCompany: 'Recreation Yard Limited',
  brand1: 'Recreation Yard Kericho',
  brand2: 'Recreation Yard Runners',
  motto: 'MOVE. PLAY. CONNECT. THRIVE.',
  tagline: 'Your space for recreation, active living, sports and shared experiences.',
  address: 'KOOMA, along Kericho–Kisumu Highway, Kericho, Kenya',
  phone: '0792035035',
  phoneSecondary: '0792035035',
  email: 'relax@recreationyard.com',
  website: 'www.recreationyard.com',
  hours: 'Prior booking mandatory — please confirm date and time with our team',
  googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Kooma%2C%20Kericho%2C%20Kenya',
  embedLink: '',
  socials: {},
} as const

export const NAV_LINKS: NavigationMenuItem[] = [
  { label: 'Home', to: '/', icon: 'i-tabler-home' },
  { label: 'Recreation', to: '/facilities', icon: 'i-tabler-trees' },
  { label: 'Services', to: '/pricing', icon: 'i-tabler-briefcase' },
  { label: 'Sportswear & Gear', to: '/shop', icon: 'i-tabler-shirt-sport' },
  { label: 'Events & Club', to: '/events', icon: 'i-tabler-calendar-event' },
  { label: 'Gallery', to: '/gallery', icon: 'i-tabler-photo' },
  { label: 'Contact', to: '/contact', icon: 'i-tabler-phone' },
]

export interface FooterCategory {
  title: string
  links: NavigationMenuItem[]
}

export const FOOTER_LINKS: FooterCategory[] = [
  {
    title: 'Brands & Services',
    links: [
      { label: 'Recreation Yard Kericho', to: '/facilities', icon: 'i-tabler-trees' },
      { label: 'Recreation Yard Runners', to: '/events', icon: 'i-tabler-run' },
      { label: 'Sports Kits & Sportswear', to: '/shop', icon: 'i-tabler-shirt-sport' },
      { label: 'Group & Team Experiences', to: '/pricing', icon: 'i-tabler-users-group' },
    ],
  },
  {
    title: 'Information & Support',
    links: [
      { label: 'Photo Gallery', to: '/gallery', icon: 'i-tabler-photo' },
      { label: 'Testimonials', to: '/testimonials', icon: 'i-tabler-message-circle' },
      { label: 'FAQs & Policies', to: '/faqs', icon: 'i-tabler-help' },
      { label: 'Bookings & Contact', to: '/contact', icon: 'i-tabler-phone' },
    ],
  },
]

export const RECREATION_PILLARS = [
  {
    id: 'lawn-and-outdoor-games',
    title: 'Lawn & Outdoor Games',
    tagline: 'Active play in a green outdoor setting.',
    description: 'Badminton, lawn tennis on our grass playing area, cornhole, supervised archery, and other selected recreational activities.',
    icon: 'i-tabler-ball-tennis',
    features: ['Badminton & lawn tennis on grass', 'Supervised archery activities', 'Cornhole & selected games'],
  },
  {
    id: 'board-and-social-games',
    title: 'Board & Social Games',
    tagline: 'Connect over friendly games.',
    description: 'Chess, darts subject to venue safety arrangements, and other social games in a relaxed environment.',
    icon: 'i-tabler-chess',
    features: ['Outdoor chess sets', 'Darts subject to venue safety', 'Relaxed group social play'],
  },
  {
    id: 'recreation-yard-runners',
    title: 'Recreation Yard Runners',
    tagline: 'Run. Jog. Walk. Enjoy the journey.',
    description: 'A welcoming running and walking club supporting consistency, personal progress and connection physically in Kericho and virtually.',
    icon: 'i-tabler-run',
    features: ['Physical meet-ups in Kericho', 'Virtual participation anywhere', 'Community challenges & marathon prep'],
  },
  {
    id: 'sports-merchandise-and-kits',
    title: 'Sports Kits & Sportswear',
    tagline: 'Coordinated apparel and gear for teams.',
    description: 'Running apparel, complete marathon kits, school games uniforms, corporate sportswear and selected sporting equipment.',
    icon: 'i-tabler-shirt-sport',
    features: ['Complete marathon event kits', 'School games & corporate sportswear', 'Footballs, rackets & accessories'],
  },
  {
    id: 'group-experiences-and-picnics',
    title: 'Group Experiences & Picnics',
    tagline: 'Make shared occasions memorable.',
    description: 'Bring-your-own-refreshments picnics, outdoor birthday parties, graduations, meetings and corporate team building.',
    icon: 'i-tabler-users-group',
    features: ['Bring-your-own-refreshments model', 'Team building & milestone celebrations', 'Prior booking mandatory'],
  },
] as const

export const PRICING_PASSES = [] as const
export const SHOP_HIGHLIGHTS = [] as const
export const FAQ_ITEMS = [] as const
export const FEATURED_EVENTS = [] as const
