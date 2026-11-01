import { defineCollection, defineContentConfig, property, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {

    facilities: defineCollection({
      type: 'page',
      source: 'facilities/*.md',
      schema: z.object({
        title: z
          .string()
          .nonempty('Title is required')
          .describe('Name of the facility or area (e.g. Archery Range, Lawn Tennis Court)'),

        description: property(z.string())
          .editor({ input: 'textarea' })
          .describe('Brief summary of the facility for listings and cards'),

        quote: z.object({
          text: z
            .string()
            .describe('1-liner quote about this court or range'),
          author: z
            .string()
            .optional()
            .describe('Author or source (e.g., Lead Instructor, Guest Reviewer)'),
        }).optional(),

        category: property(z.string().default('Outdoor Sports'))
          .editor({
            input: 'select',
            options: ['Outdoor Sports', 'Target Sports', 'Kids & Family', 'Events & Venues', 'Relaxation & Picnics'],
          })
          .describe('Category for filtering facilities'),

        icon: property(z.string().default('i-lucide-trees'))
          .editor({ input: 'icon' })
          .describe('Icon visual for navigation menus and cards (e.g. i-lucide-target)'),

        coverImage: z.object({
          src: property(z.string()).editor({ input: 'media' }).describe('Main cover photo'),
          alt: z.string().default('Facility Image').describe('Alt text for accessibility'),
        }).optional(),

        gallery: z.array(
          z.object({
            url: property(z.string()).editor({ input: 'media' }).describe('Gallery image path'),
            caption: z.string().optional().describe('Optional caption for full-screen viewer'),
          }),
        ).default([]).describe('Additional photo gallery for this facility'),

        operatingHours: z
          .string()
          .default('Confirm availability when booking')
          .describe('Opening hours specific to this facility'),

        ageGroup: property(z.string().default('All Ages'))
          .editor({
            input: 'select',
            options: ['All Ages', 'Kids (3-12)', 'Teens & Adults (13+)', 'Adults Only (18+)'],
          })
          .describe('Target age restrictions or guidelines'),

        capacity: z
          .string()
          .optional()
          .describe('Max participant or spectator capacity (e.g. "Up to 20 archers per slot")'),

        bookingRequired: z
          .boolean()
          .default(false)
          .describe('Does this facility require advance slot reservation?'),

        features: z
          .array(z.string())
          .default([])
          .describe('Key features & amenities provided (e.g. "Equipment provided", "Shaded seating", "Instructor available")'),

        rules: z
          .array(z.string())
          .default([])
          .describe('Safety rules & dress code (e.g. "Closed-toe shoes required", "No outside food inside lanes")'),

        pricing: z.object({
          rate: z.string().describe('Price value (e.g. "1,500" or "Free")'),
          unit: z.string().describe('Pricing unit (e.g. "per hour", "per target slot", "per day")'),
          note: z.string().optional().describe('Special conditions (e.g. "Includes basic bow rental")'),
        }).optional(),

        featured: z
          .boolean()
          .default(false)
          .describe('Pin to homepage or top facility sections'),

        order: z
          .number()
          .default(99)
          .describe('Display sequence weight (lower numbers appear first)'),

        badge: z
          .string()
          .optional()
          .describe('Promotional badge text (e.g. "Most Popular", "New Facility")'),

        cta: z.object({
          label: z.string().default('Book Facility Slot'),
          to: z.string().default('/contact?type=facility-booking'),
        }).optional(),
      }),
    }),

    pricing: defineCollection({
      type: 'page',
      source: 'pricing/*.md',
      schema: z.object({
        title: z
          .string()
          .nonempty()
          .describe('Pass or plan name (e.g. All-Day Activity Pass, Monthly Archery Club)'),

        description: property(z.string())
          .editor({ input: 'textarea' })
          .describe('Short explanation of what access level this pass grants'),

        category: property(z.string().default('Day Passes'))
          .editor({
            input: 'select',
            options: ['Group & School Packages', 'Facility Hire'],
          })
          .describe('Category tab on the pricing page'),

        price: z.number().describe('Numeric price amount (e.g. 2000)'),

        currency: z.string().default('KES').describe('Currency code'),

        billingCycle: property(z.string().default('per session'))
          .editor({
            input: 'select',
            options: ['per session', 'per hour', 'per day', 'per month', 'per year', 'one-time'],
          })
          .describe('Billing or access interval'),

        isPopular: z
          .boolean()
          .default(false)
          .describe('Highlight this pricing card with a badge or border outline'),

        badge: z
          .string()
          .optional()
          .describe('Custom ribbon text (e.g. "Best Value", "Save 20%")'),

        features: z
          .array(z.string())
          .default([])
          .describe('List of perks and inclusions'),

        notIncluded: z
          .array(z.string())
          .default([])
          .describe('List of exclusions or add-ons requiring extra fees'),

        order: z.number().default(99).describe('Display sequence weight'),

        cta: z.object({
          label: z.string().default('Get Pass'),
          to: z.string().default('/contact?type=pass-purchase'),
        }).optional(),
      }),
    }),

    shop: defineCollection({
      type: 'page',
      source: 'shop/*.md',
      schema: z.object({
        title: z.string().optional().describe('Legacy title field'),
        name: z.string().optional().describe('Product or equipment item name'),

        description: property(z.string())
          .editor({ input: 'textarea' })
          .describe('Item description, specifications, or gear details'),

        itemType: property(z.string().default('merchandise'))
          .editor({
            input: 'select',
            options: ['merchandise', 'equipment_rental', 'snacks_and_drinks', 'souvenir'],
          })
          .describe('Distinguishes physical shop items from rental gear'),

        category: property(z.string().default('General'))
          .editor({
            input: 'select',
            options: ['Running Apparel', 'School & Corporate Sportswear', 'Sporting Equipment', 'Lawn Games', 'General'],
          })
          .describe('Shop product category'),

        price: z.number().default(0).describe('Item price'),
        currency: z.string().default('KES').describe('Currency unit'),

        rentalDuration: z
          .string()
          .optional()
          .describe('For rental gear only (e.g. "per hour", "per session")'),

        image: z.union([
          property(z.string()).editor({ input: 'media' }),
          z.object({
            src: property(z.string()).editor({ input: 'media' }),
            alt: z.string().optional(),
          }),
        ]).optional().describe('Product or rental gear photo'),

        inStock: z.boolean().default(true).describe('Is item currently available?'),
        featured: z.boolean().default(false).describe('Showcase on shop home section'),
        badge: z.string().optional().describe('Tag badge (e.g. "Rental", "Hot Seller")'),
        order: z.number().default(99).describe('Display order'),
        details: z.array(z.string()).default([]).describe('Item features or technical specs'),
      }),
    }),

    events: defineCollection({
      type: 'page',
      source: 'events/*.md',
      schema: z.object({
        title: z
          .string()
          .nonempty('Event title is required')
          .describe('Name of tournament, workshop, or community gathering'),

        description: property(z.string())
          .editor({ input: 'textarea' })
          .describe('Detailed event summary and highlights'),

        status: property(z.string().default('upcoming'))
          .editor({
            input: 'select',
            options: ['upcoming', 'registration_open', 'sold_out', 'ongoing', 'completed', 'cancelled'],
          })
          .describe('Event availability status'),

        date: z
          .string()
          .describe('Event date display text (e.g. "15 DEC 2026")'),

        startDate: z
          .string()
          .optional()
          .describe('ISO 8601 start date timestamp (e.g. "2026-10-25T05:45:00+03:00")'),
        endDate: z
          .string()
          .optional()
          .describe('ISO 8601 end date timestamp (e.g. "2026-10-25T13:00:00+03:00")'),

        time: z.string().default('8:00 AM – 5:00 PM').describe('Time duration display text'),
        location: z.string().default('Recreation Yard Kericho').describe('Specific venue or start point'),

        category: property(z.string().default('Community'))
          .editor({
            input: 'select',
            options: ['Archery Competition', 'Sports & Fitness', 'Community & Social', 'Wellness & Yoga', 'Kids Camp'],
          })
          .describe('Event category filter'),

        entryFee: z.string().default('Free').describe('Entry cost (e.g. "Free", "KES 500", "KES 1,000 per team")'),

        capacity: z.string().optional().describe('Max participant limit (e.g. "200 participants")'),

        coverImage: z.union([
          property(z.string()).editor({ input: 'media' }),
          z.object({
            src: property(z.string()).editor({ input: 'media' }),
            alt: z.string().optional(),
          }),
        ]).optional().describe('Event promotional banner/poster'),

        badge: z.string().optional().describe('Ribbon label (e.g. "Featured Tournament")'),
        featured: z.boolean().default(false).describe('Promote on homepage banner'),
        order: z.number().default(99).describe('Display sequence'),
        tags: z.array(z.string()).default([]).describe('Search tags (e.g. ["Marathon", "Weekend", "Family"])'),

        organizer: z.object({
          name: z.string().default('Recreation Yard Kericho'),
          phone: z.string().optional(),
          email: z.string().optional(),
        }).optional().describe('Event host or organizing body'),

        registrationUrl: z.string().optional().describe('Direct external registration or ticketing link'),

        schedule: z.array(
          z.object({
            time: z.string().describe('Schedule point or time window'),
            activity: z.string().describe('Activity title'),
            details: z.string().optional().describe('Additional notes or instructions'),
          }),
        ).default([]).describe('Timeline or itinerary for the event'),

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
        title: z
          .string()
          .nonempty('Gallery collection title is required')
          .describe('Album or facility photo collection name'),

        description: property(z.string())
          .editor({ input: 'textarea' })
          .describe('Album description'),

        category: property(z.string().default('sports'))
          .editor({
            input: 'select',
            options: ['archery', 'lawn-games', 'scenery', 'events-and-parties', 'facilities'],
          })
          .describe('Category filter for gallery page'),

        badge: z.string().optional().describe('Album tag (e.g. "Recent Photos")'),
        date: z.string().optional().describe('Date album was created or shot'),

        coverImage: z.union([
          property(z.string()).editor({ input: 'media' }),
          z.object({
            src: property(z.string()).editor({ input: 'media' }),
            alt: z.string().optional(),
          }),
        ]).optional().describe('Thumbnail image for the entire album'),

        photos: z.array(
          z.object({
            url: property(z.string().nonempty('Photo URL is required'))
              .editor({ input: 'media' })
              .describe('Image location in public media folder'),
            caption: z.string().optional().describe('Photo caption displayed in lightbox'),
            alt: z.string().optional().describe('Accessibility alt text'),
          }),
        ).default([]).describe('List of images inside this album'),

        featured: z.boolean().default(false).describe('Show on homepage gallery showcase'),
        order: z.number().default(99).describe('Display ordering'),
      }),
    }),

    faqs: defineCollection({
      type: 'page',
      source: 'faqs/*.md',
      schema: z.object({
        question: z.string().nonempty().describe('The user question'),

        answer: property(z.string())
          .editor({ input: 'textarea' })
          .describe('Detailed answer text'),

        category: property(z.string().default('General'))
          .editor({
            input: 'select',
            options: ['General', 'Pricing & Passes', 'Facilities & Sports', 'Events & Groups'],
          })
          .describe('FAQ section categorization'),

        facility: z
          .string()
          .optional()
          .describe('Facility slug target (e.g. "archery-range"). Leave blank or set "all" for general facility FAQs'),

        order: z.number().default(99).describe('Display sequence within category'),
      }),
    }),

    testimonials: defineCollection({
      type: 'page',
      source: 'testimonials/*.md',
      schema: z.object({
        author: z.string().nonempty().describe('Guest or member name'),

        role: z
          .string()
          .default('Visitor')
          .describe('Role or context (e.g. "Club Member", "Corporate Event Host")'),

        category: property(z.string().default('General'))
          .editor({
            input: 'select',
            options: ['General', 'Pricing & Passes', 'Facilities & Sports', 'Events & Groups'],
          })
          .describe('Testimonial placement category'),

        facility: z
          .string()
          .optional()
          .describe('Facility slug target (e.g. "archery-range"). Leave blank or set "all" for general facility testimonials'),

        comment: property(z.string())
          .editor({ input: 'textarea' })
          .describe('Review or testimonial text'),

        rating: z.number().min(1).max(5).default(5).describe('Star rating out of 5'),

        avatar: property(z.string())
          .editor({ input: 'media' })
          .optional()
          .describe('Guest profile picture or avatar photo'),

        featured: z.boolean().default(true).describe('Include in featured queries'),
      }),
    }),
  },
})
