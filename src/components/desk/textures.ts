/**
 * Procedural canvas textures for the desk scene — drawn in code from the
 * author's desk photo (floral tablecloth, world-map desk mat, butterfly
 * cabinet, pink poster), so no photos or third-party assets ship.
 */
import * as THREE from 'three'

function canvas(w: number, h: number, draw: (ctx: CanvasRenderingContext2D) => void) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  draw(c.getContext('2d')!)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 8
  return t
}

/** Deterministic PRNG so textures are identical on every load. */
function rng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 2 ** 32
  }
}

function flower(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string, center: string) {
  ctx.fillStyle = color
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2
    ctx.beginPath()
    ctx.ellipse(x + Math.cos(a) * r * 0.55, y + Math.sin(a) * r * 0.55, r * 0.5, r * 0.32, a, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.fillStyle = center
  ctx.beginPath()
  ctx.arc(x, y, r * 0.22, 0, Math.PI * 2)
  ctx.fill()
}

/** Cream tablecloth with scattered brown roses and leaves. */
export function tableclothTexture(repeat = 3) {
  const t = canvas(512, 512, (ctx) => {
    const rand = rng(11)
    ctx.fillStyle = '#efe7da'
    ctx.fillRect(0, 0, 512, 512)
    for (let i = 0; i < 70; i++) {
      const x = rand() * 512
      const y = rand() * 512
      ctx.fillStyle = rand() < 0.5 ? '#b49a86' : '#9c7f6b'
      ctx.beginPath()
      ctx.ellipse(x, y, 10, 4, rand() * Math.PI, 0, Math.PI * 2)
      ctx.fill()
    }
    for (let i = 0; i < 38; i++) {
      const r = 9 + rand() * 12
      flower(ctx, rand() * 512, rand() * 512, r, rand() < 0.5 ? '#8a5a44' : '#a87058', '#5e3a2a')
    }
  })
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.repeat.set(repeat, repeat)
  return t
}

/** Dark desk mat with a faint dotted world map. */
export function deskMatTexture() {
  return canvas(1024, 400, (ctx) => {
    ctx.fillStyle = '#1b1e25'
    ctx.fillRect(0, 0, 1024, 400)
    // Blobby continents as dot clouds (stylised, not survey-accurate).
    const blobs: [number, number, number, number][] = [
      [200, 130, 120, 70],
      [260, 280, 60, 90],
      [520, 120, 90, 50],
      [540, 250, 70, 90],
      [700, 130, 170, 70],
      [820, 290, 70, 40],
    ]
    const rand = rng(5)
    ctx.fillStyle = 'rgba(160,170,185,0.35)'
    for (const [cx, cy, rx, ry] of blobs) {
      for (let i = 0; i < 900; i++) {
        const a = rand() * Math.PI * 2
        const d = Math.sqrt(rand())
        const x = cx + Math.cos(a) * rx * d * (0.8 + rand() * 0.4)
        const y = cy + Math.sin(a) * ry * d
        ctx.fillRect(Math.round(x / 6) * 6, Math.round(y / 6) * 6, 2, 2)
      }
    }
    ctx.strokeStyle = 'rgba(160,170,185,0.12)'
    for (let y = 40; y < 400; y += 60) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(1024, y)
      ctx.stroke()
    }
  })
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

/** Glossy black drawer front with butterflies and pink vines. */
export function cabinetTexture() {
  return canvas(512, 256, (ctx) => {
    const rand = rng(23)
    ctx.fillStyle = '#121214'
    ctx.fillRect(0, 0, 512, 256)
    ctx.strokeStyle = '#c98fa4'
    ctx.lineWidth = 2
    for (let i = 0; i < 3; i++) {
      ctx.beginPath()
      const x0 = 250 + i * 70
      ctx.moveTo(x0, 30)
      for (let t = 0; t < 1; t += 0.05) ctx.lineTo(x0 + Math.sin(t * 9) * 30 + t * 60, 30 + t * 200)
      ctx.stroke()
    }
    const colors = ['#8fc3e8', '#e8d77a', '#a7d7c5', '#8fc3e8']
    for (let i = 0; i < 9; i++) {
      butterfly(ctx, 40 + rand() * 440, 30 + rand() * 200, 14 + rand() * 12, colors[i % colors.length], rand() * 1.2 - 0.6)
    }
  })
}

/** Pink framed poster: a line-drawn building on pink, like the one on the author's wall. */
export function posterTexture() {
  return canvas(360, 480, (ctx) => {
    const g = ctx.createLinearGradient(0, 0, 0, 480)
    g.addColorStop(0, '#f2a7c3')
    g.addColorStop(1, '#e56f9b')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 360, 480)
    ctx.fillStyle = 'rgba(255,255,255,0.85)'
    ctx.fillRect(50, 60, 200, 14)
    ctx.fillRect(80, 90, 170, 14)
    ctx.fillRect(110, 120, 110, 14)
    // Isometric building
    ctx.fillStyle = '#f7c9da'
    ctx.beginPath()
    ctx.moveTo(40, 330)
    ctx.lineTo(180, 260)
    ctx.lineTo(330, 320)
    ctx.lineTo(330, 420)
    ctx.lineTo(180, 470)
    ctx.lineTo(40, 420)
    ctx.closePath()
    ctx.fill()
    ctx.strokeStyle = '#c9477a'
    ctx.lineWidth = 2
    ctx.stroke()
    ctx.fillStyle = '#c9477a'
    for (let r = 0; r < 4; r++)
      for (let c = 0; c < 6; c++) {
        ctx.fillRect(55 + c * 20, 340 + r * 18 + c * 0, 10, 8)
        ctx.fillRect(200 + c * 20, 300 + r * 18 + c * 4, 10, 8)
      }
  })
}

/** Warm cream wall with a faint plaster noise. */
export function wallTexture() {
  const t = canvas(256, 256, (ctx) => {
    const rand = rng(3)
    ctx.fillStyle = '#e9e0c4'
    ctx.fillRect(0, 0, 256, 256)
    for (let i = 0; i < 1800; i++) {
      ctx.fillStyle = rand() < 0.5 ? 'rgba(255,255,255,0.08)' : 'rgba(120,100,60,0.05)'
      ctx.fillRect(rand() * 256, rand() * 256, 2, 2)
    }
  })
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.repeat.set(4, 2)
  return t
}

/** Pale floor tiles. */
export function floorTexture() {
  const t = canvas(256, 256, (ctx) => {
    ctx.fillStyle = '#d9d6cf'
    ctx.fillRect(0, 0, 256, 256)
    ctx.strokeStyle = '#bdb9b0'
    ctx.lineWidth = 3
    ctx.strokeRect(0, 0, 256, 256)
  })
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.repeat.set(10, 10)
  return t
}

/** Sheer curtain with a soft leaf pattern. */
export function curtainTexture() {
  const t = canvas(256, 512, (ctx) => {
    ctx.fillStyle = '#e8e2dc'
    ctx.fillRect(0, 0, 256, 512)
    ctx.strokeStyle = 'rgba(160,150,140,0.35)'
    ctx.lineWidth = 3
    for (let y = 0; y < 512; y += 96)
      for (let x = 0; x < 256; x += 64) {
        ctx.beginPath()
        ctx.ellipse(x + 32, y + 48, 18, 40, 0, 0, Math.PI * 2)
        ctx.stroke()
      }
  })
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.repeat.set(2, 1)
  return t
}
