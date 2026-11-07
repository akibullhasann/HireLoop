import Image from "next/image"
import Link from "next/link"

import globe from "@/app/images/globe.png"
import { cn } from "@/lib/utils"

type AuthMode = "sign-in" | "sign-up"

const authTabs: { mode: AuthMode; label: string; href: string }[] = [
  { mode: "sign-in", label: "Sign in", href: "/sign-in" },
  { mode: "sign-up", label: "Sign up", href: "/sign-up" },
]

type AuthPageShellProps = {
  mode: AuthMode
  eyebrow: string
  title: string
  description: string
  children: React.ReactNode
}

function AuthPageShell({
  mode,
  eyebrow,
  title,
  description,
  children,
}: AuthPageShellProps) {
  return (
    <main className="relative isolate overflow-hidden bg-[#010103]">
      <Image
        src={globe}
        alt=""
        aria-hidden="true"
        priority
        sizes="100vw"
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-auto w-[1440px] min-w-full max-w-none -translate-x-1/2 opacity-60 select-none"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(92,83,254,0.22),transparent_60%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-b from-transparent to-[#010103]"
      />

      <div className="mx-auto flex w-full max-w-[1100px] flex-col items-center px-5 pt-12 pb-20 sm:px-6 sm:pt-16 lg:pt-20">
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="rounded-full border border-white/15 bg-white/[0.04] px-4 py-1.5 font-label text-[11px] tracking-[0.18em] text-white/70 uppercase">
            {eyebrow}
          </span>
          <h1 className="text-balance font-heading text-4xl font-bold tracking-[-0.02em] text-white sm:text-5xl">
            {title}
          </h1>
          <p className="max-w-lg text-pretty font-heading text-base leading-relaxed text-white/60 sm:text-lg">
            {description}
          </p>
        </div>

        <div className="mt-10 w-full max-w-[480px] rounded-[20px] border border-white/10 bg-[#0b0a10]/80 p-6 shadow-[0_40px_120px_-60px_rgba(92,83,254,0.8)] backdrop-blur-xl sm:p-8">
          <div
            role="tablist"
            aria-label="Authentication"
            className="mb-7 grid grid-cols-2 gap-1 rounded-[12px] border border-white/10 bg-white/[0.03] p-1"
          >
            {authTabs.map((tab) => (
              <Link
                key={tab.mode}
                href={tab.href}
                role="tab"
                aria-selected={mode === tab.mode}
                className={cn(
                  "rounded-[9px] px-4 py-2 text-center font-button text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
                  mode === tab.mode
                    ? "bg-brand text-white shadow-[0_6px_20px_-8px_rgba(92,83,254,0.9)]"
                    : "text-white/55 hover:text-white"
                )}
              >
                {tab.label}
              </Link>
            ))}
          </div>

          {children}
        </div>
      </div>
    </main>
  )
}

export { AuthPageShell }
export type { AuthMode }
