import { BrandMark } from "@/components/brand-mark";

export function SiteFooter() {
  return (
    <footer className="border-t border-line-faint bg-night-950/60">
      <div className="mx-auto w-full max-w-6xl px-5 py-10 text-sm text-mist-500">
        <p className="flex items-center gap-2 font-display text-base tracking-wide text-gold-200">
          <BrandMark className="h-5 w-5 text-gold-300" />
          Judgement
        </p>
        <p className="mt-2 max-w-2xl leading-relaxed">
          คำทำนายทั้งหมดเขียนขึ้นเพื่อเป็นแง่คิดและกำลังใจ ไม่ใช่คำพยากรณ์ที่ตายตัว
          และไม่ใช่คำแนะนำทางการแพทย์ กฎหมาย หรือการลงทุน การตัดสินใจในชีวิตยังเป็นของคุณเสมอ
        </p>
        <p className="mt-4 text-xs text-mist-500/80">
          ภาพไพ่จากสำรับ Rider–Waite–Smith ซึ่งเป็นสาธารณสมบัติ · ชุดข้อมูลจากโปรเจกต์ tarot-json (MIT)
        </p>
      </div>
    </footer>
  );
}
