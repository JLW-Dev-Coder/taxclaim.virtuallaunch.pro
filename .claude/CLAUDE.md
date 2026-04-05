# CLAUDE.md — TaxClaim Virtual Launch Pro (TCVLP)

- **Repo:** `taxclaim.virtuallaunch.pro`
- **Product:** TaxClaim Pro — Form 843 Penalty Abatement Platform
- **Domain:** `taxclaim.virtuallaunch.pro`
- **Last updated:** 2026-04-04
- **Purpose:** Hosted landing pages + automated Form 843 generation for tax professionals

## System Definition

**What it is:**
- A frontend platform for tax professionals to onboard clients, generate IRS Form 843 refund claims, and manage penalty abatement workflows
- Static HTML pages served via Cloudflare Pages / Workers
- Worker API handles form generation, checkout, reviews, support, and onboarding

**What it is NOT:**
- Not a backend database — no D1/R2 writes happen here without VLP orchestration
- Not the billing system — Stripe is the source of truth for subscriptions
- Not the IRS transcript system — transcripts come from TaxMonitor Pro (TMP)

**Audience:** Tax professionals (CPAs, EAs, tax preparers) serving individual taxpayers

**Stack:**
- Next.js (App Router) + TypeScript + CSS Modules
- Static export (`output: 'export'`) deployed to Cloudflare Pages
- Fonts: DM Sans (body), Raleway (display) via `next/font/google`
- Color: Red primary (#dc2626)

**Backend dependencies:**
- VLP Worker (`api.virtuallaunch.pro`) — auth, session, orchestration
- Stripe — checkout, subscriptions (prod_UCK4SzsEnjp19U, price_1TDvQe9ROeyeXOqek1fpOWWH)
- TMP — IRS transcript data

## Hard Constraints

1. **No PII in public responses** — taxpayer data never appears in static HTML
2. Do not modify contract JSON files without Principal approval
3. **No backend routes in this repo** — all backend logic lives in VLP Worker at `api.virtuallaunch.pro`
4. Do not deploy without lint/build verification
5. Stripe product/price IDs are canonical — never fabricate test IDs

## Terminology

| Canonical | Forbidden |
|-----------|-----------|
| Form 843 | 843 form, refund form |
| penalty abatement | penalty relief, tax forgiveness |
| tax professional | tax pro (in formal docs) |
| taxpayer | client (ambiguous) |
| landing page | site, webpage |

## Repo Structure

```
taxclaim.virtuallaunch.pro/
├── .claude/           ← Claude config, canonicals, settings
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
│   ├── Header.tsx     ← Sticky header with nav
│   ├── Footer.tsx     ← Site footer
│   ├── CtaBanner.tsx  ← Dual CTA (Form 843 + TMP directory)
│   ├── DeadlineBanner.tsx ← Kwong deadline alert banner
│   └── AuthGuard.tsx  ← Session check wrapper
├── lib/
│   └── api.ts         ← Typed VLP API client
├── contracts/         ← JSON data contracts (source of truth)
├── legacy-html/       ← Original static HTML (reference only — do not modify)
├── public/            ← Static assets (favicon, images, robots.txt)
└── README.md
```

## Data Contracts

Source of truth: `/contracts/*.contract.json`
- 11 contract files defining all API endpoints, payloads, validation rules
- Stripe product/price definitions in `stripe-product.json` and `stripe-price-v1.json`

## Post-Task Requirements

After every code change:
1. Confirm no PII leaks in HTML templates
2. Run build if package.json exists
3. Verify any new API calls use `https://api.virtuallaunch.pro` with `credentials: 'include'`

## Migration Status

- **Next.js migration** (2026-04-04) — converted from static HTML to Next.js App Router with CSS Modules
- **Standalone Worker deleted** (2026-04-04) — was at `workers/src/index.js`, never called by frontend
- Frontend is Next.js static export deployed to Cloudflare Pages — no backend in this repo
- All backend API routes live in VLP Worker at `api.virtuallaunch.pro`
- Auth: `vlp_session` cookie via `credentials: 'include'` (Bearer tokens removed)
- **Cloudflare SDKs removed** (2026-04-04) — replaced with `lib/api.ts`
- Form 843 generation uses VLP Worker route `POST /v1/tcvlp/forms/843/generate`
- PDF download via `GET /v1/tcvlp/forms/843/:form_id/download`
- Transcript upload via `POST /v1/tcvlp/transcript/upload`
- Reviews via `GET /v1/tcvlp/reviews` and `POST /v1/tcvlp/reviews`
- Session check via `GET /v1/auth/session`
- All API calls use `https://api.virtuallaunch.pro` with `credentials: 'include'` — no standalone Worker

## Legacy HTML Policy

- Original static HTML files are preserved in `legacy-html/` for reference
- Do NOT modify legacy HTML files — they are frozen snapshots
- Do NOT delete legacy HTML until .tsx parity is confirmed by Principal
- All new work happens in `app/` and `components/` only

## Related Systems

| System | Path | Relationship |
|--------|------|-------------|
| VLP | `virtuallaunch.pro` | Parent platform, auth orchestration |
| TMP | `taxmonitor.pro` | IRS transcript data source |
| TTMP | `transcript.taxmonitor.pro` | Transcript processing |
