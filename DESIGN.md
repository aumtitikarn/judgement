---
name: จันทราไพ่
description: A Thai tarot site where the visitor draws their own cards, lit like a table at midnight.
colors:
  night-950: "#06040f"
  night-900: "#0c0820"
  night-850: "#120d2b"
  night-800: "#191139"
  night-700: "#241a4d"
  night-600: "#33256b"
  gold-200: "#f7e7bf"
  gold-300: "#f0d89b"
  gold-400: "#e2bd6b"
  gold-500: "#c9a227"
  mystic-400: "#a68bff"
  mystic-500: "#7c5cff"
  mystic-600: "#5b3fd6"
  mist-100: "#efeaff"
  mist-300: "#cabfe8"
  mist-500: "#9184b8"
  alert-rose: "#fda4af"
typography:
  display:
    fontFamily: "Trirong, Georgia, serif"
    fontSize: "clamp(2.25rem, 5vw, 3rem)"
    fontWeight: 400
    lineHeight: 1.25
    letterSpacing: "normal"
  headline:
    fontFamily: "Trirong, Georgia, serif"
    fontSize: "clamp(1.5rem, 3vw, 1.875rem)"
    fontWeight: 400
    lineHeight: 1.35
  title:
    fontFamily: "Trirong, Georgia, serif"
    fontSize: "1.25rem"
    fontWeight: 400
    lineHeight: 1.4
  body:
    fontFamily: "Noto Sans Thai, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.75
  label:
    fontFamily: "Noto Sans Thai, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0.2em"
rounded:
  sm: "0.75rem"
  md: "1rem"
  lg: "1.5rem"
  full: "9999px"
spacing:
  xs: "0.5rem"
  sm: "0.75rem"
  md: "1.25rem"
  lg: "1.5rem"
  xl: "2.5rem"
  section: "3.5rem"
components:
  button-primary:
    backgroundColor: "linear-gradient(to right, #c9a227, #f0d89b)"
    textColor: "{colors.night-950}"
    typography: "{typography.title}"
    rounded: "{rounded.full}"
    padding: "0.75rem 2rem"
  button-primary-hover:
    backgroundColor: "linear-gradient(to right, #d9af2b, #f5e2ae)"
    textColor: "{colors.night-950}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.gold-200}"
    typography: "{typography.title}"
    rounded: "{rounded.full}"
    padding: "0.625rem 1.5rem"
  button-outline-hover:
    backgroundColor: "rgba(226, 189, 107, 0.1)"
    textColor: "{colors.gold-200}"
  button-mystic:
    backgroundColor: "transparent"
    textColor: "{colors.mystic-400}"
    typography: "{typography.body}"
    rounded: "{rounded.full}"
    padding: "0.375rem 1rem"
  button-mystic-hover:
    backgroundColor: "rgba(124, 92, 255, 0.1)"
    textColor: "{colors.mystic-400}"
  card-surface:
    backgroundColor: "rgba(12, 8, 32, 0.6)"
    textColor: "{colors.mist-300}"
    rounded: "{rounded.lg}"
    padding: "1.5rem"
  card-surface-hover:
    backgroundColor: "rgba(18, 13, 43, 0.7)"
  card-inset:
    backgroundColor: "rgba(255, 255, 255, 0.03)"
    textColor: "{colors.mist-300}"
    rounded: "{rounded.md}"
    padding: "1.25rem"
  input-field:
    backgroundColor: "rgba(6, 4, 15, 0.6)"
    textColor: "{colors.mist-100}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: "0.625rem 1rem"
  chip-neutral:
    backgroundColor: "rgba(255, 255, 255, 0.05)"
    textColor: "{colors.mist-300}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "0.25rem 0.75rem"
  chip-gold:
    backgroundColor: "rgba(226, 189, 107, 0.1)"
    textColor: "{colors.gold-200}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "0.375rem 1rem"
  nav-link:
    backgroundColor: "transparent"
    textColor: "{colors.mist-300}"
    typography: "{typography.body}"
    rounded: "{rounded.full}"
    padding: "0.5rem 0.75rem"
  nav-link-hover:
    backgroundColor: "rgba(255, 255, 255, 0.05)"
    textColor: "{colors.gold-200}"
---

# Design System: จันทราไพ่

## Overview

**Creative North Star: "The Midnight Reading Table"**

