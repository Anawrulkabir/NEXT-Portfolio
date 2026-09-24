/**
 * Procedural textures for the desk diorama, drawn in code from the author's
 * desk photo. Kept low-contrast on purpose: the scene reads as a soft studio
 * render, so patterns whisper instead of shout.
 */
import * as THREE from 'three'

function draw(w: number, h: number, paint: (ctx: CanvasRenderingContext2D) => void) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  paint(c.getContext('2d')!)
  return c
}

function tex(c: HTMLCanvasElement, srgb = true) {
  const t = new THREE.CanvasTexture(c)
  if (srgb) t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 8
  return t
}

/** Deterministic PRNG so every load looks identical. */
export function rng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 2 ** 32
  }
}

function blossom(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, petal: string, eye: string) {
  ctx.fillStyle = petal
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2
    ctx.beginPath()
    ctx.ellipse(x + Math.cos(a) * r * 0.5, y + Math.sin(a) * r * 0.5, r * 0.46, r * 0.3, a, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.fillStyle = eye
  ctx.beginPath()
  ctx.arc(x, y, r * 0.2, 0, Math.PI * 2)
  ctx.fill()
}

/** Cream cotton with small, faded rose-brown blossoms (the tablecloth). */
export function tableclothTexture(repeat: number) {
  const c = draw(512, 512, (ctx) => {
    const rand = rng(11)
    ctx.fillStyle = '#efe7d8'
    ctx.fillRect(0, 0, 512, 512)
    // Weave
    ctx.globalAlpha = 0.05
    ctx.fillStyle = '#6b5a40'
    for (let y = 0; y < 512; y += 3) ctx.fillRect(0, y, 512, 1)
    ctx.globalAlpha = 1
    for (let i = 0; i < 60; i++) {
      ctx.fillStyle = 'rgba(150,140,100,0.28)'
      ctx.beginPath()
      ctx.ellipse(rand() * 512, rand() * 512, 7, 2.6, rand() * Math.PI, 0, Math.PI * 2)
      ctx.fill()
    }
    for (let i = 0; i < 34; i++) {
      const r = 6 + rand() * 7
      blossom(ctx, rand() * 512, rand() * 512, r, rand() < 0.5 ? 'rgba(160,110,90,0.45)' : 'rgba(185,135,110,0.4)', 'rgba(110,70,55,0.5)')
    }
  })
  const t = tex(c)
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.repeat.set(repeat, repeat)
  return t
}

/** Charcoal desk mat with a faint dotted world map. */
export function deskMatTexture() {
  const c = draw(1024, 420, (ctx) => {
    ctx.fillStyle = '#25282d'
    ctx.fillRect(0, 0, 1024, 420)
    const blobs: [number, number, number, number][] = [
      [210, 140, 120, 70],
      [270, 290, 55, 90],
      [520, 125, 85, 50],
      [545, 260, 65, 90],
      [720, 135, 170, 70],
      [835, 300, 65, 38],
    ]
    const rand = rng(5)
    ctx.fillStyle = 'rgba(190,195,205,0.22)'
    for (const [cx, cy, rx, ry] of blobs) {
      for (let i = 0; i < 700; i++) {
        const a = rand() * Math.PI * 2
        const d = Math.sqrt(rand())
        const x = cx + Math.cos(a) * rx * d * (0.8 + rand() * 0.4)
        const y = cy + Math.sin(a) * ry * d
        ctx.fillRect(Math.round(x / 7) * 7, Math.round(y / 7) * 7, 2, 2)
      }
    }
  })
  return tex(c)
}

function butterfly(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, color: string, rot: number) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(rot)
  ctx.fillStyle = color
  for (const side of [-1, 1]) {
    ctx.beginPath()
    ctx.ellipse(side * s * 0.45, -s * 0.2, s * 0.45, s * 0.3, side * 0.5, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.ellipse(side * s * 0.32, s * 0.22, s * 0.28, s * 0.2, -side * 0.4, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.restore()
}

/** Gloss-black drawer front with a few pastel butterfly decals and a vine. */
export function drawerTexture(seed: number) {
  const c = draw(512, 256, (ctx) => {
    const rand = rng(seed)
    ctx.fillStyle = '#18181a'
    ctx.fillRect(0, 0, 512, 256)
    ctx.strokeStyle = 'rgba(205,150,170,0.45)'
    ctx.lineWidth = 2
    ctx.beginPath()
    const x0 = 300 + rand() * 120
    ctx.moveTo(x0, 0)
    for (let t = 0; t < 1; t += 0.04) ctx.lineTo(x0 + Math.sin(t * 8 + seed) * 22 + t * 40, t * 256)
    ctx.stroke()
    const colors = ['rgba(150,195,230,0.75)', 'rgba(230,215,130,0.75)', 'rgba(170,215,195,0.75)']
    for (let i = 0; i < 3; i++) {
      butterfly(ctx, 60 + rand() * 380, 50 + rand() * 150, 13 + rand() * 9, colors[i % colors.length], rand() - 0.5)
    }
  })
  return tex(c)
}

/** The MacBook's wallpaper: the same keyboard palette as the desktop on the monitor. */
export function laptopWallpaper() {
  const c = draw(256, 160, (ctx) => {
    ctx.fillStyle = '#2f5d4a'
    ctx.fillRect(0, 0, 256, 160)
    const blob = (x: number, y: number, r: number, color: string) => {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r)
      g.addColorStop(0, color)
      g.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, 256, 160)
    }
    blob(40, 30, 140, 'rgba(239,230,214,0.9)')
    blob(220, 140, 130, 'rgba(169,68,76,0.85)')
    blob(190, 20, 90, 'rgba(127,165,138,0.8)')
    ctx.fillStyle = 'rgba(255,255,255,0.35)'
    ctx.fillRect(0, 0, 256, 5)
  })
  return tex(c)
}

/** The small "hp" roundel on the monitor chin. */
export function hpLogoTexture() {
  const c = draw(256, 52, (ctx) => {
    ctx.clearRect(0, 0, 256, 52)
    ctx.strokeStyle = '#6b6d70'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.arc(128, 26, 20, 0, Math.PI * 2)
    ctx.stroke()
    ctx.fillStyle = '#6b6d70'
    ctx.font = 'italic bold 22px Arial, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('hp', 128, 27)
  })
  return tex(c)
}

/** Soft black blob used as a baked contact shadow under objects. */
export function contactShadowTexture() {
  const c = draw(256, 256, (ctx) => {
    const g = ctx.createRadialGradient(128, 128, 10, 128, 128, 128)
    g.addColorStop(0, 'rgba(0,0,0,0.55)')
    g.addColorStop(0.55, 'rgba(0,0,0,0.22)')
    g.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 256, 256)
  })
  return tex(c, false)
}

/** Smudges and dust on the monitor glass (used as a CSS overlay image). */
export function glassSmudgeDataUrl() {
  const c = draw(640, 360, (ctx) => {
    const rand = rng(99)
    ctx.clearRect(0, 0, 640, 360)
    for (let i = 0; i < 26; i++) {
      const x = rand() * 640
      const y = rand() * 360
      const r = 12 + rand() * 38
      const g = ctx.createRadialGradient(x, y, 0, x, y, r)
      g.addColorStop(0, 'rgba(255,255,255,0.35)')
      g.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.ellipse(x, y, r, r * (0.4 + rand() * 0.6), rand() * Math.PI, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.fillStyle = 'rgba(255,255,255,0.5)'
    for (let i = 0; i < 400; i++) ctx.fillRect(rand() * 640, rand() * 360, 1, 1)
  })
  return c.toDataURL('image/png')
}
