/**
 * Profile content — see docs/PORTFOLIO_REDESIGN.md §06.4
 *
 * Every fact here traces to the Verified Facts Ledger (§00.3). Fields the
 * author hasn't confirmed are `pending()` and render nothing in production.
 */
import { pending } from './pending'
import type { Profile } from './types'

export const profile: Profile = {
  name: 'Md Anawrul Kabir Fahad',
  shortName: 'Fahad Kabir',
  positioning: 'Mechanical Engineering × AI × Software Infrastructure',
  sentence:
    'I build systems at the intersection of engineering, software, AI infrastructure, and computational research.',
  spine: [
    'I started by building machines.',
    'Then I learned to build software.',
    'Then I learned to build the infrastructure behind AI.',
    'Now I apply computational intelligence to engineering problems.',
  ],
  location: 'Chattogram, Bangladesh',
  about: [
    // Draft — author to approve (§14 blocker). Tense depends on C1.
    'I study Mechanical Engineering at CUET and work as a software engineer at Poridhi.io, where I build the GPU platform behind AI Studio. I started with robots — a remote-controlled soccer bot in 2022 — then spent two years on competitive programming before moving into backend and infrastructure work.',
    'My research brings that computing background back to engineering: a physics-informed neural network solver for airfoil flow in my thesis, and machine-learning models for heat transfer in low-GWP refrigerants. I am most interested in problems where physical understanding and learned models have to work together.',
  ],
  portrait: pending('ADD PROFESSIONAL PORTRAIT or confirm reuse of fahad.jpg'),
  education: [
    {
      id: 'cuet-bsc-me',
      institution: 'Chittagong University of Engineering & Technology (CUET)',
      degree: 'B.Sc. in Mechanical Engineering',
      location: 'Chattogram, Bangladesh',
      dates: { start: '2022-04', end: 'expected', endLabel: 'Jul 2026 (expected)' }, // C1
      status: 'in-progress',
      details: [
        pending('ADD CGPA — optional'),
        pending('ADD relevant coursework — optional'),
      ],
    },
  ],
  destination: {
    heading: "This is where I'm going.",
    line: pending('CONFIRM destination line (C4): AI × ME only, or also AI systems/infra?', true),
    sentence:
      'Using computational and AI methods to understand and model real engineering systems.',
  },
  cv: {
    viewHref: '/cv',
    downloadHref: '/cv/Md-Anawrul-Kabir-Fahad-CV.pdf',
    updated: '2026-07',
    academic: pending('ADD ACADEMIC CV — optional'),
  },
  links: [
    { kind: 'email', label: 'Email', href: 'mailto:mdanawrulkabirfahad123@gmail.com' },
    { kind: 'linkedin', label: 'LinkedIn', href: 'https://linkedin.com/in/anawrulkabir' },
    { kind: 'github', label: 'GitHub', href: 'https://github.com/anawrulkabir' },
    {
      kind: 'codeforces',
      label: 'Codeforces',
      href: 'https://codeforces.com/profile/fahadkabir123',
      verify: true,
    },
    {
      kind: 'codechef',
      label: 'CodeChef',
      href: 'https://www.codechef.com/users/fahadkabir123',
      verify: true,
    },
    // scholar / orcid: add only when they exist
  ],
}
