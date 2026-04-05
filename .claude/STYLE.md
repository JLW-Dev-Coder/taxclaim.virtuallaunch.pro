# STYLE.md — TaxClaim Virtual Launch Pro (TCVLP)

Last updated: 2026-04-04

---

## Stack

- **CSS approach:** Tailwind CSS via CDN (`cdn.tailwindcss.com/3.4.17`)
- **Global tokens:** Inline `<style>` blocks + Tailwind config in each HTML file
- **NOT used:** CSS modules, Sass, CSS-in-JS, PostCSS build pipeline

## Design Tokens

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| Primary | `#dc2626` (red-600) | CTAs, active states, accent |
| Primary hover | `scale(1.05)` | Button hover effect |
| Primary glow | `rgba(220,38,38,0.3)` | Pulse animation shadow |
| Primary focus | `rgba(220,38,38,0.2)` | Input focus ring |
| Background | Dark (`#0f1117` range) | Page backgrounds |
| Surface | `rgba(255,255,255,.06)` | Card/secondary backgrounds |
| Border | `#2a2d3e` | Secondary button borders |
| Text primary | `#f1f1f4` | Body text on dark |

### Typography
| Token | Value |
|-------|-------|
| Display font | `Raleway` (700, 800, 900) |
| Body font | `DM Sans` (400, 500, 600, 700) |
| Font source | Google Fonts CDN |

### Spacing & Layout
| Token | Value |
|-------|-------|
| Border radius (buttons) | `8px` |
| Button padding | `12px 24px` |
| Animation | `fadeUp 0.5s ease-out` with staggered delays |

## Button Patterns

```css
/* Primary */
.btn-primary {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 12px 24px; border-radius: 8px;
  font-weight: 600; border: none; cursor: pointer;
  transition: all 0.2s;
}
.btn-primary:hover { transform: scale(1.05); }

/* Secondary */
.btn-secondary {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 12px 24px; border-radius: 8px;
  font-weight: 600; border: 1px solid #2a2d3e;
  background: rgba(255,255,255,.06); color: #f1f1f4;
  cursor: pointer; transition: all 0.2s;
}
.btn-secondary:hover { background: rgba(255,255,255,.12); }
```

## Animations

```css
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(220,38,38,0.3); }
  50% { box-shadow: 0 0 0 10px rgba(220,38,38,0); }
}
```

## Icons

- **Library:** Lucide (`cdn.jsdelivr.net/npm/lucide@0.263.0`)

## Self-Check

Before delivering any styled page:
- [ ] Uses Tailwind CDN (not build pipeline)
- [ ] DM Sans for body, Raleway for display headings
- [ ] Red primary (#dc2626) for CTAs and accents
- [ ] Dark background theme
- [ ] fadeUp animation on page sections
- [ ] pulse-glow on primary CTAs
- [ ] Focus rings use red-200 opacity
