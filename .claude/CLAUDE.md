# CLAUDE.md — TaxClaim Virtual Launch Pro (TCVLP)

- **Repo:** `taxclaim.virtuallaunch.pro`
- **Product:** TaxClaim Pro — Form 843 Penalty Abatement Platform
- **Domain:** `taxclaim.virtuallaunch.pro`
- **Last updated:** 2026-04-07 (calendar page, profile API, subscription gating, white-label branding)
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
- Static export (`output: 'export'`) — built to `out/`, deployed to Cloudflare Pages
- `wrangler.toml` → `pages_build_output_dir = "out"` (matches `package.json` deploy script)
- Fonts: DM Sans (body), Raleway (display) via `next/font/google`
- Color: Red primary (#dc2626)
- **Auth:** client-side only. Protected pages wrap in `<AuthGuard>` which calls `getSession()` on mount and redirects to `/sign-in` if missing. No `middleware.ts` (incompatible with static export).

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
│   ├── calendar/      ← Cal.com booking page for client consultations (AuthGuard-wrapped)
│   └── claim/         ← Branded claim page (flat route; slug read from `?slug=` query param client-side)
├── components/        ← Shared React components
│   ├── Header.tsx     ← Sticky header with nav
│   ├── Footer.tsx     ← Site footer
│   ├── CtaBanner.tsx  ← Dual CTA (Form 843 + TMP directory)
│   ├── DeadlineBanner.tsx ← Kwong deadline alert banner
│   ├── KwongCard.tsx  ← Clickable Kwong case card + modal (homepage)
│   └── AuthGuard.tsx  ← Client-side session check wrapper (getSession → /sign-in)
├── lib/
│   └── api.ts         ← Typed VLP API client
├── contracts/         ← JSON data contracts (source of truth)
├── legacy-html/       ← Original static HTML (reference only — do not modify)
├── public/            ← Static assets: `robots.txt`, `favicon.ico`
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
- PDF download via `GET /v1/tcvlp/forms/843/:form_id/download` — wired through `downloadForm843(formId)` in `lib/api.ts`, which returns a `Blob` for browser download
- Transcript upload via `POST /v1/tcvlp/transcript/upload`
- Reviews via `GET /v1/tcvlp/reviews` and `POST /v1/tcvlp/reviews`
- Session check via `GET /v1/auth/session`
- Profile (white-label branding) via `GET /v1/tcvlp/profile` and `PATCH /v1/tcvlp/profile` — stores `firm_name`, `firm_phone`, `firm_website`, `firm_logo_url`. **⚠️ VLP Worker route not yet implemented — frontend wired, backend needed.**
- Subscription gating via `GET /v1/tcvlp/subscription/status?slug={slug}` — returns `{ active: boolean, plan?: string }`. Called from the claim page to gate Form 843 generation. **⚠️ VLP Worker route not yet implemented — frontend wired, backend needed.** Frontend defaults to `{ active: false }` on fetch error.
- All API calls use `https://api.virtuallaunch.pro` with `credentials: 'include'` — no standalone Worker

## White-Label Claim Page

- Route: `/claim?slug={pro-slug}` (e.g. `taxclaim.virtuallaunch.pro/claim?slug=smith-tax`)
- `ClaimLoader` fetches the tax pro profile via `getProBySlug(slug)`
- `ClaimClient` renders the pro's `firm_name`, `display_name`, `welcome_message`, and `logo_url` in the sticky header
- Falls back to the default TCVLP red logo box when `logo_url` is missing
- Shows a "Page Not Available" state when `slug` resolves to no pro

## Unlimited Client Access Gating

- Subscription check runs on mount in `ClaimClient` via `checkSubscription(slug)`
- While status is `null` (pending), the claim flow stays enabled optimistically
- On `{ active: false }`: warning banner at top of main content, generate button disabled with label "Subscription Required", `handleGenerate` short-circuits with an error message
- On `{ active: true }`: unlimited Form 843 claims allowed for that pro's clients (platform charges the pro $10/mo flat)

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
