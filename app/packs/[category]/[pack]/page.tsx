import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ReadingRoom } from "@/components/tarot/reading-room";
import { PACK_CATEGORIES } from "@/lib/tarot/packs";
import { spreadOfCategory } from "@/lib/tarot/spread";

export function generateStaticParams() {
  return PACK_CATEGORIES.flatMap((item) =>
    item.packs.map((pack) => ({ category: item.slug, pack: pack.slug })),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/packs/[category]/[pack]">): Promise<Metadata> {
  const { category, pack } = await params;
  const spread = spreadOfCategory(category, pack);
  if (!spread) return { title: "ไม่พบหน้านี้" };

  return { title: `${spread.label} — แพ็กคำถาม`, description: spread.description };
}

export default async function PackReadingPage({ params }: PageProps<"/packs/[category]/[pack]">) {
  const { category, pack } = await params;
  const spread = spreadOfCategory(category, pack);
  if (!spread) notFound();

  return (
    <ReadingRoom
      spread={spread}
      backHref={`/packs/${category}`}
      backLabel="กลับไปเลือกชุดคำถาม"
    />
  );
}
