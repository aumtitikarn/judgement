import type { Metadata } from "next";
import Link from "next/link";

import { CardLibrary } from "@/components/tarot/card-library";
import { DECK } from "@/lib/tarot/deck";

export const metadata: Metadata = {
  title: "คลังไพ่ทาโรต์ 78 ใบ",
  description:
    "ความหมายไพ่ทาโรต์ทั้ง 78 ใบ ทั้งแบบหงายและกลับหัว แยกตามเรื่องความรัก การงาน การเงิน และครอบครัว",
};

export default function CardsPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 pb-24 pt-10">
      <header>
        <Link href="/" className="text-sm text-mist-500 transition hover:text-gold-200">
          ← กลับหน้าแรก
        </Link>
        <h1 className="mt-4 font-display text-3xl text-gold-200 sm:text-4xl">
          คลังไพ่ทั้ง {DECK.length} ใบ
        </h1>
        <p className="mt-2 max-w-2xl leading-relaxed text-mist-300">
          เปิดดูความหมายของไพ่แต่ละใบได้ทุกเมื่อ ทั้งความหมายเมื่อออกหงายและกลับหัว
          แยกตามเรื่องที่คนถามบ่อยที่สุด
        </p>
      </header>

      <div className="mt-10">
        <CardLibrary />
      </div>
    </div>
  );
}
