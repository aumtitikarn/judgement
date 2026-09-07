# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

คนไทยวัยผู้ใหญ่ทั่วไป เปิดเว็บจากมือถือ มักเป็นตอนกลางคืนและอยู่คนเดียว — Thai adults on a
phone, usually alone and late at night, opening the site because something specific is weighing
on them (a relationship that went quiet, a job decision, money pressure). No tarot knowledge is
assumed: they do not know what the cards mean and do not need to. They arrive with a worry, not
with curiosity about the deck.

The card library (`/cards`) serves the same person after the reading, not a separate scholarly
audience — it is where they go to look up the card they just drew.

## Product Purpose

จันทราไพ่ is a Thai-language tarot site where the visitor draws their own cards and receives a
reading written for their question and their personal details. It exists to give someone carrying
an unresolved worry a moment of structure and reflection — คำทำนายเป็นแง่คิดและกำลังใจ,
explicitly not a fixed prophecy and not medical, legal, or financial advice.

Intended to be a public Thai site with real traffic: found by strangers through search, used by
people who return (the daily card is built for repeat visits), and shared. Success is a stranger
finishing a reading and coming back another night.

## Positioning

**ผู้ใช้เลือกไพ่เอง.** The site does not randomize and reveal. It fans out all 78 cards face-down
and the visitor physically taps the ones that feel right — the same act as choosing from a
reader's spread on a table. Competing Thai tarot sites hand back a pre-rolled result; the drawn
cards here belong to the person who drew them, which is what makes the reading feel like theirs.

Second differentiator: the reading is genuinely personal. Name, birth date/time, and birthplace go
to the model alongside the actual cards drawn and the visitor's own typed question, and the model
reads card by card rather than emitting one generic paragraph.

## Operating Context

Every mode runs the same four-stage ritual, and the pacing is part of the product:
`intro` (details + question) → `shuffling` (สับไพ่) → `picking` (tap cards from the fanned deck)
→ `reading` (cards flip one at a time, base meaning shows, then the AI reading streams in).

Three ways in:

- **เริ่มดูดวง** (`/reading`) — the visitor types their own question, draws 3 cards
  (สถานการณ์ตอนนี้ / สิ่งที่ยังมองไม่เห็น / ทางที่กำลังจะไป).
- **ดูดวงประจำวัน** (`/reading/daily`) — one card, held in `localStorage` until the day ends, so
  the same day always returns the same card. This is the repeat-visit surface.
- **แพ็กคำถาม** (`/packs`) — 71 common questions across 11 categories, split into 23 packs of at
  most 4. **One question = one card**; the AI answers each question with its own card.

Categories: ความรัก · คนเก่า/แฟนเก่า · คนคุยเก่า · การงาน · การเงิน · ธุรกิจและการค้า ·
สุขภาพและใจ · ครอบครัวและคนรอบตัว · การเรียนและเป้าหมายชีวิต · เดินทาง ย้ายบ้าน และการเปลี่ยนแปลง ·
คำถามภาพรวม. Each category declares a `meaningKey` (`general` / `love` / `work` / `money` /
`family`) selecting which facet of each card's meaning feeds the model.

Supporting surface: **คลังไพ่** (`/cards`) — all 78 cards, upright and reversed meanings.

## Capabilities and Constraints

- Next.js 16 (App Router) + React 19 + Tailwind v4, pnpm. Thai fonts: Noto Sans Thai (body),
  Trirong (display).
- **No accounts and no server-side database, ever.** Querent details live only in the visitor's
  own `localStorage` under `chandra-tarot:querent`, and are transmitted only when a reading is
  requested. Any future feature must work without server-side visitor storage.
- **The question is never stored.** It is deliberately outside the `Querent` shape, so the field
  is empty on every return; name and birth details persist.
- **Free with no paywall and no ads.** Every reading, pack, and card meaning stays unmetered.
- `POST /api/reading` takes `{ spread, question?, querent, draws:[{id, reversed}] }` and streams
  `text/plain`. The server rebuilds the spread and card meanings itself from `ref` and `id`,
  trusting no client-supplied text; pack and daily questions are entirely server-side. Rate limit:
  8 requests per minute per IP.
- The model delimits its output with `[[CARD1]]…[[CARDn]]`, `[[SUMMARY]]`, `[[ACTION]]`,
  `[[TIMING]]` so sections stream into the right boxes. If AI is down, unconfigured, or hasn't
  reached a card yet, that card's box falls back to the library meaning — **the site must always
  work without AI**.
- Gemini via `GOOGLE_API_KEY` (`GEMINI_MODEL` default `gemini-3.6-flash`). Without a key,
  everything else still works and the AI box says it isn't configured.
- Reader persona: **จันทรา**, a Thai reader of 20+ years. Warm, direct, plain polite spoken Thai;
  no jargon, no repetition, no greeting, never states it is an AI.
- The model is barred from reading on death, serious illness, or specific medical/legal/investment
  advice; it redirects to feelings and coping and points to a professional.
- **Open decision:** Thai-only is the current state but was not confirmed as a permanent
  commitment. Do not assume other languages are planned; do not assume they are ruled out.

## Brand Commitments

- Name: **จันทราไพ่**. Reader voice: **จันทรา** (see persona above).
- The footer disclaimer is a standing commitment, not decoration: readings are แง่คิดและกำลังใจ,
  not fixed prophecy, and not medical, legal, or investment advice; the decision stays the
  visitor's.
- Attribution to Rider–Waite–Smith and the tarot-json project must remain visible.

## Evidence on Hand

- 78 card images at `public/cards/*.jpg` — Rider–Waite–Smith, public domain in the US; files and
  card list from [tarot-json](https://github.com/equokka/tarot-json) (MIT), license copy at
  `public/cards/LICENSE.txt`.
- All Thai card meanings were written from scratch for this project: `lib/tarot/data/*.ts`, each
  card carrying `keywords`, `general`, `love`, `work`, `money`, `family`, `advice` in both
  upright and reversed directions.
- 71 real questions in `lib/tarot/packs.ts`, grouped and split by `toPacks()`.
- **Absent — never fabricate:** no users, traffic numbers, testimonials, reviews, ratings,
  accuracy claims, press, partners, pricing, or credentials for จันทรา as a real person. There is
  no analytics, no launch date, and no user count to cite.

## Product Principles

1. **The visitor's hand chooses.** Never auto-randomize and reveal. The fan of 78, the shuffle,
   and the tap are the product, not a loading screen to optimize away.
2. **Nothing about the visitor leaves their device unasked.** No accounts, no server storage, no
   stored questions. Privacy is a design constraint, not a policy page.
3. **The ritual has a tempo.** intro → shuffle → pick → flip is deliberately paced; speed is not
   the goal on this surface.
4. **Comfort without false certainty.** Readings offer perspective and steadiness, never verdicts
   on health, death, law, or money. The decision stays the visitor's.
5. **Degrade to something still worth reading.** With no API key, a dead model, or a slow stream,
   the library meanings must carry the experience on their own.

## Accessibility & Inclusion

- Phone-first and one-handed: the primary session is a small screen at night. The 78-card fan and
  the reading must be fully usable at that size.
- `prefers-reduced-motion` is already honored globally — the ambient float/twinkle/glow, the card
  flip, and the shuffle sway all reduce. Any new motion must do the same.
- Dark-only (`color-scheme: dark`) suits the late-night context; contrast on the dark ground is a
  standing requirement, not an afterthought.
- Thai typography: `lang="th"` with Thai-subset fonts. Line-height and letter-spacing must respect
  Thai ascenders/descenders — Latin-tuned tracking breaks Thai text.
