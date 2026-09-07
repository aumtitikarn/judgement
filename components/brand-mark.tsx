/**
 * ตราของเว็บ — ดวงตะวันขึ้นเหนือเส้นขอบฟ้าในวงแหวนสองชั้น
 *
 * ไพ่ Judgement (XX) คือไพ่แห่งการตื่นขึ้นและการเริ่มใหม่ จึงใช้ตะวันขึ้นแทนเสียงแตร
 * ซึ่งอ่านไม่ออกที่ขนาด 40px วงแหวนสองชั้นกับขีดรัศมียืมมาจากหลังไพ่โดยตรง
 * ใช้ currentColor ทั้งหมด ตราจึงเปลี่ยนสีตามธีมเองโดยไม่ต้องมีสองไฟล์
 */
export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none" aria-hidden="true">
      <circle cx="20" cy="20" r="16.4" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1.1" />
      <circle cx="20" cy="20" r="12.6" stroke="currentColor" strokeOpacity="0.22" strokeWidth="0.7" />

      {/* ขีดรัศมีแปดทิศ ภาษาเดียวกับหลังไพ่ */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <line
          key={angle}
          x1="20"
          y1="1.4"
          x2="20"
          y2="3.6"
          stroke="currentColor"
          strokeOpacity="0.45"
          strokeWidth="1"
          strokeLinecap="round"
          transform={`rotate(${angle} 20 20)`}
        />
      ))}

      {/* ตะวันครึ่งดวงกำลังพ้นขอบฟ้า */}
      <path d="M13.6 24.1a6.4 6.4 0 0 1 12.8 0Z" fill="currentColor" fillOpacity="0.9" />
      <path
        d="M9.4 24.1h21.2"
        stroke="currentColor"
        strokeOpacity="0.75"
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      {/* แสงสามเส้นเหนือดวงตะวัน */}
      <path
        d="M20 11.2v2M13.9 13.5l1.3 1.5M26.1 13.5l-1.3 1.5"
        stroke="currentColor"
        strokeOpacity="0.55"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  );
}
