/**
 * สคริปต์ที่ต้องทำงานตอนเบราว์เซอร์ parse HTML ก่อนวาดเฟรมแรก
 *
 * ฝั่งเซิร์ฟเวอร์ส่งเป็น text/javascript เบราว์เซอร์จึงรันทันทีตอนโหลดหน้าตรง ๆ
 * ฝั่งเบราว์เซอร์เรนเดอร์เป็น text/plain เพราะ React ไม่รันสคริปต์ที่เรนเดอร์ฝั่ง client อยู่แล้ว
 * และการประกาศแบบนี้ทำให้ React เลิกเตือนเรื่อง script tag ใน component
 */
export function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
