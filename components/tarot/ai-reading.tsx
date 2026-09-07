"use client";

import { splitBold, toLines } from "@/lib/tarot/ai-sections";
import type { AiReadingState } from "./use-ai-reading";

function Lines({ body }: { body: string }) {
  return (
    <>
      {toLines(body).map((line, index) => (
        <p
          key={index}
          className={
            line.kind === "bullet"
              ? "flex gap-2 leading-relaxed text-mist-100"
              : "leading-relaxed text-mist-100"
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

/** สรุปท้ายการเปิดไพ่: คำตอบรวม คำแนะนำ และจังหวะเวลา (ส่วนรายใบอยู่ในกล่องของไพ่แต่ละใบ) */
export function AiReading({
  subject,
  reading,
}: {
  /** ข้อความสั้น ๆ บอกว่ากำลังตอบเรื่องอะไร (คำถามของผู้ใช้ หรือชื่อแพ็ก) */
  subject: string;
  reading: AiReadingState;
}) {
  const { status, error, sections, retry } = reading;
  const hasSummary = Boolean(sections.summary || sections.action || sections.timing);

  return (
    <section className="animate-rise rounded-2xl border border-mystic-400/30 bg-linear-to-br from-night-800/80 to-night-900/80 p-6 shadow-[var(--shadow-object)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-xl text-mystic-400">คำตอบสำหรับคำถามของคุณ</h3>
          <p className="mt-1 text-sm text-mist-500">{subject}</p>
        </div>
        {(status === "done" || status === "error") && (
          <button
            type="button"
            onClick={retry}
            className="rounded-full border border-mystic-400/40 px-4 py-1.5 text-sm text-mystic-400 transition hover:bg-mystic-500/10 active:scale-95"
          >
            อ่านใหม่อีกครั้ง
          </button>
        )}
      </div>

      {status === "loading" && (
        <p className="mt-5 flex items-center gap-2 text-mist-300">
          <span className="animate-glow text-gold-400">✦</span>
          กำลังตีความไพ่ของคุณ...
        </p>
      )}

      {status === "error" && (
        <div className="mt-5 rounded-xl border border-alert/30 bg-alert/10 px-4 py-3">
          <p className="text-sm leading-relaxed text-alert">{error}</p>
          <p className="mt-2 text-xs text-mist-500">
            คำทำนายพื้นฐานของไพ่แต่ละใบด้านบนยังอ่านได้ตามปกติ
          </p>
        </div>
      )}

      {hasSummary && (
        <div className="mt-5 space-y-5">
          {sections.summary && (
            <div className="space-y-2">
              <Lines body={sections.summary} />
            </div>
          )}

          {sections.action && (
            <div>
              <h4 className="font-display text-lg text-gold-200">สิ่งที่ควรทำต่อจากนี้</h4>
              <div className="mt-2 space-y-2">
                <Lines body={sections.action} />
              </div>
            </div>
          )}

          {sections.timing && (
            <div>
              <h4 className="font-display text-lg text-gold-200">ช่วงเวลาที่ควรจับตา</h4>
              <div className="mt-2 space-y-2">
                <Lines body={sections.timing} />
              </div>
            </div>
          )}

          {status === "streaming" && (
            <span className="animate-glow inline-block text-gold-400">▌</span>
          )}
        </div>
      )}

      {status === "streaming" && !hasSummary && (
        <p className="mt-5 flex items-center gap-2 text-sm text-mist-500">
          <span className="animate-glow text-gold-400">✦</span>
          กำลังอ่านไพ่ทีละใบอยู่ด้านบน สรุปรวมจะตามมา
        </p>
      )}

      {status === "done" && (
        <p className="mt-5 border-t border-line pt-4 text-xs leading-relaxed text-mist-500">
          คำทำนายนี้สร้างโดย AI จากไพ่ที่คุณเปิดเอง ใช้เป็นแง่คิดประกอบการตัดสินใจ
          ไม่ใช่คำแนะนำทางการแพทย์ กฎหมาย หรือการลงทุน
        </p>
      )}
    </section>
  );
}
