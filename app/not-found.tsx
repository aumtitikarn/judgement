import Link from "next/link";

import { CardBack } from "@/components/tarot/card-back";

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center px-5 py-24 text-center">
      <div className="h-40 w-24 animate-float sm:h-52 sm:w-32">
        <CardBack />
      </div>
      <h1 className="mt-8 font-display text-3xl text-gold-200">ไม่พบหน้าที่คุณตามหา</h1>
      <p className="mt-3 text-mist-300">
        ไพ่ใบนี้ยังคว่ำอยู่ ลองกลับไปเริ่มใหม่ที่หน้าแรกแล้วเลือกเรื่องที่อยากรู้อีกครั้ง
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full border border-gold-400/40 px-6 py-3 font-display text-gold-200 transition hover:bg-gold-400/10"
      >
        กลับหน้าแรก
      </Link>
    </div>
  );
}
