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
  positioning: 'Mechanical engineering student and software engineer',
  sentence:
    'I study Mechanical Engineering at CUET, and for over a year I worked on GPU platforms at Poridhi.io. I like problems where physics, data and software meet.',
  spine: [
    '2022: I built a remote-controlled soccer robot.',
    '2022–23: competitive programming. ICPC preliminaries twice, 300+ problems.',
    '2025: I joined Poridhi.io and started building GPU infrastructure.',
    'Now: a thesis that teaches a neural network the physics of airflow.',
  ],
  location: 'Chattogram, Bangladesh',
  about: [
    // Plain, specific, first person — every sentence restates the current SWE and Academic CVs (Oct 2026).
    'From May 2025 to July 2026 I worked at Poridhi.io. On AI Studio, which gives users GPU workspaces with Jupyter or VS Code, I developed the Next.js frontend and partnered with the team to move the platform from AWS to a Kubernetes cluster on the company GPU server. There, six users share 48 GB of GPU memory as isolated 8 GB slices, and starting a session went from 10–15 minutes to 3–5. On TensorCode, a browser platform for AI, GPU and kernel programming, I owned the frontend from the first version and co-developed TensorRAG, a visual tool for building ML training pipelines.',
    'I study Mechanical Engineering at CUET. My thesis adapts a released physics-informed airfoil surrogate to conditions beyond its training range with low-rank updates, and measures what it forgets. Separately, I build machine-learning models of heat transfer for two low-GWP refrigerants and test them on operating conditions left out of training.',
  ],
  // C5 resolved: new professional portrait supplied by the author (Sep 2026).
  portrait: {
    id: 'portrait',
    src: '/media/portrait/fahad.webp',
    alt: 'Portrait of Md Anawrul Kabir Fahad in a navy suit and glasses',
    kind: 'portrait',
  },
  education: [
    {
      id: 'cuet-bsc-me',
      institution: 'Chittagong University of Engineering & Technology (CUET)',
      degree: 'B.Sc. in Mechanical Engineering',
      location: 'Chattogram, Bangladesh',
      dates: { start: '2022-04', end: 'present', endLabel: 'Present' }, // both CVs: in progress, Apr 2022 – Present
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
      'I want to use machine learning to model real engineering systems, starting with fluid flow and heat transfer.',
  },
  cv: {
    viewHref: '/cv',
    downloadHref: '/cv/Md-Anawrul-Kabir-Fahad-SWE-CV.pdf',
    updated: '2026-07',
    academic: '/cv/Md-Anawrul-Kabir-Fahad-Academic-CV.pdf',
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
