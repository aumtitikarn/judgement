/** ส่วนต่าง ๆ ของคำทำนายที่ AI ส่งกลับมา คั่นด้วยเครื่องหมาย [[...]] */
export interface AiSections {
  /** คำแปลไพ่ทีละใบ เรียงตามตำแหน่งในสเปรด */
  cards: string[];
  summary: string;
  action: string;
  timing: string;
}

export const EMPTY_SECTIONS: AiSections = { cards: [], summary: "", action: "", timing: "" };

/**
 * ยอมรับเครื่องหมายหลายรูปแบบเท่าที่โมเดลอาจเขียนมา เช่น [CARD 1], [[card1]], [[ SUMMARY ]]
 * ถ้าจับไม่ได้สักอัน ข้อความจะไปโผล่ที่กล่องสรุปแทนที่จะหายไปทั้งก้อน
 */
const MARKER_SOURCE = String.raw`\[{1,2}\s*(CARD\s*\d{1,2}|SUMMARY|ACTION|TIMING)\s*\]{1,2}`;
const MARKER = new RegExp(MARKER_SOURCE, "gi");

const normalizeTag = (raw: string) => raw.toUpperCase().replace(/\s+/g, "");

/** สัญลักษณ์มาร์กดาวน์ที่โมเดลชอบแปะรอบหัวข้อ ไม่มีความหมายเมื่อเหลืออยู่ลำพัง */
const DECORATION = /^[\s*#:_~\-–—]+$/;

/** ตัดสัญลักษณ์ที่ค้างอยู่หัวและท้ายของแต่ละส่วนออก */
const cleanBody = (body: string) =>
  stripMarkers(body)
    .replace(/^[\s*#:_~\-–—]+/, "")
    .replace(/[\s*#:_~]+$/, "")
    .trim();

/** กันเครื่องหมายหลุดไปโผล่บนหน้าจอ ใช้เป็นด่านสุดท้ายก่อนเรนเดอร์เสมอ */
export function stripMarkers(text: string): string {
  return text.replace(new RegExp(MARKER_SOURCE, "gi"), "");
}

/**
 * แยกข้อความที่สตรีมมาเป็นส่วน ๆ ทำงานกับข้อความที่ยังมาไม่ครบได้
 * (ส่วนสุดท้ายจะค่อย ๆ ยาวขึ้นระหว่างสตรีม)
 */
export function parseSections(text: string, cardCount: number): AiSections {
  const result: AiSections = {
    cards: new Array<string>(cardCount).fill(""),
    summary: "",
    action: "",
    timing: "",
  };
  if (!text.trim()) return { ...result, cards: [] };

  const matches = [...text.matchAll(MARKER)];
  // โมเดลไม่ทำตามรูปแบบเลย ยังดีกว่าปล่อยให้ผู้ใช้เห็นกล่องว่าง
  if (matches.length === 0) return { ...result, cards: [], summary: cleanBody(text) };

  matches.forEach((match, index) => {
    const start = (match.index ?? 0) + match[0].length;
    const end = index + 1 < matches.length ? matches[index + 1].index : text.length;
    const body = cleanBody(text.slice(start, end));
    const tag = normalizeTag(match[1]);

    if (tag.startsWith("CARD")) {
      const position = Number(tag.slice(4)) - 1;
      if (position >= 0 && position < cardCount) result.cards[position] = body;
    } else if (tag === "SUMMARY") result.summary = body;
    else if (tag === "ACTION") result.action = body;
    else if (tag === "TIMING") result.timing = body;
  });

  return result;
}

/** ตัดข้อความยาวเป็นย่อหน้า และแยกบรรทัดที่ขึ้นต้นด้วย '- ' ออกมาเป็นรายการ */
export function toLines(body: string): { kind: "bullet" | "paragraph"; text: string }[] {
  return stripMarkers(body)
    .split("\n")
    .map((line) => line.trim())
    // บรรทัดที่เหลือแต่สัญลักษณ์ (เช่น '##' ที่เคยครอบเครื่องหมายไว้) ไม่ต้องแสดง
    .filter((line) => line.length > 0 && !DECORATION.test(line))
    .map((line) =>
      line.startsWith("- ") || line.startsWith("• ")
        ? { kind: "bullet" as const, text: line.slice(2).trim() }
        : { kind: "paragraph" as const, text: line },
    );
}

/** ตัด ** ** ที่โมเดลอาจใส่มา คืนเป็นชิ้นส่วนสลับ ปกติ/เน้น */
export function splitBold(text: string): { bold: boolean; text: string }[] {
  return text
    .split(/\*\*(.+?)\*\*/g)
    .map((part, index) => ({ bold: index % 2 === 1, text: part }))
    .filter((part) => part.text.length > 0);
}
