"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { EMPTY_SECTIONS, parseSections, type AiSections } from "@/lib/tarot/ai-sections";
import type { Querent } from "@/lib/tarot/querent";
import type { DrawnCard } from "@/lib/tarot/types";

export type AiStatus = "loading" | "streaming" | "done" | "error";

interface Run {
  status: AiStatus;
  text: string;
  error: string;
}

const NEW_RUN: Run = { status: "loading", text: "", error: "" };

export interface AiReadingState {
  status: AiStatus;
  error: string;
  sections: AiSections;
  retry: () => void;
}

/**
 * ขอคำทำนายจาก /api/reading แล้วสตรีมกลับมาแบบทีละตัวอักษร
 * เก็บผลแยกตามรอบ (attempt) เพื่อให้การกด "อ่านใหม่" เริ่มจากสถานะว่างได้เอง
 */
export function useAiReading({
  enabled,
  spreadRef,
  question,
  querent,
  draws,
}: {
  enabled: boolean;
  spreadRef: string;
  /** เฉพาะโหมดที่ผู้ใช้พิมพ์คำถามเอง โหมดอื่นเซิร์ฟเวอร์เติมให้ */
  question: string;
  querent: Querent | null;
  draws: DrawnCard[];
}): AiReadingState {
  const [attempt, setAttempt] = useState(0);
  const [runs, setRuns] = useState<Record<number, Run>>({});
  const run = runs[attempt] ?? NEW_RUN;

  const retry = useCallback(() => setAttempt((value) => value + 1), []);

  /* เทียบ dependency ด้วยค่าไม่ใช่ตัวตนของอ็อบเจกต์ เพื่อไม่ให้เผลอยิงซ้ำเมื่อ props ถูกสร้างใหม่ */
  const payload = useMemo(
    () =>
      enabled && querent && draws.length > 0
        ? JSON.stringify({
            spread: spreadRef,
            question,
            querent,
            draws: draws.map((draw) => ({ id: draw.card.id, reversed: draw.reversed })),
          })
        : "",
    [enabled, spreadRef, question, querent, draws],
  );

  useEffect(() => {
    if (!payload) return;

    const controller = new AbortController();
    const patch = (changes: Partial<Run>) =>
      setRuns((prev) => ({ ...prev, [attempt]: { ...(prev[attempt] ?? NEW_RUN), ...changes } }));

    (async () => {
      try {
        const response = await fetch("/api/reading", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: payload,
        });

        if (!response.ok || !response.body) {
          const failure = (await response.json().catch(() => null)) as { error?: string } | null;
          throw new Error(failure?.error ?? "ขอคำทำนายไม่สำเร็จ ลองใหม่อีกครั้ง");
        }

        patch({ status: "streaming" });

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let text = "";
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          text += decoder.decode(value, { stream: true });
          patch({ text });
        }
        patch({ status: "done" });
      } catch (caught) {
        if (controller.signal.aborted) return;
        patch({
          status: "error",
          error: caught instanceof Error ? caught.message : "ขอคำทำนายไม่สำเร็จ",
        });
      }
    })();

    return () => controller.abort();
  }, [payload, attempt]);

  const sections = useMemo(
    () => (run.text ? parseSections(run.text, draws.length) : EMPTY_SECTIONS),
    [run.text, draws.length],
  );

  return { status: run.status, error: run.error, sections, retry };
}
