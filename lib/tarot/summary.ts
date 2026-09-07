import type { DrawnCard, SuitKey } from "./types";

const SUIT_NOTE: Record<SuitKey, string> = {
  major: "ไพ่อาร์คานาใหญ่เด่นในการเปิดครั้งนี้ แปลว่าเรื่องนี้ไม่ใช่เรื่องเล็ก แต่เป็นบทเรียนใหญ่ที่ชีวิตกำลังพาคุณผ่าน",
  cups: "พลังธาตุน้ำเด่น เรื่องนี้ตัดสินกันที่ความรู้สึกและความสัมพันธ์มากกว่าเหตุผล",
  swords: "พลังธาตุลมเด่น กุญแจของเรื่องนี้อยู่ที่ความคิดและการสื่อสาร พูดให้ชัดแล้วจะคลี่ได้เร็ว",
  wands: "พลังธาตุไฟเด่น เรื่องนี้ต้องการการลงมือและความกล้ามากกว่าการรอ",
  pentacles: "พลังธาตุดินเด่น เรื่องนี้เกี่ยวกับสิ่งที่จับต้องได้ ทั้งเงิน งาน และความมั่นคง",
};

/** สรุปภาพรวมของการเปิดไพ่จากสัดส่วนไพ่ที่ออกมา */
export function buildSummary(draws: DrawnCard[]): string[] {
  if (draws.length === 0) return [];

  const lines: string[] = [];
  const reversedCount = draws.filter((draw) => draw.reversed).length;
  const majorCount = draws.filter((draw) => draw.card.arcana === "major").length;

  const tally = new Map<SuitKey, number>();
  for (const draw of draws) {
    tally.set(draw.card.suit, (tally.get(draw.card.suit) ?? 0) + 1);
  }
  const [dominantSuit, dominantCount] = [...tally.entries()].sort((a, b) => b[1] - a[1])[0];

  if (majorCount === draws.length && draws.length > 1) {
    lines.push("ออกไพ่อาร์คานาใหญ่ทั้งหมด ช่วงนี้เป็นจังหวะเปลี่ยนผ่านครั้งสำคัญของชีวิตคุณจริง ๆ");
  } else if (majorCount > 0) {
    lines.push(SUIT_NOTE.major);
  } else if (dominantCount > 1) {
    lines.push(SUIT_NOTE[dominantSuit]);
  }

  if (reversedCount === 0) {
    lines.push("ไพ่ออกหงายทั้งหมด พลังงานกำลังไหลไปข้างหน้าอย่างเปิดเผย สิ่งที่เห็นคือสิ่งที่เป็น");
  } else if (reversedCount === draws.length) {
    lines.push("ไพ่กลับหัวทั้งหมด มีบางอย่างที่ยังติดขัดหรือถูกเก็บไว้ข้างใน ลองหันกลับไปดูต้นเหตุก่อนเดินต่อ");
  } else {
    lines.push(
      `มีไพ่กลับหัว ${reversedCount} ใบจาก ${draws.length} ใบ แปลว่าบางส่วนของเรื่องนี้ยังต้องปรับ แต่ไม่ได้ตันทั้งหมด`,
    );
  }

  return lines;
}
