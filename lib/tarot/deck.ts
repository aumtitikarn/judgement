import { major } from "./data/major";
import { cups } from "./data/cups";
import { swords } from "./data/swords";
import { wands } from "./data/wands";
import { pentacles } from "./data/pentacles";
import type { CardSeed, MeaningKey, SuitKey, TarotCard } from "./types";

const build = (seeds: CardSeed[], suit: SuitKey): TarotCard[] =>
  seeds.map((seed) => ({
    ...seed,
    suit,
    arcana: suit === "major" ? "major" : "minor",
    image: `/cards/${seed.id}.jpg`,
  }));

export const DECK: TarotCard[] = [
  ...build(major, "major"),
  ...build(cups, "cups"),
  ...build(swords, "swords"),
  ...build(wands, "wands"),
  ...build(pentacles, "pentacles"),
];

export const CARD_BY_ID = new Map(DECK.map((card) => [card.id, card]));

export const SUITS: { key: SuitKey; label: string; element: string; about: string }[] = [
  { key: "major", label: "อาร์คานาใหญ่", element: "โชคชะตา", about: "บทเรียนใหญ่ของชีวิตและจุดเปลี่ยนสำคัญ" },
  { key: "cups", label: "ถ้วย", element: "น้ำ", about: "อารมณ์ ความรู้สึก และความสัมพันธ์" },
  { key: "swords", label: "ดาบ", element: "ลม", about: "ความคิด การสื่อสาร และความจริง" },
  { key: "wands", label: "ไม้เท้า", element: "ไฟ", about: "แรงบันดาลใจ การลงมือ และพลังชีวิต" },
  { key: "pentacles", label: "เหรียญ", element: "ดิน", about: "การเงิน การงาน และความมั่นคง" },
];

export const SUIT_LABEL: Record<SuitKey, string> = {
  major: "อาร์คานาใหญ่",
  cups: "ชุดถ้วย",
  swords: "ชุดดาบ",
  wands: "ชุดไม้เท้า",
  pentacles: "ชุดเหรียญ",
};

/** สลับไพ่แบบ Fisher-Yates โดยใช้ตัวสุ่มของเบราว์เซอร์เมื่อมี */
export function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  const random = () => {
    if (typeof crypto !== "undefined" && crypto.getRandomValues) {
      const buffer = new Uint32Array(1);
      crypto.getRandomValues(buffer);
      return buffer[0] / 4294967296;
    }
    return Math.random();
  };
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** โอกาสที่ไพ่จะออกแบบกลับหัว */
export const REVERSED_CHANCE = 0.4;

export function meaningOf(card: TarotCard, reversed: boolean) {
  return reversed ? card.reversed : card.upright;
}

export function readingText(card: TarotCard, reversed: boolean, key: MeaningKey) {
  return meaningOf(card, reversed)[key];
}
