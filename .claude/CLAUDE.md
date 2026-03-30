# TaxClaim.VirtualLaunch.Pro — CLAUDE.md

## Platform Purpose & Business Model

TaxClaim Pro (TCVLP) is a SaaS tool for tax professionals that enables them to create **branded landing pages** for their clients to generate **Form 843 preparation guides** based on the **Kwong v. US** ruling.

- **Flat pricing**: $10/month per tax professional
- **Each pro gets**: `{slug}.taxclaim.virtuallaunch.pro`
- **Taxpayers** visit the pro's branded page, optionally upload their IRS transcript, and receive a Form 843 preparation guide

---

## Critical Compliance Rules

### Preparation Guide Watermark (REQUIRED everywhere)
All generated output **must** display prominently:

```
PREPARATION GUIDE — NOT AN OFFICIAL IRS FORM
```

Never describe the output as an "official IRS form" or "Form 843" without the "preparation guide" qualifier.

### July 10, 2026 Deadline (REQUIRED on all taxpayer pages)
- Display on every taxpayer-facing page via `<DeadlineBanner />`
- The claim deadline under Kwong v. US is **July 10, 2026**
- After this date, claims cannot be reopened

### Official Form Link
Always link to the official IRS Form 843:
`https://www.irs.gov/pub/irs-pdf/f843.pdf`

---

## Subdomain Routing

`middleware.ts` extracts the subdomain from the `host` header:

```
jones-tax.taxclaim.virtuallaunch.pro
→ internally renders /claim/jones-tax
→ sets x-pro-slug: jones-tax header
```

The `x-pro-slug` header is read by the page server component to identify which pro's page to render.

---

## VLP API Endpoints

All API calls go through `lib/api.ts`. Base URL: `NEXT_PUBLIC_API_BASE` (default: `https://api.virtuallaunch.pro`).

| Function | Method | Endpoint |
|---|---|---|
| `getSession()` | GET | `/v1/auth/session` |
| `logout()` | POST | `/v1/auth/logout` |
| `getProBySlug(slug)` | GET | `/v1/tcvlp/pro/by-slug/:slug` |
| `getPro(pro_id)` | GET | `/v1/tcvlp/pro/:pro_id` |
| `getMailingAddress(state)` | GET | `/v1/tcvlp/mailing-address?state=` |
| `uploadTranscript(formData)` | POST | `/v1/tcvlp/transcript/upload` |
| `generateForm843(data)` | POST | `/v1/tcvlp/forms/843/generate` |
| `submitForm843(submission_id)` | POST | `/v1/tcvlp/forms/843/submit` |
| `createCheckout(account_id, platform)` | POST | `/v1/checkout/sessions` |
| `tcvlpOnboarding(data)` | POST | `/v1/tcvlp/onboarding` |
| `getTicketsByAccount(account_id)` | GET | `/v1/support/tickets/by-account/:account_id` |

Auth uses the **`vlp_session` cookie** (set by VLP backend). `getSession()` returns `null` if not authenticated.

---

## Pages

| Route | Auth | Description |
|---|---|---|
| `/` | Public | Tax pro marketing page |
| `/demo` | Public | Client-facing demo walkthrough |
| `/support` | Public | Support + Cal.com embeds |
| `/sign-in` | Public | Magic link + Google OAuth |
| `/dashboard` | Auth required | Multi-view pro dashboard |
| `/onboarding` | Auth required | 3-step wizard (firm → slug → payment) |
| `/success` | Public | Post-payment confirmation |
| `/claim/[slug]` | Public | Taxpayer claim page (5-step form) |

---

## CSS Modules Policy

- **No Tailwind**. No inline styles. CSS Modules only.
- CSS variables are defined in `app/globals.css` under `:root`
- Font variables: `--font-display` (Raleway), `--font-body` (DM Sans)
- Color palette: `--color-bg`, `--color-surface`, `--color-red`, `--color-text-1`, etc.

---

## Kwong v. US — Background

The U.S. Court of Federal Claims ruled in **Kwong v. United States** (2023) that certain IRS penalties assessed between **January 20, 2020, and July 10, 2023**, may be challenged via IRS Form 843. This created a limited window for taxpayers to recover penalties.

Tax professionals use TaxClaim Pro to help clients navigate this process before the **July 10, 2026** claim deadline.

---

## Migration Status

- Migrated from: Plain HTML files in `public/`
- Framework: Next.js 15 App Router
- TypeScript strict mode
- Auth: VLP cookie session (`vlp_session`)
- CSS: CSS Modules (no Tailwind)
- Deployment: Cloudflare Pages via `wrangler.toml`
