"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import { DECK, SUITS, SUIT_LABEL } from "@/lib/tarot/deck";
import type { Meaning, SuitKey, TarotCard } from "@/lib/tarot/types";

const TOPIC_ROWS: { key: keyof Meaning; label: string }[] = [
  { key: "general", label: "ภาพรวม / ประจำวัน" },
  { key: "love", label: "ความรัก" },
  { key: "work", label: "การงาน" },
  { key: "money", label: "การเงิน" },
  { key: "family", label: "ครอบครัว" },
];

function MeaningBlock({ meaning, title, tone }: { meaning: Meaning; title: string; tone: string }) {
  return (
    <div className="rounded-2xl border border-line bg-inset p-5">
      <h4 className={`font-display text-lg ${tone}`}>{title}</h4>
      <div className="mt-2 flex flex-wrap gap-2">
        {meaning.keywords.map((keyword) => (
          <span
            key={keyword}
            className="rounded-full border border-line bg-inset-strong px-3 py-1 text-xs text-mist-300"
          >
            {keyword}
          </span>
        ))}
      </div>
      <dl className="mt-4 space-y-3">
        {TOPIC_ROWS.map((row) => (
          <div key={row.key}>
            <dt className="text-xs text-mist-500">{row.label}</dt>
            <dd className="text-sm leading-relaxed text-mist-100">{meaning[row.key] as string}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 rounded-xl border border-gold-400/20 bg-gold-400/5 px-4 py-3 text-sm leading-relaxed text-gold-200">
        คำแนะนำ · {meaning.advice}
      </p>
    </div>
  );
}

export function CardLibrary() {
  const [suit, setSuit] = useState<SuitKey | "all">("all");
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<TarotCard | null>(null);

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return DECK.filter((card) => {
      if (suit !== "all" && card.suit !== suit) return false;
      if (!keyword) return true;
      return (
        card.nameTh.toLowerCase().includes(keyword) ||
        card.name.toLowerCase().includes(keyword) ||
        card.upright.keywords.some((word) => word.includes(keyword)) ||
        card.reversed.keywords.some((word) => word.includes(keyword))
      );
    });
  }, [suit, query]);

  useEffect(() => {
    if (!active) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActive(null);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active]);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSuit("all")}
            className={`rounded-full border px-4 py-2 text-sm transition ${
              suit === "all"
                ? "border-gold-400/50 bg-gold-400/10 text-gold-200"
                : "border-line text-mist-300 hover:border-line-strong"
            }`}
          >
            ทั้งหมด
          </button>
          {SUITS.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setSuit(item.key)}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                suit === item.key
                  ? "border-gold-400/50 bg-gold-400/10 text-gold-200"
                  : "border-line text-mist-300 hover:border-line-strong"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="ค้นหาชื่อไพ่หรือคำสำคัญ"
          className="w-full rounded-full border border-line bg-inset-strong px-5 py-2.5 text-sm text-mist-100 outline-hidden transition placeholder:text-mist-500 focus:border-gold-400/50 sm:w-72"
        />
      </div>

      <p className="mt-4 text-sm text-mist-500">พบ {filtered.length} ใบ</p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {filtered.map((card) => (
          <button
            key={card.id}
            type="button"
            onClick={() => setActive(card)}
            className="group text-left"
          >
            <div className="relative aspect-[350/600] overflow-hidden rounded-xl border border-line bg-night-800 transition group-hover:-translate-y-1 group-hover:border-gold-400/40 group-hover:shadow-[var(--shadow-card-lift)]">
              <Image
                src={card.image}
                alt={card.nameTh}
                fill
                sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 200px"
                className="object-cover"
              />
            </div>
            <p className="mt-2 font-display text-base text-mist-100 transition group-hover:text-gold-200">
              {card.nameTh}
            </p>
            <p className="text-xs text-mist-500">{card.name}</p>
          </button>
        ))}
      </div>

      {active && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-night-950/85 p-4 backdrop-blur-sm sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={`ความหมายไพ่ ${active.nameTh}`}
          onClick={() => setActive(null)}
        >
          <div
            className="animate-rise my-6 w-full max-w-3xl rounded-3xl border border-line bg-night-900 p-5 sm:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs text-mist-500">{SUIT_LABEL[active.suit]}</p>
                <h2 className="font-display text-3xl text-gold-200">{active.nameTh}</h2>
                <p className="text-sm text-mist-500">{active.name}</p>
              </div>
              <button
                type="button"
                onClick={() => setActive(null)}
                className="rounded-full border border-line-strong px-4 py-2 text-sm text-mist-300 transition hover:bg-inset-strong"
              >
                ปิด
              </button>
            </div>

            <div className="mt-6 flex flex-col gap-6 lg:flex-row">
              <div className="mx-auto w-40 shrink-0 lg:mx-0">
                <div className="relative aspect-[350/600] overflow-hidden rounded-xl border border-gold-400/25">
                  <Image
                    src={active.image}
                    alt={active.nameTh}
                    fill
                    sizes="160px"
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <MeaningBlock meaning={active.upright} title="ไพ่หงาย" tone="text-gold-200" />
                <MeaningBlock meaning={active.reversed} title="ไพ่กลับหัว" tone="text-mystic-400" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
