"use client";

import { useEffect, useId, useState } from "react";

import {
  EMPTY_QUERENT,
  MAX_LENGTH,
  MAX_QUESTION_LENGTH,
  loadQuerent,
  saveQuerent,
  validateQuerent,
  validateQuestion,
  type Querent,
  type QuerentField,
} from "@/lib/tarot/querent";

const FIELD_CLASS =
  "w-full rounded-xl border border-line bg-night-950/60 px-4 py-2.5 text-mist-100 outline-none transition placeholder:text-mist-500/60 focus:border-gold-400/50 focus:ring-2 focus:ring-gold-400/20";

function Field({
  label,
  hint,
  error,
  htmlFor,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="text-left">
      <label htmlFor={htmlFor} className="block text-sm text-mist-300">
        {label}
        {hint && <span className="ml-1.5 text-xs text-mist-500">{hint}</span>}
      </label>
      <div className="mt-1.5">{children}</div>
      {error && <p className="mt-1 text-xs text-alert">{error}</p>}
    </div>
  );
}

/**
 * ฟอร์มเก็บข้อมูลผู้ถามก่อนสับไพ่ ข้อมูลถูกจำไว้ใน localStorage ของเครื่องผู้ใช้เท่านั้น
 * ช่องคำถามจะโผล่เฉพาะโหมดที่ผู้ใช้ต้องตั้งคำถามเอง และไม่เคยถูกเก็บข้ามรอบ
 */
