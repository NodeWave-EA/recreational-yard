<script setup lang="ts">
const props = defineProps<{
  defaultTier?: string
  compact?: boolean
}>()

const tierOptions = [
  'Day Pass (KES 500 / day)',
  'Monthly Individual Member (KES 2,500 / month)',
  'Recreation Yard Runners Pass (KES 2,000 / month)',
  'Family Recreation Pass (KES 4,500 / month)',
  'Corporate & Team Partner (Custom Quote)',
]

const interestOptions = [
  'Lawn Games & Outdoor Recreation',
  'Running, Jogging & Walking Club',
  'Archery & Precision Sports',
  'Group, Family & Birthday Events',
  'Corporate Team Building & Wellness',
  'Sports Apparel & Team Uniforms',
]

const formState = reactive({
  fullName: '',
  email: '',
  phone: '',
  tier: props.defaultTier || tierOptions[1],
  primaryInterest: interestOptions[0],
  notes: '',
})

const isSubmitting = ref(false)
const isSubmitted = ref(false)

async function handleSubmit() {
  if (!formState.fullName || !formState.email || !formState.phone)
    return

  isSubmitting.value = true

  await new Promise(resolve => setTimeout(resolve, 1000))

  isSubmitting.value = false
  isSubmitted.value = true
}

function resetForm() {
  isSubmitted.value = false
  formState.fullName = ''
  formState.email = ''
  formState.phone = ''
  formState.notes = ''
}
</script>

<template>
  <div class="p-6 sm:p-8 rounded-md border border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/50 hover:border-lime-500 dark:hover:border-lime-500 transition-all duration-300 shadow-xs space-y-6">
    <div v-if="isSubmitted" class="space-y-4 text-center py-6">
      <div class="flex size-12 items-center justify-center rounded-md bg-lime-500/10 text-lime-600 dark:text-lime-400 mx-auto">
        <UIcon name="i-tabler-circle-check" class="size-7" />
      </div>

      <div class="space-y-2">
        <h3 class="text-xl font-black text-neutral-950 dark:text-white">
          Application Received!
        </h3>
        <p class="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-sm mx-auto leading-relaxed font-medium">
          Thank you, <strong class="text-neutral-950 dark:text-white">{{ formState.fullName }}</strong>. Our team will contact you via WhatsApp/Email within 24 hours to confirm your membership pass.
        </p>
      </div>

      <div class="pt-2">
        <UButton
          color="neutral"
          variant="outline"
          icon="i-tabler-arrow-left"
          class="font-extrabold text-xs uppercase rounded-md px-5 py-2.5 cursor-pointer"
          @click="resetForm"
        >
          Submit Another Application
        </UButton>
      </div>
    </div>

    <template v-else>
      <div>
        <UBadge color="primary" variant="soft" class="font-bold text-[10px] uppercase tracking-wider mb-2 rounded-md">
          Membership Signup
        </UBadge>
        <h2 class="text-2xl font-black text-neutral-950 dark:text-white">
          Become a Member
        </h2>
        <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-1 font-medium leading-relaxed">
          Join our community to enjoy exclusive benefits, events, and facility discounts.
        </p>
      </div>

      <form class="space-y-4" @submit.prevent="handleSubmit">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <label class="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Full Name *
            </label>
            <UInput
              v-model="formState.fullName"
              icon="i-tabler-user"
              placeholder="e.g. Jane Kiprop"
              size="md"
              color="neutral"
              class="w-full rounded-md"
              required
            />
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Phone / WhatsApp *
            </label>
            <UInput
              v-model="formState.phone"
              icon="i-tabler-phone"
              placeholder="+254 7XX XXX XXX"
              size="md"
              color="neutral"
              class="w-full rounded-md"
              required
            />
          </div>
        </div>

        <div class="space-y-1.5">
          <label class="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Email Address *
          </label>
          <UInput
            v-model="formState.email"
            type="email"
            icon="i-tabler-mail"
            placeholder="e.g. name@domain.com"
            size="md"
            color="neutral"
            class="w-full rounded-md"
            required
          />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <label class="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Membership Tier *
            </label>
            <USelectMenu
              v-model="formState.tier"
              :items="tierOptions"
              :options="tierOptions"
              size="md"
              color="neutral"
              class="w-full rounded-md"
            />
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Primary Interest
            </label>
            <USelectMenu
              v-model="formState.primaryInterest"
              :items="interestOptions"
              :options="interestOptions"
              size="md"
              color="neutral"
              class="w-full rounded-md"
            />
          </div>
        </div>

        <div class="space-y-1.5">
          <label class="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Notes or Special Requests
          </label>
          <UTextarea
            v-model="formState.notes"
            placeholder="Specify team sizes, preferred start dates, apparel sizes, or custom goals..."
            :rows="4"
            autoresize
            color="neutral"
            class="w-full min-h-27.5 rounded-md"
          />
        </div>

        <UButton
          type="submit"
          block
          size="lg"
          color="primary"
          icon="i-tabler-send"
          :loading="isSubmitting"
          class="font-black uppercase text-xs text-neutral-950 rounded-md py-3.5 cursor-pointer justify-center"
        >
          Submit Membership Application
        </UButton>
      </form>
    </template>
  </div>
</template>
