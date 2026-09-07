import Link from "next/link";

import { BrandMark } from "@/components/brand-mark";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-line-faint bg-night-950/70 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-4">
        <Link href="/" className="group flex items-center gap-3">
          <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold-400/40 bg-night-800 text-gold-300 shadow-[var(--shadow-sigil)] transition group-hover:text-gold-200">
            <BrandMark className="h-6 w-6" />
          </span>
          {/* บนมือถือเหลือแค่ตรา เพื่อเว้นที่ให้ลิงก์กับปุ่มสลับธีมในแถวเดียวกัน */}
          <span className="hidden leading-tight sm:block">
            <span className="block font-display text-lg tracking-wide text-gold-200 transition group-hover:text-gold-300">
              Judgement
            </span>
            <span className="block text-xs text-mist-500">ไพ่ทาโรต์ออนไลน์</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1 text-sm whitespace-nowrap sm:gap-2">
          <Link
            href="/reading/daily"
            className="hidden rounded-full px-3 py-2 text-mist-300 transition hover:bg-inset-strong hover:text-gold-200 sm:block"
          >
            ดวงประจำวัน
          </Link>
          <Link
            href="/packs"
            className="rounded-full px-3 py-2 text-mist-300 transition hover:bg-inset-strong hover:text-gold-200"
          >
            แพ็กคำถาม
          </Link>
          <Link
            href="/cards"
            className="hidden rounded-full px-3 py-2 text-mist-300 transition hover:bg-inset-strong hover:text-gold-200 sm:block"
          >
            คลังไพ่
          </Link>
          <ThemeToggle />
          <Link
            href="/reading"
            className="rounded-full border border-gold-400/40 px-3 py-2 text-gold-200 transition hover:bg-gold-400/10"
          >
            เริ่มดูดวง
          </Link>
        </nav>
      </div>
    </header>
  );
}
