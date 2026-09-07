import type { Metadata } from "next";
import Link from "next/link";

import { PACK_CATEGORIES, TOTAL_PACKS, TOTAL_QUESTIONS } from "@/lib/tarot/packs";

export const metadata: Metadata = {
  title: "แพ็กคำถาม — เลือกหมวดที่อยากรู้",
  description: `แพ็กคำถามดูดวงครบทุกหมวด ${TOTAL_QUESTIONS} คำถาม แบ่งเป็น ${TOTAL_PACKS} ชุด ชุดละไม่เกิน 4 ข้อ`,
};

export default function PacksPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 pb-24 pt-10">
      <header>
        <Link href="/" className="text-sm text-mist-500 transition hover:text-gold-200">
          ← กลับหน้าแรก
        </Link>
        <h1 className="mt-4 font-display text-3xl text-gold-200 sm:text-4xl">แพ็กคำถาม</h1>
        <p className="mt-3 max-w-2xl leading-relaxed text-mist-300">
          คำถามที่คนถามบ่อยที่สุด {TOTAL_QUESTIONS} ข้อ แบ่งเป็น {TOTAL_PACKS} ชุด ชุดละไม่เกิน 4 ข้อ
          เลือกชุดที่ใช่ แล้วเปิดไพ่ข้อละหนึ่งใบ AI จะตอบให้ทีละข้อจากไพ่ที่คุณเลือกเอง
        </p>
      </header>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {PACK_CATEGORIES.map((category) => (
          <Link
            key={category.slug}
            href={`/packs/${category.slug}`}
            className="group flex flex-col rounded-3xl border border-line bg-night-900/60 p-6 transition hover:-translate-y-1 hover:border-line-strong hover:bg-night-850/70"
          >
            <div className="flex items-center gap-3">
              <span
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl"
                style={{
                  backgroundColor: `${category.accent}1f`,
                  border: `1px solid ${category.accent}55`,
                }}
              >
                {category.emoji}
              </span>
              <div className="min-w-0">
                <h2 className="font-display text-xl text-mist-100">{category.label}</h2>
                <p className="text-xs text-mist-500">{category.tagline}</p>
              </div>
            </div>

            <ul className="mt-4 flex-1 space-y-1.5">
              {category.packs.map((pack) => (
                <li key={pack.slug} className="flex gap-2 text-xs text-mist-500">
                  <span className="font-display" style={{ color: category.accent }}>
                    ✦
                  </span>
                  {pack.label} · {pack.questions.length} คำถาม
                </li>
              ))}
            </ul>

            <span className="mt-5 inline-block text-sm text-gold-300 transition group-hover:translate-x-1">
              เลือกชุดคำถาม →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
