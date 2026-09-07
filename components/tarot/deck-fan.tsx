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

/** ขยับนิ้วเกินระยะนี้ระหว่างกด ถือว่ากำลังเลื่อนสำรับ ไม่ใช่เลือกไพ่ */
const DRAG_SLOP = 10;

export function DeckFan({ total, picked, maxPicks, shuffling, onPick }: DeckFanProps) {
  const done = picked.length >= maxPicks;
  const scroller = useRef<HTMLDivElement>(null);
  const pressOrigin = useRef<{ x: number; y: number } | null>(null);

  /* เปิดมาให้เห็นกลางสำรับก่อน แล้วผู้ใช้ค่อยเลื่อนหาไพ่ที่ถูกใจเอง */
  useEffect(() => {
    const node = scroller.current;
    if (!node) return;
    node.scrollLeft = (node.scrollWidth - node.clientWidth) / 2;
  }, [total]);

  /*
   * บนมือถือผู้ใช้ต้องปัดสำรับไปมาก่อนจึงจะเจอไพ่ที่รู้สึกว่าใช่
   * ถ้านับการปัดที่ปล่อยนิ้วลงบนไพ่เป็นการเลือกด้วย ไพ่จะถูกหยิบทั้งที่ยังไม่ได้ตั้งใจ
   * และผู้ใช้เสียสิทธิ์เลือกไปหนึ่งใบโดยไม่มีทางย้อน ซึ่งขัดกับหัวใจของเว็บนี้
   */
  const handlePointerDown = (event: React.PointerEvent) => {
    pressOrigin.current = { x: event.clientX, y: event.clientY };
  };

  const handlePick = (index: number) => (event: React.MouseEvent) => {
    const origin = pressOrigin.current;
    pressOrigin.current = null;
    /* กดด้วยคีย์บอร์ดไม่มี pointerdown นำหน้า และรายงานพิกัดเป็น 0 จึงข้ามการตรวจนี้ */
    if (origin && Math.hypot(event.clientX - origin.x, event.clientY - origin.y) > DRAG_SLOP) {
      return;
    }
    onPick(index);
  };

  return (
    <div
      ref={scroller}
      onPointerDown={handlePointerDown}
      className="deck-scroll -mx-5 overflow-x-auto px-5 pb-8 pt-14"
    >
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
              onClick={handlePick(index)}
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
              {/* group-active ยกไพ่ขึ้นตอนนิ้วยังกดค้าง เพราะจอสัมผัสไม่มี hover
                  ผู้ใช้จึงเห็นว่ากำลังจะหยิบใบไหนก่อนปล่อยนิ้ว */}
              <span
                className={`block h-full w-full rounded-xl shadow-[var(--shadow-card)] transition-transform duration-300 ${
                  done || shuffling
                    ? ""
                    : "group-hover:-translate-y-7 group-focus-visible:-translate-y-7 group-active:-translate-y-7"
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
