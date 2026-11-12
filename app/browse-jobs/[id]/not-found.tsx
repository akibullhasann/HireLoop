import Link from "next/link"
import { SearchX } from "lucide-react"

export default function JobDetailsNotFound() {
  return (
    <main className="min-h-svh bg-[#08080a] px-5 pt-6 pb-24 text-white sm:px-6 sm:pt-8 lg:px-8">
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="flex flex-col items-center gap-2 rounded-[12px] border border-dashed border-white/10 bg-[#0c0c0f]/60 px-6 py-16 text-center">
          <SearchX aria-hidden="true" className="size-8 text-[#6e6e78]" />
          <h1 className="mt-2 font-heading text-base font-semibold text-white">
            This job is no longer available
          </h1>
          <p className="max-w-sm text-[13px] text-[#828997]">
            It may have been closed or removed by the employer.
          </p>
          <Link
            href="/browse-jobs"
            className="mt-4 inline-flex h-10 items-center justify-center rounded-[8px] bg-white px-5 text-[13px] font-medium text-[#0b0b0c] transition-colors hover:bg-white/90"
          >
            Browse open roles
          </Link>
        </div>
      </div>
    </main>
  )
}
