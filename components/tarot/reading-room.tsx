"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { CARD_BY_ID, DECK, REVERSED_CHANCE, shuffle } from "@/lib/tarot/deck";
import { loadQuerent, type Querent } from "@/lib/tarot/querent";
import type { Spread } from "@/lib/tarot/spread";
import { buildSummary } from "@/lib/tarot/summary";
import type { DrawnCard, TarotCard } from "@/lib/tarot/types";
import { AiReading } from "./ai-reading";
import { CardBack } from "./card-back";
import { CardDetail } from "./card-detail";
import { DeckFan } from "./deck-fan";
import { QuerentForm } from "./querent-form";
import { useAiReading } from "./use-ai-reading";

type Phase = "intro" | "shuffling" | "picking" | "reading";

interface FanCard {
  card: TarotCard;
  reversed: boolean;
}

const DAILY_KEY = "chandra-tarot:daily";

function todayStamp(date = new Date()) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function thaiDate(stamp: string) {
  const date = new Date(`${stamp}T00:00:00`);
  if (Number.isNaN(date.getTime())) return stamp;
  return new Intl.DateTimeFormat("th-TH", { dateStyle: "long" }).format(date);
}

export function ReadingRoom({
  spread,
  backHref = "/",
  backLabel = "กลับหน้าแรก",
}: {
  spread: Spread;
  backHref?: string;
  backLabel?: string;
}) {
  const count = spread.slots.length;
  const isPack = spread.mode === "pack";

  const [phase, setPhase] = useState<Phase>("intro");
  const [fan, setFan] = useState<FanCard[]>([]);
  const [picks, setPicks] = useState<number[]>([]);
  const [flipped, setFlipped] = useState<boolean[]>([]);
  const [savedDate, setSavedDate] = useState<string | null>(null);
  const [querent, setQuerent] = useState<Querent | null>(null);
  const [question, setQuestion] = useState("");
  /* เปิดคำทำนาย AI อัตโนมัติเฉพาะรอบที่ผู้ใช้เพิ่งกรอกฟอร์ม ผลเดิมที่กู้คืนมาต้องกดเอง */
  const [aiOpen, setAiOpen] = useState(false);

  const timers = useRef<number[]>([]);
  const resultRef = useRef<HTMLDivElement>(null);

  const clearTimers = useCallback(() => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const draws: DrawnCard[] = useMemo(
    () =>
      picks
        .map((fanIndex, order) => {
          const chosen = fan[fanIndex];
          const slot = spread.slots[order];
          if (!chosen || !slot) return null;
          return {
            card: chosen.card,
            reversed: chosen.reversed,
            position: slot.title,
            positionHint: slot.hint,
          };
        })
        .filter((item): item is DrawnCard => item !== null),
    [picks, fan, spread.slots],
  );

  const allRevealed = flipped.length === count && flipped.every(Boolean);

  /* ไพ่ประจำวัน: ถ้าวันนี้เปิดไปแล้ว ให้แสดงผลเดิม
     อ่านค่าหลัง mount เพื่อไม่ให้ผลที่เซิร์ฟเวอร์เรนเดอร์ไว้กับฝั่งเบราว์เซอร์ต่างกัน */
  useEffect(() => {
    if (spread.mode !== "daily") return;
    let restoreTimer = 0;
    try {
      const raw = window.localStorage.getItem(DAILY_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as {
        date?: string;
        draws?: { id?: string; reversed?: boolean }[];
      };
      const stamp = parsed?.date;
      if (!stamp || stamp !== todayStamp() || !Array.isArray(parsed.draws)) return;

      const restored: FanCard[] = [];
      for (const entry of parsed.draws) {
        const card = entry?.id ? CARD_BY_ID.get(entry.id) : undefined;
        if (!card) return;
        restored.push({ card, reversed: Boolean(entry.reversed) });
      }
      if (restored.length !== count) return;

      const savedQuerent = loadQuerent();

      restoreTimer = window.setTimeout(() => {
        if (savedQuerent) setQuerent(savedQuerent);
        setFan(restored);
        setPicks(restored.map((_, index) => index));
        setFlipped(restored.map(() => true));
        setSavedDate(stamp);
        setPhase("reading");
      }, 0);
    } catch {
      /* อ่านค่าเดิมไม่ได้ ก็เริ่มใหม่ตามปกติ */
    }
    return () => window.clearTimeout(restoreTimer);
  }, [spread.mode, count]);

  const beginReveal = useCallback(
    (chosen: number[], deck: FanCard[]) => {
      setPhase("reading");
      setFlipped(new Array(chosen.length).fill(false));

      chosen.forEach((_, order) => {
        const id = window.setTimeout(
          () => {
            setFlipped((prev) => {
              const next = [...prev];
              next[order] = true;
              return next;
            });
          },
          450 + order * 620,
        );
        timers.current.push(id);
      });

      if (spread.mode === "daily") {
        try {
          const stamp = todayStamp();
          window.localStorage.setItem(
            DAILY_KEY,
            JSON.stringify({
              date: stamp,
              draws: chosen.map((fanIndex) => ({
                id: deck[fanIndex].card.id,
                reversed: deck[fanIndex].reversed,
              })),
            }),
          );
          setSavedDate(stamp);
        } catch {
          /* บันทึกไม่ได้ก็ไม่เป็นไร ยังดูผลได้ปกติ */
        }
      }

      const scrollId = window.setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 120);
      timers.current.push(scrollId);
    },
    [spread.mode],
  );

  useEffect(() => {
    if (phase !== "picking" || picks.length < count) return;
    const id = window.setTimeout(() => beginReveal(picks, fan), 620);
    timers.current.push(id);
    return () => window.clearTimeout(id);
  }, [phase, picks, count, fan, beginReveal]);

  const startShuffle = useCallback(() => {
    clearTimers();
    const deck = shuffle(DECK).map((card) => ({
      card,
      reversed: Math.random() < REVERSED_CHANCE,
    }));
    setFan(deck);
    setPicks([]);
    setFlipped([]);
    setSavedDate(null);
    setPhase("shuffling");
    const id = window.setTimeout(() => setPhase("picking"), 1400);
    timers.current.push(id);
  }, [clearTimers]);

  /* กรอกฟอร์มเสร็จ = เริ่มรอบใหม่ทันที และให้ AI อ่านผลอัตโนมัติเมื่อเปิดไพ่ครบ */
  const handleQuerentSubmit = useCallback(
    (next: Querent, nextQuestion: string) => {
      setQuerent(next);
      setQuestion(nextQuestion);
      setAiOpen(true);
      startShuffle();
    },
    [startShuffle],
  );

  const editQuerent = useCallback(() => {
    clearTimers();
    setAiOpen(false);
    setPhase("intro");
  }, [clearTimers]);

  const handlePick = useCallback(
    (index: number) => {
      setPicks((prev) => {
        if (prev.length >= count || prev.includes(index)) return prev;
        return [...prev, index];
      });
    },
    [count],
  );

  const reading = useAiReading({
    enabled: aiOpen && allRevealed,
    spreadRef: spread.ref,
    question,
    querent,
    draws,
  });

  const summary = useMemo(() => (allRevealed ? buildSummary(draws) : []), [allRevealed, draws]);

  const aiSubject = isPack
    ? `${spread.label} · ${count} คำถาม`
    : question
      ? `“${question}”`
      : spread.tagline;

  return (
    <div className="mx-auto w-full max-w-6xl px-5 pb-20 pt-10">
      <header className="text-center">
        <Link href={backHref} className="text-sm text-mist-500 transition hover:text-gold-200">
          ← {backLabel}
        </Link>
        <div className="mt-4 text-4xl" aria-hidden="true">
          {spread.emoji}
        </div>
        <h1 className="mt-2 font-display text-3xl text-gold-200 sm:text-4xl">{spread.label}</h1>
        <p className="mt-2 text-mist-300">{spread.tagline}</p>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-mist-500">
          {spread.description}
        </p>
      </header>

      {phase === "intro" && (
        <section className="animate-rise mx-auto mt-10 max-w-3xl rounded-3xl border border-line bg-night-900/60 p-6 backdrop-blur-sm sm:p-10">
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-40 w-28 items-center justify-center sm:h-52 sm:w-36">
              <div className="animate-float h-full w-full">
                <CardBack />
              </div>
            </div>
            <h2 className="font-display text-2xl text-mist-100">ตั้งจิตให้นิ่ง แล้วถามในใจ</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-mist-300">
              {spread.needsQuestion
                ? `หายใจเข้าลึก ๆ สักครั้ง เขียนคำถามที่ค้างคาใจให้ชัด แล้วกดสับไพ่ คุณจะเป็นคนเลือกไพ่ทั้ง ${count} ใบด้วยตัวเอง`
                : `หายใจเข้าลึก ๆ สักครั้ง นึกถึงเรื่องที่อยากรู้ให้ชัด แล้วกดสับไพ่ คุณจะเป็นคนเลือกไพ่ทั้ง ${count} ใบด้วยตัวเอง`}
            </p>
          </div>

          {isPack && (
            <ol className="mt-8 space-y-2">
              {spread.slots.map((slot, index) => (
                <li
                  key={slot.title}
                  className="flex gap-3 rounded-2xl border border-line bg-inset px-4 py-3 text-sm leading-relaxed text-mist-300"
                >
                  <span className="font-display" style={{ color: spread.accent }}>
                    {index + 1}
                  </span>
                  {slot.title}
                </li>
              ))}
            </ol>
          )}

          <QuerentForm
            askQuestion={spread.needsQuestion}
            questionExample={
              spread.mode === "daily"
                ? "วันนี้ของฉันจะเป็นอย่างไร"
                : "ตอนนี้ลังเลว่าจะย้ายงานดีไหม ควรอยู่ต่อหรือไป"
            }
            submitLabel="สับไพ่แล้วเริ่มเลือก"
            onSubmit={handleQuerentSubmit}
          />
        </section>
      )}

      {(phase === "shuffling" || phase === "picking") && (
        <section className="mt-10">
          <div className="text-center">
            <h2 className="font-display text-2xl text-mist-100">
              {phase === "shuffling" ? "กำลังสับไพ่..." : "เลือกไพ่ของคุณ"}
            </h2>
            <p className="mt-2 text-sm text-mist-300">
              {phase === "shuffling"
                ? "ระหว่างนี้ให้นึกถึงคำถามของคุณไปด้วย"
                : `แตะไพ่ที่รู้สึกว่าใช่ ${count} ใบ ไม่ต้องคิดมาก เชื่อความรู้สึกแรก`}
            </p>
            {phase === "picking" && (
              <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-400/10 px-4 py-1.5 text-sm text-gold-200">
                เลือกแล้ว {picks.length} / {count} ใบ
              </p>
            )}
          </div>

          {phase === "picking" && isPack && picks.length < count && (
            <p className="mx-auto mt-4 max-w-2xl rounded-2xl border border-line bg-inset px-4 py-3 text-center text-sm leading-relaxed text-mist-300">
              <span className="font-display text-mystic-400">
                ใบที่ {picks.length + 1} สำหรับข้อ {picks.length + 1} ·{" "}
              </span>
              {spread.slots[picks.length]?.title}
            </p>
          )}

          <div className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-3 sm:gap-4">
            {spread.slots.map((slot, index) => {
              const filled = index < picks.length;
              return (
                <div key={slot.title} className="w-20 text-center sm:w-32">
                  <div
                    className={`relative aspect-[350/600] overflow-hidden rounded-xl border transition ${
                      filled
                        ? "border-gold-400/40 shadow-[var(--shadow-emission-soft)]"
                        : "border-dashed border-line-strong bg-inset"
                    }`}
                  >
                    {filled ? (
                      <CardBack />
                    ) : (
                      <span className="absolute inset-0 flex items-center justify-center font-display text-2xl text-mist-500">
                        {index + 1}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 line-clamp-2 text-xs text-mist-300">
                    {isPack ? `ข้อ ${index + 1}` : slot.title}
                  </p>
                </div>
              );
            })}
          </div>

          <DeckFan
            total={fan.length}
            picked={picks}
            maxPicks={count}
            shuffling={phase === "shuffling"}
            onPick={handlePick}
          />

          <p className="text-center text-xs text-mist-500">
            เลื่อนซ้าย–ขวาเพื่อดูไพ่ทั้ง {fan.length} ใบในสำรับ
          </p>
        </section>
      )}

      {phase === "reading" && (
        <section ref={resultRef} className="mt-10 scroll-mt-24">
          {savedDate && (
            <p className="mb-6 text-center text-sm text-mist-500">
              ไพ่ประจำวันของคุณ · {thaiDate(savedDate)}
            </p>
          )}

          <div className="flex flex-wrap justify-center gap-3 sm:gap-6">
            {draws.map((draw, index) => (
              <figure key={`${draw.card.id}-${index}`} className="w-28 text-center sm:w-40">
                <div className="flip-scene relative aspect-[350/600]">
                  <div className={`flip-inner ${flipped[index] ? "is-flipped" : ""}`}>
                    <div className="flip-face">
                      <CardBack />
                    </div>
                    <div className="flip-face flip-face-back border border-gold-400/30 bg-deck-800">
                      <Image
                        src={draw.card.image}
                        alt={draw.card.nameTh}
                        fill
                        sizes="(max-width: 640px) 128px, 160px"
                        priority={index === 0}
                        className={`object-cover ${draw.reversed ? "rotate-180" : ""}`}
                      />
                    </div>
                  </div>
                </div>
                <figcaption className="mt-3">
                  <p className="text-xs text-mist-500">
                    {isPack ? `ข้อ ${index + 1}` : draw.position}
                  </p>
                  <p className="font-display text-base text-gold-200">
                    {flipped[index] ? draw.card.nameTh : "..."}
                  </p>
                  {flipped[index] && (
                    <p className="text-xs text-mist-500">{draw.reversed ? "กลับหัว" : "หงาย"}</p>
                  )}
                </figcaption>
              </figure>
            ))}
          </div>

          {allRevealed && (
            <div className="mt-12 space-y-5">
              {draws.map((draw, index) => (
                <CardDetail
                  key={`${draw.card.id}-detail-${index}`}
                  draw={draw}
                  meaningKey={spread.meaningKey}
                  index={index}
                  isPack={isPack}
                  aiText={aiOpen ? reading.sections.cards[index] : ""}
                  aiStatus={aiOpen ? reading.status : undefined}
                />
              ))}

              {summary.length > 0 && (
                <div className="animate-rise rounded-2xl border border-gold-400/25 bg-linear-to-br from-night-800/80 to-night-900/80 p-6">
                  <h3 className="font-display text-xl text-gold-200">ภาพรวมของการเปิดครั้งนี้</h3>
                  <ul className="mt-3 space-y-2 text-mist-100">
                    {summary.map((line) => (
                      <li key={line} className="flex gap-2 leading-relaxed">
                        <span aria-hidden="true" className="text-gold-400">
                          ✦
                        </span>
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {querent &&
                (aiOpen ? (
                  <AiReading subject={aiSubject} reading={reading} />
                ) : (
                  <div className="rounded-2xl border border-mystic-400/25 bg-night-900/60 p-6 text-center">
                    <h3 className="font-display text-xl text-mystic-400">คำทำนายเฉพาะคุณ</h3>
                    <p className="mt-2 text-sm leading-relaxed text-mist-300">
                      ให้ AI อ่านไพ่ทีละใบตามข้อมูลของคุณ พร้อมสรุปคำตอบและคำแนะนำ
                    </p>
                    <button
                      type="button"
                      onClick={() => setAiOpen(true)}
                      className="mt-4 rounded-full border border-mystic-400/40 px-6 py-2.5 text-mystic-400 transition hover:bg-mystic-500/10 active:scale-95"
                    >
                      ✦ ขอคำทำนายเฉพาะคุณ
                    </button>
                  </div>
                ))}

              <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={startShuffle}
                  className="rounded-full border border-gold-400/40 px-6 py-3 font-display text-gold-200 transition hover:bg-gold-400/10 active:scale-95"
                >
                  {spread.mode === "daily" ? "เปิดไพ่ใหม่อีกครั้ง" : "เปิดไพ่ใหม่"}
                </button>
                <button
                  type="button"
                  onClick={editQuerent}
                  className="rounded-full border border-line px-6 py-3 text-mist-300 transition hover:bg-inset-strong active:scale-95"
                >
                  {spread.needsQuestion ? "แก้ไขข้อมูลและคำถาม" : "แก้ไขข้อมูลของคุณ"}
                </button>
              </div>

              {spread.mode === "daily" && (
                <p className="text-center text-xs text-mist-500">
                  ไพ่ประจำวันจะถูกเก็บไว้ในเครื่องของคุณจนถึงเที่ยงคืน หากเปิดใหม่ ผลเดิมจะถูกแทนที่
                </p>
              )}

              <div className="flex flex-wrap justify-center gap-3 pt-8">
                <Link
                  href={backHref}
                  className="rounded-full border border-line bg-inset-strong px-5 py-2 text-sm text-mist-300 transition hover:border-gold-400/40 hover:text-gold-200"
                >
                  ← {backLabel}
                </Link>
                <Link
                  href="/cards"
                  className="rounded-full border border-line bg-inset-strong px-5 py-2 text-sm text-mist-300 transition hover:border-gold-400/40 hover:text-gold-200"
                >
                  ดูความหมายไพ่ทั้ง 78 ใบ
                </Link>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
