import Link from "next/link";

import { CardBack } from "@/components/tarot/card-back";
import { DECK, SUITS } from "@/lib/tarot/deck";
import { PACK_CATEGORIES, TOTAL_PACKS, TOTAL_QUESTIONS } from "@/lib/tarot/packs";
import { CUSTOM_SPREAD, DAILY_SPREAD } from "@/lib/tarot/spread";

const FLOWS = [
  {
    href: CUSTOM_SPREAD.href,
    emoji: CUSTOM_SPREAD.emoji,
    label: "เริ่มดูดวง",
    tagline: "พิมพ์คำถามของคุณเอง",
    detail: "ไม่ต้องเลือกหมวด พิมพ์เรื่องที่ค้างคาใจลงไปตรง ๆ แล้วเปิดไพ่ 3 ใบ",
    cta: "ถามเลย",
    accent: "#c9a227",
    primary: true,
  },
  {
    href: DAILY_SPREAD.href,
    emoji: DAILY_SPREAD.emoji,
    label: "ดูดวงประจำวัน",
    tagline: "ไพ่หนึ่งใบสำหรับวันนี้",
    detail: "พลังงานหลักของวัน สิ่งที่ควรระวัง และคำแนะนำสั้น ๆ ที่ใช้ได้ทันที",
    cta: "เปิดไพ่วันนี้",
    accent: "#e2bd6b",
    primary: false,
  },
  {
    href: "/packs",
    emoji: "🗂️",
    label: "แพ็กคำถาม",
    tagline: `ครบทุกหมวด ${TOTAL_QUESTIONS} คำถาม`,
    detail: `${PACK_CATEGORIES.length} หมวด แบ่งเป็น ${TOTAL_PACKS} ชุด ชุดละไม่เกิน 4 ข้อ เปิดไพ่ข้อละหนึ่งใบ`,
    cta: "เลือกแพ็ก",
    accent: "#8f7ae6",
    primary: false,
  },
];

