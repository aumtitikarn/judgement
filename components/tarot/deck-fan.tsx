"use client";

import { useEffect, useRef } from "react";

import { CardBack } from "./card-back";

interface DeckFanProps {
  total: number;
  picked: number[];
  maxPicks: number;
  shuffling: boolean;
  onPick: (index: number) => void;
}

export function DeckFan({ total, picked, maxPicks, shuffling, onPick }: DeckFanProps) {
  const done = picked.length >= maxPicks;
  const scroller = useRef<HTMLDivElement>(null);

  /* เปิดมาให้เห็นกลางสำรับก่อน แล้วผู้ใช้ค่อยเลื่อนหาไพ่ที่ถูกใจเอง */
  useEffect(() => {
    const node = scroller.current;
    if (!node) return;
    node.scrollLeft = (node.scrollWidth - node.clientWidth) / 2;
  }, [total]);

  return (
    <div ref={scroller} className="deck-scroll -mx-5 overflow-x-auto px-5 pb-8 pt-14">
      <div
        className={`deck-fan relative mx-auto ${shuffling ? "fan-shuffling" : ""}`}
        style={{
          width: `calc(var(--fan-gap) * ${total - 1} + var(--fan-card-w))`,
          height: "var(--fan-strip-h)",
        }}
      >
        {Array.from({ length: total }, (_, index) => {
          const norm = total > 1 ? (index / (total - 1)) * 2 - 1 : 0;
          const angle = norm * 9;
          const lift = norm * norm * 30;
          const isPicked = picked.includes(index);

          return (
            <button
              key={index}
              type="button"
              aria-label={`เลือกไพ่ใบที่ ${index + 1}`}
              aria-pressed={isPicked}
              disabled={isPicked || done || shuffling}
              onClick={() => onPick(index)}
              className={`group fan-card absolute bottom-0 origin-bottom rounded-xl outline-hidden transition-[opacity,transform] duration-500 ${
                isPicked ? "pointer-events-none scale-90 opacity-0" : "opacity-100"
              }`}
              style={{
                left: `calc(var(--fan-gap) * ${index})`,
                width: "var(--fan-card-w)",
                height: "var(--fan-card-h)",
                transform: `rotate(${angle.toFixed(2)}deg) translateY(${lift.toFixed(1)}px)`,
                ["--fan-z" as string]: String(index + 1),
                animationDelay: `${(index % 12) * 0.06}s`,
              }}
            >
              <span
                className={`block h-full w-full rounded-xl shadow-[var(--shadow-card)] transition-transform duration-300 ${
                  done || shuffling ? "" : "group-hover:-translate-y-7 group-focus-visible:-translate-y-7"
                }`}
              >
                <CardBack />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
