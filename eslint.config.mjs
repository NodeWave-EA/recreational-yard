import antfu from '@antfu/eslint-config'
import betterTailwindcss from 'eslint-plugin-better-tailwindcss'
import { getDefaultAttributes } from 'eslint-plugin-better-tailwindcss/api/defaults'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    ignores: [
      'recreational-yard.vercel.app-*.json',
      '.vscode/**',
    ],
  },
  antfu({
    formatters: {
      css: true,
      html: true,
      markdown: true,
      graphql: true,
    },
    stylistic: {
      indent: 2,
      semi: false,
      quotes: 'single',
      braceStyle: '1tbs',
    },
  }),
  {
    rules: {
      'node/prefer-global/process': 'off',
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'better-tailwindcss/no-unknown-classes': ['error', {
        ignore: ['animate-marquee'],
      }],
    },
  },
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
  {
    files: ['**/*.vue'],
    rules: {
      'link-checker/valid-route': 'off',
      'vue/component-name-in-template-casing': [
        'error',
        'PascalCase',
        {
          registeredComponentsOnly: false,
          ignores: [],
        },
      ],
      'vue/match-component-file-name': [
        'error',
        {
          extensions: ['vue'],
          shouldMatchCase: false,
        },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector: 'VElement[name=/^(?!(Nuxt|Client|DevOnly|Teleport|Suspense|KeepAlive|Transition|Router|U[A-Z]))[A-Z]/]',
          message: 'Your manual components must use kebab-case (e.g. <my-component />). Only built-in Nuxt core and Nuxt UI components should use PascalCase.',
        },
      ],
      'better-tailwindcss/no-conflicting-classes': 'off',
    },
  },
)
