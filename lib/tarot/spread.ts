import { CATEGORY_BY_SLUG, findPack, type PackCategory, type QuestionPack } from "./packs";
import type { MeaningKey } from "./types";

export type ReadingMode = "custom" | "daily" | "pack";

export interface SpreadSlot {
  /** ชื่อตำแหน่งในสเปรด หรือคำถามของแพ็ก */
  title: string;
  hint: string;
}

export interface Spread {
  mode: ReadingMode;
  /** ตัวอ้างอิงที่ส่งให้ API เพื่อให้เซิร์ฟเวอร์ประกอบสเปรดเดิมขึ้นมาเองได้ */
  ref: string;
  href: string;
  emoji: string;
  label: string;
  tagline: string;
  description: string;
  accent: string;
  meaningKey: MeaningKey;
  slots: SpreadSlot[];
  /** โหมดที่ผู้ใช้ต้องพิมพ์คำถามเอง */
  needsQuestion: boolean;
}

export const CUSTOM_SPREAD: Spread = {
  mode: "custom",
  ref: "custom",
  href: "/reading",
  emoji: "🔮",
  label: "ถามคำถามของคุณเอง",
  tagline: "หนึ่งคำถาม สามใบ หนึ่งคำตอบ",
  description:
    "พิมพ์เรื่องที่ค้างคาใจลงไปตรง ๆ แล้วเปิดไพ่ 3 ใบ เพื่อดูสถานการณ์จริง สิ่งที่ยังมองไม่เห็น และทางที่กำลังจะไป",
  accent: "#c9a227",
  meaningKey: "general",
  needsQuestion: true,
  slots: [
    { title: "สถานการณ์ตอนนี้", hint: "จุดที่คุณยืนอยู่จริง ๆ ในเรื่องที่ถาม" },
    { title: "สิ่งที่ยังมองไม่เห็น", hint: "สิ่งที่ซ่อนอยู่ หรือมุมที่คุณอาจมองข้าม" },
    { title: "ทางที่กำลังจะไป", hint: "แนวโน้มถ้ายังเดินแบบนี้ต่อไป" },
  ],
};

export const DAILY_SPREAD: Spread = {
  mode: "daily",
  ref: "daily",
  href: "/reading/daily",
  emoji: "🌙",
  label: "ดูดวงประจำวัน",
  tagline: "ไพ่หนึ่งใบสำหรับวันนี้",
  description:
    "เปิดไพ่หนึ่งใบเพื่อดูพลังงานหลักของวัน สิ่งที่ควรระวัง และคำแนะนำสั้น ๆ ที่ใช้ได้ทันที",
  accent: "#e2bd6b",
  meaningKey: "general",
  needsQuestion: false,
  slots: [{ title: "พลังของวันนี้", hint: "สิ่งที่กำลังนำทางวันนี้ของคุณ" }],
};

/** คำถามประจำวันที่ส่งให้ AI เมื่อผู้ใช้ไม่ได้พิมพ์เอง */
export const DAILY_QUESTION = "วันนี้ของฉันจะเป็นอย่างไร และควรระวังอะไรเป็นพิเศษ";

export const packRef = (categorySlug: string, packSlug: string) =>
  `pack:${categorySlug}:${packSlug}`;

export function packSpread(category: PackCategory, pack: QuestionPack): Spread {
  return {
    mode: "pack",
    ref: packRef(category.slug, pack.slug),
    href: `/packs/${category.slug}/${pack.slug}`,
    emoji: category.emoji,
    label: `${category.label} · ${pack.label}`,
    tagline: category.tagline,
    description: `เปิดไพ่ ${pack.questions.length} ใบ ใบละหนึ่งคำถาม แล้วให้ AI ตอบทีละข้อจากไพ่ที่คุณเลือกเอง`,
    accent: category.accent,
    meaningKey: category.meaningKey,
    needsQuestion: false,
    slots: pack.questions.map((question) => ({
      title: question,
      hint: "ไพ่ใบนี้ตอบคำถามข้อนี้โดยเฉพาะ",
    })),
  };
}

/** ประกอบสเปรดกลับจาก ref ใช้ได้ทั้งฝั่งหน้าเว็บและฝั่ง API */
export function resolveSpread(ref: string): Spread | null {
  if (ref === CUSTOM_SPREAD.ref) return CUSTOM_SPREAD;
  if (ref === DAILY_SPREAD.ref) return DAILY_SPREAD;

  const [prefix, categorySlug, packSlug] = ref.split(":");
  if (prefix !== "pack" || !categorySlug || !packSlug) return null;

  const found = findPack(categorySlug, packSlug);
  return found ? packSpread(found.category, found.pack) : null;
}

export const spreadOfCategory = (categorySlug: string, packSlug: string) => {
  const category = CATEGORY_BY_SLUG.get(categorySlug);
  const pack = category?.packs.find((item) => item.slug === packSlug);
  return category && pack ? packSpread(category, pack) : null;
};