export function QuerentForm({
  askQuestion,
  questionExample,
  submitLabel,
  onSubmit,
}: {
  askQuestion: boolean;
  questionExample: string;
  submitLabel: string;
  onSubmit: (querent: Querent, question: string) => void;
}) {
  const uid = useId();
  const fieldId = (name: QuerentField | "question") => `${uid}-${name}`;

  const [value, setValue] = useState<Querent>(EMPTY_QUERENT);
  const [question, setQuestion] = useState("");
  const [errors, setErrors] = useState<Partial<Record<QuerentField, string>>>({});
  const [questionError, setQuestionError] = useState<string | undefined>(undefined);
  const [restored, setRestored] = useState(false);

  /* เติมข้อมูลเดิมหลัง mount เพื่อไม่ให้ผลที่เซิร์ฟเวอร์เรนเดอร์ไว้กับฝั่งเบราว์เซอร์ต่างกัน */
  useEffect(() => {
    const saved = loadQuerent();
    if (!saved) return;
    const timer = window.setTimeout(() => {
      setValue(saved);
      setRestored(Boolean(saved.firstName || saved.lastName));
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const update = (field: QuerentField) => (next: string) => {
    setValue((prev) => ({ ...prev, [field]: next }));
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed: Querent = {
      ...value,
      firstName: value.firstName.trim(),
      lastName: value.lastName.trim(),
      birthCity: value.birthCity.trim(),
      birthCountry: value.birthCountry.trim(),
    };
    const found = validateQuerent(trimmed);
    const askedFor = askQuestion ? validateQuestion(question) : undefined;
    setErrors(found);
    setQuestionError(askedFor);

    const firstBroken = (Object.keys(found)[0] as QuerentField | undefined) ?? (askedFor && "question");
    if (firstBroken) {
      document.getElementById(fieldId(firstBroken))?.focus();
      return;
    }

    setValue(trimmed);
    saveQuerent(trimmed);
    onSubmit(trimmed, question.trim());
  };

  const today = new Date().toISOString().slice(0, 10);

  return (
    <form onSubmit={handleSubmit} className="mt-8 text-left" noValidate>
      <div className="rounded-2xl border border-line bg-inset p-5 sm:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="font-display text-lg text-gold-200">ข้อมูลของคุณ</h3>
          {restored && <span className="text-xs text-mist-500">เติมข้อมูลครั้งก่อนให้แล้ว</span>}
        </div>
        <p className="mt-1 text-xs leading-relaxed text-mist-500">
          ใช้ประกอบคำทำนายให้ตรงกับคุณมากขึ้น ข้อมูลถูกเก็บไว้ในเครื่องของคุณเอง
          และจะถูกส่งไปตอนขอคำทำนายเท่านั้น
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="ชื่อ" error={errors.firstName} htmlFor={fieldId("firstName")}>
            <input
              id={fieldId("firstName")}
              className={FIELD_CLASS}
              value={value.firstName}
              onChange={(event) => update("firstName")(event.target.value)}
              maxLength={MAX_LENGTH.firstName}
              autoComplete="given-name"
              placeholder="เช่น จันทร์เพ็ญ"
            />
          </Field>

          <Field label="นามสกุล" error={errors.lastName} htmlFor={fieldId("lastName")}>
            <input
              id={fieldId("lastName")}
              className={FIELD_CLASS}
              value={value.lastName}
              onChange={(event) => update("lastName")(event.target.value)}
              maxLength={MAX_LENGTH.lastName}
              autoComplete="family-name"
              placeholder="เช่น แสงเดือน"
            />
          </Field>

          <Field label="วันเกิด" error={errors.birthDate} htmlFor={fieldId("birthDate")}>
            <input
              id={fieldId("birthDate")}
              type="date"
              className={FIELD_CLASS}
              value={value.birthDate}
              onChange={(event) => update("birthDate")(event.target.value)}
              min="1900-01-01"
              max={today}
            />
          </Field>

          <Field
            label="เวลาเกิด"
            hint="ไม่ทราบก็เว้นว่างได้"
            error={errors.birthTime}
            htmlFor={fieldId("birthTime")}
          >
            <input
              id={fieldId("birthTime")}
              type="time"
              className={FIELD_CLASS}
              value={value.birthTime}
              onChange={(event) => update("birthTime")(event.target.value)}
            />
          </Field>

          <Field label="เมืองที่เกิด" error={errors.birthCity} htmlFor={fieldId("birthCity")}>
            <input
              id={fieldId("birthCity")}
              className={FIELD_CLASS}
              value={value.birthCity}
              onChange={(event) => update("birthCity")(event.target.value)}
              maxLength={MAX_LENGTH.birthCity}
              placeholder="เช่น เชียงใหม่"
            />
          </Field>

          <Field
            label="ประเทศที่เกิด"
            error={errors.birthCountry}
            htmlFor={fieldId("birthCountry")}
          >
            <input
              id={fieldId("birthCountry")}
              className={FIELD_CLASS}
              value={value.birthCountry}
              onChange={(event) => update("birthCountry")(event.target.value)}
              maxLength={MAX_LENGTH.birthCountry}
              placeholder="เช่น ไทย"
            />
          </Field>
        </div>

        {askQuestion && (
          <div className="mt-4">
            <Field
              label="คำถามที่อยากรู้"
              hint={`${question.length}/${MAX_QUESTION_LENGTH}`}
              error={questionError}
              htmlFor={fieldId("question")}
            >
              <textarea
                id={fieldId("question")}
                className={`${FIELD_CLASS} min-h-28 resize-y leading-relaxed`}
                value={question}
                onChange={(event) => {
                  setQuestion(event.target.value);
                  setQuestionError(undefined);
                }}
                maxLength={MAX_QUESTION_LENGTH}
                placeholder={questionExample}
              />
            </Field>
            <p className="mt-1.5 text-xs text-mist-500">
              ถามให้เจาะจงจะได้คำตอบที่ชัดกว่า เช่น “{questionExample}”
            </p>
          </div>
        )}
      </div>

      <div className="mt-8 text-center">
        <button
          type="submit"
          className="rounded-full bg-linear-to-r from-gold-500 to-gold-300 px-8 py-3 font-display text-lg text-night-950 shadow-[var(--shadow-emission-strong)] transition hover:brightness-110 active:scale-95"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
