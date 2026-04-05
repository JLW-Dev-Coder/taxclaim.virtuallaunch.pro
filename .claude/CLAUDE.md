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
- HTML + Tailwind CSS (CDN) + vanilla JS
- Cloudflare Pages (static hosting, no Worker in this repo)
- Fonts: DM Sans (body), Raleway (display)
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
├── contracts/         ← JSON data contracts (source of truth)
├── public/            ← Static HTML pages (index, landing, demo, success)
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

- **Standalone Worker deleted** (2026-04-04) — was at `workers/src/index.js`, never called by frontend
- Frontend is static HTML served via Cloudflare Pages — no backend in this repo
- All backend API routes live in VLP Worker at `api.virtuallaunch.pro`
- Auth: `vlp_session` cookie via `credentials: 'include'` (Bearer tokens removed)
- **Cloudflare SDKs removed** (2026-04-04) — `/_sdk/data_sdk.js` and `/_sdk/element_sdk.js` replaced with `/lib/api.js`
- Form 843 generation uses VLP Worker route `POST /v1/tcvlp/forms/843/generate`
- PDF download via `GET /v1/tcvlp/forms/843/:form_id/download`
- Transcript upload via `POST /v1/tcvlp/transcript/upload`
- Reviews via `GET /v1/tcvlp/reviews` and `POST /v1/tcvlp/reviews`
- Session check via `GET /v1/auth/session`
- All API calls use `https://api.virtuallaunch.pro` with `credentials: 'include'` — no standalone Worker

## Related Systems

| System | Path | Relationship |
|--------|------|-------------|
| VLP | `virtuallaunch.pro` | Parent platform, auth orchestration |
| TMP | `taxmonitor.pro` | IRS transcript data source |
| TTMP | `transcript.taxmonitor.pro` | Transcript processing |
