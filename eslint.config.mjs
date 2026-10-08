// @ts-check
import antfu from '@antfu/eslint-config'
import betterTailwindcss from 'eslint-plugin-better-tailwindcss'
import { getDefaultAttributes } from 'eslint-plugin-better-tailwindcss/api/defaults'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  antfu({
    formatters: {
      css: true,
      html: true,
      markdown: true,
      graphql: true,
    },
    stylistic: {
      indent: 2,
      commaDangle: 'never',
      braceStyle: '1tbs',
    },
  }),

  betterTailwindcss.configs['correctness-error'],
  {
    settings: {
      'better-tailwindcss': {
        entryPoint: 'app/assets/css/main.css',
        attributes: [
          ...getDefaultAttributes(),
          ['^v-bind:ui$', [{ match: 'objectValues' }]],
        ],
      },
    },
  },

  // Custom Casing Rules for Vue Templates
  {
    files: ['**/*.vue'],
    rules: {
      // Force PascalCase for the whitelisted built-in components globally
      'vue/component-name-in-template-casing': [
        'error',
        'PascalCase',
        {
          registeredComponentsOnly: false,
          ignores: [],
        },
      ],

      // Ensures component filenames match standard convention rules
      'vue/match-component-file-name': [
        'error',
        {
          extensions: ['vue'],
          shouldMatchCase: false,
        },
      ],

      // Override: Catch manual components using PascalCase and force them to kebab-case instead
      // This lookahead ignores core tags (Nuxt, Client, UI Framework 'U', and native Vue fragments)
      'no-restricted-syntax': [
        'error',
        {
          selector: 'VElement[name=/^(?!(Nuxt|Client|DevOnly|Teleport|Suspense|KeepAlive|Transition|Router|U[A-Z]))[A-Z]/]',
          message: 'Your manual components must use kebab-case (e.g. <my-component />). Only built-in Nuxt core and Nuxt UI components should use PascalCase.',
        },
      ],
    },
  },
)
