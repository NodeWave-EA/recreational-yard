# Recreation Yard Limited

This is the Nuxt website for RECREATION YARD LIMITED, a recreation, sports, wellness, events and sports merchandise business based at Kooma, along the Kericho–Kisumu Highway in Kericho, Kenya. The brand brings together Recreation Yard Kericho and Recreation Yard Runners under the promise: Move. Play. Connect. Thrive.

## Overview

The site showcases:

- Outdoor recreation including badminton, lawn tennis, cornhole, chess, picnics and selected supervised activities
- Physical and virtual running, jogging and walking through Recreation Yard Runners
- Running kits, complete marathon kits, school games uniforms, corporate sportswear and selected equipment
- Group experiences for birthdays, graduations, meetings and team building
- A gallery and facility content library managed through markdown files
- Event promotion and contact inquiries
- SEO-friendly pages and responsive UI built with Nuxt and Nuxt UI

## Tech Stack

- Nuxt 4
- Vue 3 + TypeScript
- Tailwind CSS
- Nuxt UI
- @nuxt/content and @nuxt/studio for content-driven pages
- Nodemailer for inquiry email delivery
- Cloudflare Turnstile for CAPTCHA verification

## Project Structure

```bash
.
├── app/                  # Nuxt app pages, layouts, composables, components, and utilities
├── content/              # Facility, gallery, FAQ, and pricing content files
├── public/               # Static assets, uploads, and public media
├── server/                # Server endpoints such as the contact form API
├── .env.example          # Sample environment configuration
├── nuxt.config.ts        # Nuxt configuration and runtime env setup
├── package.json          # Project scripts and dependencies
├── LICENSE               # MIT license
└── README.md             # Project documentation
```

## Features

- Facility landing pages and catalog browsing
- Service and quotation enquiries based on customer requirements
- Event and shop highlights sections
- Contact form with:
  - required field validation
  - honeypot detection
  - rate limiting
  - Cloudflare Turnstile verification
  - SMTP email dispatch
- Content-managed pages via markdown in `content/`
- Mobile-friendly, accessible UI

## Requirements

- Node.js 20+
- Bun or npm
- A mail provider configured for SMTP (for the contact form)
- Cloudflare Turnstile keys (optional for local development, but recommended)

## Local Development

1. Install dependencies:

   ```bash
   bun install
   # or
   npm install
   ```

2. Create a local environment file:

   ```bash
   cp .env.example .env
   ```

3. Update the values in `.env` as needed for your local setup.

4. Start the development server:

   ```bash
   bun run dev
   # or
   npm run dev
   ```

Then open <http://localhost:3000> in your browser.

## Environment Variables

The project expects the following environment variables, as defined in `.env.example` and `nuxt.config.ts`:

```bash
NUXT_PUBLIC_SITE_URL=http://localhost:3000
NUXT_PUBLIC_TURNSTILE_SITE_KEY=...
NUXT_TURNSTILE_SECRET_KEY=...
NUXT_SMTP_HOST=smtp.gmail.com
NUXT_SMTP_PORT=587
NUXT_SMTP_USER=relax@recreationyard.com
NUXT_SMTP_PASS=your_app_password_here
NUXT_SMTP_FROM="Recreation Yard Limited <relax@recreationyard.com>"
NUXT_CONTACT_RECIPIENT=relax@recreationyard.com
```

Notes:

- `NUXT_PUBLIC_TURNSTILE_SITE_KEY` is used on the client side.
- `NUXT_TURNSTILE_SECRET_KEY` is used server-side to verify CAPTCHA tokens.
- SMTP credentials are required only if you want the contact form to send emails in production or local testing.

## Useful Scripts

```bash
bun run dev         # run the Nuxt app in development mode
bun run build       # production build
bun run preview     # preview the production build locally
bun run lint        # run ESLint
bun run typecheck   # run Nuxt TypeScript checking
```

## Content Management

Most marketing content is stored in the `content/` directory as Markdown files. For example:

- `content/facilities/*.md`
- `content/gallery/*.md`
- `content/pricing/*.md`
- `content/faqs/*.md`

These files drive sections such as facilities, pricing, FAQs, and gallery entries.

## Deployment

The Nuxt config is set to a Vercel-friendly Nitro preset and is ready for deployment to Vercel or a similar Node-based hosting environment. Ensure the required environment variables are configured in the deployment platform before launching.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
