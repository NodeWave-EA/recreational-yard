// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

  modules: ['@nuxt/eslint', '@nuxt/ui', '@vueuse/nuxt/module', '@nuxt/image', 'nuxt-studio', '@nuxt/content', '@nuxt/icon/module', '@nuxtjs/turnstile', '@nuxt/fonts'],

  devtools: {
    enabled: true,
  },

  app: {
    buildAssetsDir: '/_nuxt/',
    head: {
      htmlAttrs: { lang: 'en' },
      titleTemplate: '%s | Recreational Yard',
      meta: [
        { name: 'theme-color', content: '' },
        { name: 'msapplication-TileColor', content: '' },
        { 'http-equiv': 'X-UA-Compatible', 'content': 'IE=edge' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
        { name: 'apple-mobile-web-app-title', content: 'Recreational Yard' },
        { name: 'application-name', content: 'Recreational Yard' },
      ],
      link: [
      ],
    },
    pageTransition: {
      name: 'page',
      mode: 'out-in',
    },
    layoutTransition: {
      name: 'layout',
      mode: 'out-in',
    },
  },

  css: ['~/assets/css/main.css'],

  router: {
    options: { scrollBehaviorType: 'smooth' },
  },

  content: {
    build: {
      markdown: {
        toc: {
          depth: 5,
          searchDepth: 5,
        },
      },
    },
  },

  runtimeConfig: {
    // Server-only private keys
    smtpHost: process.env.NUXT_SMTP_HOST || 'smtp.gmail.com',
    smtpPort: process.env.NUXT_SMTP_PORT || '587',
    smtpUser: process.env.NUXT_SMTP_USER || '',
    smtpPass: process.env.NUXT_SMTP_PASS || '',
    smtpFrom: process.env.NUXT_SMTP_FROM || 'info@moderatelimited.co.ke',
    contactRecipient: process.env.NUXT_CONTACT_RECIPIENT || 'info@moderatelimited.co.ke',
    turnstileSecretKey: process.env.NUXT_TURNSTILE_SECRET_KEY || '',

    // Client-accessible public keys
    public: {
      turnstileSiteKey: process.env.NUXT_PUBLIC_TURNSTILE_SITE_KEY || '',
    },
  },

  routeRules: {
    '/': { prerender: true },
  },

  compatibilityDate: '2026-06-30',

  nitro: {
    preset: 'vercel',
  },

  eslint: {
    config: {
      standalone: false,
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs',
      },
    },
  },

  icon: {
    size: '1.2em',
    class: 'icon',
    serverBundle: 'local',
    fetchTimeout: 4000,
    clientBundle: {
      scan: true,
    },
  },

  image: {
    quality: 80,
    format: ['webp', 'avif'],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
  },

  studio: {
    auth: {
      google: {
        clientId: process.env.NUXT_STUDIO_AUTH_GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.NUXT_STUDIO_AUTH_GOOGLE_CLIENT_SECRET || '',
      },
    },
  },

  turnstile: {
    siteKey: process.env.NUXT_PUBLIC_TURNSTILE_SITE_KEY || '',
  },
})