const STEPS = [
  { title: "เลือกวิธีถาม", detail: "พิมพ์คำถามเอง ดูดวงประจำวัน หรือหยิบแพ็กคำถามสำเร็จรูป" },
  { title: "ตั้งจิตแล้วสับไพ่", detail: "กรอกชื่อและวันเวลาเกิดสั้น ๆ แล้วกดสับไพ่ทั้งสำรับ 78 ใบ" },
  { title: "เลือกไพ่ด้วยตัวเอง", detail: "แตะไพ่ที่รู้สึกว่าใช่ ไม่มีการสุ่มให้ คุณคือคนหยิบไพ่ของตัวเอง" },
];

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 pb-24">
      <section className="grid items-center gap-10 py-14 md:grid-cols-[1.15fr_1fr] md:py-20">
        <div className="animate-rise">
          <p className="inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-400/10 px-4 py-1.5 text-xs text-gold-200">
            ✦ ไพ่ทาโรต์ครบทั้ง {DECK.length} ใบ พร้อมคำทำนายภาษาไทย
          </p>
          <h1 className="mt-6 font-display text-4xl leading-tight text-mist-100 sm:text-5xl">
            เปิดไพ่ด้วยมือของคุณเอง
            <span className="block text-gold-200">แล้วฟังสิ่งที่ใจอยากบอก</span>
          </h1>
          <p className="mt-5 max-w-xl leading-relaxed text-mist-300">
            Judgement ไม่สุ่มไพ่ให้คุณ แต่กางสำรับทั้ง 78 ใบให้คุณเลือกเอง
            แล้วให้ AI อ่านไพ่ทีละใบตามคำถามและข้อมูลของคุณโดยเฉพาะ
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={CUSTOM_SPREAD.href}
              className="rounded-full bg-linear-to-r from-gold-500 to-gold-300 px-7 py-3 font-display text-lg text-night-950 shadow-[var(--shadow-emission)] transition hover:brightness-110 active:scale-95"
            >
              🔮 เริ่มดูดวง
            </Link>
            <Link
              href="/packs"
              className="rounded-full border border-line-strong px-7 py-3 font-display text-lg text-mist-100 transition hover:border-gold-400/40 hover:text-gold-200"
            >
              ดูแพ็กคำถาม
            </Link>
          </div>
        </div>

        <div className="relative mx-auto flex h-72 w-full max-w-sm items-center justify-center sm:h-96">
          {[-18, -6, 6, 18].map((angle, index) => (
            <div
              key={angle}
              className="absolute h-48 w-28 origin-bottom sm:h-64 sm:w-40"
              style={{
                transform: `rotate(${angle}deg) translateY(${Math.abs(angle) * 0.6}px)`,
                zIndex: index,
              }}
            >
              <div
                className="h-full w-full animate-float"
                style={{ animationDelay: `${index * 0.4}s` }}
              >
                <CardBack />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="start" className="scroll-mt-24 py-6">
        <h2 className="font-display text-2xl text-gold-200 sm:text-3xl">อยากดูแบบไหน</h2>
        <p className="mt-2 text-mist-300">เลือกได้ 3 แบบ ทุกแบบคุณเป็นคนหยิบไพ่เอง</p>

        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          {FLOWS.map((flow) => (
            <Link
              key={flow.href}
              href={flow.href}
              className={`group flex flex-col rounded-3xl p-6 transition hover:-translate-y-1 sm:p-7 ${
                flow.primary
                  ? "border border-gold-400/30 bg-linear-to-br from-night-800/80 to-night-900/70 hover:border-gold-400/60"
                  : "border border-line bg-night-900/60 hover:border-line-strong hover:bg-night-850/70"
              }`}
            >
              <span
                className="flex h-14 w-14 items-center justify-center rounded-2xl text-3xl"
                style={{
                  backgroundColor: `${flow.accent}1f`,
                  border: `1px solid ${flow.accent}55`,
                }}
              >
                {flow.emoji}
              </span>
              <h3 className="mt-4 font-display text-2xl text-mist-100">{flow.label}</h3>
              <p className="text-sm" style={{ color: flow.accent }}>
                {flow.tagline}
              </p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-mist-300">{flow.detail}</p>
              <span className="mt-5 inline-block font-display text-gold-300 transition group-hover:translate-x-1">
                {flow.cta} →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="py-14">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="font-display text-2xl text-gold-200 sm:text-3xl">หมวดในแพ็กคำถาม</h2>
          <Link href="/packs" className="text-sm text-gold-300 transition hover:text-gold-200">
            ดูทั้งหมด →
          </Link>
        </div>
        <div className="mt-5 flex flex-wrap gap-2.5">
          {PACK_CATEGORIES.map((category) => (
            <Link
              key={category.slug}
              href={`/packs/${category.slug}`}
              className="rounded-full border px-4 py-2 text-sm text-mist-300 transition hover:text-mist-100"
              style={{
                borderColor: `${category.accent}44`,
                backgroundColor: `${category.accent}14`,
              }}
            >
              <span className="mr-1.5" aria-hidden="true">
                {category.emoji}
              </span>
              {category.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="py-6">
        <h2 className="font-display text-2xl text-gold-200 sm:text-3xl">เปิดไพ่อย่างไร</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {STEPS.map((step, index) => (
            <div key={step.title} className="rounded-2xl border border-line bg-inset p-5">
              <span className="font-display text-3xl text-gold-400/70">0{index + 1}</span>
              <h3 className="mt-2 font-display text-lg text-mist-100">{step.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-mist-300">{step.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-3xl border border-line bg-night-900/50 p-6 sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl text-gold-200">สำรับไรเดอร์–เวต ครบ 78 ใบ</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-mist-300">
              ทุกใบมีคำอธิบายทั้งแบบหงายและกลับหัว แยกตามเรื่องความรัก การงาน การเงิน ครอบครัว
              พร้อมคำแนะนำสั้น ๆ ที่นำไปใช้ได้จริง
            </p>
          </div>
          <Link
            href="/cards"
            className="rounded-full border border-gold-400/40 px-6 py-2.5 text-gold-200 transition hover:bg-gold-400/10"
          >
            เปิดคลังไพ่
          </Link>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-5">
          {SUITS.map((suit) => (
            <div key={suit.key} className="rounded-2xl border border-line bg-inset p-4">
              <p className="font-display text-lg text-mist-100">{suit.label}</p>
              <p className="text-xs text-gold-300">ธาตุ{suit.element}</p>
              <p className="mt-2 text-xs leading-relaxed text-mist-500">{suit.about}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
