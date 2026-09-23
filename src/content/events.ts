/**
 * Events / conferences — see docs/PORTFOLIO_REDESIGN.md §06.4
 *
 * Sep 2026: names, organizers, dates, teams and results below were read off
 * the author's certificates and event badges (see certifications.ts). Where
 * a certificate doesn't say something (place, result), it stays pending.
 */
import { pending } from './pending'
import type { EventItem, ImageAsset } from './types'

/** Badge photo at /public/media/events/<id>-badge.webp; size comes from media.json. */
const badge = (id: string, alt: string): ImageAsset => ({
  id: `${id}-badge`,
  src: `/media/events/${id}-badge.webp`,
  alt,
  kind: 'photo',
})

export const events: EventItem[] = [
  {
    id: 'break-the-monolith-2025',
    type: 'hackathon',
    name: 'Break The Monolith Microservice Hackathon',
    organizer: 'IEEE Computer Society, CUET Student Branch Chapter',
    date: '2025',
    place: pending('ADD place'),
    role: 'Team member, Team_Deadlock',
    result: 'Champion',
    images: [],
    links: [],
    relatedProjectId: 'ride-sharing-microservices',
  },
  {
    id: 'api-avenger-cuet-2025',
    type: 'hackathon',
    name: 'API Avengers, Televerse 1.0',
    organizer: 'Department of Electronics and Telecommunication Engineering, CUET',
    date: '2025',
    place: 'CUET, Chattogram',
    role: 'Participant',
    result: 'Finalist · CUET Rising Team',
    images: [
      badge(
        'televerse',
        'Televerse 1.0 participant badge with the name Fahad, organized by the Department of ETE, CUET'
      ),
    ],
    links: [],
    relatedProjectId: 'donation-backend',
  },
  {
    id: 'bs23-ai-engineering-hackathon',
    type: 'hackathon',
    name: 'AI Engineering Hackathon 2025',
    organizer: 'Poridhi.io, powered by Brain Station 23',
    date: '2025-04',
    place: 'Brain Station 23, Mohakhali, Dhaka',
    role: 'Participant, team 43',
    result: pending('ADD result — optional, none stated in CV'),
    images: [
      badge(
        'ai-engineering-hackathon',
        'AI Engineering Hackathon participant badge: name Fahad, team 43, Brain Station 23, Dhaka'
      ),
    ],
    links: [],
    relatedProjectId: 'intent-product-search',
  },
  {
    id: 'nextgen-hackathon-2025',
    type: 'hackathon',
    name: 'NextGen Hackathon 2025',
    organizer: 'Programming Hero, powered by Liberate Labs — IIUC Tech Fest 2025',
    date: '2025-11-14',
    place: 'IIUC campus, Kumira, Chattogram',
    role: 'Participant, team Innovatrix',
    images: [
      badge(
        'nextgen-hackathon',
        'NextGen Hackathon badge for team Innovatrix, 14 November 2025, IIUC campus, Kumira, Chattogram'
      ),
    ],
    links: [],
  },
  {
    id: 'nsu-techfest-webxtreme-2025',
    type: 'hackathon',
    name: 'WebXtreme 25 Hackathon, NSU Tech Fest 2025',
    organizer: 'North South University (NSUCEC)',
    date: '2025',
    place: 'North South University, Dhaka',
    role: 'Participant',
    images: [],
    links: [],
  },
  {
    id: 'icpc-preliminaries',
    type: 'competition',
    name: 'ICPC Preliminaries',
    date: '2022, 2023',
    place: pending('ADD place'),
    role: pending('ADD team name / role'),
    result: pending('ADD result — optional'),
    images: [],
    links: [],
  },
  {
    id: 'cuet-iupc',
    type: 'competition',
    name: 'CUET IUPC',
    date: '2022–2023',
    place: pending('ADD place'),
    role: pending('ADD team name / role'),
    result: pending('ADD result — optional'),
    images: [],
    links: [],
  },
  {
    id: 'asrro-robocoder-2022',
    type: 'competition',
    name: 'ASRRO Robocoder Programming Contest',
    organizer: 'Andromeda Space and Robotics Research Organization (ASRRO), CUET',
    date: '2022-11-30',
    place: 'CUET, Chattogram',
    role: 'Participant',
    images: [],
    links: [],
  },
  {
    id: 'robosoccer-cuss-2022',
    type: 'competition',
    name: 'Robo Soccer, Chittagong Science Carnival 2.0',
    organizer: 'Chittagong University Scientific Society (CUSS)',
    date: '2022-05', // VERIFY: CV-old says May–Jun 2022; the certificate carries no date
    place: pending('ADD place'),
    role: 'Built and programmed a remote-controlled Soccer Bot (Arduino)',
    result: pending('ADD result — optional'),
    images: [],
    links: [],
    relatedProjectId: 'soccer-bot',
  },
  {
    id: 'business-competition',
    type: 'business-competition',
    name: pending('ADD business competition name'),
    organizer: pending('ADD organizer'),
    date: pending('ADD date'),
    place: pending('ADD place'),
    role: pending('ADD team / idea / your role'),
    result: pending('ADD result'),
    summary: 'Took part in a business competition.',
    images: [],
    links: [],
  },
  {
    id: 'betic-event',
    type: 'research-event',
    name: pending('ADD exact BETIC-related event name'),
    organizer: pending('ADD organizer'),
    date: pending('ADD date'),
    place: pending('ADD place'),
    role: pending('ADD your role'),
    images: [],
    links: [],
  },
]
