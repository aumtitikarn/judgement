export type SuitKey = "major" | "cups" | "swords" | "wands" | "pentacles";

/** ความหมายของไพ่ถูกเขียนไว้ 5 ด้าน หมวดคำถามแต่ละหมวดจะเลือกใช้ด้านที่ตรงที่สุด */
export type MeaningKey = "general" | "love" | "work" | "money" | "family";

/** ความหมายของไพ่หนึ่งใบในทิศทางเดียว (ตั้งตรง หรือ กลับหัว) */
export interface Meaning {
  keywords: string[];
  /** ภาพรวม ใช้กับการดูดวงประจำวันด้วย */
  general: string;
  love: string;
  work: string;
  money: string;
  family: string;
  advice: string;
}

export interface CardSeed {
  id: string;
  name: string;
  nameTh: string;
  number: number;
  upright: Meaning;
  reversed: Meaning;
}

export interface TarotCard extends CardSeed {
  arcana: "major" | "minor";
  suit: SuitKey;
  image: string;
}

/** ไพ่ที่ถูกเปิดแล้ว: ใบไหน หงายหรือกลับหัว อยู่ตำแหน่งใดในสเปรด */
export interface DrawnCard {
  card: TarotCard;
  reversed: boolean;
  position: string;
  positionHint: string;
}
