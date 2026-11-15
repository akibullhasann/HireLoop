"use client"

import * as React from "react"
import { Check, Copy } from "lucide-react"

import { toast } from "@/components/ui/toast"
import { cn } from "@/lib/utils"

type CopyButtonProps = {
  value: string
  label?: string
  className?: string
}

/**
 * Small copy-to-clipboard affordance for receipt identifiers. It only reads
 * from the browser clipboard API, so it has to be a client component.
 */
function CopyButton({ value, label = "value", className }: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      toast.add({
        title: "Copied to clipboard",
        description: `The ${label.toLowerCase()} is ready to paste.`,
      })
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.add({
        title: "Couldn't copy automatically",
        description: "Select the text and copy it manually.",
      })
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={`Copy ${label.toLowerCase()}`}
      className={cn(
        "grid size-8 shrink-0 place-items-center rounded-[6px] border border-white/[0.07] bg-[#222228] text-[#a0a0ab] transition-colors outline-none hover:bg-white/[0.08] hover:text-[#ededef] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
        className
      )}
    >
      {copied ? (
        <Check aria-hidden="true" className="size-3.5 text-emerald-400" />
      ) : (
        <Copy aria-hidden="true" className="size-3.5" />
      )}
    </button>
  )
}

export { CopyButton }
