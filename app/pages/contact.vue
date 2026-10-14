<script setup lang="ts">
import { useContentQuery } from '~/composables/useContentQuery'
import { CONTACTS, LOCATION_DETAILS, SITE_NAME } from '~/utils/site-data'

const route = useRoute()
const toast = useToast()
const { getCollection } = useContentQuery()

// Fetch contact/support FAQs
const { data: contactFaqs } = await getCollection('contact-faqs-collection', 'faqs', {
  where: { category: 'General' },
  sort: [{ key: 'order', order: 'ASC' }],
  enableLogging: false,
})

// Active open FAQ accordion items state
const openFaqItems = ref<number[]>([0])

function toggleFaqItem(index: number) {
  if (openFaqItems.value.includes(index)) {
    openFaqItems.value = openFaqItems.value.filter(i => i !== index)
  } else {
    openFaqItems.value.push(index)
  }
}

const inquiryOptions = [
  'General Inquiry',
  'Facility Booking',
  'Running Club',
  'Event Registration',
  'Group & Corporate Booking',
  'Sports Kits & Merchandise',
]

const formState = reactive({
  name: '',
  email: '',
  phone: '',
  inquiryType: 'General Inquiry',
  subject: '',
  message: '',
  turnstileToken: '',
  websiteUrl: '', // Honeypot field
})

const isSubmitting = ref(false)

// Pre-fill form state based on URL parameters
onMounted(() => {
  const facility = route.query.facility as string
  const pass = route.query.pass as string
  const eventName = route.query.event as string
  const type = route.query.type as string

  if (facility) {
    formState.inquiryType = 'Facility Booking'
    formState.subject = `Booking Request: ${facility.replace(/-/g, ' ')}`
    formState.message = `Hello, I would like to reserve a slot for ${facility.replace(/-/g, ' ')}. Please advise on availability and guidelines.`
  } else if (pass) {
    formState.inquiryType = 'Sports Kits & Merchandise'
    formState.subject = `Service enquiry: ${pass.replace(/-/g, ' ')}`
    formState.message = `Hello, I would like more information about ${pass.replace(/-/g, ' ')}. Please advise on availability and requirements.`
  } else if (eventName) {
    formState.inquiryType = 'Event Registration'
    formState.subject = `Event Registration: ${eventName.replace(/-/g, ' ')}`
    formState.message = `Hello, I would like to register for the upcoming event: ${eventName.replace(/-/g, ' ')}.`
  } else if (type === 'group-booking') {
    formState.inquiryType = 'Group & Corporate Booking'
    formState.subject = 'Custom Group / Corporate Function Request'
    formState.message = 'Hello, we are planning a group outing, team-building function or shared experience at Recreation Yard. Please advise on suitability, availability and quotation.'
  }
})

async function handleSubmit() {
  if (!formState.name || !formState.email || !formState.message) {
    toast.add({
      title: 'Missing Required Fields',
      description: 'Please complete your name, email address, and message.',
      color: 'warning',
    })
    return
  }

  isSubmitting.value = true

  try {
    const res = await $fetch<{ success: boolean, message: string }>('/api/contact', {
      method: 'POST',
      body: formState,
    })

    toast.add({
      title: 'Inquiry Submitted',
      description: res.message,
      color: 'primary',
    })

    // Reset Form Fields
    formState.name = ''
    formState.email = ''
    formState.phone = ''
    formState.subject = ''
    formState.message = ''
    formState.turnstileToken = ''
  } catch (err: any) {
    toast.add({
      title: 'Submission Error',
      description: err?.data?.statusMessage || err?.message || 'Failed to send message. Please try again.',
      color: 'error',
    })
  } finally {
    isSubmitting.value = false
  }
}

useSeoMeta({
  title: `Contact Us & Bookings | ${SITE_NAME}`,
  description: 'Contact Recreation Yard Limited in Kericho for recreation, running, sports merchandise and group experience enquiries.',
  ogTitle: `Contact Us & Bookings | ${SITE_NAME}`,
  ogDescription: 'Contact Recreation Yard Limited in Kericho for recreation, running, sports merchandise and group experience enquiries.',
  ogImage: `${useRuntimeConfig().public.siteUrl}/logo.png`,
  ogUrl: `${useRuntimeConfig().public.siteUrl}/contact`,
})

