/**
 * Day or night, chosen once and kept on every route. The island and the site pages share one key, stored the way
 * the island's own store writes it (JSON, "fk." prefix), and one attribute: data-theme on <html>.
 */
export type Theme = 'light' | 'dark'

const THEME_KEY = 'fk.theme'

/** The theme showing now: the saved choice, else the system's. */
export function currentTheme(): Theme {
  const t = document.documentElement.getAttribute('data-theme')
  if (t === 'light' || t === 'dark') return t
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/** Show a theme and remember it for every page. */
export function setTheme(t: Theme) {
  document.documentElement.setAttribute('data-theme', t)
  try {
    localStorage.setItem(THEME_KEY, JSON.stringify(t))
  } catch {}
}

/** Inline, pre-paint: restore the saved choice so no page flashes the other theme first. */
export const themeBootScript = `try{var t=JSON.parse(localStorage.getItem('${THEME_KEY}'));if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t)}catch(e){}`
