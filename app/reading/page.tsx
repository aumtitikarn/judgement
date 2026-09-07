import type { Metadata } from "next";

import { ReadingRoom } from "@/components/tarot/reading-room";
import { CUSTOM_SPREAD } from "@/lib/tarot/spread";

export const metadata: Metadata = {
  title: `${CUSTOM_SPREAD.label} — ${CUSTOM_SPREAD.tagline}`,
  description: CUSTOM_SPREAD.description,
};

export default function CustomReadingPage() {
  return <ReadingRoom spread={CUSTOM_SPREAD} />;
}
