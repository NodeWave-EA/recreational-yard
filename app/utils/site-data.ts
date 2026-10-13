import type { NavigationMenuItem } from '@nuxt/ui'

export const SITE_NAME = 'Recreation Yard'
export const SITE_DESCRIPTION = 'Kericho\'s Premier Outdoor Recreation Destination'

export const CONTACTS = {
  phone: '+254726270046',
  whatsapp: '+254726270046',
  email: 'info@moderatelimited.co.ke',
} as const

export const SOCIAL_LINKS: NavigationMenuItem[] = [
  {
    label: 'Facebook',
    icon: 'i-tabler-brand-facebook',
    to: 'https://facebook.com',
  },
  {
    label: 'Instagram',
    icon: 'i-tabler-brand-instagram',
    to: 'https://instagram.com',
  },
  {
    label: 'TikTok',
    icon: 'i-tabler-brand-tiktok',
    to: 'https://tiktok.com',
  },
] as const

// Announcement Bar Configuration
export const ANNOUNCEMENT_BAR = {
  text: 'Welcome to Kericho\'s Premier Outdoor Recreation Destination! We are officially open daily from 7:30 AM to 6:00 PM. Enjoy our facilities, events, and shop!',
  ctaText: 'Book Your Slot →',
  ctaLink: '/pricing',
} as const

// Highlights
export const HIGHLIGHTS = [
  {
    text: 'Safe • Clean • Well Maintained',
    icon: 'i-tabler-heart',
  },
  {
    text: 'Family & Community Focused',
    icon: 'i-tabler-users',
  },
  {
    text: 'Tea Garden Views',
    icon: 'i-tabler-tree',
  },
] as const

// Location & Business Details
export const LOCATION_DETAILS = {
  company: 'RECREATION YARD LIMITED',
  parentCompany: 'MODERATE LIMITED',
  tagline: 'Play. Compete. Relax. Kericho\'s top outdoor space for sports, health, and family recreation.',
  address: 'KOOMA, Kericho - Kisumu Highway, Kericho, Kenya',
  phone: '+254 726 270046',
  phoneSecondary: '0726270046',
  email: 'info@moderatelimited.co.ke',
  hours: 'Open Daily from 7:30 AM to 6:00 PM',
  googleMapsUrl: 'https://maps.app.goo.gl/xDRSUtZ3grSzm1FY8',
  embedLink: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.739361381699!2d35.251213899999996!3d-0.36046449999999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182a59c90dfcd6c5:0x64288e800c7613ec!2sRECREATION%20YARD%20LIMITED!5e0!3m2!1sen!2ske!4v1791612688404!5m2!1sen!2ske',
  socials: {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    tiktok: 'https://tiktok.com',
  },
} as const

// Navigation Links
export const NAV_LINKS: NavigationMenuItem[] = [
  {
    label: 'Home',
    to: '/',
    icon: 'i-tabler-home',
  },
  {
    label: 'Facilities',
    to: '/facilities',
    icon: 'i-tabler-trees',
  },
  {
    label: 'Pricing',
    to: '/pricing',
    icon: 'i-tabler-ticket',
  },
  {
    label: 'Shop',
    to: '/shop',
    icon: 'i-tabler-shopping-bag',
  },
  {
    label: 'Events',
    to: '/events',
    icon: 'i-tabler-calendar-event',
  },
  {
    label: 'Gallery',
    to: '/gallery',
    icon: 'i-tabler-photo',
  },
  {
    label: 'Contact',
    to: '/contact',
    icon: 'i-tabler-phone',
  },
]

export interface FooterCategory {
  title: string
  links: NavigationMenuItem[]
}

export const FOOTER_LINKS: FooterCategory[] = [
  {
    title: 'Explore',
    links: [
      { label: 'Home', to: '/', icon: 'i-tabler-home' },
      { label: 'Facilities & Zones', to: '/facilities', icon: 'i-tabler-trees' },
      { label: 'Pricing & Day Passes', to: '/pricing', icon: 'i-tabler-ticket' },
      { label: 'Events & Tournaments', to: '/events', icon: 'i-tabler-calendar-event' },
    ],
  },
  {
    title: 'Community',
    links: [
      { label: 'Photo Gallery', to: '/gallery', icon: 'i-tabler-photo' },
      { label: 'Visitor Testimonials', to: '/testimonials', icon: 'i-tabler-message-circle' },
      { label: 'Shop & Merchandise', to: '/shop', icon: 'i-tabler-shopping-bag' },
      { label: 'Help & FAQs', to: '/faqs', icon: 'i-tabler-help' },
    ],
  },
]

