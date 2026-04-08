# STYLE.md — TaxClaim Virtual Launch Pro (TCVLP)

Last updated: 2026-04-07

---

## Stack

- **Framework:** Next.js 15 App Router (static export, `output: 'export'`)
- **CSS approach:** CSS Modules per page/component (`*.module.css`)
- **Global tokens:** `app/globals.css` — CSS variables accessed via `var(--token)`
- **Fonts:** `next/font/google` — DM Sans (body), Raleway (display)
- **NOT used:** Tailwind, Sass, CSS-in-JS, inline styles (except in the tiny loading fallbacks in `AuthGuard`/`Suspense`)

## Design Tokens

### Colors (from `app/globals.css`)
| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg` | Dark (`#0f1117` range) | Page backgrounds |
| `--color-border` | `#2a2d3e` | Card / button borders |
| `--color-text-1` | `#f1f1f4` | Primary body text |
| `--color-text-2` | Dim gray | Secondary text |
| `--color-text-3` | Dimmer gray | Tertiary / hint text |
| `--color-green` | `#22c55e` | Success / court-backed accents |
| Red primary | `#dc2626` | CTAs, deadlines, accent |

### Typography
| Token | Value |
|-------|-------|
| Display font | Raleway via `next/font/google` (700, 800, 900) |
| Body font | DM Sans via `next/font/google` (400, 500, 600, 700) |

### Spacing & Radii
| Token | Value |
|-------|-------|
| Button radius | `0.5rem` – `8px` |
| Card radius | `1rem` |
| Button padding | `0.75rem 1.25rem` |

## Patterns

- **Pages:** each `app/<route>/page.tsx` has a colocated `page.module.css`.
- **Components:** each `components/<Name>.tsx` has a colocated `<Name>.module.css`.
- **Auth:** protected pages wrap their content in `<AuthGuard>` (client-side `getSession()` → `/sign-in` redirect). No middleware.
- **API:** all backend calls go through `lib/api.ts` with `credentials: 'include'`. Never re-declare `API_BASE` — import it from `lib/api.ts`.
- **Buttons:** primary = red `#dc2626` with `transform: scale(1.03)` hover; secondary = bordered translucent surface.
- **Animations:** `fadeUp`, `slideUp`, `fadeIn` keyframes live inside the CSS module that needs them.

## Self-Check

Before delivering any styled page:
- [ ] Uses a CSS Module (no Tailwind, no inline styles)
- [ ] Font tokens come from `next/font/google` via root layout
- [ ] Colors come from `var(--color-*)` tokens in `globals.css`
- [ ] Red `#dc2626` used for primary CTAs
- [ ] Protected content wrapped in `<AuthGuard>`
- [ ] All API calls use `lib/api.ts` (with `credentials: 'include'`)
