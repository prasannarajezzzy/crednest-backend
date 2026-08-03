# CredNest B2B Debt Platform

CredNest is a premium, responsive marketing site for an Indian B2B non-dilutive debt platform. It replaces the former retail-loan experience with founder-focused debt products, lender matching, a funding estimator, compatibility assessment, and a clearly labelled simulated term-sheet workflow.

## Run locally

Requires Node.js `^20.19.0 || >=22.12.0`.

```bash
npm install
npm run dev
npm run typecheck
npm run build
npm run preview
```

`npm run build` creates the client bundle and prerenders every public marketing route into `dist/` with route-specific metadata and JSON-LD. `npm run preview` uses the included production-like server so clean deep links, exact 301s, and the custom 404 can be checked locally.

## Main routes

- `/` — platform overview
- `/products` and `/products/:slug` — seven Swift and Scale debt products
- `/funding-estimator` — indicative funding range and lead capture
- `/technology` — underwriting and matching workflow
- `/capital-partners` — lender and advisor network
- `/about`, `/contact`, `/faq`, `/terms`, `/privacy`
- `/blog` — noindex editorial placeholder for the future resource library
- `/login` and `/admin` — non-functional, noindex login placeholders

Legacy retail-loan and blog URLs are permanently redirected in `public/_redirects` and `vercel.json`. Hash-only legacy links are migrated client-side because URL fragments never reach the server.

Deployment rules are supplied for Netlify (`netlify.toml` + `_redirects`), Vercel (`vercel.json`), and Apache (`public/.htaccess`). Configure the hosting account so `www.crednest.io` and any controlled legacy domain redirect to the canonical `https://crednest.io` origin.

## Content and integrations

Edit product terms, FAQs, contact details and their `tel:`/WhatsApp URLs, disclaimers, and company metadata in `src/content/site.ts`.

Three environment variables drive the integrations (see `.env.example`). Lead delivery resolves in this order:

1. `VITE_LEAD_ENDPOINT` — a custom webhook receiving JSON. Works on any host and wins when set.
2. `VITE_LEAD_MODE=netlify` — delivers through Netlify Forms. Set this in the Netlify UI under *Site configuration → Environment variables*, not in a local `.env`, so development keeps running in demo mode rather than posting real leads.
3. Neither — demo mode: forms validate, say plainly that nothing was sent, and log the payload locally. No lead data is persisted by this repository.

Netlify Forms needs the detection stub in `index.html`. Netlify's build bot scans the deployed HTML for that `crednest-lead` form and registers its fields; **any field not declared there is silently discarded on submission**, so add new form fields in both places. Submissions post to `/` as `application/x-www-form-urlencoded`, and `metadata` arrives as a JSON string.

Every form carries an off-screen honeypot (`website`) that Netlify's own spam filter also uses, and reports `elapsedMs` so a destination can score submissions. Time-to-submit is deliberately never enforced client-side, because browser autofill completes the form in well under a second and would drop genuine leads.
- `VITE_GA_ID` — Google Analytics 4 measurement ID. Blank, no analytics loads and no consent banner appears, because the site then sets no non-essential cookies. Set it and analytics loads only after an explicit opt-in, with IP anonymisation on and ad personalisation off.

`/login`, `/admin` and `/blog` still resolve but are deliberately unlinked from the navigation until real authentication and editorial content exist.

Before launch, replace every bracketed placeholder and verify:

- Legal entity name, registration number, office, email, phone, and WhatsApp link
- Product amounts, tenures, indicative pricing, eligibility, timelines, and claims
- Partner names/logos, company milestones, team biographies, and performance metrics
- Privacy policy, terms, consent language, security controls, and verified certifications
- CRM/webhook authentication, spam protection, analytics consent, and production monitoring

CredNest is presented as a debt-capital facilitator, not a lender or NBFC. Do not remove the qualification language until it has been reviewed by legal/compliance counsel.

## Key implementation files

- `src/pages/HomePage.tsx` — homepage narrative and interactive sections
- `src/pages/MarketingPages.tsx` — product and supporting pages
- `src/components/SiteChrome.tsx` — navigation, footer, partner prompt, floating actions
- `src/components/LeadForms.tsx` — reusable lead forms and accessible dialog
- `src/lib/seo.ts` — route metadata and structured data
- `scripts/prerender.mjs` — static route generation
- `scripts/preview.mjs` — clean-route production preview and redirect checks
- `public/crednest-founders-hero.jpg` and `public/crednest-founders-hero-*.webp` — bespoke generated hero artwork plus responsive delivery variants

## Retired retail code

Nothing from the retail site was deleted — it was moved out of the build into `archive/`, which is not compiled, bundled or deployed:

- `archive/retail-src/` — the 34 unreachable retail modules (admin portal, loan calculators, eligibility flows, blog detail, legacy `src/api`, `src/config`, `src/constants`, `src/utils`)
- `archive/retail-static/` — 90 unused static assets formerly shipped from `public/static/`
- `archive/retail-config/` — the unused Tailwind and stylelint configuration
- `archive/retail-docs/` — the superseded retail deployment guides

Removing that code also removed its dependencies. `chart.js`, `react-chartjs-2`, `mongoose` and `tailwindcss` are no longer installed; `mongoose` in particular never belonged in a browser bundle. The site now styles itself entirely from `src/index.css` with plain CSS custom properties, so PostCSS runs `autoprefixer` only. Client and CSS bundle hashes were unchanged by these removals, confirming none of it reached production.
