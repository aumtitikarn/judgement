import type { CardSeed, Meaning } from "./types";

/**
 * ตัวช่วยเขียนข้อมูลไพ่แบบสั้น ลำดับอาร์กิวเมนต์คือ
 * m(keywords, general, love, work, money, family, advice)
 * keywords คั่นด้วย "/"
 */
export const m = (
  keywords: string,
  general: string,
  love: string,
  work: string,
  money: string,
  family: string,
  advice: string,
): Meaning => ({ keywords: keywords.split("/"), general, love, work, money, family, advice });

/** c(id, ชื่ออังกฤษ, ชื่อไทย, เลขไพ่, ความหมายตั้งตรง, ความหมายกลับหัว) */
export const c = (
  id: string,
  name: string,
  nameTh: string,
  number: number,
  upright: Meaning,
  reversed: Meaning,
): CardSeed => ({ id, name, nameTh, number, upright, reversed });
