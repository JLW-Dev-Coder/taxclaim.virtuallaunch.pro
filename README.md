# TaxClaim Virtual Launch Pro (TCVLP)

**Product:** TaxClaim Pro — Form 843 Penalty Abatement Platform
**Domain:** `taxclaim.virtuallaunch.pro`
**Purpose:** Branded landing pages + automated Form 843 generation for tax professionals

---

## System Overview

**What it is:**
- A frontend platform for tax professionals to onboard clients, generate IRS Form 843 refund claims, and manage penalty abatement workflows
- Next.js App Router with static export, deployed to Cloudflare Pages

**What it is NOT:**
- Not a backend — all API logic lives in VLP Worker at `api.virtuallaunch.pro`
- Not the billing system — Stripe is the source of truth for subscriptions
- Not the IRS transcript system — transcripts come from TaxMonitor Pro (TMP)

**Audience:** Tax professionals (CPAs, EAs, tax preparers) serving individual taxpayers

## Architecture

| Layer | Technology |
|-------|-----------|
| Framework | Next.js (App Router) + TypeScript |
| Styling | CSS Modules + CSS custom properties |
| Fonts | DM Sans (body), Raleway (display) via `next/font/google` |
| Build | Static export (`output: 'export'`) |
| Hosting | Cloudflare Pages |
| Backend | VLP Worker (`api.virtuallaunch.pro`) |
| Auth | `vlp_session` cookie via `credentials: 'include'` |
| Payments | Stripe (`prod_UCK4SzsEnjp19U`, `price_1TDvQe9ROeyeXOqek1fpOWWH`) |

## Responsibilities

| This Repo | VLP Worker | TMP |
|-----------|-----------|-----|
| Landing pages, UI, forms | Auth, API, orchestration | IRS transcript data |
| Static assets | Stripe checkout | Transcript processing |
| Client-side session checks | Form 843 PDF generation | Penalty extraction |

## Repo Structure

```
taxclaim.virtuallaunch.pro/
├── app/               ← Next.js App Router pages and layouts
│   ├── layout.tsx     ← Root layout (fonts, metadata)
│   ├── globals.css    ← Design tokens, CSS variables, animations
│   ├── page.tsx       ← Homepage
│   ├── demo/          ← Demo walkthrough page
│   ├── success/       ← Post-onboarding confirmation
│   ├── what-is-form-843/ ← SEO content page
│   ├── sign-in/       ← Login (magic link + Google OAuth)
│   ├── onboarding/    ← Tax pro onboarding wizard
│   ├── dashboard/     ← Tax pro dashboard
│   ├── support/       ← Support page
│   ├── affiliate/     ← Affiliate program page
│   └── claim/[slug]/  ← Dynamic branded claim page
├── components/        ← Shared React components
├── lib/api.ts         ← Typed VLP API client
├── contracts/         ← JSON data contracts (source of truth)
├── legacy-html/       ← Original static HTML (reference only)
└── public/            ← Static assets (favicon, images, robots.txt)
```

## Core Workflows

1. **Onboarding** — Tax pro signs in → completes onboarding → Stripe checkout → branded page goes live
2. **Form 843 Generation** — Client visits branded page → uploads transcript (optional) → enters penalty details → generates preparation guide → prints and mails to IRS
3. **Dashboard** — Tax pro views submissions, manages settings, tracks activity

## Data Contracts

Source of truth: `/contracts/*.contract.json`
- 11 contract files defining all API endpoints, payloads, validation rules
- Stripe product/price definitions in `stripe-product.json` and `stripe-price-v1.json`

## Setup / Local Development

```bash
npm install
npm run dev        # Start dev server at localhost:3000
npm run build      # Static export to out/
npm run deploy     # Build + deploy to Cloudflare Pages
```

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Static export to `out/` |
| `npm run start` | Serve production build locally |
| `npm run lint` | Run ESLint |
| `npm run deploy` | Build + deploy to Cloudflare Pages |

## Deployment

- **Target:** Cloudflare Pages (`taxclaim-virtuallaunch-pro`)
- **Trigger:** `npm run deploy` (manual) or CI pipeline
- **Output:** Static files in `out/`

## Constraints

1. **No PII in public responses** — taxpayer data never appears in static HTML
2. **No backend routes in this repo** — all backend logic lives in VLP Worker
3. Stripe product/price IDs are canonical — never fabricate test IDs
4. All API calls use `https://api.virtuallaunch.pro` with `credentials: 'include'`

## Related Systems

| System | Path | Relationship |
|--------|------|-------------|
| VLP | `virtuallaunch.pro` | Parent platform, auth orchestration |
| TMP | `taxmonitor.pro` | IRS transcript data source |
| TTMP | `transcript.taxmonitor.pro` | Transcript processing |

## Glossary

| Term | Meaning |
|------|---------|
| Form 843 | IRS form for penalty abatement requests |
| Penalty abatement | Request to reduce or remove IRS penalties |
| Kwong v. US | 2023 court ruling enabling penalty challenges for Jan 2020–July 2023 |
| Tax professional | CPA, EA, or tax preparer using this platform |
| Preparation guide | Generated document (not official IRS form) guiding Form 843 completion |

## Product Details (Stripe)

* **Product Name:** Virtual Launch Pro — Tax Claim Pro
* **Product ID:** `prod_UCK4SzsEnjp19U`
* **Price:** $10.00 USD / month
* **Price ID:** `price_1TDvQe9ROeyeXOqek1fpOWWH`

---

All contracts, templates, and product definitions are proprietary to **TaxClaim Pro**.
