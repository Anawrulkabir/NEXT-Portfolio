/**
 * Certificates — see docs/PORTFOLIO_REDESIGN.md §06.4, §05.2 Room R1.
 * Photographed by the author (Sep 2026); cropped and re-encoded (EXIF
 * stripped) into /public/media/certificates. Each text field below is read
 * off the certificate itself — nothing is inferred.
 */
import type { Certification } from './types'

/** Image at /public/media/certificates/<id>.webp; size comes from media.json. */
const img = (id: string, alt: string) => ({
  id: `${id}-image`,
  src: `/media/certificates/${id}.webp`,
  alt,
  kind: 'certificate' as const,
})

export const certifications: Certification[] = [
  {
    id: 'break-the-monolith-champion',
    name: 'Champion — Break The Monolith Microservice Hackathon (Team_Deadlock)',
    issuer: 'IEEE Computer Society, CUET Student Branch Chapter',
    date: '2025',
    kind: 'award',
    category: 'programming',
    eventId: 'break-the-monolith-2025',
    image: img(
      'break-the-monolith-champion',
      'Certificate of Achievement: Md Anawrul Kabir Fahad, member of Team_Deadlock, Champion in the Break The Monolith Microservice Hackathon'
    ),
  },
  {
    id: 'api-avengers-finalist',
    name: 'Finalist — API Avengers, Televerse 1.0',
    issuer: 'Department of Electronics and Telecommunication Engineering, CUET',
    date: '2025',
    kind: 'award',
    category: 'programming',
    eventId: 'api-avenger-cuet-2025',
    image: img(
      'api-avengers-finalist',
      'Certificate of Appreciation: Md Anawrul Kabir Fahad, finalist in API Avengers under Televerse 1.0, Department of ETE, CUET'
    ),
  },
  {
    id: 'api-avengers-rising-team',
    name: 'CUET Rising Team — API Avengers, Televerse 1.0',
    issuer: 'Department of Electronics and Telecommunication Engineering, CUET',
    date: '2025',
    kind: 'award',
    category: 'programming',
    eventId: 'api-avenger-cuet-2025',
    image: img(
      'api-avengers-rising-team',
      'Certificate of Appreciation: Md Anawrul Kabir Fahad, CUET Rising Team in API Avengers under Televerse 1.0'
    ),
  },
  {
    id: 'ai-engineering-hackathon-2025',
    name: 'Participation — AI Engineering Hackathon 2025',
    issuer: 'Poridhi.io, powered by Brain Station 23',
    date: '2025-04-26',
    kind: 'participation',
    category: 'ml',
    eventId: 'bs23-ai-engineering-hackathon',
    image: img(
      'ai-engineering-hackathon-2025',
      'Certificate of Participation in the AI Engineering Hackathon 2025 by Poridhi.io, powered by Brain Station 23, dated 26 April 2025'
    ),
  },
  {
    id: 'nextgen-hackathon-2025',
    name: 'Participation — NextGen Hackathon 2025, IIUC Tech Fest 2025',
    issuer: 'Programming Hero and International Islamic University Chittagong',
    date: '2025-11',
    kind: 'participation',
    category: 'programming',
    eventId: 'nextgen-hackathon-2025',
    image: img(
      'nextgen-hackathon-2025',
      'Certificate of Participation, IIUC Tech Fest 2025: completing the Programming Hero NextGen Hackathon 2025, powered by Liberate Labs'
    ),
  },
  {
    id: 'nsu-techfest-webxtreme-2025',
    name: 'Participation — WebXtreme 25 Hackathon, NSU Tech Fest 2025',
    issuer: 'North South University (NSUCEC)',
    date: '2025',
    kind: 'participation',
    category: 'programming',
    eventId: 'nsu-techfest-webxtreme-2025',
    image: img(
      'nsu-techfest-webxtreme-2025',
      'Certificate for Participation in the WebXtreme 25 Hackathon at North South University Tech Fest 2025'
    ),
  },
  {
    id: 'asrro-robocoder-2022',
    name: 'Participation — ASRRO Robocoder Programming Contest',
    issuer: 'Andromeda Space and Robotics Research Organization (ASRRO), CUET',
    date: '2022-11-30',
    kind: 'participation',
    category: 'programming',
    eventId: 'asrro-robocoder-2022',
    image: img(
      'asrro-robocoder-2022',
      'Certificate of Participation in the ASRRO Robocoder Programming Contest, 30 November 2022, by the Andromeda Space and Robotics Research Organization, CUET'
    ),
  },
  {
    id: 'cuss-robo-soccer',
    name: 'Recognition — Robo Soccer, Chittagong Science Carnival 2.0',
    issuer: 'Chittagong University Scientific Society (CUSS)',
    date: '2022',
    kind: 'participation',
    category: 'engineering',
    eventId: 'robosoccer-cuss-2022',
    image: img(
      'cuss-robo-soccer',
      'Certificate of Recognition for participation in Robo Soccer at Chittagong Science Carnival 2.0, hosted by the Chittagong University Scientific Society'
    ),
  },
]