The whole system is one scene: a small table late at night, a deck fanned across it, and จันทรา sitting opposite you. Everything visual answers to that room. The near-black ground is not "dark mode" — it is the unlit space around the table. Gold is not a brand color — it is the candle. The violet that rises at the page edges is the room's dark air, not an accent looking for a job. This matters because the visitor is alone on a phone at 1am with something specific weighing on them; the design's job is to make a small lit place for them to sit down in, not to perform mysticism at them.

The density is unhurried. Sections breathe at 3.5rem, body copy runs at 1.75 line-height because Thai ascenders and descenders need the room, and the ritual (intro → shuffle → pick → flip) is paced on purpose. Nothing here should read as an app trying to get the visitor through a funnel. The surfaces are soft-cornered and tappable because the primary session is one thumb on a small screen — warmth and reachability are the same decision.

The one thing this system must never become is a cosmic-mystic template: purple-on-black gradients, glowing orbs, sparkle overlays used as decoration, stock crystal-ball imagery. The starfield and the ambient glow exist at the lowest possible amplitude to suggest a room with a window, and they stop there. Restraint is what separates a reading table from a fortune-teller stock photo.

**Key Characteristics:**
- Near-black indigo ground (`#06040f`) with three barely-there radial washes; never a flat black
- One warm gold family carrying every act of attention, against a cool violet-tinted neutral
- Trirong (serif) for every heading and every moment of voice; Noto Sans Thai for everything read at length
- Full pills for actions, 16–24px rounding on surfaces, hairline white borders at 10%
- Two separate depth vocabularies: black shadow for weight, colored glow for emission
- Dark-only by commitment (`color-scheme: dark`), motion fully reduced under `prefers-reduced-motion`

## Colors

A single warm gold lighting a cool violet-black room, with a violet-tinted neutral ramp doing all the reading work in between.

### Primary
- **Candle Gold** (`#e2bd6b`): The system's light source. Borders on anything the visitor is meant to touch or has just revealed — the card frame, the CTA glow, the header sigil ring, the `✦` bullet that leads an AI line. At 10% opacity it becomes the wash behind a gold chip; at 30–50% it becomes a border.
- **Lit Gold** (`#f0d89b`): The bright end of the flame. The right half of the primary button gradient, and the color of a heading that has just been revealed.
- **Pale Gold** (`#f7e7bf`): Gold at reading weight. Every section heading, every eyebrow chip's text, every `<strong>` inside an AI reading. This is the most-used gold by area, because it is the one that stays legible on the dark ground.
- **Deep Gold** (`#c9a227`): The dark end of the primary gradient and the accent of the ภาพรวม pack category. Too low-contrast for text on night; use it as a surface or gradient stop only.

### Secondary
- **Mystic Violet** (`#a68bff`): The voice of the AI, and only that. The จันทรา reading panel's border and heading, the "อ่านใหม่อีกครั้ง" control, the position label above each drawn card. It marks *interpretation* as distinct from *the card itself*.
- **Deep Violet** (`#7c5cff`): The ambient wash at the top-left of the page ground (22% opacity) and the hover fill under a mystic control (10%). Never a text color.

### Tertiary
- **Category Accents** (eleven hues, `#e0709b` ความรัก through `#c9a227` ภาพรวม): Each pack category carries its own hue, used only at 8–27% opacity as a chip border and fill. They are wayfinding, not palette — a category accent never becomes a text color, a button, or a surface.

### Neutral
- **Ink Night** (`#06040f`): The page ground and the text color on gold buttons. Nothing sits behind this.
- **Panel Night** (`#0c0820`) / **Raised Night** (`#120d2b`) / **Card Night** (`#191139`): The three surface steps above the ground, used at 50–80% opacity so the ambient wash reads through them.
- **Deck Night** (`#241a4d`, `#33256b`): The card-back gradient only. These are the lightest violets in the system and they exist so the face-down deck reads as an object with a sheen.
- **Moon Mist** (`#efeaff`): Default body text and every heading that isn't gold. Violet-tinted white, never pure white.
- **Dim Mist** (`#cabfe8`): Secondary prose — descriptions, taglines, the text under a heading. The workhorse.
- **Faint Mist** (`#9184b8`): Meta text — labels, counts, timestamps, the footer disclaimer, placeholders. The floor of legibility on this ground; never go dimmer.
- **Alert Rose** (`#fda4af`): Field validation errors and the AI-failure panel. The only non-gold, non-violet hue permitted to carry text.

### Named Rules

**The Light Source Rule.** Gold marks where the eye should go, and nowhere else: the primary action, the frame of a card, the heading that opens a section, the thing just revealed. If a gold element is not one of those four, it is decoration and it comes out. This is the rule most likely to be broken by a well-meaning variant.

