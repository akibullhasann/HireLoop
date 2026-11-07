import type { Metadata } from "next"

import { HeroSection } from "@/components/hero-section"

export const metadata: Metadata = {
  title: "HireLoop — Find Your Dream Job Today",
  description:
    "HireLoop connects top talent with world-class companies. Browse thousands of curated opportunities and land your next role — faster.",
}

export default function Page() {
  return (
    <main className="bg-[#010103]">
      <HeroSection />
    </main>
  )
}
