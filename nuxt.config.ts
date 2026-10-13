// https://nuxt.com/docs/api/configuration/nuxt-config
const siteUrl = process.env.NUXT_PUBLIC_SITE_URL
  || (process.env.NODE_ENV === 'production' ? 'https://recreational-yard.vercel.app' : 'http://localhost:3000')

export default defineNuxtConfig({

  modules: ['@nuxt/eslint', '@nuxt/ui', '@vueuse/nuxt/module', '@nuxt/image', 'nuxt-studio', '@nuxt/content', '@nuxt/icon/module', '@nuxtjs/turnstile', '@nuxt/fonts', '@nuxtjs/seo', '@nuxt/hints', '@nuxt/a11y', '@nuxt/scripts', '@nuxt/devtools'],

  devtools: {
    enabled: process.env.NODE_ENV !== 'production',
  },

  app: {
    buildAssetsDir: '/_nuxt/',
    head: {
      htmlAttrs: { lang: 'en' },
      meta: [
        { name: 'theme-color', content: '#0a255c' },
        { name: 'msapplication-TileColor', content: '#0a255c' },
        { 'http-equiv': 'X-UA-Compatible', 'content': 'IE=edge' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
        { name: 'apple-mobile-web-app-title', content: 'RYK' },
        { name: 'application-name', content: 'Recreational Yard' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon-96x96.png?v=20261013', sizes: '96x96' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg?v=20261013' },
        { rel: 'shortcut icon', href: '/favicon.ico?v=20261013' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png?v=20261013' },
        { rel: 'manifest', href: '/manifest.json?v=20261013' },
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

  site: {
    url: siteUrl,
    name: 'Recreation Yard',
    description: 'Kericho\'s premier outdoor recreation destination for sports, family activities, events, and relaxation.',
    defaultLocale: 'en',
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
      siteUrl,
    },
  },

  routeRules: {
    '/': { prerender: true },
    '/facilities': { prerender: true },
    '/pricing': { prerender: true },
    '/events': { prerender: true },
    '/gallery': { prerender: true },
    '/shop': { prerender: true },
    '/contact': { prerender: true },
  },

  compatibilityDate: '2026-06-30',

  nitro: {
    preset: 'vercel',
    serverAssets: [
      {
        baseName: 'gallery',
        dir: 'public/content/gallery',
      },
    ],
  },

  aiReady: {
    enabled: true,
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

  linkChecker: {
    enabled: true,
    runOnBuild: true,
    failOnError: false,
    fetchRemoteUrls: false,
    showLiveInspections: true,
    excludePages: ['/search'],
    report: {
      html: true,
      json: true,
    },
  },

  nuxtseo: {
    enabled: true,
    tips: true,
  },

  ogImage: {
    enabled: true,
  },

  robots: {
    enabled: true,
    debug: true,
    header: true,
    metaTag: true,
    sitemap: [`${siteUrl}/sitemap.xml`],
    allow: [
      '/',
      '/facilities',
      '/pricing',
      '/events',
      '/gallery',
      '/shop',
      '/contact',
    ],
    disallow: ['/search'],
    robotsEnabledValue: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    groups: [
      {
        userAgent: '*',
        allow: '/',
        contentUsage: {
          'bots': 'y',
          'train-ai': 'y',
          'ai-output': 'y',
          'search': 'y',
        },
        contentSignal: {
          'search': 'yes',
          'ai-input': 'yes',
          'ai-train': 'yes',
        },
      },
    ],
  },

  schemaOrg: {
    enabled: true,
    defaults: true,
    minify: process.env.NODE_ENV === 'production',
  },

  seo: {
    enabled: true,
    automaticDefaults: true,
    automaticOgAndTwitterTags: true,
    automaticTwitterTags: true,
    canonicalLowercase: true,
    canonicalQueryWhitelist: [],
    redirectToCanonicalSiteUrl: true,
    meta: {
      ogLocale: 'en_KE',
      twitterCard: 'summary_large_image',
    },
  },

  sitemap: {
    enabled: true,
    sitemapName: 'sitemap.xml',
    exclude: ['/search'],
    defaults: {
      changefreq: 'weekly',
      priority: 0.7,
    },
    urls: [
      { loc: '/', priority: 1, changefreq: 'weekly' },
      { loc: '/facilities', priority: 0.9, changefreq: 'weekly' },
      { loc: '/pricing', priority: 0.9, changefreq: 'weekly' },
      { loc: '/events', priority: 0.8, changefreq: 'weekly' },
      { loc: '/gallery', priority: 0.7, changefreq: 'weekly' },
      { loc: '/shop', priority: 0.7, changefreq: 'weekly' },
      { loc: '/contact', priority: 0.8, changefreq: 'monthly' },
    ],
  },

  skewProtection: {
    enabled: true,
  },

  studio: {
    repository: {
      provider: 'github',
      branch: 'main',
      owner: 'Nodewave-EA',
      repo: 'recreational-yard',
    },
  },

  turnstile: {
    siteKey: process.env.NUXT_PUBLIC_TURNSTILE_SITE_KEY || '',
  },
})
