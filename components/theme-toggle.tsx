"use client";

import { useCallback, useEffect, useLayoutEffect, useSyncExternalStore } from "react";

import { THEME_STORAGE_KEY, type ThemePreference } from "@/lib/theme";

const OPTIONS: { value: ThemePreference; label: string; icon: React.ReactNode }[] = [
  {
    value: "light",
    label: "ธีมสว่าง",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
        <circle cx="12" cy="12" r="4.2" />
        <path
          strokeLinecap="round"
          d="M12 2.6v2.1M12 19.3v2.1M4.36 4.36l1.48 1.48M18.16 18.16l1.48 1.48M2.6 12h2.1M19.3 12h2.1M4.36 19.64l1.48-1.48M18.16 5.84l1.48-1.48"
        />
      </svg>
    ),
  },
  {
    value: "dark",
    label: "ธีมมืด",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20.2 14.6A8.4 8.4 0 1 1 9.4 3.8a6.6 6.6 0 0 0 10.8 10.8Z"
        />
      </svg>
    ),
  },
  {
    value: "system",
    label: "ตามเครื่อง",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
        <rect x="2.8" y="4.4" width="18.4" height="12" rx="1.9" />
        <path strokeLinecap="round" d="M9 19.6h6" />
      </svg>
    ),
  },
];

/**
 * สลับธีมสว่าง/มืด เก็บไว้ใน localStorage ของเครื่องผู้ใช้เอง เหมือนข้อมูลผู้ถาม
 * ค่าตั้งต้นคือตามเครื่อง ซึ่งตกเป็นธีมมืดเมื่อผู้ใช้ไม่ได้ตั้งอะไรไว้ เพราะคนส่วนใหญ่เปิดเว็บนี้ตอนกลางคืน
 *
 * สคริปต์ใน layout ตั้ง data-theme ให้ตั้งแต่ตอน parse HTML แล้ว ที่นี่จึงไม่มีจังหวะธีมกะพริบ
 * ตัวเลือกที่ผู้ใช้เลือกไว้เป็น state ที่อยู่นอก React จึงอ่านผ่าน useSyncExternalStore
 * ซึ่งใช้ค่าฝั่งเซิร์ฟเวอร์ตอน hydrate แล้วค่อยซิงก์ให้เอง โดยไม่ทำให้ hydration พัง
 */
export function ThemeToggle() {
  const preference = useSyncExternalStore(subscribe, readPreference, readServerPreference);

  /* ตั้ง data-theme ซ้ำเพราะ Strict Mode ตอน dev ล้าง attribute บน <html> ทิ้งตอน remount
     useLayoutEffect ทำงานก่อนวาดเฟรม ผู้ใช้จึงไม่เห็นธีมที่ผิด */
  useLayoutEffect(() => {
    applyTheme(preference);
  }, [preference]);

  /* เลือก "ตามเครื่อง" ไว้แล้วผู้ใช้สลับธีมของเครื่องกลางคัน เว็บต้องตามไปด้วยทันที */
  useEffect(() => {
    if (preference !== "system") return;
    const query = window.matchMedia("(prefers-color-scheme: light)");
    const sync = () => applyTheme("system");
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, [preference]);

  const choose = useCallback((next: ThemePreference) => {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      /* โหมดส่วนตัวหรือปิดที่เก็บข้อมูลไว้ — สลับธีมรอบนี้ยังใช้ได้ แค่ไม่ถูกจำ */
    }
    applyTheme(next);
    emit();
  }, []);

  return (
    <div
      role="group"
      aria-label="ธีมของเว็บ"
      className="flex items-center gap-0.5 rounded-full border border-line p-0.5"
    >
      {OPTIONS.map((option) => {
        const active = preference === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => choose(option.value)}
            aria-pressed={active}
            title={option.label}
            className={`flex h-7 w-7 items-center justify-center rounded-full transition ${
              active
                ? "bg-gold-400/15 text-gold-200"
                : "text-mist-500 hover:bg-inset-strong hover:text-mist-300"
            }`}
          >
            <span className="h-4 w-4">{option.icon}</span>
            <span className="sr-only">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ตัวเลือกธีมอยู่ใน localStorage ซึ่งเป็น state นอก React จึงต้องมี store เล็ก ๆ คอยกระจายให้ */
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  /* แท็บอื่นของเว็บเดียวกันเปลี่ยนธีม แท็บนี้ก็ควรตามไปด้วย */
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

function readPreference(): ThemePreference {
  try {
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
    return saved === "light" || saved === "dark" || saved === "system" ? saved : "system";
  } catch {
    return "system";
  }
}

function readServerPreference(): ThemePreference {
  return "system";
}

function applyTheme(preference: ThemePreference) {
  const resolved =
    preference === "system"
      ? window.matchMedia("(prefers-color-scheme: light)").matches
        ? "light"
        : "dark"
      : preference;
  document.documentElement.setAttribute("data-theme", resolved);
}
