#!/usr/bin/env tsx
/**
 * Accessibility audit (§15.9, Phase 9): axe (WCAG 2.2 AA + best practice)
 * on every route at desktop and phone widths, plus the world's interactive
 * states (open panel, room, map overlay, lightbox, controls). Also checks one
 * h1 per page and no skipped heading levels.
 *
 * Usage: npm run build && npm start   (in another terminal)
 *        npm run a11y                  # BASE_URL=http://localhost:3000 by default
 * Needs a Chromium: set CHROME_PATH, or install one with `npx playwright install chromium`.
 */
import { chromium, type Page } from 'playwright-core'
import AxeBuilder from '@axe-core/playwright'
import { projects, projectTitle, research } from '../src/content'

const BASE = process.env.BASE_URL ?? 'http://localhost:3000'
const routes = [
  '/',
  '/about',
  '/experience',
  '/hire',
  '/research',
  ...research.map((r) => `/research/${r.id}`),
  '/academic',
  '/projects',
  ...projects.filter((p) => projectTitle(p)).map((p) => `/projects/${p.id}`),
  '/skills',
  '/journey',
  '/archive',
  '/cv',
  '/contact',
]
const states: [string, string][] = [
  ['open panel', '/?open=phe-rig-r455a'],
  ['airfoil demo', '/?open=wind-tunnel'],
  ['archive room', '/?at=archive'],
  ['events map', '/?open=map-table'],
  ['field office', '/?open=mailbox'],
]

let failures = 0

async function audit(page: Page, label: string) {
  const { violations } = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
    .analyze()
  for (const v of violations) {
    failures++
    console.log(`✗ ${label}: ${v.id} (${v.impact}) × ${v.nodes.length} — ${v.nodes[0]?.target.join(' ')}`)
  }
}

async function headings(page: Page, label: string) {
  const r = await page.evaluate(() => {
    const lv = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((e) => Number(e.tagName[1]))
    return { h1: lv.filter((l) => l === 1).length, skips: lv.filter((l, i) => i > 0 && l > lv[i - 1] + 1).length }
  })
  if (r.h1 !== 1 || r.skips) {
    failures++
    console.log(`✗ ${label}: ${r.h1} h1, ${r.skips} skipped heading level(s)`)
  }
}

async function main() {
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH })
  for (const [width, mobile] of [
    [1440, false],
    [390, true],
  ] as const) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 }, isMobile: mobile, hasTouch: mobile })
    await ctx.addInitScript(() => localStorage.setItem('world:intro-seen', '1'))
    const page = await ctx.newPage()
    for (const r of routes) {
      await page.goto(BASE + r, { waitUntil: 'networkidle' })
      await audit(page, `${width}px ${r}`)
      await headings(page, `${width}px ${r}`)
    }
    for (const [label, url] of states) {
      await page.goto(BASE + url, { waitUntil: 'networkidle' })
      await page.waitForTimeout(900)
      await audit(page, `${width}px ${label}`)
    }
    await ctx.close()
  }
  await browser.close()
  console.log(failures ? `\n${failures} problem(s).` : `\nAll clear: ${routes.length} routes + ${states.length} states at 2 widths.`)
  process.exit(failures ? 1 : 0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
