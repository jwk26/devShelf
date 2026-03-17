# Design Tokens — CodeShelf

> Shadcn-first with codeshelf extensions.
> Extracted from codeshelf-nextjs audit (verified actual usage), adapted for Shadcn/Radix.
> Dark mode tokens designed fresh (codeshelf-nextjs had no dark mode).

## Table of Contents

- [Intentional Departures](#intentional-departures)
- [globals.css — CSS Variable Layer](#globalscss--css-variable-layer)
  - [Base Layer Rules](#base-layer-rules)
- [tailwind.config.ts](#tailwindconfigts)
- [Font Loading](#font-loading)
- [Component Usage Quick Reference](#component-usage-quick-reference)
- [Shadows & Depth](#shadows--depth)
- [Textures & Overlays](#textures--overlays)
- [Transitions & Animation Tokens](#transitions--animation-tokens)
- [Density-Responsive Typography Scale](#density-responsive-typography-scale)
- [Prose Overrides (globals.css)](#prose-overrides-globalscss)
- [Scrollbar Utilities (globals.css)](#scrollbar-utilities-globalscss)
- [Category Color System](#category-color-system)
- [Component Visual Recipes](#component-visual-recipes)

---

## Intentional Departures

These are deliberate design changes from codeshelf-nextjs, not omissions:

1. **No mono font.** codeshelf-nextjs declared JetBrains Mono in `design-tokens.ts` but never loaded it — `font-mono` in `tailwind.config.ts` was mapped to Pretendard. The result: metadata labels, timestamps, and code UI were always rendered in Pretendard with tight sizes and wide letter-spacing. We liked that look and are keeping it intentional. Two font families only: Playfair Display (serif headings) + Pretendard Variable (everything else including metadata).

2. **Dark mode (new).** codeshelf-nextjs was light-only. Dark mode tokens below are fresh designs using inverted stone scale with preserved orange accent.

3. **`#fbfbfa` sidebar surface normalized.** The audit found `#fbfbfa` used in archive/dashboard sidebars — an undeclared variant between `--background` (#fafaf7) and stone-50 (#fafaf9). We normalize this to a dedicated `--background-sidebar` token rather than letting it drift as an arbitrary value.

---

## globals.css — CSS Variable Layer

```css
@layer base {
  :root {
    /* ── Shadcn Core Tokens (HSL without hsl() wrapper) ── */
    --background: 55 23% 97%;           /* #fafaf7 — warm off-white */
    --foreground: 24 10% 10%;           /* #1c1917 — stone-900 */

    --card: 55 12% 95%;                 /* #f3f3f0 — card background */
    --card-foreground: 24 10% 10%;      /* #1c1917 */

    --popover: 0 0% 100%;              /* #FFFFFF */
    --popover-foreground: 24 10% 10%;

    --primary: 24 10% 10%;              /* #1c1917 — stone-900 */
    --primary-foreground: 0 0% 100%;    /* #FFFFFF */

    --secondary: 40 6% 96%;             /* #f5f5f4 — stone-100 */
    --secondary-foreground: 24 10% 10%;

    --muted: 40 6% 96%;                 /* #f5f5f4 — stone-100 */
    --muted-foreground: 25 5% 45%;      /* #78716c — stone-500 */

    --accent: 20 6% 90%;                /* #e7e5e4 — stone-200 (hover bg) */
    --accent-foreground: 24 10% 10%;

    --destructive: 0 84% 60%;           /* #EF4444 */
    --destructive-foreground: 0 0% 100%;

    --border: 20 6% 90%;                /* #e7e5e4 — stone-200 */
    --input: 20 6% 90%;
    --ring: 25 95% 53%;                 /* #f97316 — orange-500 (focus ring) */

    --radius: 0.5rem;                   /* Default rounded-lg; mixed per component */

    /* ── Surface Extensions ── */
    --background-secondary: 55 20% 96%; /* #f8f8f5 — navbar, footer */
    --background-sidebar: 50 15% 98%;   /* #fbfbfa — archive/dashboard sidebars */

    /* ── Orange Accent Scale ──
       Full scale from audit — used for selection, focus, badges, links, active states */
    --orange-50: 33 100% 96%;           /* #fff7ed — selection bg, muted backgrounds */
    --orange-100: 34 100% 92%;          /* #ffedd5 — focus halos, light fills */
    --orange-200: 32 98% 83%;           /* #fed7aa — focus borders, soft accents */
    --orange-400: 27 96% 61%;           /* #fb923c — hover states, secondary accent */
    --orange-500: 25 95% 53%;           /* #f97316 — primary accent, links */
    --orange-600: 21 94% 48%;           /* #ea580c — hover on primary accent */
    --orange-700: 17 89% 40%;           /* #c2410c — active/pressed states */
    --orange-900: 15 75% 28%;           /* #7c2d12 — selection text in light mode */

    /* ── Layout ── */
    --reading-width: 850px;
    --sidebar-width: 400px;
    --layout-max: 1920px;

    /* ── Metadata Typography Scale ──
       Used for labels, timestamps, character counts, volume numbers.
       Rendered in Pretendard (sans) at small sizes with wide tracking. */

    /* Tracking (letter-spacing) */
    --tracking-tightest: 0.1em;         /* Compact labels */
    --tracking-label: 0.2em;            /* Standard metadata labels */
    --tracking-mid: 0.3em;              /* Mid labels */
    --tracking-wide: 0.4em;             /* Category badges, volume numbers */
    --tracking-wider: 0.5em;            /* Emphasized labels */
    --tracking-widest: 0.6em;           /* Maximum spread (section headers) */

    /* Metadata font sizes */
    --text-meta-xs: 9px;                /* Smallest metadata (timestamps) */
    --text-meta-sm: 10px;               /* Small metadata (character counts) */
    --text-meta-base: 11px;             /* Standard metadata (labels) */
    --text-meta-md: 12px;               /* Larger metadata (category badges) */
  }

  .dark {
    --background: 24 10% 10%;           /* #1c1917 — stone-900 */
    --foreground: 40 6% 98%;            /* #fafaf9 — stone-50 */

    --card: 12 5% 15%;                  /* #292524 — stone-800 */
    --card-foreground: 40 6% 98%;

    --popover: 12 5% 15%;
    --popover-foreground: 40 6% 98%;

    --primary: 40 6% 98%;               /* #fafaf9 — stone-50 */
    --primary-foreground: 24 10% 10%;   /* #1c1917 */

    --secondary: 30 7% 25%;             /* #44403c — stone-700 */
    --secondary-foreground: 40 6% 98%;

    --muted: 30 7% 25%;                 /* #44403c — stone-700 */
    --muted-foreground: 25 5% 64%;      /* #a8a29e — stone-400 */

    --accent: 30 7% 25%;                /* #44403c — stone-700 (hover bg) */
    --accent-foreground: 40 6% 98%;

    --destructive: 0 63% 31%;
    --destructive-foreground: 40 6% 98%;

    --border: 30 7% 25%;                /* #44403c — stone-700 */
    --input: 30 7% 25%;
    --ring: 27 96% 61%;                 /* #fb923c — orange-400 (brighter in dark) */

    /* Surface Extensions (dark overrides) */
    --background-secondary: 12 5% 13%;  /* slightly lighter than bg */
    --background-sidebar: 20 5% 12%;    /* sidebar surface */

    /* Orange Scale (dark overrides — shifted brighter for contrast) */
    --orange-50: 25 6% 18%;             /* warm dark tint for selections */
    --orange-100: 25 10% 20%;           /* dark focus halos */
    --orange-200: 25 20% 25%;           /* dark focus borders */
    --orange-400: 27 96% 61%;           /* #fb923c — hover states */
    --orange-500: 25 95% 53%;           /* #f97316 — primary accent */
    --orange-600: 27 96% 61%;           /* brighter hover in dark */
    --orange-700: 25 95% 53%;           /* active states */
    --orange-900: 34 100% 92%;          /* inverted — light text on dark */
  }
}
```

### Base Layer Rules

Add these after the CSS variables in `globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground font-sans antialiased;
    -webkit-tap-highlight-color: transparent;
  }
  [id] {
    scroll-margin-top: 5rem;
  }
  button, a, [role="button"] {
    touch-action: manipulation;
  }
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
}
```

---

## tailwind.config.ts

```typescript
import typography from "@tailwindcss/typography";
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      laptop: "1440px",
      fhd: "1920px",
      qhd: "2560px",
      uhd: "3840px",
    },
    extend: {
      colors: {
        background: {
          DEFAULT: "hsl(var(--background))",
          secondary: "hsl(var(--background-secondary))",
          sidebar: "hsl(var(--background-sidebar))",
        },
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        orange: {
          50: "hsl(var(--orange-50))",
          100: "hsl(var(--orange-100))",
          200: "hsl(var(--orange-200))",
          400: "hsl(var(--orange-400))",
          500: "hsl(var(--orange-500))",
          600: "hsl(var(--orange-600))",
          700: "hsl(var(--orange-700))",
          900: "hsl(var(--orange-900))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      fontFamily: {
        /* One wiring path:
           CSS: --font-serif, --font-pretendard (declared in globals.css :root)
           Layout: Playfair_Display next/font sets --font-playfair on <html>
                   Pretendard loaded via CDN, referenced as --font-pretendard
           Config: font-serif → var(--font-serif) → Playfair Display
                   font-sans → var(--font-pretendard) → Pretendard Variable
           Components: use font-serif or font-sans (default) */
        serif: ["var(--font-serif)"],
        sans: ["var(--font-pretendard)", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      fontSize: {
        "meta-xs": "var(--text-meta-xs)",     /* 9px — timestamps */
        "meta-sm": "var(--text-meta-sm)",     /* 10px — character counts */
        "meta-base": "var(--text-meta-base)", /* 11px — standard labels */
        "meta-md": "var(--text-meta-md)",     /* 12px — category badges */
      },
      letterSpacing: {
        tightest: "var(--tracking-tightest)", /* 0.1em */
        label: "var(--tracking-label)",       /* 0.2em — standard metadata */
        mid: "var(--tracking-mid)",           /* 0.3em */
        wide: "var(--tracking-wide)",         /* 0.4em — volume numbers */
        wider: "var(--tracking-wider)",       /* 0.5em */
        widest: "var(--tracking-widest)",     /* 0.6em — section headers */
      },
      maxWidth: {
        reading: "var(--reading-width)",      /* 850px */
        layout: "var(--layout-max)",          /* 1920px */
      },
      gridTemplateColumns: {
        layout: "var(--sidebar-width) 1fr",   /* 400px sidebar + content */
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        float: "float 4s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.23, 1, 0.32, 1)",
      },
      typography: {
        DEFAULT: {
          css: {
            "--tw-prose-body": "hsl(var(--foreground))",
            "--tw-prose-headings": "hsl(var(--foreground))",
            "--tw-prose-links": "hsl(var(--orange-500))",
            "--tw-prose-bold": "hsl(var(--foreground))",
            "--tw-prose-code": "hsl(var(--foreground))",
            "--tw-prose-pre-bg": "hsl(var(--card))",
            "--tw-prose-pre-code": "hsl(var(--foreground))",
            "--tw-prose-borders": "hsl(var(--border))",
            "--tw-prose-hr": "hsl(var(--border))",
            maxWidth: "var(--reading-width)",
          },
        },
      },
    },
  },
  plugins: [typography],
};

export default config;
```

---

## Font Loading

**Two fonts only** (see [Intentional Departures](#intentional-departures) for rationale).

Single wiring path: CSS variable → Tailwind config → component class.

### 1. Declare CSS variables in `globals.css`

```css
:root {
  --font-serif: var(--font-playfair), Georgia, serif;
  --font-pretendard: 'Pretendard Variable', -apple-system, BlinkMacSystemFont, sans-serif;
}
```

### 2. Load fonts in `app/layout.tsx`

```tsx
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",  // next/font injects this CSS variable on <html>
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={playfair.variable} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### 3. Wiring chain summary

```
Playfair Display:
  next/font → --font-playfair (on <html>) → --font-serif (globals.css) → font-serif (Tailwind) → className="font-serif"

Pretendard Variable:
  CDN <link> → 'Pretendard Variable' → --font-pretendard (globals.css) → font-sans (Tailwind) → className="font-sans" (default)
```

---

## Component Usage Quick Reference

```tsx
{/* ── Metadata label (uppercase, tracked, small sans) ── */}
<span className="text-meta-base font-medium uppercase tracking-label text-muted-foreground">
  PUBLISHED
</span>

{/* ── Tiny metadata (timestamps, character counts) ── */}
<span className="text-meta-xs uppercase tracking-wide text-muted-foreground">
  2.4K CHARS
</span>

{/* ── Category badge (wider tracking, medium size) ── */}
<span className="text-meta-md font-semibold uppercase tracking-wide text-orange-600">
  API
</span>

{/* ── Volume number (widest tracking) ── */}
<span className="text-meta-sm uppercase tracking-widest text-muted-foreground">
  VOL. 03
</span>

{/* ── Display heading (Playfair serif, italic) ── */}
<h2 className="font-serif text-3xl italic font-normal">
  Series Title Here
</h2>

{/* ── Page title (Playfair, bold) ── */}
<h1 className="font-serif text-5xl md:text-6xl font-bold">
  CodeShelf
</h1>

{/* ── Card with warm background + shadow ── */}
<div className="bg-card rounded-lg border border-border shadow-sm p-6">
  {children}
</div>

{/* ── Book card on bookshelf (interactive) ── */}
<div className="bg-card rounded-sm shadow-sm hover:shadow-lg transition-shadow duration-300 ease-smooth">
  {/* spine + cover */}
</div>

{/* ── Tag pill (orange accent) ── */}
<span className="rounded-full border border-border px-3 py-0.5 text-meta-base font-medium uppercase tracking-label text-muted-foreground hover:text-orange-500 hover:border-orange-500 transition-colors">
  NEXT-JS
</span>

{/* ── Active nav link ── */}
<a className="text-foreground font-medium border-b-2 border-foreground">
  Archive
</a>

{/* ── Inactive nav link ── */}
<a className="text-muted-foreground hover:text-foreground transition-colors">
  Series
</a>

{/* ── Orange accent link ── */}
<a className="text-orange-500 hover:text-orange-600 transition-colors">
  View all posts →
</a>

{/* ── Focus ring (forms, inputs) ── */}
<input className="focus:ring-2 focus:ring-orange-100 focus:border-orange-200" />

{/* ── Text selection color (global in body) ── */}
<body className="selection:bg-orange-50 selection:text-orange-900">

{/* ── Sidebar surface ── */}
<aside className="bg-background-sidebar border-r border-border">
  {children}
</aside>

{/* ── Post detail: 2-column layout ── */}
<div className="lg:grid lg:grid-cols-layout lg:gap-8">
  <aside className="lg:sticky lg:top-24">
    {/* metadata sidebar */}
  </aside>
  <article className="prose max-w-reading">
    {/* markdown content */}
  </article>
</div>

{/* ── Page container ── */}
<div className="mx-auto max-w-layout px-6 md:px-12">
  {children}
</div>

{/* ── Prose heading override (serif, italic) ── */}
{/* In globals.css @layer components: */}
{/* .prose h2 { @apply font-serif text-3xl italic font-normal; } */}

{/* ── Secondary background (navbar, footer) ── */}
<nav className="bg-background-secondary border-b border-border">
  {children}
</nav>

{/* ── Dark mode toggle ── */}
{/* Uses next-themes. Colors automatically switch via CSS variables. */}
```

---

## Shadows & Depth

Named shadow tokens extracted from codeshelf-nextjs. Use these exact values — they are the "layered depth" that gives the design its editorial feel.

### Shadow Tokens (for `tailwind.config.ts` → `theme.extend.boxShadow`)

```typescript
boxShadow: {
  // Book card resting state — subtle paper-like lift
  'book': '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
  // Book card hover — dramatic directional shadow (light from upper-left)
  'book-hover': '20px 10px 40px -10px rgba(0,0,0,0.1), inset 0 -2px 6px rgba(0,0,0,0.02)',
  // Book card active/selected — deepest shadow
  'book-active': '30px 15px 50px -10px rgba(0,0,0,0.15)',
  // Shelf shadow — blur pool under book stack
  'shelf': '0 0 48px 0 rgba(28,25,23,0.05)',  // stone-900/5 blur-3xl
  // Article card — clean minimal elevation
  'article': '0 1px 2px 0 rgba(0,0,0,0.05)',  // Tailwind shadow-sm equivalent
  // Mobile bottom toolbar
  'toolbar': '0 -4px 6px -1px rgba(0,0,0,0.1), 0 -2px 4px -2px rgba(0,0,0,0.1)', // shadow-lg
},
```

### Book Card Shadow Layers (5-layer depth system)

Each book card uses 5 decorative layers stacked via `position: absolute`. All layers use `pointer-events-none` and `aria-hidden="true"`.

```
Layer 1 — Bottom gradient:    h-[3px], bg-gradient-to-t from-black/5 to-transparent, inset-x-0 bottom-0
Layer 2 — Content:            The actual text content (title + post count)
Layer 3 — Paper texture:      inset-0, opacity-[0.03], mix-blend-multiply, bg-[url(...natural-paper.png)]
Layer 4 — Shine gradient:     inset-0, bg-gradient-to-r from-white/0 via-white/30 to-white/0
                               opacity-0 → group-hover:opacity-100, transition-opacity duration-700
Layer 5 — Bottom blur shadow: bottom-0, h-[0.5px], bg-black/5, blur-[0.2px]
```

---

## Textures & Overlays

These decorative layers give the design its "printed paper" feel. They are light-mode only — skip or reduce in dark mode.

### Paper Texture

```html
<div
  class="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply
         bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]"
  aria-hidden="true"
/>
```

- **Where:** Book cards on homepage bookshelf
- **Opacity:** `0.03` (barely visible — the soul of the design)
- **Blend mode:** `mix-blend-multiply` (darkens slightly, like printed ink on textured paper)
- **Dark mode:** Omit or use `dark:hidden`

### Shine Gradient

```html
<div
  class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0
         opacity-0 group-hover:opacity-100 transition-opacity duration-700"
  aria-hidden="true"
/>
```

- **Where:** Book cards on hover
- **Effect:** Simulates light reflection sweeping across a glossy surface
- **Timing:** `duration-700` for slow, luxurious reveal

### Decorative Quote Mark

```html
<span class="absolute -left-16 top-0 font-serif text-7xl fhd:text-8xl qhd:text-9xl uhd:text-[12rem]
             text-stone-200 select-none opacity-50">
  &quot;
</span>
```

- **Where:** Before series description in bookshelf preview panel
- **Density scaling:** Grows at each breakpoint

### Shelf Shadow

```html
<div class="absolute -bottom-8 left-0 w-48 h-8 bg-stone-900/5 blur-3xl rounded-full pointer-events-none"
     aria-hidden="true" />
```

- **Where:** Under the book stack in bookshelf sidebar
- **Effect:** Soft pool of shadow, like books resting on a shelf

---

## Transitions & Animation Tokens

### Named Durations

| Name | Value | Usage |
|------|-------|-------|
| `fast` | `200ms` | Color changes on small elements |
| `normal` | `300ms` | Standard hover transitions, button states |
| `medium` | `500ms` | Content translate, text color shifts |
| `slow` | `700ms` | Book card hover (translate + shadow + shine), primary transitions |
| `slower` | `1000ms` | Preview panel crossfade on series change |

### Named Easings (for `tailwind.config.ts` → `theme.extend.transitionTimingFunction`)

```typescript
transitionTimingFunction: {
  // Primary easing — used on book hover, content transitions
  // Overshoots slightly then settles. Feels "physical".
  smooth: 'cubic-bezier(0.23, 1, 0.32, 1)',
},
```

### Transition Recipes

```
Book card hover:        transition-all duration-700 ease-smooth
Shine reveal:           transition-opacity duration-700
Content text slide:     transition-all duration-500 group-hover:translate-x-1
Color change:           transition-colors duration-500
Hover arrow reveal:     opacity-0 group-hover:opacity-100 transition-all transform
                        translate-x-4 group-hover:translate-x-0
CTA tracking expand:    group-hover:tracking-[0.3em] transition-all duration-300
Preview crossfade:      transition-all duration-1000 animate-in fade-in slide-in-from-right-8
Recent indicator move:  group-hover:-translate-x-1 transition-transform duration-500
```

### Keyframe Animations

```typescript
// Already in tailwind.config.ts
animation: {
  float: 'float 4s ease-in-out infinite',  // Gentle bobbing (bookshelf)
},
keyframes: {
  float: {
    '0%, 100%': { transform: 'translateY(0px)' },
    '50%': { transform: 'translateY(-8px)' },
  },
},
// Tailwind built-in: animate-ping (used for recent indicator dot)
```

### Recent Activity Indicator

```html
<div class="relative flex h-1.5 w-1.5">
  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
  <span class="relative inline-flex rounded-full h-1.5 w-1.5 bg-orange-500" />
</div>
```

- **Where:** Book cards with `is_recent: true`, decorative vertical panel dot
- **Sizes:** `h-1.5 w-1.5` on books, `h-2 w-2` on preview panel

---

## Density-Responsive Typography Scale

The original uses `fhd:`, `qhd:`, `uhd:` breakpoints to scale typography and spacing on large displays. These are the exact responsive values per element.

### Bookshelf Preview Panel

| Element | Base | `md:` | `fhd:` (1920) | `qhd:` (2560) | `uhd:` (3840) |
|---------|------|-------|----------------|----------------|----------------|
| Preview title | `text-6xl` | `text-8xl` | `text-9xl` | `text-[10rem]` | `text-[14rem]` |
| Description | `text-2xl` | `text-4xl` | `text-5xl` | `text-6xl` | `text-8xl` |
| Quote mark | `text-7xl` | — | `text-8xl` | `text-9xl` | `text-[12rem]` |
| Dots | `w-2.5 h-2.5` | — | `w-3.5 h-3.5` | `w-4 h-4` | `w-6 h-6` |
| Preview min-height | `min-h-[600px]` | — | `min-h-[800px]` | `min-h-[1000px]` | `min-h-[1400px]` |

### Preview Title Exact Classes

```
font-serif text-6xl md:text-8xl fhd:text-9xl qhd:text-[10rem] uhd:text-[14rem]
text-stone-900 leading-[0.9] tracking-tight font-medium
line-clamp-2 overflow-hidden text-ellipsis text-balance
```

---

## Prose Overrides (globals.css)

Exact CSS for article content styling. Add to `globals.css` in `@layer components`.

```css
@layer components {
  .prose {
    @apply text-stone-700 max-w-none;
  }

  .prose h2 {
    @apply font-serif text-3xl mt-12 mb-6 italic font-normal;
    text-wrap: balance;
  }

  .prose h3 {
    @apply font-serif text-2xl mt-8 mb-4 font-normal;
    text-wrap: balance;
  }

  .prose p {
    @apply leading-relaxed mb-6 font-light;
  }

  .prose code {
    @apply font-mono text-sm bg-stone-100 px-1.5 py-0.5 rounded;
  }

  .prose pre {
    @apply bg-stone-900 text-stone-100 p-6 rounded overflow-x-auto my-6;
  }

  .prose pre code {
    @apply bg-transparent p-0 text-sm;
  }

  .prose a {
    @apply text-blue-600 hover:text-blue-800 underline decoration-1 underline-offset-2 transition-colors;
  }

  .prose ul,
  .prose ol {
    @apply my-6 pl-6;
  }

  .prose li {
    @apply mb-2;
  }

  .prose blockquote {
    @apply border-l-4 border-stone-300 pl-4 italic text-stone-600 my-6;
  }

  .prose strong {
    @apply font-semibold text-stone-900;
  }

  .prose em {
    @apply italic;
  }
}
```

**Key difference from current:** Prose links are `text-blue-600` (not orange). Orange is for navigation/CTA links outside prose content.

---

## Scrollbar Utilities (globals.css)

```css
/* Minimal scrollbar for content panels */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #a8a29e; /* stone-400 */
  border-radius: 5px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #78716c; /* stone-500 */
}

/* Hidden scrollbar (keeps scroll functionality) */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
```

- **Where:** `.scrollbar-hide` on bookshelf sidebar, archive sidebar. `.custom-scrollbar` on content panels, modals.

---

## Category Color System

Categories use **hash-based deterministic colors** — no hardcoded mapping. Any new category gets a consistent color automatically.

```typescript
// src/lib/categories.ts
export function generateCategoryColor(name: string): { bgClass: string; textClass: string } {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  const colorFamilies = [
    // 50 curated variants across: rose, pink, fuchsia, violet, purple, indigo,
    // blue, sky, cyan, teal, emerald, green, lime, yellow, amber, orange, red
    // Each: { bgClass: 'bg-{color}-50/50', textClass: 'text-{color}-600' }
    // ... (3 shades per color family)
  ]
  return colorFamilies[Math.abs(hash) % colorFamilies.length]
}
```

### CategoryBadge Styling

```
px-2 py-0.5 rounded-sm font-mono text-[9px] font-bold uppercase tracking-tighter
border border-current/10 {bgClass} {textClass}
```

---

## Component Visual Recipes

Atomic specs for each component. An implementing agent should reproduce these exact class combinations.

### Section Header

Reusable pattern for page section introductions.

```html
<div class="space-y-3">
  <h4 class="font-mono text-[11px] font-medium uppercase tracking-[0.5em] text-stone-400">
    Section {number}
  </h4>
  <h3 class="font-serif text-4xl md:text-5xl text-stone-800 italic">
    {title}
  </h3>
  <p class="font-mono text-[11px] text-stone-400">
    {koreanSubtitle}
  </p>
</div>
```

| Instance | Number | Title | Korean |
|----------|--------|-------|--------|
| Homepage bookshelf | `01` | `series` | `시리즈 // 전체 시리즈 목록` |
| Archive | `02` | `archive` | `아카이브 // 전체 글 목록` |
| Dashboard | `03` | `dashboard` | `대시보드 // 나의 콘텐츠` |

### TagBadge

```
Container: inline-flex items-center justify-center font-mono transition-colors whitespace-nowrap rounded-md
Icon:      Hash (lucide-react), mr-1 opacity-50 shrink-0

Sizes:
  sm → h-5 px-2 text-[9px],   icon: w-2.5 h-2.5
  md → h-6 px-2.5 text-[10px], icon: w-3 h-3
  lg → h-7 px-3 text-xs,       icon: w-3.5 h-3.5

Variants:
  default → bg-stone-100 text-stone-600 border border-stone-200
  outline → bg-transparent text-stone-500 border border-stone-200
  ghost   → bg-transparent text-stone-500 border border-transparent
  active  → bg-stone-800 text-stone-100 border border-stone-800

Clickable hover:
  default → hover:bg-stone-200 hover:text-stone-900
  outline → hover:border-stone-400 hover:text-stone-800 hover:bg-stone-50
  ghost   → hover:bg-stone-100/50 hover:text-stone-800
  active  → hover:bg-stone-900 hover:border-stone-900 hover:shadow-sm
```

### Book Card (Homepage Bookshelf)

**Dimensions (language-aware):**

```
Height by post count:
  default: 32px | 8+ posts: 48px | 12+ posts: 58px | 20+ posts: 72px

Width by title length:
  Korean:  4+ chars → w-48 | 8+ → w-56 | 12+ → w-64 | default: w-40
  English: 10+ chars → w-48 | 20+ → w-56 | 30+ → w-64 | default: w-40
```

**Card classes:**

```
Container (Link):
  relative group cursor-pointer transition-all duration-700 ease-smooth transform {width} min-w-0
  Active:  translate-x-8 z-40
  Hover:   hover:translate-x-8 z-10
  Default: translate-x-0

Card body:
  relative {color_theme || 'bg-white'} w-full rounded-[4px] md:rounded-[5px]
  flex items-center px-4 md:px-5 overflow-hidden
  shadow-book
  group-hover:shadow-book-hover
  Active: shadow-book-active
  transition-all duration-700 ease-out min-w-0

Title text:
  text-xs font-mono font-medium tracking-[0.1em] uppercase truncate whitespace-nowrap
  Active: text-stone-900
  Default: text-stone-500 group-hover:text-stone-800
  transition-colors duration-500

Post count:
  font-mono text-[10px] font-normal
  Active: text-stone-700
  Default: text-stone-400
```

### Post Row (Archive / Series Detail)

```
Container (Link):
  group relative flex flex-col md:flex-row md:items-center gap-2 md:gap-12
  py-4 border-b border-stone-200 cursor-pointer
  hover:bg-[#f3f3f0]/60 transition-all duration-300 px-6 rounded-sm
  animate-in fade-in slide-in-from-bottom-2 overflow-hidden shrink-0

Index column (w-36):
  Index:  font-mono text-[11px] text-stone-500 font-bold w-8
          Value: String(index + 1).padStart(2, '0')
  Date:   font-mono text-[10px] text-stone-400 font-normal uppercase tracking-[0.2em]

Content column (flex-grow, min-w-0, pr-4):
  CategoryBadge + Title inline (flex items-center gap-3)
  Title:   text-[15px] font-mono text-stone-600 group-hover:text-stone-900
           transition-colors truncate font-normal leading-tight
  Excerpt: text-stone-400 text-xs font-mono font-light truncate max-w-2xl lg:max-w-3xl
           group-hover:text-stone-600 transition-colors

Tags column (hidden md:flex, w-72, pl-4):
  Up to 3 TagBadge size="sm" variant="ghost"
  class="bg-stone-50 border-stone-200 text-stone-400 truncate"

Metrics column (w-40, border-l border-stone-100, pl-6):
  FileText icon (w-3.5 h-3.5) + font-mono text-[10px] uppercase tracking-widest font-normal
  Eye icon (w-3.5 h-3.5) + same text styling
  Hover arrow: ArrowUpRight w-5 h-5 text-stone-900
    opacity-0 group-hover:opacity-100 transition-all
    transform translate-x-4 group-hover:translate-x-0
```

### Post Table Header

```
Container: hidden md:flex items-center gap-12 pb-3 border-b border-stone-200 px-6 shrink-0
Label style: font-mono text-[10px] text-stone-400 font-bold uppercase tracking-[0.4em]
Korean text: opacity-50 font-normal ml-1

Columns:
  "Index/Date"  날짜   → w-36
  "Subject"     제목   → flex-grow
  "Tags"        태그   → w-72, pl-4, text-left
  "Metrics"     통계   → w-40, pl-6, text-left
```

### Article Card (Post Detail)

```
Wrapper: bg-white rounded-lg shadow-sm (dark: bg-card)

Header: p-8 pb-6 border-b border-stone-100
  Category + Tags row: flex items-center gap-3 mb-4
    CategoryBadge: px-3 py-1 text-xs font-mono font-bold rounded-full {bgClass} {textClass}
    TagBadge: size="sm" variant="outline" class="text-stone-600 border-stone-200 bg-transparent"

  Title: text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-4 leading-tight text-balance
  Excerpt: text-lg text-stone-600 leading-relaxed

  Author card: flex items-center gap-3
    Avatar: w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center
    Name: font-semibold text-stone-900 text-sm
    Role: text-xs text-stone-500

  Metadata: flex items-center gap-6 text-xs text-stone-500 font-mono
    Label: text-[10px] text-stone-400 uppercase tracking-wider
    Value: text-stone-900

Content: p-8, prose prose-stone max-w-none (see Prose Overrides section)
```

### Three-Column Post Detail Layout

```
Page background: min-h-screen bg-stone-50
Container: w-full max-w-[1920px] mx-auto px-6 md:px-12 py-12
Flex row: flex gap-6 xl:gap-8 justify-center

Left sidebar (TOC):
  hidden lg:block shrink-0
  width: clamp(200px, 15vw, 280px)   ← inline style, not Tailwind class
  Inner: sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto

Main content:
  min-w-0 flex-1 max-w-[800px]

Right sidebar (Toolbox):
  hidden xl:block shrink-0
  width: clamp(180px, 14vw, 240px)   ← inline style, not Tailwind class
  Inner: sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto

Mobile bottom toolbar:
  fixed bottom-0 left-0 right-0 xl:hidden
  bg-white border-t border-stone-200 shadow-lg z-50
  Inner: px-6 py-4
```

### Archive Sidebar

```
Container:
  w-full lg:w-[400px] shrink-0 border-r border-stone-200
  pr-12 lg:pr-16 pt-12 lg:h-full lg:overflow-y-auto scrollbar-hide
Section spacing: space-y-16

Section labels:
  font-mono text-[11px] uppercase tracking-[0.4em] text-stone-500 font-bold

Category buttons:
  flex items-center justify-between group text-sm font-mono uppercase tracking-[0.2em]
  transition-all text-left
  Active:   text-stone-900 font-bold
  Inactive: text-stone-500 hover:text-stone-900
  Count:    text-[11px]
            Active: text-stone-900 font-bold
            Inactive: text-stone-300 font-normal, group-hover:text-stone-500

Sort buttons (same styling as category, full width):
  Korean label (right-aligned): text-[11px] text-stone-300 group-hover:text-stone-500 font-normal

Tag deactivation hint:
  text-[9px] text-red-500 font-mono tracking-wider
  "* click again to deactivate."

Info box:
  p-6 bg-[#fbfbfa] border border-stone-100 rounded-sm shadow-sm
  Text: font-mono text-[11px] text-stone-500 font-normal uppercase tracking-[0.1em] leading-loose
  Content: "{N} categories\n{N} tags\n{N} posts"
```

### Bookshelf Auto-Cycle Control

```
Button:
  flex items-center gap-2 group cursor-pointer
  hover:bg-stone-100 px-3 py-1.5 rounded-sm transition-colors

Icons (lucide-react, strokeWidth={1.5}, w-4 h-4):
  Paused:    PlayCircle, text-stone-500 group-hover:text-stone-600
  Hovering:  Timer, text-orange-500/70
  Playing:   PauseCircle, text-stone-500 group-hover:text-stone-600

Label:
  font-mono text-[11px] font-medium uppercase tracking-widest transition-colors
  Base: text-stone-400 group-hover:text-stone-600
  Format: "Auto_Cycle: [{OFF|PAUSED|ON}]"
  Status colors: OFF → text-stone-400, PAUSED → text-orange-500/70, ON → text-green-600/70
```

### Bookshelf Preview Action Footer

```
CTA link:
  group relative inline-flex items-center gap-6
  text-[11px] font-mono font-bold text-stone-900 uppercase tracking-[0.2em]
  Inner span: border-b-2 border-stone-900 pb-2
              group-hover:tracking-[0.3em] transition-all duration-300
  Arrow: text-2xl, group-hover:translate-x-3 transition-transform duration-300

Statistics (next to CTA):
  flex items-center gap-10 border-l border-stone-200 pl-10
  Label: text-[10px] font-mono text-stone-400 font-normal uppercase tracking-widest mb-1
  Value: text-lg font-mono text-stone-800 font-bold tabular-nums
```

### Bookshelf Decorative Vertical Text

```
Container: absolute -top-12 right-0 flex flex-col items-center gap-4 pointer-events-none
Line: h-24 w-[1px] bg-stone-200
Text rotation: [writing-mode:vertical-lr] rotate-180

Slug line:
  font-mono text-[10px] text-stone-600 font-normal lowercase tracking-[0.4em] whitespace-nowrap
  Format: "{category}@codeshelf/{slug}"

Build line:
  font-mono text-[9px] text-stone-400 font-normal uppercase tracking-[0.6em] whitespace-nowrap
  Format: "Build: {postCount} entries · {characterCount}"
```

---

## Key Differences from workspace2 (tcrei)

| Aspect | tcrei | CodeShelf |
|--------|-------|-----------|
| `--background` | Cool `#F4F4F5` (zinc-100) | Warm `#fafaf7` (custom) |
| `--accent` | zinc-200 (neutral hover) | stone-200 (warm hover) |
| Orange accent | None (monochrome) | Full `orange-50` through `orange-900` scale |
| Heading font | Geist Sans (black, tracked) | Playfair Display (serif, italic) |
| Body + metadata font | Geist Sans + Geist Mono | Pretendard Variable only (no mono — see Departures) |
| Metadata sizing | Standard Tailwind `text-xs` | Custom scale: `text-meta-xs` (9px) through `text-meta-md` (12px) |
| Metadata tracking | `tracking-label` only (0.1em) | Full scale: `tracking-tightest` (0.1em) through `tracking-widest` (0.6em) |
| `--radius` | `0rem` (sharp globally) | `0.5rem` (mixed, rounded-lg default) |
| Shadows | None (zero shadows) | Subtle layered (`shadow-sm` through `shadow-lg`) |
| Sidebar surface | Same as background | Dedicated `--background-sidebar` token |
| Typography style | Industrial, NASA-grid | Literary, warm, bookshelf metaphor |
