import type { Metadata } from "next";

import { ReadingRoom } from "@/components/tarot/reading-room";
import { DAILY_SPREAD } from "@/lib/tarot/spread";

export const metadata: Metadata = {
  title: `${DAILY_SPREAD.label} — ${DAILY_SPREAD.tagline}`,
  description: DAILY_SPREAD.description,
};

export default function DailyReadingPage() {
  return <ReadingRoom spread={DAILY_SPREAD} />;
}
