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
