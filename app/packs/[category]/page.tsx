import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CATEGORY_BY_SLUG, PACK_CATEGORIES } from "@/lib/tarot/packs";

export function generateStaticParams() {
  return PACK_CATEGORIES.map((item) => ({ category: item.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/packs/[category]">): Promise<Metadata> {
  const { category } = await params;
  const found = CATEGORY_BY_SLUG.get(category);
  if (!found) return { title: "ไม่พบหน้านี้" };

  return {
    title: `แพ็กคำถาม${found.label} — ${found.tagline}`,
    description: found.packs.flatMap((pack) => pack.questions).join(" · "),
  };
}

export default async function CategoryPage({ params }: PageProps<"/packs/[category]">) {
  const { category } = await params;
  const found = CATEGORY_BY_SLUG.get(category);
  if (!found) notFound();

  return (
    <div className="mx-auto w-full max-w-4xl px-5 pb-24 pt-10">
      <header className="text-center">
        <Link href="/packs" className="text-sm text-mist-500 transition hover:text-gold-200">
          ← กลับไปเลือกหมวด
        </Link>
        <div className="mt-4 text-4xl" aria-hidden="true">
          {found.emoji}
        </div>
        <h1 className="mt-2 font-display text-3xl text-gold-200 sm:text-4xl">{found.label}</h1>
        <p className="mt-2 text-mist-300">{found.tagline}</p>
        <p className="mt-4 text-sm text-mist-500">
          เลือกหนึ่งชุด แล้วเปิดไพ่ข้อละหนึ่งใบ
        </p>
      </header>

      <div className="mt-10 space-y-5">
        {found.packs.map((pack) => (
          <Link
            key={pack.slug}
            href={`/packs/${found.slug}/${pack.slug}`}
            className="group block rounded-3xl border border-line bg-night-900/60 p-6 transition hover:border-line-strong hover:bg-night-850/70 sm:p-7"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-xl" style={{ color: found.accent }}>
                {pack.label}
              </h2>
              <span className="rounded-full border border-line bg-inset-strong px-3 py-1 text-xs text-mist-300">
                เปิดไพ่ {pack.questions.length} ใบ
              </span>
            </div>

            <ol className="mt-4 space-y-2">
              {pack.questions.map((question, index) => (
                <li key={question} className="flex gap-3 text-sm leading-relaxed text-mist-300">
                  <span className="font-display text-mist-500">{index + 1}</span>
                  {question}
                </li>
              ))}
            </ol>

            <span className="mt-5 inline-block text-sm text-gold-300 transition group-hover:translate-x-1">
              เริ่มเปิดไพ่ชุดนี้ →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
