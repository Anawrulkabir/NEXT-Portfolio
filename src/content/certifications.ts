/**
 * Certifications — see docs/PORTFOLIO_REDESIGN.md §06.4
 * ~8-10 certificates exist (F31); none of the details are supplied yet.
 * Production renders only entries whose image.src AND name are set —
 * see the isFilled() helper in index.ts.
 */
import { pending } from './pending'
import type { Certification } from './types'

const slot = (n: number): Certification => ({
  id: `cert-${String(n).padStart(2, '0')}`,
  name: pending(`ADD CERTIFICATE ${n}: name`),
  issuer: pending(`ADD CERTIFICATE ${n}: issuer`),
  date: pending(`ADD CERTIFICATE ${n}: date`),
  credentialUrl: pending(`ADD CERTIFICATE ${n}: credential link — optional`),
  image: {
    id: `cert-${String(n).padStart(2, '0')}-image`,
    src: pending(`ADD CERTIFICATE ${n}: image`),
    // Alt text is required even for placeholders (§15.9); this slot never
    // renders in production anyway since image.src stays pending.
    alt: `Certificate ${n} placeholder`,
    kind: 'certificate',
  },
})

export const certifications: Certification[] = Array.from({ length: 10 }, (_, i) => slot(i + 1))