// Recreation Pillars (For Homepage Highlights)
export const RECREATION_PILLARS = [
  {
    id: 'lawn-tennis',
    title: 'Tennis on the Lawn',
    tagline: 'Authentic grass-court tennis in the cool mountain climate.',
    description: 'Experience classic grass tennis with friends or sign up for structured coaching sessions.',
    icon: 'i-tabler-ball-tennis',
    features: ['Natural grass surface', 'Casual & competitive play', 'Coaching available'],
  },
  {
    id: 'archery-range',
    title: 'Archery Range',
    tagline: 'Test your focus, aim, and precision.',
    description: 'Equipped with recurve bows, target stands, and range safety marshals.',
    icon: 'i-tabler-target',
    features: ['Recurve gear provided', 'Targets 10m to 30m', 'Safety instructors on site'],
  },
  {
    id: 'badminton-courts',
    title: 'Badminton Courts',
    tagline: 'Fast-paced fun for all skill levels.',
    description: 'Enjoy quick matches or friendly doubles on our outdoor courts with rackets and shuttles included.',
    icon: 'i-tabler-barbell',
    features: ['2 courts available', 'Rackets & shuttles included', 'Evening lighting'],
  },
  {
    id: 'walking-jogging-trail',
    title: 'Walking & Jogging Trail',
    tagline: 'Scenic morning runs and peaceful evening walks.',
    description: 'A 1.5km crushed-stone trail weaving alongside natural flora and tea garden perimeters.',
    icon: 'i-tabler-walk',
    features: ['1.5km circuit', 'Soft-impact pathing', 'Fresh tea estate breezes'],
  },
  {
    id: 'picnic-bbq-area',
    title: 'Picnic & BBQ Area',
    tagline: 'Gather, grill, and celebrate outdoors.',
    description: 'Shaded wooden gazebos paired with clean, heavy-duty charcoal grill stations.',
    icon: 'i-tabler-grill',
    features: ['Shaded seating', 'Built-in grill stations', 'Group booking available'],
  },
  {
    id: 'kids-playground',
    title: 'Kids Playground',
    tagline: 'Safe, vibrant, and energetic play for children.',
    description: 'Equipped with swings, slides, climbing frames, and obstacle features on soft grass.',
    icon: 'i-tabler-mood-kid',
    features: ['Soft rubberized grass', 'Secure perimeter', 'Visible from dining area'],
  },
  {
    id: 'outdoor-fitness-zone',
    title: 'Outdoor Fitness Zone',
    tagline: 'Calisthenics and strength training in open air.',
    description: 'Equipped with pull-up bars, parallel bars, core stations, and resistance equipment.',
    icon: 'i-tabler-stretching',
    features: ['Bodyweight exercise frames', 'Stretching mats', 'Open daily'],
  },
  {
    id: 'tea-garden-stroll',
    title: 'Tea Garden Stroll',
    tagline: 'Scenic walks with unforgettable photos.',
    description: 'A tranquil stroll along the edge of Kericho\'s world-famous tea gardens.',
    icon: 'i-tabler-plant',
    features: ['Guided nature walks', 'Photography spots', 'Highland views'],
  },
] as const

// Pricing Passes
export const PRICING_PASSES = [
  {
    id: 'day-pass',
    name: 'Day Pass',
    price: 500,
    unit: 'day',
    isPopular: false,
    ctaText: 'BUY DAY PASS',
    features: [
      'Full access to all 8 recreation zones',
      'Standard equipment rentals available on site',
      'Valid 8:00 AM – 7:00 PM daily',
    ],
  },
  {
    id: 'monthly-member',
    name: 'Monthly Member',
    price: 2500,
    unit: 'month',
    isPopular: true,
    ctaText: 'BECOME A MEMBER',
    features: [
      'Unlimited facility access all month',
      'Free racket & archery gear rental',
      '3 Free Guest Passes per month',
      'Exclusive discounts on shop merchandise & events',
    ],
  },
] as const

// Shop Highlights
export const SHOP_HIGHLIGHTS = [
  {
    id: 'tea-250g',
    title: 'Kericho Premium Loose Leaf Tea (250g)',
    price: 400,
    category: 'Fresh Local Produce',
    description: 'Handpicked from surrounding Kericho estates.',
  },
  {
    id: 'yard-cap',
    title: 'Official Recreation Yard Performance Cap',
    price: 800,
    category: 'Branded Sportswear',
    description: 'Lightweight, moisture-wicking outdoor cap.',
  },
] as const

// FAQ Items
export const FAQ_ITEMS = [
  {
    question: 'Do I need to book in advance to visit for a day?',
    answer: 'Walk-ins are always welcome for General Day Passes (KES 500)! However, to guarantee availability for lawn tennis or BBQ stations, we recommend reserving online.',
  },
  {
    question: 'Are equipment rentals included in the entry fee?',
    answer: 'Day Pass holders can rent sports gear at nominal rates on-site. Monthly Members receive complimentary gear rentals.',
  },
] as const

// Featured Events
export const FEATURED_EVENTS = [
  {
    id: 'event-marathon-2026',
    title: 'ANNUAL KERICHO CROSS COUNTRY',
    date: '10 OCT 2026',
    location: 'Kericho',
    description: '10KM run through Kericho country. Medals, refreshments & prizes!',
    badge: '10 OCT 2026',
    registrationOpen: false,
  },
] as const
