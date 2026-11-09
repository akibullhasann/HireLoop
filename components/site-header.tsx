"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"

import logo from "@/app/images/logo.png"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { useSession, signOut } from "@/lib/auth-client"



const authLinks = [
  { label: "Sign In", href: "/sign-in" },
  { label: "Get Started", href: "/sign-up" },
]

function SiteHeader() {
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const pathname = usePathname()
  const { data: session } = useSession();
  console.log('user session in the navbar', session)

  const navLinks = [
  { label: "Browse Jobs", href: "/jobs" },
  { label: "Company", href: "/companies" },
  { label: "Pricing", href: "/pricing" },
  { label: "Dashboard", href: `/dashboard/${session?.user.role || 'seeker'}` },
]

  const closeMobile = () => setMobileOpen(false)

  // The dashboard is a full-height app shell with its own layout, so the
  // marketing header must not overlap the sidebar.
  if (pathname.startsWith("/dashboard")) return null

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`)
  
  const handleSignOut = async () =>{
    await signOut();
  }

  return (
    <header className="sticky top-0 z-40 px-4 pt-4 pb-2 sm:px-6 sm:pt-6">
      <div className="mx-auto flex h-16 w-full max-w-[1320px] items-center gap-4 rounded-[16px] bg-nav px-4 sm:h-[68px] sm:px-5 lg:h-[74px] lg:px-6">
        <Link
          href="/"
          aria-label="HireLoop home"
          className="shrink-0"
          onClick={closeMobile}
        >
          <Image
            src={logo}
            alt="HireLoop"
            priority
            className="h-8 w-auto sm:h-9 lg:h-11"
          />
        </Link>

        <div className="ml-auto hidden items-center gap-6 lg:flex">
          <nav aria-label="Primary" className="flex items-center gap-10">
            {navLinks.map((link) => {
              const active = isActive(link.href)

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "text-base tracking-[-0.0125em] text-nav-foreground transition-colors hover:text-brand",
                    active && "text-brand"
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          <span
            aria-hidden="true"
            className="h-6 w-px bg-[#a8a8a8]/40"
          />

          {session?.user ?
            <div>
              <div className="text-[#EDEDEF]">Welcome,{session.user.name}</div>
              <Button
               onClick={handleSignOut}
               nativeButton={false}
               className="h-[38px] rounded-[8px] bg-transparent px-4 text-lg font-semibold text-[#645AFF] hover:bg-white/5 hover:text-[#645AFF]"
              >Sign Out</Button>
            </div>
            :

            <>
              <div className="flex items-center gap-4">
                <Link
                  href={authLinks[0].href}
                  className={cn(
                    buttonVariants({ variant: "secondary" }),
                    "h-12 rounded-[12px] bg-white px-6 font-button text-lg font-semibold text-brand shadow-none hover:bg-white/90 lg:h-[58px]"
                  )}
                >
                  {authLinks[0].label}
                </Link>
                <Link
                  href={authLinks[1].href}
                  className={cn(
                    buttonVariants(),
                    "h-12 rounded-[12px] px-6 font-cta text-lg font-medium lg:h-[58px]"
                  )}
                >
                  {authLinks[1].label}
                </Link>
              </div>
            </>
          }
        </div>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open navigation menu"
                className="ml-auto size-10 text-nav-foreground hover:bg-white/10 hover:text-nav-foreground lg:hidden"
              />
            }
          >
            <Menu />
          </SheetTrigger>

          <SheetContent
            side="right"
            className="w-full max-w-xs gap-0 border-white/10 bg-[#17171b] text-white sm:max-w-sm"
          >
            <SheetHeader className="border-b border-white/10 px-6 py-5">
              <SheetTitle className="sr-only">Site navigation</SheetTitle>
              <SheetDescription className="sr-only">
                Browse HireLoop pages and account actions.
              </SheetDescription>
              <Link
                href="/"
                aria-label="HireLoop home"
                className="w-fit"
                onClick={closeMobile}
              >
                <Image
                  src={logo}
                  alt="HireLoop"
                  className="h-9 w-auto"
                />
              </Link>
            </SheetHeader>

            <nav
              aria-label="Mobile primary"
              className="flex flex-col gap-1 px-4 py-4"
            >
              {navLinks.map((link) => {
                const active = isActive(link.href)

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMobile}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "rounded-lg px-3 py-3 text-base text-nav-muted transition-colors hover:bg-white/10 hover:text-white",
                      active && "bg-white/10 text-white"
                    )}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </nav>

            <SheetFooter className="mt-auto gap-3 border-t border-white/10 px-6 py-5">
              <Link
                href={authLinks[0].href}
                onClick={closeMobile}
                className={cn(
                  buttonVariants({ variant: "secondary" }),
                  "h-11 w-full rounded-[12px] bg-white font-button text-base font-semibold text-brand shadow-none hover:bg-white/90"
                )}
              >
                {authLinks[0].label}
              </Link>
              <Link
                href={authLinks[1].href}
                onClick={closeMobile}
                className={cn(
                  buttonVariants(),
                  "h-11 w-full rounded-[12px] font-cta text-base font-medium"
                )}
              >
                {authLinks[1].label}
              </Link>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}

export { SiteHeader }
