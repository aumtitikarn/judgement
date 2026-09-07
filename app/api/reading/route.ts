import type { NextRequest } from "next/server";

import { CARD_BY_ID } from "@/lib/tarot/deck";
import { buildUserPrompt, systemPrompt } from "@/lib/tarot/prompt";
import { MAX_QUESTION_LENGTH, parseQuerent, validateQuestion } from "@/lib/tarot/querent";
import { DAILY_QUESTION, resolveSpread, type SpreadSlot } from "@/lib/tarot/spread";
import type { DrawnCard } from "@/lib/tarot/types";

export const runtime = "nodejs";
/** คำทำนายขึ้นกับข้อมูลที่ส่งมาทุกครั้ง จึงไม่ควรถูกแคช */
export const dynamic = "force-dynamic";

const MODEL = process.env.GEMINI_MODEL || "gemini-3.6-flash";
const endpoint = () =>
  `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:streamGenerateContent?alt=sse`;

/** รองรับทั้งชื่อมาตรฐานและชื่อที่ตั้งไว้เองใน .env */
const readApiKey = () =>
  process.env.GOOGLE_API_KEY ||
  process.env.GEMINI_API_KEY ||
  process.env["GOOGLE-API"] ||
  process.env["GPT-API"] ||
  "";

const fail = (status: number, message: string) => Response.json({ error: message }, { status });

/** จำกัดจำนวนครั้งต่อ IP กันการกดรัวจนบิลบาน (อยู่ในหน่วยความจำของอินสแตนซ์เดียว) */
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 8;
const hits = new Map<string, number[]>();

function overRateLimit(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((at) => now - at < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 500) {
    for (const [key, times] of hits) {
      if (times.every((at) => now - at >= WINDOW_MS)) hits.delete(key);
    }
  }
  return recent.length > MAX_PER_WINDOW;
}

interface DrawInput {
  id?: unknown;
  reversed?: unknown;
}

/** ประกอบไพ่จาก id ที่ส่งมา โดยใช้ความหมายและตำแหน่งจากฝั่งเซิร์ฟเวอร์เท่านั้น */
function resolveDraws(raw: unknown, slots: SpreadSlot[]): DrawnCard[] | null {
  if (!Array.isArray(raw) || raw.length !== slots.length) return null;

  const draws: DrawnCard[] = [];
  for (const [index, entry] of (raw as DrawInput[]).entries()) {
    const id = typeof entry?.id === "string" ? entry.id : "";
    const card = CARD_BY_ID.get(id);
    if (!card) return null;
    draws.push({
      card,
      reversed: entry?.reversed === true,
      position: slots[index].title,
      positionHint: slots[index].hint,
    });
  }
  return draws;
}

/** ไพ่ทาโรต์แตะเรื่องความรักและความขัดแย้งเป็นปกติ จึงผ่อนตัวกรองลงเหลือเฉพาะระดับรุนแรง */
const SAFETY_SETTINGS = [
  "HARM_CATEGORY_HARASSMENT",
  "HARM_CATEGORY_HATE_SPEECH",
  "HARM_CATEGORY_SEXUALLY_EXPLICIT",
  "HARM_CATEGORY_DANGEROUS_CONTENT",
].map((category) => ({ category, threshold: "BLOCK_ONLY_HIGH" }));

