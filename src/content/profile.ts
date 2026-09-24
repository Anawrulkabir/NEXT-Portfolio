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
  positioning: 'Mechanical engineering student who builds GPU infrastructure',
  sentence:
    'I study mechanical engineering at CUET and work on AI Studio at Poridhi.io, where I helped cut GPU session launch time from 10–15 minutes to 3–5.',
  spine: [
    '2022: I built a remote-controlled soccer robot.',
    '2022–23: competitive programming. ICPC preliminaries twice, 300+ problems.',
    '2025: I joined Poridhi.io and started building GPU infrastructure.',
    'Now: a thesis that teaches a neural network the physics of airflow.',
  ],
  location: 'Chattogram, Bangladesh',
  about: [
    // Plain, specific, first person — every sentence carries a fact from the CV (Jul 2026).
    'At Poridhi.io I work on AI Studio, an on-demand GPU platform. I set up its first AWS stack, then co-engineered its move to a bare-metal Kubernetes cluster, where HAMi splits each RTX 4090 into six isolated 8 GB slices. Starting a GPU session used to take 10–15 minutes; now it takes 3–5. I also built the backend of TensorCode, an in-browser GPU IDE, on Cloudflare’s edge.',
    'I also study mechanical engineering at CUET. My thesis trains a physics-informed neural network to predict airflow around a NACA 0012 airfoil, then adapts it to steep angles of attack with LoRA-style fine-tuning instead of retraining from scratch. Separately, I work on machine-learning models for heat transfer in low-GWP refrigerants.',
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
      'I want to use machine learning to model real engineering systems, starting with fluid flow and heat transfer.',
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