**The One Voice Rule.** Violet belongs to the AI reading and to nothing else on the page. A violet border is a promise that จันทรา is speaking inside it. Using violet for a generic panel breaks the only signal the reading surface has.

**The No Pure Black Rule.** The ground is `#06040f` under three radial washes and a starfield, never `#000`. Any surface that reads as flat black has lost the room.

**The Category Stays In Its Lane Rule.** Category accent hues appear only as chip border (27%) and chip fill (8%). They never become text, button, or panel color — eleven competing hues would shred the gold.

## Typography

**Display Font:** Trirong (with Georgia, serif) — `--font-thai-display`
**Body Font:** Noto Sans Thai (with system-ui, sans-serif) — `--font-thai-sans`

**Character:** Trirong is a Thai serif with real stroke contrast; it gives headings the weight of something written by hand rather than generated. Noto Sans Thai underneath is neutral to the point of invisibility, which is the point — it carries long readings without asking for attention. The pairing reads as a handwritten card set on printed paper.

### Hierarchy
- **Display** (Trirong 400, `clamp(2.25rem, 5vw, 3rem)`, line-height 1.25): Page-opening h1 only — the hero on `/`, the title of a reading room. One per page.
- **Headline** (Trirong 400, `clamp(1.5rem, 3vw, 1.875rem)`, line-height 1.35): Section openers. Almost always Pale Gold.
- **Title** (Trirong 400, `1.25rem`–`1.5rem`, line-height 1.4): Card titles, panel headings, the name of a drawn card.
- **Body** (Noto Sans Thai 400, `1rem`, line-height 1.75): All prose, all AI reading text, all card meanings. Constrained to `max-w-xl`/`max-w-2xl` so lines don't run past comfortable measure.
- **Label** (Noto Sans Thai 400, `0.75rem`, letter-spacing `0.2em`, uppercase where Latin): Position eyebrows above a drawn card, meta counts, hints beside a field label. The only tracked type in the system.

### Named Rules

**The Thai Leading Rule.** Body text never drops below 1.75 line-height and headings never below 1.25. Thai stacks vowels and tone marks above and below the baseline; Latin-tuned leading collides them. `leading-relaxed` on prose is not a preference, it is legibility.

**The Serif Speaks Rule.** Trirong appears wherever the site has a voice: headings, card names, the `<strong>` inside an AI reading, the number on a step card. Noto Sans Thai appears wherever the site is being read. A Trirong paragraph and a Noto Sans heading are both errors.

**The No Tracking On Thai Rule.** Letter-spacing above 0 is reserved for the `0.2em` label style and never applied to Thai body copy at any size.

## Layout

A single centered column at `max-w-6xl` with `1.25rem` gutters, holding a stack of sections that breathe at `3.5rem` vertical rhythm (`py-14`), tightening to `1.5rem` between elements inside a section. Reading surfaces narrow further to `max-w-3xl`; prose narrows again to `max-w-xl`/`max-w-2xl`.

The site is phone-first in the strict sense: every layout starts as one column and earns its columns upward. The hero splits to `1.15fr 1fr` at `md`; flow cards go 1 → 3 at `lg`; the card library grid goes 2 → 3 → 5 across `sm`/`lg`. Breakpoints in use are `sm: 640px`, `md: 768px`, `lg: 1024px` — nothing beyond that, because the desktop case is the minority case.

The 78-card fan is the one deliberately overflowing element: a horizontally scrolled strip that bleeds past the gutter (`-mx-5 px-5`), auto-centered on mount, with card width and fan gap stepping up at each breakpoint via `--fan-card-w` / `--fan-gap`. It is allowed to break the column because the deck is meant to feel wider than the screen.

Sticky header at `z-30` with `backdrop-blur-md` over `night-950/70`; the full-screen card modal sits at `z-50` over `night-950/85`. `scroll-mt-24` on anchored sections keeps the sticky header from eating the target.

## Elevation & Depth

The system uses two shadow vocabularies with strictly separate jobs, over a base of tonal layering. Surfaces are stacked by tone — `night-950` ground, `night-900/60` panel, `white/[0.03]` inset — separated by hairline `white/10` borders, and most of them carry no shadow at all. Shadow appears only when something is a physical object (a card, a lifted panel) or a light (a CTA, a lit frame), and those two get different treatments.

