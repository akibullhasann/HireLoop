import Image from "next/image"
import Link from "next/link"
import { Briefcase, MapPin, Search } from "lucide-react"

import globe from "@/app/images/globe.png"

const trendingRoles = ["Product Designer", "AI Engineering", "Dev-ops Engineer"]

function HeroSection() {
  return (
    <section className="relative isolate -mt-[88px] overflow-hidden bg-[#010103] pt-[88px] sm:-mt-[100px] sm:pt-[100px] lg:-mt-[106px] lg:pt-[106px]">
      <Image
        src={globe}
        alt=""
        aria-hidden="true"
        priority
        sizes="100vw"
        className="pointer-events-none absolute top-0 left-1/2 -z-10 h-auto w-[1440px] max-w-none min-w-full -translate-x-1/2 select-none"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-b from-transparent to-[#010103]"
      />

      <div className="mx-auto flex w-full max-w-[784px] flex-col items-center px-5 pt-16 pb-24 sm:px-6 sm:pt-24 sm:pb-32 lg:px-0 lg:pt-[168px] lg:pb-56">
        <div className="flex flex-col items-center gap-8">
          <div className="flex items-center justify-center">
            <span
              aria-hidden="true"
              className="hidden h-px w-10 bg-gradient-to-l from-brand/80 to-transparent sm:block lg:w-16"
            />
            <div className="rounded-full bg-[linear-gradient(120deg,rgba(92,83,254,0.75),rgba(255,255,255,0.18),rgba(220,2,206,0.55))] p-px shadow-[0_0_36px_-8px_rgba(92,83,254,0.8)]">
              <div className="flex items-center gap-2.5 rounded-full bg-[#0b0814] px-4 py-2 sm:gap-4 sm:px-6 sm:py-3">
                <Briefcase
                  className="size-4 text-white sm:size-5 lg:size-6"
                  aria-hidden="true"
                />
                <span className="font-label text-xs leading-[1.2] whitespace-nowrap text-white sm:text-sm md:text-base lg:text-xl">
                  50,000+ new jobs this month
                </span>
              </div>
            </div>
            <span
              aria-hidden="true"
              className="hidden h-px w-10 bg-gradient-to-r from-brand/80 to-transparent sm:block lg:w-16"
            />
          </div>

          <div className="flex flex-col gap-4 text-center">
            <h1 className="font-heading text-4xl leading-[1.15] font-bold tracking-[-0.02em] text-balance text-white sm:text-5xl lg:text-[56px]">
              Find Your Dream Job Today
            </h1>
            <p className="mx-auto max-w-[784px] font-heading text-base leading-relaxed text-pretty text-white sm:text-lg lg:text-xl lg:leading-[1.6]">
              HireLoop connects top talent with world-class companies. Browse
              thousands of curated opportunities and land your next role —
              faster.
            </p>
          </div>
        </div>

        <div className="mt-12 flex w-full flex-col gap-6">
          <form
            role="search"
            action="/browse-jobs"
            method="get"
            className="flex w-full flex-col gap-2 rounded-[16px] border border-white/20 bg-[#101010] p-2 lg:flex-row lg:items-center lg:gap-6 lg:pl-6"
          >
            <div className="flex items-center gap-2 px-2 py-2 lg:w-[316px] lg:px-0 lg:py-0">
              <Search
                className="size-6 shrink-0 text-white"
                aria-hidden="true"
              />
              <label htmlFor="hero-search" className="sr-only">
                Job title, skill or company
              </label>
              <input
                id="hero-search"
                name="search"
                type="text"
                autoComplete="off"
                placeholder="Job title, skill or company"
                className="w-full min-w-0 bg-transparent text-base text-white outline-none placeholder:text-white/60"
              />
            </div>

            <span
              aria-hidden="true"
              className="mx-2 h-px bg-white/20 lg:mx-0 lg:h-6 lg:w-px"
            />

            <div className="flex items-center gap-2 px-2 py-2 lg:w-[316px] lg:px-0 lg:py-0">
              <MapPin
                className="size-6 shrink-0 text-white"
                aria-hidden="true"
              />
              <label htmlFor="hero-location" className="sr-only">
                Location or Remote
              </label>
              <input
                id="hero-location"
                name="location"
                type="text"
                autoComplete="off"
                placeholder="Location or Remote"
                className="w-full min-w-0 bg-transparent text-base text-white outline-none placeholder:text-white/60"
              />
            </div>

            <button
              type="submit"
              aria-label="Search jobs"
              className="grid h-12 w-full place-items-center rounded-[12px] bg-brand text-white transition-colors hover:bg-brand/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60 lg:ml-auto lg:w-12 lg:shrink-0"
            >
              <Search className="size-5" aria-hidden="true" />
            </button>
          </form>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3">
            <span className="font-heading text-sm text-white sm:text-base">
              Trending Position
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {trendingRoles.map((role) => (
                <Link
                  key={role}
                  href={`/jobs?q=${encodeURIComponent(role)}`}
                  className="rounded-full border border-white/10 bg-[#1a1a1b] px-3 py-1.5 font-heading text-xs text-white transition-colors hover:border-white/25 hover:bg-[#232326] sm:text-sm"
                >
                  {role}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export { HeroSection }