export async function POST(request: NextRequest) {
  const apiKey = readApiKey();
  if (!apiKey) {
    return fail(503, "ยังไม่ได้ตั้งค่า GOOGLE_API_KEY บนเซิร์ฟเวอร์");
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
  if (overRateLimit(ip)) {
    return fail(429, "ขอคำทำนายถี่เกินไป พักสักครู่แล้วลองใหม่อีกครั้ง");
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return fail(400, "ข้อมูลที่ส่งมาไม่ถูกต้อง");
  }

  const spread = typeof body.spread === "string" ? resolveSpread(body.spread) : null;
  if (!spread) return fail(400, "ไม่พบรูปแบบการเปิดไพ่นี้");

  const querent = parseQuerent(body.querent);
  if (!querent) return fail(400, "ข้อมูลผู้ถามไม่ครบหรือไม่ถูกต้อง");

  // โหมดที่มีคำถามตายตัวอยู่แล้ว ไม่ต้องเชื่อคำถามที่ไคลเอนต์ส่งมา
  let question = "";
  if (spread.needsQuestion) {
    const raw = typeof body.question === "string" ? body.question.trim() : "";
    const invalid = validateQuestion(raw);
    if (invalid) return fail(400, invalid);
    question = raw.slice(0, MAX_QUESTION_LENGTH);
  } else if (spread.mode === "daily") {
    question = DAILY_QUESTION;
  }

  const draws = resolveDraws(body.draws, spread.slots);
  if (!draws) return fail(400, "ข้อมูลไพ่ที่เปิดไม่ถูกต้อง");

  let upstream: Response;
  try {
    upstream = await fetch(endpoint(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt(spread) }] },
        contents: [
          {
            role: "user",
            parts: [{ text: buildUserPrompt(querent, spread, question, draws) }],
          },
        ],
        safetySettings: SAFETY_SETTINGS,
        generationConfig: {
          temperature: 0.9,
          maxOutputTokens: 8192,
        },
      }),
      signal: AbortSignal.timeout(60_000),
    });
  } catch {
    return fail(504, "เชื่อมต่อผู้ให้บริการ AI ไม่สำเร็จ ลองใหม่อีกครั้ง");
  }

  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text().catch(() => "");
    console.error("Gemini error", upstream.status, detail.slice(0, 500));

    let message = "ขอคำทำนายจาก AI ไม่สำเร็จ ลองใหม่อีกครั้ง";
    if (detail.includes("API_KEY_INVALID") || upstream.status === 401) {
      message = "คีย์ Google API ไม่ถูกต้อง ตรวจค่าใน .env อีกครั้ง";
    } else if (upstream.status === 403) {
      message = "คีย์นี้ไม่มีสิทธิ์เรียกใช้ Generative Language API";
    } else if (upstream.status === 404) {
      message = `ไม่พบโมเดล "${MODEL}" ลองตั้งค่า GEMINI_MODEL ใหม่`;
    } else if (upstream.status === 429) {
      // Google บอกมาว่าให้รออีกกี่วินาที ส่งต่อให้ผู้ใช้รู้ด้วยจะได้ไม่กดรัว
      const wait = detail.match(/retry in ([\d.]+)s/i)?.[1];
      message = wait
        ? `โควตาของ Google API เต็มชั่วคราว ลองใหม่อีกครั้งในอีก ${Math.ceil(Number(wait))} วินาที`
        : "โควตาของ Google API เต็มชั่วคราว รอสักครู่แล้วลองใหม่";
    }

    // ตอนพัฒนาให้เห็นสาเหตุจริงจากผู้ให้บริการด้วย จะได้แก้ถูกจุด
    const devDetail =
      process.env.NODE_ENV === "development" ? ` [${upstream.status}] ${detail.slice(0, 700)}` : "";
    return fail(502, `${message}${devDetail}`);
  }

  return new Response(toTextStream(upstream.body), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    },
  });
}

interface GeminiChunk {
  candidates?: {
    content?: { parts?: { text?: string }[] };
    finishReason?: string;
  }[];
  promptFeedback?: { blockReason?: string };
}

/** แปลงสตรีมแบบ SSE ของ Gemini ให้เหลือเฉพาะตัวอักษรของคำทำนาย */
function toTextStream(body: ReadableStream<Uint8Array>): ReadableStream<Uint8Array> {
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";
  let emitted = false;
  let stopReason = "";
  let reader: ReadableStreamDefaultReader<Uint8Array> | null = null;

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      reader = body.getReader();
      try {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.startsWith("data:")) continue;
            const payload = line.slice(5).trim();
            if (!payload) continue;
            try {
              const chunk = JSON.parse(payload) as GeminiChunk;
              const candidate = chunk.candidates?.[0];
              const text = candidate?.content?.parts
                ?.map((part) => part.text ?? "")
                .join("");
              if (text) {
                emitted = true;
                controller.enqueue(encoder.encode(text));
              }
              const reason = chunk.promptFeedback?.blockReason ?? candidate?.finishReason;
              if (reason && reason !== "STOP") stopReason = reason;
            } catch {
              /* บรรทัดที่ยังไม่สมบูรณ์ ข้ามไปก่อน */
            }
          }
        }
      } catch (error) {
        console.error("stream error", error);
      } finally {
        reader.releaseLock();
        reader = null;
        // ถูกตัวกรองบล็อกหรือโดนตัดกลางคัน ผู้ใช้ควรรู้แทนที่จะเห็นกล่องว่าง
        if (!emitted) {
          const note =
            stopReason === "SAFETY" || stopReason === "PROHIBITED_CONTENT"
              ? "ระบบความปลอดภัยของ AI ไม่ยอมตอบคำถามนี้ ลองเปลี่ยนวิธีถามแล้วเปิดใหม่อีกครั้ง"
              : "AI ไม่ได้ส่งคำทำนายกลับมา ลองกดอ่านใหม่อีกครั้ง";
          controller.enqueue(encoder.encode(note));
        } else if (stopReason === "MAX_TOKENS") {
          controller.enqueue(encoder.encode("\n\n(คำทำนายยาวเกินโควตา จึงถูกตัดไว้เท่านี้)"));
        }
        controller.close();
      }
    },
    // ผู้ใช้ปิดหน้าไปแล้ว ไม่ต้องรอคำตอบที่เหลือจาก Gemini ต่อ
    cancel(reason) {
      // ระหว่างอ่านอยู่ ตัวสตรีมถูก reader ล็อกไว้ ต้องสั่งผ่าน reader เท่านั้น
      void (reader ? reader.cancel(reason) : body.cancel(reason)).catch(() => {});
    },
  });
}
