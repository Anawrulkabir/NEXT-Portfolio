import { ExternalLink } from 'lucide-react'
import { visibleLinks, type Link } from '@/content'

export function LinkRow({ links, className }: { links: Link[]; className?: string }) {
  const shown = visibleLinks(links)
  if (!shown.length) return null
  return (
    <ul className={`flex flex-wrap gap-x-4 gap-y-2 text-sm ${className ?? ''}`}>
      {shown.map((link) => (
        <li key={link.href}>
          <a
            href={link.href}
            target={link.kind === 'email' ? undefined : '_blank'}
            rel={link.kind === 'email' ? undefined : 'noopener noreferrer'}
            className="pixel-focus inline-flex items-center gap-1 underline underline-offset-2"
          >
            {link.label}
            {link.kind !== 'email' && <ExternalLink className="h-3 w-3" aria-hidden="true" />}
          </a>
        </li>
      ))}
    </ul>
  )
}