const siteUrl = useRuntimeConfig().public.siteUrl
useSchemaOrg([{
  '@type': 'ContactPage',
  '@id': `${siteUrl}/contact#webpage`,
  'url': `${siteUrl}/contact`,
  'name': `Contact Us & Bookings | ${SITE_NAME}`,
  'description': 'Contact Recreation Yard Limited in Kericho for recreation, running, sports merchandise and group experience enquiries.',
  'isPartOf': { '@id': `${siteUrl}/#website` },
  'about': { '@id': `${siteUrl}/#organization` },
}])
</script>

<template>
  <div class="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white pb-16 transition-colors duration-300">
    <!-- Left-Aligned Mobile Hero Header -->
    <section class="pt-6 sm:pt-10 pb-2 sm:pb-4 text-left sm:text-center px-4 mx-auto space-y-3">
      <div class="inline-flex">
        <UBadge
          color="primary"
          variant="soft"
          class="font-bold uppercase tracking-widest text-[10px] sm:text-xs px-3 py-1 rounded-full border border-lime-500/20"
        >
          <UIcon name="i-tabler-headset" class="size-3.5 mr-1.5 text-lime-500 shrink-0" />
          <span>Bookings & enquiries</span>
        </UBadge>
      </div>

      <h1 class="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-neutral-950 dark:text-white leading-tight">
        Recreation Yard Kericho
      </h1>

      <p class="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-md mx-0 sm:mx-auto">
        Contact us about outdoor recreation, Recreation Yard Runners, sports kits, group bookings, partnerships or general enquiries.
      </p>
    </section>

    <!-- Compact Contact Info Bar -->
    <div class="border-y border-neutral-200 dark:border-neutral-800 py-4 sm:py-6 my-4 sm:my-6">
      <UContainer class="w-full">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <!-- Phone / WhatsApp -->
          <a
            :href="`tel:${CONTACTS.phone}`"
            class="group flex items-center gap-2.5 sm:gap-3.5 hover:text-lime-600 dark:hover:text-lime-400 transition-colors min-w-0"
          >
            <div class="flex size-9 sm:size-11 shrink-0 items-center justify-center rounded-xl bg-lime-500/10 text-lime-600 dark:text-lime-400 group-hover:bg-lime-500 group-hover:text-neutral-950 transition-colors">
              <UIcon name="i-tabler-phone-call" class="size-4 sm:size-5" />
            </div>
            <div class="min-w-0 flex-1">
              <span class="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-neutral-400 block truncate">Phone / WhatsApp</span>
              <span class="text-xs sm:text-sm font-black text-neutral-950 dark:text-white block mt-0.5 group-hover:text-lime-600 dark:group-hover:text-lime-400 truncate">
                {{ CONTACTS.phone }}
              </span>
            </div>
          </a>

          <!-- Email Address -->
          <a
            :href="`mailto:${CONTACTS.email}`"
            class="group flex items-center gap-2.5 sm:gap-3.5 hover:text-lime-600 dark:hover:text-lime-400 transition-colors min-w-0"
          >
            <div class="flex size-9 sm:size-11 shrink-0 items-center justify-center rounded-xl bg-lime-500/10 text-lime-600 dark:text-lime-400 group-hover:bg-lime-500 group-hover:text-neutral-950 transition-colors">
              <UIcon name="i-tabler-mail" class="size-4 sm:size-5" />
            </div>
            <div class="min-w-0 flex-1">
              <span class="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-neutral-400 block truncate">Email Address</span>
              <span class="text-xs sm:text-sm font-black text-neutral-950 dark:text-white block mt-0.5 group-hover:text-lime-600 dark:group-hover:text-lime-400 truncate">
                {{ CONTACTS.email }}
              </span>
            </div>
          </a>

          <!-- Operating Hours -->
          <div class="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
            <div class="flex size-9 sm:size-11 shrink-0 items-center justify-center rounded-xl bg-lime-500/10 text-lime-600 dark:text-lime-400">
              <UIcon name="i-tabler-clock" class="size-4 sm:size-5" />
            </div>
            <div class="min-w-0 flex-1">
              <span class="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-neutral-400 block truncate">Operating Hours</span>
              <span class="text-xs sm:text-sm font-bold text-neutral-950 dark:text-white block mt-0.5 truncate">
                8:00 AM - 7:00 PM
              </span>
            </div>
          </div>

          <!-- Location -->
          <div class="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
            <div class="flex size-9 sm:size-11 shrink-0 items-center justify-center rounded-xl bg-lime-500/10 text-lime-600 dark:text-lime-400">
              <UIcon name="i-tabler-map-pin" class="size-4 sm:size-5" />
            </div>
            <div class="min-w-0 flex-1">
              <span class="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-neutral-400 block truncate">Location</span>
              <span class="text-xs sm:text-sm font-bold text-neutral-950 dark:text-white block mt-0.5 truncate">
                KOOMA, Kericho–Kisumu Hwy
              </span>
            </div>
          </div>
        </div>
      </UContainer>
    </div>

    <!-- Main Content Container -->
    <UContainer class="w-full pt-4 space-y-16">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start">
        <!-- Left: Online Inquiry Form -->
        <div class="lg:col-span-7 space-y-6">
          <div>
            <UBadge color="neutral" variant="soft" class="font-bold text-[10px] uppercase tracking-wider mb-2">
              Send Us a Message
            </UBadge>
            <h2 class="text-2xl font-black text-neutral-950 dark:text-white">
              Online Inquiry Form
            </h2>
            <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Fill in your details and our concierge team will respond within 2 hours.
            </p>
          </div>

          <form class="space-y-4" @submit.prevent="handleSubmit">
            <!-- Honeypot Field -->
            <input
              v-model="formState.websiteUrl"
              type="text"
              name="websiteUrl"
              tabindex="-1"
              autocomplete="off"
              class="hidden"
              aria-hidden="true"
            >

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <label class="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Your Full Name *</label>
                <UInput
                  v-model="formState.name"
                  icon="i-tabler-user"
                  placeholder="e.g. Kiprono Cheruiyot"
                  size="md"
                  color="neutral"
                  class="w-full"
                  required
                />
              </div>

              <div class="space-y-1.5">
                <label class="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Email Address *</label>
                <UInput
                  v-model="formState.email"
                  type="email"
                  icon="i-tabler-mail"
                  placeholder="e.g. name@domain.com"
                  size="md"
                  color="neutral"
                  class="w-full"
                  required
                />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <label class="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Phone / WhatsApp Number</label>
                <UInput
                  v-model="formState.phone"
                  icon="i-tabler-phone"
                  placeholder="+254 7XX XXX XXX"
                  size="md"
                  color="neutral"
                  class="w-full"
                />
              </div>

              <div class="space-y-1.5">
                <label class="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Inquiry Category *</label>
                <USelectMenu
                  v-model="formState.inquiryType"
                  :items="inquiryOptions"
                  :options="inquiryOptions"
                  size="md"
                  color="neutral"
                  class="w-full"
                />
              </div>
            </div>

            <div class="space-y-1.5">
              <label class="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Subject Line</label>
              <UInput
                v-model="formState.subject"
                placeholder="e.g. Group recreation or sports kit enquiry"
                size="md"
                color="neutral"
                class="w-full"
              />
            </div>

            <div class="space-y-1.5">
              <label class="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Your Message *</label>
              <UTextarea
                v-model="formState.message"
                placeholder="Provide details about your proposed date, time, group size, or specific questions..."
                :rows="4"
                autoresize
                color="neutral"
                class="w-full min-h-27.5"
                required
              />
            </div>

            <!-- Cloudflare Turnstile Captcha -->
            <div class="py-1">
              <NuxtTurnstile v-model="formState.turnstileToken" />
            </div>

            <!-- Submit Button -->
            <UButton
              type="submit"
              block
              size="lg"
              color="primary"
              icon="i-tabler-send"
              :loading="isSubmitting"
              class="font-black uppercase text-xs text-neutral-950 rounded-xl py-3.5"
            >
              Send Message
            </UButton>
          </form>
        </div>

        <!-- Right: Venue Overview & Direct Channels -->
        <div class="lg:col-span-5 space-y-8 lg:border-l lg:border-neutral-200/80 lg:dark:border-neutral-800 lg:pl-10">
          <div class="space-y-3">
            <UBadge color="neutral" variant="soft" class="font-bold text-[10px] uppercase tracking-wider">
              Venue Overview
            </UBadge>
            <h3 class="text-2xl font-black text-neutral-950 dark:text-white">
              Recreation Yard Kericho
            </h3>
            <p class="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Recreation Yard Limited connects outdoor recreation, running, sports merchandise and group experiences. We serve individuals, families, schools, corporate organisations, sports clubs, event organisers and community groups.
            </p>
          </div>

          <!-- Quick Info List -->
          <div class="space-y-3 divide-y divide-neutral-200 dark:divide-neutral-800 border-y border-neutral-200 dark:border-neutral-800 py-4">
            <div class="flex items-center gap-3 pt-3 first:pt-0">
              <UIcon name="i-tabler-circle-check-filled" class="size-4 text-lime-500 shrink-0" />
              <span class="text-xs text-neutral-700 dark:text-neutral-300 font-medium">Prior booking helps confirm availability</span>
            </div>
            <div class="flex items-center gap-3 pt-3">
              <UIcon name="i-tabler-circle-check-filled" class="size-4 text-lime-500 shrink-0" />
              <span class="text-xs text-neutral-700 dark:text-neutral-300 font-medium">Flexible recreation and merchandise enquiries</span>
            </div>
            <div class="flex items-center gap-3 pt-3">
              <UIcon name="i-tabler-circle-check-filled" class="size-4 text-lime-500 shrink-0" />
              <span class="text-xs text-neutral-700 dark:text-neutral-300 font-medium">Dedicated event hosts for corporate groups</span>
            </div>
          </div>

          <!-- Direct Action Buttons -->
          <div class="space-y-3">
            <UButton
              :to="`https://wa.me/${CONTACTS.whatsapp}?text=Hello%20Recreation%20Yard%20Team!%20I%20would%20like%20to%20inquire%20about...`"
              target="_blank"
              block
              size="lg"
              color="neutral"
              variant="ghost"
              icon="i-tabler-brand-whatsapp"
              class="font-bold text-xs rounded-xl py-3 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
            >
              WhatsApp Chat
            </UButton>
          </div>
        </div>
      </div>

      <!-- Contact & Support FAQs (Category: General) -->
      <div v-if="contactFaqs?.length" class="border-t border-neutral-200 dark:border-neutral-800 pt-10 space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
          <div>
            <UBadge color="primary" variant="soft" class="font-bold uppercase tracking-widest text-xs mb-2">
              Support Guidance
            </UBadge>
            <h2 class="text-2xl sm:text-3xl font-black text-neutral-950 dark:text-white">
              Frequently Asked Questions
            </h2>
          </div>
        </div>

        <div class="divide-y divide-neutral-200/80 dark:divide-neutral-800/80">
          <div
            v-for="(faq, idx) in contactFaqs"
            :key="idx"
            class="py-4 space-y-2"
          >
            <button
              type="button"
              class="w-full flex items-center justify-between text-left font-extrabold text-sm sm:text-base text-neutral-950 dark:text-white group cursor-pointer transition-colors"
              @click="toggleFaqItem(idx)"
            >
              <span class="group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors pr-4">
                {{ faq.question }}
              </span>
              <UIcon
                name="i-tabler-chevron-down"
                class="size-5 text-neutral-400 transition-transform duration-200 shrink-0"
                :class="{ 'rotate-180 text-lime-500': openFaqItems.includes(idx) }"
              />
            </button>

            <Transition
              enter-active-class="transition-all duration-200 ease-out"
              enter-from-class="opacity-0 max-h-0"
              enter-to-class="opacity-100 max-h-40"
              leave-active-class="transition-all duration-150 ease-in"
              leave-from-class="opacity-100 max-h-40"
              leave-to-class="opacity-0 max-h-0"
            >
              <p
                v-show="openFaqItems.includes(idx)"
                class="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed pr-6 pt-1 font-medium overflow-hidden"
              >
                {{ faq.answer }}
              </p>
            </Transition>
          </div>
        </div>
      </div>

      <!-- Embedded Google Map Frame -->
      <div class="border-t border-neutral-200 dark:border-neutral-800 pt-10 space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <UBadge color="primary" variant="soft" class="font-bold uppercase tracking-wider text-[10px] mb-1">
              <UIcon name="i-tabler-map-pin" class="size-3.5 mr-1.5 text-lime-500 shrink-0" />
              Location
            </UBadge>
            <h3 class="text-xl sm:text-2xl font-black text-neutral-950 dark:text-white">
              KOOMA, Kericho–Kisumu Highway
            </h3>
            <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Easily accessible from Kericho town, our venue is located along the scenic Kericho - Kisumu Highway, offering a convenient and picturesque setting for all visitors.
            </p>
          </div>

          <UButton
            :to="LOCATION_DETAILS.googleMapsUrl"
            target="_blank"
            color="primary"
            icon="i-tabler-location"
            class="font-extrabold uppercase text-xs text-neutral-950 rounded-xl px-5 py-2.5 shrink-0"
          >
            Open in Google Maps
          </UButton>
        </div>

        <div v-if="LOCATION_DETAILS.embedLink" class="relative w-full h-80 sm:h-105 rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900">
          <iframe
            title="Recreation Yard Kericho Google Map Location"
            :src="LOCATION_DETAILS.embedLink"
            width="100%"
            height="100%"
            style="border: 0;"
            allowfullscreen="true"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            class="w-full h-full grayscale-15 contrast-105"
          />
        </div>
      </div>
    </UContainer>
  </div>
</template>