### Shadow Vocabulary
- **Object weight** (`box-shadow: 0 20px 60px rgba(0,0,0,0.35)`): Panels that float above the page — the AI reading panel, the card detail sheet. Pure black, wide, low.
- **Card weight** (`box-shadow: 0 10px 30px rgba(0,0,0,0.45)`): A single card sitting on the table — every card back in the fan. Tighter and darker than object weight, because a card is small and close.
- **Lifted card** (`box-shadow: 0 16px 40px rgba(0,0,0,0.5)`): A card on hover in the library grid, paired with a `-4px` translate.
- **Gold emission** (`box-shadow: 0 10px 40px rgba(226,189,107,0.3–0.35)`): The primary CTA. This is light leaving the button, not the button floating.
- **Sigil emission** (`box-shadow: 0 0 24px rgba(226,189,107,0.25)`): The 🌙 mark in the header. Symmetric, no offset — it glows in place.

### Named Rules

**The Shadow Or Glow Rule.** An element gets black shadow *or* colored glow, never both. Black means mass; gold means light. An element carrying both is claiming to be a heavy lamp, and it reads as muddy.

**The Hairline Before Shadow Rule.** Reach for a `1px white/10` border before reaching for a shadow. Most panels in this system are separated by tone and hairline alone; adding shadow to a resting panel flattens the ones that have earned it.

## Shapes

Everything is softened; nothing is sharp. Three radius steps carry the whole system: `0.75rem` (12px) for anything card-shaped — the tarot cards themselves, input fields, small insets; `1rem` (16px) for grouped panels and content boxes; `1.5rem` (24px) for the large surfaces that hold a whole section. Anything interactive and inline — buttons, chips, nav links, category pills, the search field — is a full pill (`9999px`).

Borders are hairlines, and their opacity is the whole signal: `white/5` is a structural divider (header, footer), `white/10` is a resting surface edge, `white/15`–`white/20` is a hover or a secondary button, `gold-400/25`–`/40` means the element is lit or actionable, `mystic-400/30`–`/40` means the AI is speaking inside it. Solid, fully-opaque borders do not appear anywhere in this system.

The recurring silhouette is the tarot card itself at `aspect-[350/600]` with 12px corners — repeated in the fan, the library grid, the flip scene, and the detail sheet at four different sizes. The card back's own geometry (a rhombus lattice, two concentric gold rules inset 5px and 9px, a crescent inside two rings, eight radial ticks) is the system's ornamental vocabulary; ornament elsewhere should borrow from it rather than invent.

## Components

### Buttons
- **Shape:** Full pill (`9999px`) in every variant. No exceptions.
- **Primary:** Left-to-right gold gradient (`#c9a227` → `#f0d89b`) with Ink Night text, Trirong at `1.125rem`, `0.75rem 2rem` padding, gold emission shadow. One per view — this is the ritual's forward motion.
- **Hover / Focus:** `brightness(1.1)` on the gradient; `active:scale-95` for a physical press. Transitions are the default `transition` (150ms).
- **Outline:** Transparent with a `gold-400/40` hairline and Pale Gold text; hover fills to `gold-400/10`. The secondary path — "ดูแพ็กคำถาม", "เปิดคลังไพ่", the header's "เริ่มดูดวง".
- **Ghost:** Transparent with a `white/15` hairline and Dim Mist text; hover shifts border to `gold-400/40` and text to Pale Gold. Used where two neutral options sit side by side.
- **Mystic:** Transparent with a `mystic-400/40` hairline and Mystic Violet text; hover fills to `mystic-500/10`. Reserved for AI controls — "อ่านใหม่อีกครั้ง". Never used for a non-AI action.

### Chips
- **Neutral:** `white/5` fill, `white/10` hairline, Dim Mist text at `0.75rem`, full pill. Keyword tags on a card.
- **Gold eyebrow:** `gold-400/10` fill, `gold-400/30` hairline, Pale Gold text, usually opened with `✦`. Marks a status or a count above a heading.
- **Category:** Fill and border derived from the category's own accent at 8% / 27%, text in Dim Mist rising to Moon Mist on hover. Wayfinding only.

### Cards / Containers
- **Corner Style:** `1.5rem` for section-level surfaces, `1rem` for panels inside them, `0.75rem` for card-shaped things.
- **Background:** `night-900/60` for a standalone panel; `white/[0.03]` for an inset inside an already-dark panel; a `night-800/80 → night-900/70` gradient when the panel is the primary one in a group.
- **Border:** `white/10` at rest, `white/20` on hover; `gold-400/25–30` when the panel is the featured one; `mystic-400/30` when it holds AI output.
- **Shadow Strategy:** None at rest. Object weight only when the panel floats over content (see Elevation).
- **Internal Padding:** `1.25rem` on phone, stepping to `1.5rem`–`2rem` at `sm`.
- **Hover:** `-translate-y-1` plus a border brighten. Cards that navigate lift; cards that don't, don't.

