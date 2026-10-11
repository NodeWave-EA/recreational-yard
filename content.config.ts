import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    facilities: defineCollection({
      type: 'page',
      source: 'facilities/*.md',
      schema: z.object({
        title: z.string().nonempty('Title is required'),
        description: z.string(),
        icon: z.string().default('i-tabler-trees'),
        coverImage: z.object({
          src: z.string(),
          alt: z.string().default('Facility Image'),
        }).optional(),
        features: z.array(z.string()).default([]),
        capacity: z.string().optional(),
        pricing: z.object({
          rate: z.string(),
          unit: z.string(),
          note: z.string().optional(),
        }).optional(),
        featured: z.boolean().default(false),
        order: z.number().default(99),
        badge: z.string().optional(),
        cta: z.object({
          label: z.string().default('Book Facility'),
          to: z.string().default('/contact'),
        }).optional(),
      }),
    }),

    pricing: defineCollection({
      type: 'page',
      source: 'pricing/*.md',
      schema: z.object({
        title: z.string().nonempty(),
        description: z.string(),
        price: z.number(),
        currency: z.string().default('KES'),
        billingCycle: z.string(),
        isPopular: z.boolean().default(false),
        badge: z.string().optional(),
        order: z.number().default(99),
        features: z.array(z.string()).default([]),
        notIncluded: z.array(z.string()).default([]),
        cta: z.object({
          label: z.string().default('Get Pass'),
          to: z.string().default('/contact'),
        }).optional(),
      }),
    }),

    shop: defineCollection({
      type: 'page',
      source: 'shop/*.md',
      schema: z.object({
        title: z.string().optional(),
        name: z.string().optional(),
        description: z.string().default(''),
        price: z.number().default(0),
        currency: z.string().default('KES'),
        category: z.string().default('General'),
        image: z.union([
          z.string(),
          z.object({
            src: z.string(),
            alt: z.string().optional(),
          }),
        ]).optional(),
        inStock: z.boolean().default(true),
        featured: z.boolean().default(false),
        badge: z.string().optional(),
        order: z.number().default(99),
        details: z.array(z.string()).default([]),
      }),
    }),

    events: defineCollection({
      type: 'page',
      source: 'events/*.md',
      schema: z.object({
        title: z.string().nonempty('Event title is required'),
        description: z.string().default(''),
        date: z.string(), // e.g. "15 DEC 2026"
        time: z.string().default('8:00 AM – 5:00 PM'),
        location: z.string().default('Recreation Yard Kericho'),
        entryFee: z.string().default('Free'),
        category: z.string().default('Community'), // "Sports", "Social", "Wellness"
        coverImage: z.union([
          z.string(),
          z.object({
            src: z.string(),
            alt: z.string().optional(),
          }),
        ]).optional(),
        badge: z.string().optional(),
        registrationOpen: z.boolean().default(true),
        featured: z.boolean().default(false),
        order: z.number().default(99),
        tags: z.array(z.string()).default([]),
        cta: z.object({
          label: z.string().default('Register Now'),
          to: z.string().default('/contact?type=event-registration'),
        }).optional(),
      }),
    }),

    gallery: defineCollection({
      type: 'page',
      source: 'gallery/*.md',
      schema: z.object({
        title: z.string().nonempty('Gallery collection title is required'),
        description: z.string().default(''),
        category: z.string().default('sports'), // e.g. "sports", "scenery", "events"
        badge: z.string().optional(),
        date: z.string().optional(),
        coverImage: z.union([
          z.string(),
          z.object({
            src: z.string(),
            alt: z.string().optional(),
          }),
        ]).optional(),
        photos: z.array(
          z.object({
            url: z.string().nonempty('Photo URL is required'),
            caption: z.string().optional(),
          }),
        ).default([]),
        featured: z.boolean().default(false),
        order: z.number().default(99),
      }),
    }),
  },
})
