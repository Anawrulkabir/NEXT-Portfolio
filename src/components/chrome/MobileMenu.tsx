'use client'
import Link from 'next/link'
import { Menu } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import type { Link as ContentLink } from '@/content/types'

type NavItem = { label: string; href: string }

export function MobileMenu({
  navItems,
  links,
}: {
  navItems: NavItem[]
  links: ContentLink[]
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          type="button"
          className="pixel-focus lg:hidden inline-flex items-center justify-center h-11 w-11 text-parchment"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <nav className="mt-4 flex flex-col text-base" aria-label="Site">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="pixel-focus hover:underline py-2.5">
              {item.label}
            </Link>
          ))}
        </nav>
        <hr className="my-6 border-loam" />
        <nav className="flex flex-col text-sm" aria-label="Contact links">
          {links.map((link) => (
            <a
              key={link.kind}
              href={link.href}
              target={link.kind === 'email' ? undefined : '_blank'}
              rel={link.kind === 'email' ? undefined : 'noopener noreferrer'}
              className="pixel-focus hover:underline py-2.5"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
