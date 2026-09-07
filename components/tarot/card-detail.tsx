import Image from "next/image";

import { splitBold, toLines } from "@/lib/tarot/ai-sections";
import { SUIT_LABEL, meaningOf, readingText } from "@/lib/tarot/deck";
import type { DrawnCard, MeaningKey } from "@/lib/tarot/types";
import type { AiStatus } from "./use-ai-reading";

/** ข้อความจาก AI ที่อาจยังสตรีมมาไม่ครบ */
function AiParagraphs({ body }: { body: string }) {
  return (
    <>
      {toLines(body).map((line, index) => (
        <p
          key={index}
          className={
            line.kind === "bullet"
              ? "mt-2 flex gap-2 leading-relaxed text-mist-100"
              : "mt-2 leading-relaxed text-mist-100 first:mt-0"
          }
        >
          {line.kind === "bullet" && (
            <span aria-hidden="true" className="text-gold-400">
              ✦
            </span>
          )}
          <span>
            {splitBold(line.text).map((part, partIndex) =>
              part.bold ? (
                <strong key={partIndex} className="font-display text-gold-200">
                  {part.text}
                </strong>
              ) : (
                <span key={partIndex}>{part.text}</span>
              ),
            )}
          </span>
        </p>
      ))}
    </>
  );
}

/** กล่องคำทำนายของไพ่หนึ่งใบหลังเปิดแล้ว */
export function CardDetail({
  draw,
  meaningKey,
  index,
  isPack = false,
  aiText = "",
  aiStatus,
}: {
  draw: DrawnCard;
  meaningKey: MeaningKey;
  index: number;
  /** โหมดแพ็ก: ตำแหน่งของไพ่คือคำถามหนึ่งข้อ ไม่ใช่ชื่อตำแหน่งสั้น ๆ */
  isPack?: boolean;
  /** คำแปลของไพ่ใบนี้จาก AI ตามบริบทคำถาม (ว่างได้ถ้ายังสตรีมมาไม่ถึง) */
  aiText?: string;
  aiStatus?: AiStatus;
}) {
  const meaning = meaningOf(draw.card, draw.reversed);
  const main = readingText(draw.card, draw.reversed, meaningKey);
  const waitingForAi = aiStatus === "loading" || aiStatus === "streaming";

  return (
    <article
      className="animate-rise rounded-2xl border border-line bg-night-900/60 p-5 shadow-[var(--shadow-object)] backdrop-blur-sm sm:p-6"
      style={{ animationDelay: `${index * 90}ms` }}
    >
      <div className="flex flex-col gap-5 sm:flex-row">
        <div className="mx-auto w-32 shrink-0 sm:mx-0 sm:w-40">
          <div className="relative aspect-[350/600] overflow-hidden rounded-xl border border-gold-400/25 bg-night-800 shadow-[var(--shadow-card-detail)]">
            <Image
              src={draw.card.image}
              alt={draw.card.nameTh}
              fill
              sizes="(max-width: 640px) 128px, 160px"
              className={`object-cover ${draw.reversed ? "rotate-180" : ""}`}
            />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          {isPack ? (
            <p className="leading-relaxed text-mist-100">
              <span className="mr-1.5 font-display text-mystic-400">ข้อ {index + 1}</span>
              {draw.position}
            </p>
          ) : (
            <p className="text-xs uppercase tracking-[0.2em] text-mist-500">{draw.position}</p>
          )}
          <h3 className="mt-1 font-display text-2xl text-gold-200">{draw.card.nameTh}</h3>
          <p className="text-sm text-mist-500">
            {draw.card.name} · {SUIT_LABEL[draw.card.suit]}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs ${
                draw.reversed
                  ? "border border-mystic-400/40 bg-mystic-500/15 text-mystic-400"
                  : "border border-gold-400/40 bg-gold-400/10 text-gold-200"
              }`}
            >
              {draw.reversed ? "ไพ่กลับหัว" : "ไพ่หงาย"}
            </span>
            {meaning.keywords.map((keyword) => (
              <span
                key={keyword}
                className="rounded-full border border-line bg-inset-strong px-3 py-1 text-xs text-mist-300"
              >
                {keyword}
              </span>
            ))}
          </div>

          {aiText ? (
            <div className="mt-4">
              <p className="mb-2 text-xs uppercase tracking-[0.2em] text-mystic-400">
                {isPack ? "คำตอบของข้อนี้" : "อ่านตามคำถามของคุณ"}
              </p>
              <AiParagraphs body={aiText} />
              {aiStatus === "streaming" && (
                <span className="animate-glow ml-0.5 inline-block text-gold-400">▌</span>
              )}
            </div>
          ) : (
            <>
              <p className="mt-4 leading-relaxed text-mist-100">{main}</p>
              {waitingForAi && (
                <p className="mt-2 flex items-center gap-2 text-xs text-mystic-400">
                  <span className="animate-glow">✦</span>
                  {isPack ? "กำลังให้ AI ตอบข้อนี้..." : "กำลังให้ AI อ่านไพ่ใบนี้ตามคำถามของคุณ..."}
                </p>
              )}
            </>
          )}

          {meaningKey !== "general" && (
            <p className="mt-3 text-sm leading-relaxed text-mist-300">
              <span className="text-mist-500">ภาพรวมของไพ่ใบนี้ · </span>
              {meaning.general}
            </p>
          )}

          <p className="mt-4 rounded-xl border border-gold-400/20 bg-gold-400/5 px-4 py-3 text-sm leading-relaxed text-gold-200">
            <span className="font-display">คำแนะนำ · </span>
            {meaning.advice}
          </p>
        </div>
      </div>
    </article>
  );
}
