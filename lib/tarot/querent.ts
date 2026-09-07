/** ข้อมูลผู้ถาม ใช้ทั้งฝั่งเบราว์เซอร์ (ฟอร์ม + localStorage) และฝั่งเซิร์ฟเวอร์ (ตรวจก่อนส่งให้ AI) */
/** ข้อมูลส่วนตัวของผู้ถาม คำถามแยกออกไปต่างหากเพราะไม่ใช่ทุกโหมดที่ต้องพิมพ์คำถามเอง */
export interface Querent {
  firstName: string;
  lastName: string;
  /** รูปแบบ YYYY-MM-DD */
  birthDate: string;
  /** รูปแบบ HH:mm เว้นว่างได้ถ้าไม่ทราบเวลาเกิด */
  birthTime: string;
  birthCity: string;
  birthCountry: string;
}

export type QuerentField = keyof Querent;

export const QUERENT_STORAGE_KEY = "chandra-tarot:querent";

export const EMPTY_QUERENT: Querent = {
  firstName: "",
  lastName: "",
  birthDate: "",
  birthTime: "",
  birthCity: "",
  birthCountry: "ไทย",
};

/** ความยาวสูงสุดของแต่ละช่อง กันข้อความยาวเกินจนเปลืองโทเคน */
export const MAX_LENGTH: Record<QuerentField, number> = {
  firstName: 60,
  lastName: 60,
  birthDate: 10,
  birthTime: 5,
  birthCity: 80,
  birthCountry: 80,
};

export const MAX_QUESTION_LENGTH = 400;

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

/** วันเกิดต้องเป็นวันที่จริง ไม่ใช่อนาคต และไม่เก่าเกินจริง */
export function isValidBirthDate(value: string): boolean {
  if (!DATE_PATTERN.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return false;
  if (value !== date.toISOString().slice(0, 10)) return false;
  const year = date.getUTCFullYear();
  return year >= 1900 && date.getTime() <= Date.now();
}

/** ตรวจฟอร์มแล้วคืนข้อความผิดพลาดรายช่อง ช่องที่ผ่านจะไม่มีคีย์อยู่ในผลลัพธ์ */
export function validateQuerent(value: Querent): Partial<Record<QuerentField, string>> {
  const errors: Partial<Record<QuerentField, string>> = {};

  if (!value.firstName.trim()) errors.firstName = "กรุณากรอกชื่อ";
  if (!value.lastName.trim()) errors.lastName = "กรุณากรอกนามสกุล";

  if (!value.birthDate) errors.birthDate = "กรุณาเลือกวันเกิด";
  else if (!isValidBirthDate(value.birthDate)) errors.birthDate = "วันเกิดไม่ถูกต้อง";

  if (value.birthTime && !TIME_PATTERN.test(value.birthTime)) {
    errors.birthTime = "เวลาไม่ถูกต้อง";
  }

  if (!value.birthCity.trim()) errors.birthCity = "กรุณากรอกเมืองที่เกิด";
  if (!value.birthCountry.trim()) errors.birthCountry = "กรุณากรอกประเทศที่เกิด";

  return errors;
}

/** ตรวจคำถามที่ผู้ใช้พิมพ์เอง คืน undefined ถ้าใช้ได้ */
export function validateQuestion(value: string): string | undefined {
  const question = value.trim();
  if (!question) return "กรุณาพิมพ์คำถามที่อยากรู้";
  if (question.length < 5) return "เขียนคำถามให้ยาวขึ้นอีกนิด จะทำนายได้ตรงกว่า";
  if (question.length > MAX_QUESTION_LENGTH) {
    return `คำถามยาวเกิน ${MAX_QUESTION_LENGTH} ตัวอักษร`;
  }
  return undefined;
}

const text = (value: unknown, limit: number) =>
  typeof value === "string" ? value.trim().slice(0, limit) : "";

/** แปลงข้อมูลดิบ (จาก localStorage หรือ request body) ให้เป็น Querent ที่เชื่อถือได้ */
export function parseQuerent(raw: unknown): Querent | null {
  if (!raw || typeof raw !== "object") return null;
  const input = raw as Record<string, unknown>;

  const querent: Querent = {
    firstName: text(input.firstName, MAX_LENGTH.firstName),
    lastName: text(input.lastName, MAX_LENGTH.lastName),
    birthDate: text(input.birthDate, MAX_LENGTH.birthDate),
    birthTime: text(input.birthTime, MAX_LENGTH.birthTime),
    birthCity: text(input.birthCity, MAX_LENGTH.birthCity),
    birthCountry: text(input.birthCountry, MAX_LENGTH.birthCountry),
  };

  return Object.keys(validateQuerent(querent)).length === 0 ? querent : null;
}

export const fullName = (querent: Querent) => `${querent.firstName} ${querent.lastName}`.trim();

/** อายุเต็มปีนับถึงวันนี้ ใช้ประกอบคำทำนาย */
export function ageOf(querent: Querent, now = new Date()): number | null {
  if (!isValidBirthDate(querent.birthDate)) return null;
  const [year, month, day] = querent.birthDate.split("-").map(Number);
  let age = now.getFullYear() - year;
  const beforeBirthday =
    now.getMonth() + 1 < month || (now.getMonth() + 1 === month && now.getDate() < day);
  if (beforeBirthday) age -= 1;
  return age >= 0 ? age : null;
}

/** วันเกิดในรูปแบบไทย เช่น "3 มีนาคม 2540 เวลา 07:45 น." */
export function birthLine(querent: Querent): string {
  const date = new Date(`${querent.birthDate}T00:00:00`);
  const formatted = Number.isNaN(date.getTime())
    ? querent.birthDate
    : new Intl.DateTimeFormat("th-TH", { dateStyle: "long" }).format(date);
  const time = querent.birthTime ? ` เวลา ${querent.birthTime} น.` : " (ไม่ทราบเวลาเกิด)";
  return `${formatted}${time}`;
}

/* ---------- localStorage: จำข้อมูลส่วนตัวไว้ให้ไม่ต้องกรอกซ้ำ ----------
   คำถามไม่ได้อยู่ในโครงสร้างนี้ จึงไม่มีทางถูกเก็บข้ามรอบ */

export function loadQuerent(): Querent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(QUERENT_STORAGE_KEY);
    if (!raw) return null;
    const stored = JSON.parse(raw) as Record<string, unknown>;
    // ข้อมูลเก่าอาจกรอกไม่ครบ จึงเติมค่าว่างแทนที่จะทิ้งทั้งก้อน
    return {
      ...EMPTY_QUERENT,
      ...Object.fromEntries(
        (Object.keys(EMPTY_QUERENT) as QuerentField[]).map((key) => [
          key,
          text(stored[key], MAX_LENGTH[key]) || EMPTY_QUERENT[key],
        ]),
      ),
    } as Querent;
  } catch {
    return null;
  }
}

export function saveQuerent(querent: Querent): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(QUERENT_STORAGE_KEY, JSON.stringify(querent));
  } catch {
    /* เก็บไม่ได้ (โหมดส่วนตัว/พื้นที่เต็ม) ก็ยังดูดวงต่อได้ */
  }
}

export function clearQuerent(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(QUERENT_STORAGE_KEY);
  } catch {
    /* ไม่เป็นไร */
  }
}
