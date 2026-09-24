'use client'
/**
 * FahadOS apps — every word comes from src/content (the verified content
 * layer), so the OS is a new presentation of the same facts, not a copy.
 */
import { useEffect, useRef, useState } from 'react'
import {
  experience,
  filledCertifications,
  isPending,
  isSkillVisible,
  profile,
  projects,
  projectTitle,
  research,
  researchStatusLabel,
  skillGroups,
  skillsByGroup,
  skillById,
  visibleLinks,
  type Project,
} from '@/content'
import { formatDate } from '@/lib/format'

const email = profile.links.find((l) => l.kind === 'email')!.href.replace('mailto:', '')

export function WelcomeApp({ open }: { open: (id: string) => void }) {
  return (
    <div className="p-5 space-y-3 text-[15px] leading-relaxed">
      <p className="font-display text-2xl">Welcome to FahadOS</p>
      <p>
        Hi, I&rsquo;m <b>{profile.name}</b>: {profile.positioning}.
      </p>
      <p>{profile.sentence}</p>
      <p className="text-sm opacity-80">Click an icon on the desktop, or start here:</p>
      <div className="flex flex-wrap gap-2">
        {[
          ['about', 'About me'],
          ['experience', 'Experience'],
          ['research', 'Research'],
          ['certificates', 'Certificates'],
          ['terminal', 'Terminal'],
        ].map(([id, label]) => (
          <button key={id} type="button" onClick={() => open(id)} className="os-btn px-3 py-1.5 text-sm">
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}

export function AboutApp() {
  const edu = profile.education[0]
  const portrait = !isPending(profile.portrait) ? profile.portrait : null
  return (
    <div className="p-5 flex gap-5 text-[15px] leading-relaxed">
      {portrait && typeof portrait.src === 'string' && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img src={portrait.src} alt={portrait.alt} className="w-40 h-52 object-cover object-top os-inset shrink-0" />
      )}
      <div className="space-y-3">
        <p className="font-display text-xl">{profile.name}</p>
        <p className="text-[#2f6b6e] font-semibold">{profile.positioning}</p>
        {profile.about.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
        <p className="text-sm">
          <b>{edu.degree}</b>, {edu.institution} · {edu.dates.endLabel ?? edu.dates.end}
        </p>
      </div>
    </div>
  )
}

export function ExperienceApp() {
  return (
    <div className="p-5 space-y-5 text-[14px] leading-relaxed">
      {experience.map((x) => (
        <div key={x.id}>
          <p className="font-display text-xl">
            {x.org} <span className="text-sm font-sans opacity-70">· {x.location}</span>
          </p>
          {x.roles.map((r) => (
            <div key={r.id} className="mt-3 pl-3 border-l-4 border-[#4f7a4a]">
              <p className="font-semibold">
                {r.title}{' '}
                <span className="font-normal opacity-70">
                  · {formatDate(r.dates.start)} – {r.dates.end === 'present' ? 'Present' : formatDate(r.dates.end)}
                </span>
              </p>
              {r.groups.map((g, i) => (
                <div key={i} className="mt-2">
                  {g.product && <p className="text-sm font-semibold text-[#2f6b6e]">{g.product}</p>}
                  <ul className="list-disc pl-5 space-y-1">
                    {g.bullets.map((b, j) => (
                      <li key={j}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export function ProjectsApp() {
  const list = projects.filter((p) => projectTitle(p))
  const [sel, setSel] = useState<Project>(list[0])
  return (
    <div className="flex h-full text-[14px]">
      <ul className="w-56 shrink-0 os-inset bg-white m-2 overflow-auto">
        {list.map((p) => (
          <li key={p.id}>
            <button
              type="button"
              onClick={() => setSel(p)}
              className={`w-full text-left px-2 py-1.5 ${sel.id === p.id ? 'bg-[#2f4a34] text-white' : 'hover:bg-[#e6e1d3]'}`}
            >
              {projectTitle(p)}
            </button>
          </li>
        ))}
      </ul>
      <div className="p-4 overflow-auto space-y-2 leading-relaxed">
        <p className="font-display text-xl">{projectTitle(sel)}</p>
        {sel.result && !isPending(sel.result) && (
          <p className="inline-block bg-[#2f4a34] text-white text-xs px-2 py-0.5">{sel.result}</p>
        )}
        <p>{sel.oneLine}</p>
        {sel.contribution.filter((c) => !isPending(c)).length > 0 && (
          <ul className="list-disc pl-5">
            {sel.contribution.map((c, i) => (!isPending(c) ? <li key={i}>{c}</li> : null))}
          </ul>
        )}
        <p className="flex flex-wrap gap-1">
          {sel.tech
            .filter((id) => !skillById[id] || isSkillVisible(skillById[id]))
            .map((id) => (
              <span key={id} className="os-inset px-1.5 text-xs bg-white">
                {skillById[id]?.name ?? id}
              </span>
            ))}
        </p>
        <p className="flex gap-3 text-sm">
          {visibleLinks(sel.links).map((l) => (
            <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="underline text-[#1d4fb8]">
              {l.label} ↗
            </a>
          ))}
          <a href={`/projects/${sel.id}`} target="_blank" className="underline text-[#1d4fb8]">
            Full page ↗
          </a>
        </p>
      </div>
    </div>
  )
}

export function ResearchApp() {
  return (
    <div className="p-5 space-y-4 text-[14px] leading-relaxed">
      {research.map((r) => (
        <div key={r.id} className="os-inset bg-white p-3">
          <p className="inline-block text-xs font-semibold bg-[#7a3d22] text-white px-2 py-0.5">
            {researchStatusLabel[r.status]}
          </p>
          <p className="mt-2 font-semibold">{isPending(r.title) ? r.shortTitle : r.title}</p>
          <p>{r.oneLine}</p>
          {r.supervisor && !isPending(r.supervisor) && <p className="text-sm opacity-80">Supervisor: {r.supervisor}</p>}
          <a href={`/research/${r.id}`} target="_blank" className="text-sm underline text-[#1d4fb8]">
            Read more ↗
          </a>
        </div>
      ))}
    </div>
  )
}

export function CertificatesApp() {
  const [view, setView] = useState<number | null>(null)
  const certs = filledCertifications
  if (view !== null) {
    const c = certs[view]
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center gap-2 p-2 text-sm">
          <button type="button" className="os-btn px-2" onClick={() => setView(null)}>
            ← All
          </button>
          <button type="button" className="os-btn px-2" onClick={() => setView((view - 1 + certs.length) % certs.length)}>
            ◀
          </button>
          <button type="button" className="os-btn px-2" onClick={() => setView((view + 1) % certs.length)}>
            ▶
          </button>
          <span className="truncate">{c.name as string}</span>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={c.image.src as string} alt={c.image.alt} className="flex-1 min-h-0 object-contain bg-[#1b1e25]" />
      </div>
    )
  }
  return (
    <ul className="p-4 grid grid-cols-4 gap-4">
      {certs.map((c, i) => (
        <li key={c.id}>
          <button type="button" onClick={() => setView(i)} className="block text-left group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={c.image.src as string}
              alt=""
              className="w-full aspect-[4/3] object-cover border-4 border-[#8a6a45] group-hover:-translate-y-0.5 transition-transform"
            />
            <span className="block mt-1 text-xs leading-snug">{c.name as string}</span>
          </button>
        </li>
      ))}
    </ul>
  )
}

export function SkillsApp() {
  return (
    <div className="p-4 grid grid-cols-2 gap-3 text-[13px]">
      {skillGroups.map((g) => (
        <div key={g.id} className="os-inset bg-white p-2">
          <p className="font-semibold">{g.name}</p>
          <p className="mt-1 flex flex-wrap gap-1">
            {skillsByGroup(g.id)
              .filter(isSkillVisible)
              .map((s) => (
                <span key={s.id} className="bg-[#e6e1d3] px-1.5">
                  {s.name}
                </span>
              ))}
          </p>
        </div>
      ))}
    </div>
  )
}

export function ContactApp() {
  const [copied, setCopied] = useState(false)
  return (
    <div className="p-5 space-y-3 text-[15px]">
      <p className="font-display text-xl">Get in touch</p>
      <p className="flex items-center gap-2">
        <a href={`mailto:${email}`} className="underline text-[#1d4fb8]">
          {email}
        </a>
        <button
          type="button"
          className="os-btn px-2 text-sm"
          onClick={() => {
            navigator.clipboard?.writeText(email).then(() => {
              setCopied(true)
              setTimeout(() => setCopied(false), 1500)
            })
          }}
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </p>
      <ul className="space-y-1">
        {visibleLinks(profile.links)
          .filter((l) => l.kind !== 'email')
          .map((l) => (
            <li key={l.kind}>
              <a href={l.href} target="_blank" rel="noopener noreferrer" className="underline text-[#1d4fb8]">
                {l.label} ↗
              </a>
            </li>
          ))}
      </ul>
    </div>
  )
}

/** A small shell. Commands answer from the content layer. */
export function TerminalApp() {
  const [lines, setLines] = useState<string[]>(['FahadOS terminal. Type `help`.'])
  const [cmd, setCmd] = useState('')
  const endRef = useRef<HTMLDivElement>(null)
  useEffect(() => endRef.current?.scrollIntoView({ block: 'end' }), [lines])

  const run = (raw: string) => {
    const c = raw.trim().toLowerCase()
    const out: string[] = []
    if (c === 'help') out.push('whoami  experience  research  skills  projects  contact  hire-me  clear')
    else if (c === 'whoami') out.push(`${profile.name} — ${profile.positioning}`, profile.location)
    else if (c === 'experience')
      experience[0].roles.forEach((r) => out.push(`${r.title} @ ${experience[0].org} (${formatDate(r.dates.start)} – ${r.dates.end === 'present' ? 'now' : formatDate(r.dates.end)})`))
    else if (c === 'research') research.forEach((r) => out.push(`[${researchStatusLabel[r.status]}] ${r.shortTitle}`))
    else if (c === 'skills')
      skillGroups.forEach((g) =>
        out.push(`${g.name}: ${skillsByGroup(g.id).filter(isSkillVisible).map((s) => s.name).join(', ')}`)
      )
    else if (c === 'projects') projects.filter((p) => projectTitle(p)).forEach((p) => out.push(`- ${projectTitle(p)}`))
    else if (c === 'contact') out.push(email)
    else if (c === 'hire-me' || c === 'sudo hire-me') out.push('Opening the one-minute brief… → /hire')
    else if (c === 'clear') {
      setLines([])
      return
    } else if (c) out.push(`command not found: ${c}`)
    setLines((l) => [...l, `fahad@os:~$ ${raw}`, ...out])
    if (c === 'hire-me' || c === 'sudo hire-me') window.open('/hire', '_blank')
  }

  return (
    <div className="h-full bg-[#0d1110] text-[#9fe0a8] font-mono text-[13px] p-3 overflow-auto">
      {lines.map((l, i) => (
        <div key={i} className="whitespace-pre-wrap">
          {l}
        </div>
      ))}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          run(cmd)
          setCmd('')
        }}
        className="flex"
      >
        <span>fahad@os:~$&nbsp;</span>
        <input
          aria-label="Terminal command"
          value={cmd}
          onChange={(e) => setCmd(e.target.value)}
          className="flex-1 bg-transparent outline-none text-[#9fe0a8]"
          autoFocus
          spellCheck={false}
        />
      </form>
      <div ref={endRef} />
    </div>
  )
}
