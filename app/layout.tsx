import type { Metadata, Viewport } from "next";
import { Noto_Sans_Thai, Trirong } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { InlineScript } from "@/components/inline-script";
import { THEME_INIT_SCRIPT } from "@/lib/theme";

const thaiSans = Noto_Sans_Thai({
  variable: "--font-thai-sans",
  subsets: ["thai", "latin"],
  display: "swap",
});

const thaiDisplay = Trirong({
  variable: "--font-thai-display",
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const DESCRIPTION =
  "เปิดไพ่ทาโรต์ด้วยตัวคุณเอง ทั้งดวงประจำวัน ความรัก การงาน การเงิน และครอบครัว พร้อมคำทำนายภาษาไทยครบทั้ง 78 ใบ";

export const metadata: Metadata = {
  title: {
    default: "Judgement · ดูดวงไพ่ทาโรต์ออนไลน์",
    template: "%s · Judgement",
  },
  description: DESCRIPTION,
  applicationName: "Judgement",
  keywords: [
    "ดูดวง",
    "ไพ่ทาโรต์",
    "tarot",
    "judgement",
    "ดวงประจำวัน",
    "ดูดวงความรัก",
    "ดูดวงการงาน",
  ],
  openGraph: {
    type: "website",
    locale: "th_TH",
    siteName: "Judgement",
    title: "Judgement · ดูดวงไพ่ทาโรต์ออนไลน์",
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: "Judgement · ดูดวงไพ่ทาโรต์ออนไลน์",
    description: DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#06040f" },
    { media: "(prefers-color-scheme: light)", color: "#f4f1fb" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="th"
      data-theme="dark"
      suppressHydrationWarning
      className={`${thaiSans.variable} ${thaiDisplay.variable} h-full antialiased`}
    >
      <head>
        {/* ตั้งธีมตั้งแต่ตอน parse HTML ก่อนวาดเฟรมแรก
            ถ้าไปตั้งใน effect ผู้ใช้ธีมสว่างจะเห็นจอมืดวาบหนึ่งทุกครั้งที่โหลด */}
        <InlineScript html={THEME_INIT_SCRIPT} />
      </head>
      <body className="min-h-full flex flex-col">
        <div className="relative z-10 flex min-h-full flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
      {/* impeccable-live-start */}
<script src="http://localhost:8400/live.js?token=e343f5e9-1398-4516-ae5c-8e3237d3d51a"></script>
{/* impeccable-live-end */}
</body>
    </html>
  );
}