### Inputs / Fields
- **Style:** `night-950/60` fill (darker than its container — a well, not a raised surface), `white/10` hairline, `0.75rem` radius, `0.625rem 1rem` padding, Moon Mist text, Faint Mist placeholder at 60%.
- **Focus:** Border to `gold-400/50` plus a `2px` `gold-400/20` ring. No outline, no color shift on the fill. The gold ring is the only focus treatment in the system and it must survive every variant.
- **Error:** Alert Rose message at `0.75rem` below the field; the field itself is not recolored. Focus moves to the first broken field on submit.
- **Label:** Dim Mist at `0.875rem` above the field, with an optional Faint Mist hint inline at `0.75rem`.
- **Search field variant:** Same treatment at full-pill radius with `white/5` fill — the one input that reads as a control rather than a well.

### Navigation
- Sticky, `night-950/70` with `backdrop-blur-md`, separated by a `white/5` hairline. Brand mark left (a 🌙 in a `gold-400/40` ring with sigil emission, over the wordmark in Trirong Pale Gold with a Faint Mist descriptor beneath). Links right: full-pill, Dim Mist, hover to `white/5` fill and Pale Gold text. The last link is an outline button, not a text link.
- **Mobile:** secondary links (ดวงประจำวัน, คลังไพ่) drop out below `sm`; แพ็กคำถาม and เริ่มดูดวง always survive. `whitespace-nowrap` on the nav prevents Thai labels from wrapping mid-word.

### The Card Back (signature)
Drawn as inline SVG so it scales to every size the deck needs. A rhombus lattice at `gold-400` 16% over a `night-700 → night-800 → night-950` diagonal gradient, a `gold-300` radial glow centered at 42% height, two inset gold rules (5px at 50% opacity, 9px at 22%), and a masked crescent inside two concentric rings with eight radial ticks. Six scattered `gold-200` stars at 75%. This is the most-repeated object on the site — it appears 78 times in the fan alone — so it carries the identity more than any single page does. Do not replace it with an image, and do not restyle it per-surface.

### The Deck Fan (signature)
78 face-down cards on a scrolled strip, each rotated on a ±9° arc with a parabolic lift (`norm² × 30px`), z-indexed left to right and raised to `z-60` on hover. Hover/focus lifts a card `-1.75rem` out of the fan; picking it scales to 90% and fades to 0. During shuffle every card sways on a staggered `shuffle-sway` (1.1s, 0.06s steps of 12). This is the product — it is never replaced by a randomize-and-reveal, and never collapsed into a grid.

## Do's and Don'ts

### Do:
- **Do** treat gold as the light in the room: primary action, card frame, section heading, revealed content. Four jobs, no fifth.
- **Do** keep violet exclusively for AI output — the reading panel border, its heading, its controls, the position eyebrow.
- **Do** hold body copy at `1.75` line-height and headings at `1.25`; Thai tone marks need the vertical room.
- **Do** separate surfaces with tone plus a `1px white/10` hairline before considering a shadow.
- **Do** build every layout as one column first; columns appear at `md`/`lg` and nowhere below `640px`.
- **Do** use Trirong for anything with a voice and Noto Sans Thai for anything read at length.
- **Do** give every new motion a `prefers-reduced-motion` path — the global reduce block already covers `animation`/`transition`, so anything driven by JS must opt in itself.
- **Do** keep focus visible as the gold border + `gold-400/20` ring; it is the system's only focus treatment.

### Don't:
- **Don't** use pure black (`#000`) or pure white (`#fff`) as a text or surface color; the ground is `#06040f` and text tops out at `#efeaff`.
- **Don't** put a black shadow and a colored glow on the same element.
- **Don't** let a category accent hue become a text color, a button, or a panel background.
- **Don't** add sparkle, orb, gradient-mesh, or crystal-ball decoration — the starfield and ambient wash are the entire atmospheric budget and they are already spent.
- **Don't** introduce a third typeface, or a square-cornered button.
- **Don't** use solid opaque borders; every border in this system is a white or accent hairline under 50% opacity.
- **Don't** dim text below Faint Mist (`#9184b8`) on the night ground.
- **Don't** compress the ritual for speed — the shuffle, the fan, and the one-at-a-time flip are the product, not loading states.
