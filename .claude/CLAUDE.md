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
- Cloudflare Worker (workers/src/index.js)
- Fonts: DM Sans (body), Raleway (display)
- Color: Red primary (#dc2626)

**Backend dependencies:**
- VLP Worker (`api.virtuallaunch.pro`) — auth, session, orchestration
- Stripe — checkout, subscriptions (prod_UCK4SzsEnjp19U, price_1TDvQe9ROeyeXOqek1fpOWWH)
- TMP — IRS transcript data

## Hard Constraints

1. **No PII in public responses** — taxpayer data never appears in static HTML
2. Do not modify contract JSON files without Principal approval
3. Do not invent endpoints — all routes defined in workers/src/index.js
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
├── workers/src/       ← Cloudflare Worker API
└── README.md
```

## Data Contracts

Source of truth: `/contracts/*.contract.json`
- 11 contract files defining all API endpoints, payloads, validation rules
- Stripe product/price definitions in `stripe-product.json` and `stripe-price-v1.json`

## Post-Task Requirements

After every code change:
1. Verify worker routes match contract definitions
2. Confirm no PII leaks in HTML templates
3. Run build if package.json exists

## Migration Status

- Worker exists at `workers/src/index.js` (standalone, not VLP-proxied)
- No `wrangler.toml` at root — deployment config needed
- Auth: Bearer token (not vlp_session cookie)
- Frontend points to `taxclaim.virtuallaunch.pro` (self-hosted)

## Related Systems

| System | Path | Relationship |
|--------|------|-------------|
| VLP | `virtuallaunch.pro` | Parent platform, auth orchestration |
| TMP | `taxmonitor.pro` | IRS transcript data source |
| TTMP | `transcript.taxmonitor.pro` | Transcript processing |
