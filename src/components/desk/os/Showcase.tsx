'use client'
/**
 * "Fahad Kabir — Showcase '26": a small editorial website that lives inside
 * the FahadOS window (and full-screen on phones). Every word and image comes
 * from src/content; pending fields render nothing.
 */
import { Fragment, useRef, useState, type ReactNode } from 'react'
import { useDesk } from '../DeskDataContext'
import type { DeskData } from '../data'
import { PixelIcon } from './Win95'

export type Page =
  | 'home'
  | 'about'
  | 'experience'
  | 'projects'
  | 'software'
  | 'hackathons'
  | 'hardware'
  | 'research'
  | 'certificates'
  | 'contact'

const NAV: { id: Page; label: string; children?: { id: Page; label: string }[] }[] = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  {
    id: 'projects',
    label: 'Projects',
    children: [
      { id: 'software', label: 'Software' },
      { id: 'hackathons', label: 'Hackathons' },
      { id: 'hardware', label: 'Hardware' },
    ],
  },
  { id: 'research', label: 'Research' },
  { id: 'certificates', label: 'Certificates' },
  { id: 'contact', label: 'Contact' },
]

type Shelf = DeskData['projects'][number]['shelf']
type LinkItem = { label: string; href: string }
const hostOf = (href: string) => href.replace(/^mailto:/, '').replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')

function A({ href, children }: { href: string; children: ReactNode }) {
  const external = /^https?:/.test(href)
  return (
    <a href={href} className="sc-link" {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
      {children}
    </a>
  )
}

function Figure({ src, alt, n, caption, onOpen }: { src: string; alt: string; n: number; caption: string; onOpen?: () => void }) {
  const img = (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img src={src} alt={alt} className="w-full border border-black/80 bg-[#eee]" loading="lazy" />
  )
  return (
    <figure className="my-6">
      {onOpen ? (
        <button type="button" onClick={onOpen} className="block w-full cursor-zoom-in">
          {img}
        </button>
      ) : (
        img
      )}
      <figcaption className="mt-2 text-center text-[12px] italic">
        <b className="not-italic">Figure {n}:</b> {caption}
      </figcaption>
    </figure>
  )
}

function LinkList({ links }: { links: LinkItem[] }) {
  if (!links.length) return null
  return (
    <ul className="mt-2 space-y-0.5 text-[14px]">
      {links.map((l) => (
        <li key={l.href}>
          <b>[{l.label}]</b> – <A href={l.href}>{hostOf(l.href)}</A>
        </li>
      ))}
    </ul>
  )
}

function ResumeCallout() {
  const { profile } = useDesk()
  return (
    <div className="my-6 flex items-center gap-4 border-y-2 border-black py-3">
      <PixelIcon name="document" size={40} />
      <div>
        <p className="font-showcase text-[18px] font-bold leading-tight">Looking for my resume?</p>
        <A href={profile.cv.download}>Click here to download it!</A>
      </div>
    </div>
  )
}

function H1({ children, sub }: { children: ReactNode; sub?: string }) {
  return (
    <header className="mb-5">
      <h1 className="font-showcase text-[44px] font-black leading-[0.95] tracking-[-0.01em]">{children}</h1>
      {sub && <p className="font-showcase text-[17px] font-bold mt-1">{sub}</p>}
    </header>
  )
}

/* ------------------------------------------------------------------ pages */

function Home({ go }: { go: (p: Page) => void }) {
  const { profile } = useDesk()
  return (
    <div className="min-h-full flex flex-col items-center justify-center text-center px-6 py-16">
      <h1 className="font-showcase text-[56px] sm:text-[64px] font-black leading-[0.95]">{profile.name}</h1>
      <p className="font-showcase text-[19px] font-bold mt-3">{profile.positioning}</p>
      <nav aria-label="Showcase" className="mt-8 flex flex-wrap justify-center gap-x-7 gap-y-2">
        {(['about', 'experience', 'projects', 'research', 'contact'] as Page[]).map((p) => (
          <button key={p} type="button" onClick={() => go(p)} className="sc-link uppercase text-[13px] font-bold tracking-wide">
            {p}
          </button>
        ))}
      </nav>
    </div>
  )
}

function About() {
  const { profile } = useDesk()
  const { email, portrait, education: edu } = profile
  return (
    <article>
      <H1 sub={`I'm ${profile.shortName}.`}>Welcome</H1>
      <p>{profile.sentence}</p>
      <p>
        Thanks for taking the time to look around. This whole site runs on the monitor of my real desk, rebuilt in
        3D. If you have questions, the <b>Contact</b> page is one click away, or email me at{' '}
        <A href={`mailto:${email}`}>{email}</A>.
      </p>
      <ResumeCallout />
      <h2 className="sc-h2">About Me</h2>
      <p>{profile.about[0]}</p>
      {portrait && (
        <div className="sm:float-right sm:w-[220px] sm:ml-6 sm:mb-2">
          <Figure src={portrait.src} alt={portrait.alt} n={1} caption="Me." />
        </div>
      )}
      <p>{profile.about[1]}</p>
      <h2 className="sc-h2 clear-both">The path so far</h2>
      <ol className="list-decimal pl-6 space-y-1">
        {profile.spine.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ol>
      <h2 className="sc-h2">Education</h2>
      <p>
        <b>{edu.degree}</b>
        <br />
        {edu.institution}, {edu.location}
        <br />
        <i>{edu.dates}</i>
      </p>
      <h2 className="sc-h2">Where I&rsquo;m going</h2>
      <p>{profile.destination}</p>
    </article>
  )
}

function ExperiencePage() {
  const { experience } = useDesk()
  return (
    <article>
      <ResumeCallout />
      {experience.map((x) => (
        <section key={x.id} className="mb-10">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <h1 className="font-showcase text-[44px] font-black leading-none">{x.org}</h1>
            <span className="text-[13px] pb-1">{x.location}</span>
          </div>
          {x.roles.map((r) => (
            <div key={r.id} className="mt-4">
              <div className="flex items-baseline justify-between gap-4 flex-wrap">
                <h3 className="font-showcase text-[19px] font-bold">{r.title}</h3>
                <span className="text-[13px] italic">{r.dates}</span>
              </div>
              {r.groups.map((g, i) => (
                <div key={i} className="mt-3">
                  {g.product && (
                    <p className="font-bold">
                      {g.productUrl ? <A href={g.productUrl}>{g.product}</A> : g.product}
                    </p>
                  )}
                  <ul className="list-disc pl-6 space-y-1.5 mt-1">
                    {g.bullets.map((b, j) => (
                      <li key={j}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
              <p className="mt-3 text-[13px]">
                <b>Stack:</b> {r.stack.join(' · ')}
              </p>
            </div>
          ))}
        </section>
      ))}
    </article>
  )
}

const SHELVES: Record<'software' | 'hackathons' | 'hardware', { title: string; sub: string; shelves: Shelf[]; blurb: string }> = {
  software: {
    title: 'Software',
    sub: 'Projects',
    shelves: ['systems', 'early-web'],
    blurb: 'Production systems from my work at Poridhi, and the web projects I learned on.',
  },
  hackathons: {
    title: 'Hackathons',
    sub: 'Built against the clock',
    shelves: ['hackathon'],
    blurb: 'Built against the clock at hackathons, with my teams.',
  },
  hardware: {
    title: 'Hardware',
    sub: 'Robots & machines',
    shelves: ['hardware'],
    blurb: 'Where it started: building machines.',
  },
}

function ProjectsLanding({ go }: { go: (p: Page) => void }) {
  const cards: { id: Page; icon: 'terminal' | 'gamepad' | 'mine'; title: string; sub: string }[] = [
    { id: 'software', icon: 'terminal', title: 'Software', sub: 'Projects' },
    { id: 'hackathons', icon: 'gamepad', title: 'Hackathons', sub: 'Against the clock' },
    { id: 'hardware', icon: 'mine', title: 'Hardware', sub: 'Robots' },
  ]
  return (
    <article>
      <H1 sub="& research">Projects</H1>
      <p>Pick a shelf below. Research has its own page, and every certificate is on the Certificates page.</p>
      <div className="mt-6 space-y-4">
        {cards.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => go(c.id)}
            className="w-full flex items-center gap-5 border-2 border-black px-5 py-4 text-left hover:bg-black/[0.04] active:translate-y-px"
          >
            <PixelIcon name={c.icon} size={44} />
            <span>
              <span className="block font-showcase text-[30px] font-black leading-none">{c.title}</span>
              <span className="block text-[12px] font-bold uppercase tracking-wider mt-1">{c.sub}</span>
            </span>
          </button>
        ))}
      </div>
    </article>
  )
}

function Shelf({ id, openImage }: { id: keyof typeof SHELVES; openImage: (src: string, alt: string) => void }) {
  const { projects } = useDesk()
  const s = SHELVES[id]
  const list = projects.filter((p) => s.shelves.includes(p.shelf))
  let fig = 0
  return (
    <article>
      <H1 sub={s.sub}>{s.title}</H1>
      <p>{s.blurb}</p>
      <ResumeCallout />
      {list.map((p) => {
        const { result, role, problem, date, images } = p
        return (
          <section key={p.id} className="mb-10">
            <div className="flex items-baseline justify-between gap-4 flex-wrap">
              <h2 className="font-showcase text-[30px] font-black leading-tight">{p.title}</h2>
              {date && <span className="text-[13px] italic">{date}</span>}
            </div>
            {result && <p className="text-[13px] font-bold uppercase tracking-wide">★ {result}</p>}
            {role && <p className="text-[13px] italic">{role}</p>}
            <p className="mt-2">{p.oneLine}</p>
            {problem && <p>{problem}</p>}
            {p.contribution.length > 0 && (
              <ul className="list-disc pl-6 space-y-1">
                {p.contribution.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            )}
            {images.map((im) => {
              fig += 1
              return (
                <Figure
                  key={im.id}
                  src={im.src}
                  alt={im.alt}
                  n={fig}
                  caption={im.caption}
                  onOpen={() => openImage(im.src, im.alt)}
                />
              )
            })}
            <p className="text-[13px] mt-2">
              <b>Built with:</b> {p.stack.join(' · ')}
            </p>
            {p.links.length > 0 && (
              <>
                <p className="mt-3 font-bold">Links:</p>
                <LinkList links={p.links} />
              </>
            )}
          </section>
        )
      })}
    </article>
  )
}

function ResearchPage() {
  const { research, researchInterests } = useDesk()
  return (
    <article>
      <H1 sub="Machine learning × engineering">Research</H1>
      <p>What I am working on:</p>
      <ul className="list-disc pl-6 space-y-0.5">
        {researchInterests.map((r) => (
          <li key={r}>{r}</li>
        ))}
      </ul>
      {research.map((r) => {
        const { title, question, system, data, supervisor, method } = r
        return (
          <section key={r.id} className="mt-9">
            <p className="text-[12px] font-bold uppercase tracking-wider">{r.status}</p>
            <h2 className="font-showcase text-[28px] font-black leading-tight">{r.shortTitle}</h2>
            {title && title !== r.shortTitle && <p className="italic text-[14px]">{title}</p>}
            <p className="mt-2">{r.oneLine}</p>
            {question && (
              <p>
                <b>Question.</b> {question}
              </p>
            )}
            {system && (
              <p>
                <b>System.</b> {system}
              </p>
            )}
            {data && (
              <p>
                <b>Data.</b> {data}
              </p>
            )}
            {method.length > 0 && (
              <>
                <p className="font-bold">Method.</p>
                <ul className="list-disc pl-6 space-y-0.5">
                  {method.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
              </>
            )}
            {supervisor && <p className="text-[13px] mt-2">Supervisor: {supervisor}</p>}
            <p className="text-[13px] mt-1">
              <A href={`/research/${r.id}`}>Read the full write-up ↗</A>
            </p>
          </section>
        )
      })}
    </article>
  )
}

function Certificates({ openImage }: { openImage: (src: string, alt: string) => void }) {
  const { certificates } = useDesk()
  return (
    <article>
      <H1 sub="& awards">Certificates</H1>
      <p>Scans of the real certificates. Click one to take a closer look.</p>
      <div className="grid sm:grid-cols-2 gap-x-6">
        {certificates.map((c, i) => (
          <Figure
            key={c.id}
            src={c.src}
            alt={c.alt}
            n={i + 1}
            caption={[c.name, c.issuer, c.date].filter(Boolean).join(' — ')}
            onOpen={() => openImage(c.src, c.alt)}
          />
        ))}
      </div>
    </article>
  )
}

function Contact() {
  const { email, links } = useDesk().profile
  const [copied, setCopied] = useState(false)
  const [form, setForm] = useState({ name: '', from: '', message: '' })
  const send = (e: React.FormEvent) => {
    e.preventDefault()
    const body = `${form.message}\n\n— ${form.name}${form.from ? ` (${form.from})` : ''}`
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(`Hello from ${form.name || 'your portfolio'}`)}&body=${encodeURIComponent(body)}`
  }
  return (
    <article>
      <H1>Contact</H1>
      <p>
        Want to talk about infrastructure, AI, or research? The quickest way to reach me is email.
      </p>
      <p className="flex items-center gap-3 flex-wrap">
        <b>Email:</b> <A href={`mailto:${email}`}>{email}</A>
        <button
          type="button"
          className="w95-btn px-3 py-0.5 text-[12px] font-sans"
          onClick={() =>
            navigator.clipboard?.writeText(email).then(() => {
              setCopied(true)
              setTimeout(() => setCopied(false), 1500)
            })
          }
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </p>
      <ul className="space-y-0.5">
        {links.map((l) => (
          <li key={l.kind}>
            <b>[{l.label}]</b> – <A href={l.href}>{hostOf(l.href)}</A>
          </li>
        ))}
      </ul>
      <form onSubmit={send} className="mt-8 space-y-3 max-w-[460px]">
        <p className="font-showcase text-[20px] font-bold">Write to me</p>
        {(
          [
            ['name', 'Your name', 'input'],
            ['from', 'Company or email (optional)', 'input'],
            ['message', 'Message', 'textarea'],
          ] as const
        ).map(([k, label, kind]) => (
          <label key={k} className="block text-[13px] font-bold">
            {label}
            {kind === 'input' ? (
              <input
                value={form[k]}
                onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                required={k === 'name'}
                className="w95-field mt-1 block w-full px-2 py-1 font-normal"
              />
            ) : (
              <textarea
                value={form[k]}
                onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                required
                rows={5}
                className="w95-field mt-1 block w-full px-2 py-1 font-normal"
              />
            )}
          </label>
        ))}
        <button type="submit" className="w95-btn px-5 py-1 text-[12px] font-sans">
          Send message
        </button>
        <p className="text-[12px] italic">Opens your email app with the message filled in.</p>
      </form>
    </article>
  )
}

/* ------------------------------------------------------------------ shell */

export function Showcase({ initial = 'home' }: { initial?: Page }) {
  const { profile } = useDesk()
  const [first, ...rest] = profile.shortName.split(' ')
  const last = rest.join(' ')
  const [page, setPage] = useState<Page>(initial)
  const [zoom, setZoom] = useState<{ src: string; alt: string } | null>(null)
  const [navOpen, setNavOpen] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const go = (p: Page) => {
    setPage(p)
    setNavOpen(false)
    scrollRef.current?.scrollTo({ top: 0 })
  }
  const openImage = (src: string, alt: string) => setZoom({ src, alt })
  const isActive = (id: Page) =>
    page === id || (id === 'projects' && ['software', 'hackathons', 'hardware'].includes(page))

  const nav = (
    <ul className="space-y-2.5">
      {NAV.map((n) => (
        <Fragment key={n.id}>
          <li>
            <button type="button" onClick={() => go(n.id)} className="sc-link uppercase text-[12px] font-bold tracking-wide">
              {isActive(n.id) && <span aria-hidden="true">○ </span>}
              {n.label}
            </button>
          </li>
          {n.children && isActive(n.id) && (
            <li>
              <ul className="pl-3 space-y-1.5">
                {n.children.map((c) => (
                  <li key={c.id}>
                    <button type="button" onClick={() => go(c.id)} className="sc-link uppercase text-[11px] font-bold">
                      {page === c.id && <span aria-hidden="true">○ </span>}
                      {c.label}
                    </button>
                  </li>
                ))}
              </ul>
            </li>
          )}
        </Fragment>
      ))}
    </ul>
  )

  const body =
    page === 'home' ? (
      <Home go={go} />
    ) : page === 'about' ? (
      <About />
    ) : page === 'experience' ? (
      <ExperiencePage />
    ) : page === 'projects' ? (
      <ProjectsLanding go={go} />
    ) : page === 'software' || page === 'hackathons' || page === 'hardware' ? (
      <Shelf id={page} openImage={openImage} />
    ) : page === 'research' ? (
      <ResearchPage />
    ) : page === 'certificates' ? (
      <Certificates openImage={openImage} />
    ) : (
      <Contact />
    )

  return (
    <div className="showcase relative h-full flex flex-col sm:flex-row bg-white text-[#111]">
      {page !== 'home' && (
        <aside className="shrink-0 sm:w-[190px] px-6 pt-5 pb-3 sm:pt-7 border-b sm:border-b-0 border-black/15 flex sm:block items-center justify-between">
          <button type="button" onClick={() => go('home')} className="text-left">
            <span className="block font-showcase text-[30px] sm:text-[32px] font-black leading-[0.9]">
              {first}
              <br className="hidden sm:block" /> {last}
            </span>
            <span className="block font-showcase text-[14px] font-bold mt-1">Showcase &rsquo;26</span>
          </button>
          <button
            type="button"
            className="sm:hidden w95-btn px-3 py-1 text-[12px] font-sans"
            aria-expanded={navOpen}
            onClick={() => setNavOpen((o) => !o)}
          >
            Menu
          </button>
          <nav aria-label="Showcase" className="hidden sm:block mt-8">
            {nav}
          </nav>
        </aside>
      )}
      {navOpen && page !== 'home' && (
        <nav aria-label="Showcase" className="sm:hidden px-6 py-4 border-b border-black/15">
          {nav}
        </nav>
      )}
      <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto sc-scroll">
        <div className={page === 'home' ? 'h-full' : 'max-w-[640px] px-6 sm:px-8 py-6 sm:py-8 sc-body'}>{body}</div>
      </div>
      <p className="hidden sm:block absolute left-3 bottom-1.5 text-[10px] text-black/60">
        © 2026 {profile.name}
      </p>
      {zoom && (
        <div className="absolute inset-0 z-20 bg-black/85 flex flex-col items-center justify-center p-6" role="dialog" aria-label={zoom.alt}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={zoom.src} alt={zoom.alt} className="max-h-[85%] max-w-full object-contain border-2 border-white" />
          <button type="button" className="w95-btn mt-4 px-5 py-1 text-[12px] font-sans" onClick={() => setZoom(null)}>
            Close
          </button>
        </div>
      )}
    </div>
  )
}
