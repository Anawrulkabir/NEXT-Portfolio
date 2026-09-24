/**
 * The desk diorama: the author's real desk (floral tablecloth, white monitor,
 * MacBook on a stand, cream keyboard with green/red accents, world-map mat,
 * money plant in a bottle, butterfly cabinet, white lamp, blue chair),
 * modelled in code and floating in a soft studio void.
 *
 * Rendering: WebGL (transparent) over a CSS3DRenderer. The monitor's screen
 * mesh writes transparent pixels, so the live DOM OS placed at the same spot
 * in the CSS3D layer shows through, and anything in front still occludes it.
 */
import * as THREE from 'three'
import { CSS3DObject, CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer.js'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import {
  contactShadowTexture,
  deskMatTexture,
  drawerTexture,
  hpLogoTexture,
  laptopWallpaper,
  rng,
  tableclothTexture,
} from './textures'

export const SCREEN_PX = { w: 1280, h: 720 }
// HP M22f: 21.5" 16:9 panel, 476 × 268 mm active area.
const SCREEN = { w: 0.476, h: 0.268 }
const SCREEN_CENTER = new THREE.Vector3(0, 1.0, -0.2155)

const TARGET = new THREE.Vector3(-0.2, 0.62, 0)
const DESK_LOOK = new THREE.Vector3(0.02, 0.9, -0.12)

export type Mode = 'loading' | 'orbit' | 'travel' | 'desk' | 'zooming' | 'screen'
export type Hotspot = 'monitor' | 'lamp' | 'plant' | 'keyboard' | 'laptop' | 'chair'
export const HOTSPOT_LABEL: Record<Hotspot, string> = {
  monitor: 'HP M22f · use the computer',
  lamp: 'Lamp',
  plant: 'Money plant',
  keyboard: 'Royal Kludge R65',
  laptop: 'MacBook Air (M1, 2020)',
  chair: 'Chair',
}

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)
const frame = () => new Promise<void>((r) => requestAnimationFrame(() => r()))

function std(color: THREE.ColorRepresentation, extra: Partial<THREE.MeshStandardMaterialParameters> = {}) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.65, metalness: 0, ...extra })
}
function shadowed<T extends THREE.Object3D>(o: T) {
  o.traverse((c) => {
    c.castShadow = true
    c.receiveShadow = true
  })
  return o
}
function rbox(w: number, h: number, d: number, r: number, mat: THREE.Material, seg = 3) {
  return shadowed(new THREE.Mesh(new RoundedBoxGeometry(w, h, d, seg, Math.min(r, w / 2, h / 2, d / 2)), mat))
}
function cyl(rt: number, rb: number, h: number, mat: THREE.Material, seg = 28) {
  return shadowed(new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat))
}

/** A heart-shaped pothos (money plant) leaf, bent slightly along its spine. */
function leafGeometry(size: number) {
  const s = new THREE.Shape()
  s.moveTo(0, 0)
  s.bezierCurveTo(-0.55, 0.15, -0.6, 0.75, 0, 1)
  s.bezierCurveTo(0.6, 0.75, 0.55, 0.15, 0, 0)
  const g = new THREE.ShapeGeometry(s, 10)
  const p = g.attributes.position
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i)
    const y = p.getY(i)
    p.setZ(i, -x * x * 0.5 + Math.sin(y * Math.PI) * 0.08)
  }
  g.scale(size, size, size)
  g.computeVertexNormals()
  return g
}

export class DeskScene {
  readonly renderer: THREE.WebGLRenderer
  readonly css: CSS3DRenderer
  readonly scene = new THREE.Scene()
  readonly camera: THREE.PerspectiveCamera
  private cssScreen!: CSS3DObject
  private hotspots: { id: Hotspot; root: THREE.Object3D }[] = []
  private raycaster = new THREE.Raycaster()
  private pointer = new THREE.Vector2(9, 9)
  private smooth = new THREE.Vector2(0, 0)
  private look = TARGET.clone()
  private tween: {
    from: [THREE.Vector3, THREE.Vector3]
    to: () => [THREE.Vector3, THREE.Vector3]
    t: number
    dur: number
    done?: () => void
  } | null = null
  private mode: Mode = 'loading'
  private orbitAngle = 0.62
  private lampLight!: THREE.PointLight
  private lampBulb!: THREE.MeshStandardMaterial
  private lampOn = true
  private plant!: THREE.Group
  private plantWiggle = 0
  private chair!: THREE.Group
  private chairSpin = 0
  private keyMeshes = new Map<string, THREE.Mesh>()
  private keyPress = new Map<THREE.Mesh, number>()
  private knob!: THREE.Mesh
  private laptopScreen!: THREE.MeshStandardMaterial
  private laptopOn = true
  private mouseObj!: THREE.Group
  private clock = new THREE.Clock()
  private raf = 0
  private reduced = false
  private downAt: { x: number; y: number } | null = null
  /** Phones show the screen as a flat overlay, so hover-away must not exit. */
  flatScreen = false
  onHover: (h: Hotspot | null, x: number, y: number) => void = () => {}
  onModeChange: (m: Mode) => void = () => {}
  onTravel: () => void = () => {}

  constructor(
    private host: HTMLElement,
    private screenElement: HTMLElement
  ) {
    const { clientWidth: w, clientHeight: h } = host
    this.camera = new THREE.PerspectiveCamera(32, w / h, 0.05, 60)
    this.camera.position.copy(this.orbitPos(0))
    this.camera.lookAt(TARGET)

    this.css = new CSS3DRenderer()
    this.css.setSize(w, h)
    Object.assign(this.css.domElement.style, { position: 'absolute', inset: '0' })
    host.appendChild(this.css.domElement)

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setSize(w, h)
    this.renderer.setClearColor(0x000000, 0)
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.0
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    Object.assign(this.renderer.domElement.style, { position: 'absolute', inset: '0' })
    host.appendChild(this.renderer.domElement)

    const el = this.renderer.domElement
    el.addEventListener('pointermove', this.onPointerMove)
    el.addEventListener('pointerdown', this.onPointerDown)
    el.addEventListener('pointerup', this.onPointerUp)
    window.addEventListener('pointermove', this.onWindowPointer)
    window.addEventListener('resize', this.onResize)
  }

  /** Builds the scene step by step, reporting real progress to the loader. */
  async build(onStep: (label: string, done: number, total: number) => void) {
    const steps: [string, () => void | Promise<void>][] = [
      ['studioEnvironment', () => this.buildEnvironment()],
      ['tableclothTexture', () => this.buildDesk()],
      ['deskMatTexture', () => this.buildMat()],
      ['monitorModel', () => this.buildMonitor()],
      ['macbookModel', () => this.buildLaptop()],
      ['keyboardModel', () => this.buildKeyboard()],
      ['moneyPlantModel', () => this.buildPlant()],
      ['cabinetModel', () => this.buildCabinet()],
      ['lampModel', () => this.buildLamp()],
      ['chairModel', () => this.buildChair()],
      ['contactShadows', () => this.buildShadows()],
      ['lighting', () => this.buildLights()],
      ['shaders', async () => {
        await this.renderer.compileAsync(this.scene, this.camera)
      }],
    ]
    for (let i = 0; i < steps.length; i++) {
      await steps[i][1]()
      onStep(steps[i][0], i + 1, steps.length)
      await frame()
    }
  }

  /* ------------------------------------------------------------ build */

  private buildEnvironment() {
    const pmrem = new THREE.PMREMGenerator(this.renderer)
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    this.scene.environmentIntensity = 0.55
    pmrem.dispose()
    // Shadow-catching floor: invisible except for the shadows it receives.
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), new THREE.ShadowMaterial({ opacity: 0.16 }))
    floor.rotation.x = -Math.PI / 2
    floor.receiveShadow = true
    this.scene.add(floor)
  }

  private buildDesk() {
    const g = new THREE.Group()
    const cloth = std(0xffffff, { map: tableclothTexture(3), roughness: 0.92 })
    const top = rbox(1.24, 0.03, 0.66, 0.012, cloth)
    top.position.y = 0.735
    g.add(top)
    // Ruffled skirt: soft vertical folds that deepen toward the hem.
    const skirt = (w: number, seed: number) => {
      const geo = new THREE.PlaneGeometry(w, 0.66, Math.round(w * 90), 8)
      const p = geo.attributes.position
      const r = rng(seed)
      const phase = r() * 6
      for (let i = 0; i < p.count; i++) {
        const x = p.getX(i)
        const y = p.getY(i)
        const depth = (0.33 - y) / 0.66 // 0 at top, 1 at hem
        p.setZ(i, (Math.sin(x * 48 + phase) * 0.6 + Math.sin(x * 97 + phase * 2) * 0.25) * (0.004 + depth * 0.014))
        if (y < -0.32) p.setY(i, y + Math.sin(x * 48 + phase) * 0.006)
      }
      geo.computeVertexNormals()
      const m = new THREE.Mesh(geo, std(0xffffff, { map: tableclothTexture(1.4), side: THREE.DoubleSide, roughness: 0.95 }))
      return shadowed(m)
    }
    const front = skirt(1.25, 1)
    front.position.set(0, 0.405, 0.335)
    g.add(front)
    const back = skirt(1.25, 2)
    back.position.set(0, 0.405, -0.335)
    back.rotation.y = Math.PI
    g.add(back)
    for (const sx of [-1, 1]) {
      const side = skirt(0.67, 3 + sx)
      side.position.set(sx * 0.625, 0.405, 0)
      side.rotation.y = (sx * Math.PI) / 2
      g.add(side)
    }
    this.scene.add(g)
  }

  private buildMat() {
    const mat = rbox(0.84, 0.004, 0.32, 0.002, std(0xffffff, { map: deskMatTexture(), roughness: 0.95 }))
    mat.position.set(0.06, 0.752, 0.09)
    this.scene.add(mat)
  }

  /** HP M22f: 21.5" FHD, three-sided micro-edge bezel, slim chin, thin stand. */
  private buildMonitor() {
    const g = new THREE.Group()
    const shell = std(0xeeede9, { roughness: 0.42 })
    const alu = std(0xcfd2d5, { metalness: 0.6, roughness: 0.3 })
    // Stand: flat rounded base and a slim, slightly raked neck.
    const base = rbox(0.2, 0.008, 0.14, 0.006, alu, 4)
    base.position.set(0, 0.756, -0.2)
    g.add(base)
    const neck = rbox(0.05, 0.16, 0.012, 0.005, alu)
    neck.position.set(0, 0.83, -0.245)
    neck.rotation.x = -0.12
    g.add(neck)
    // Panel: thin edges plus the bulge that holds the electronics.
    const PANEL_W = 0.489
    const PANEL_H = 0.2965
    const panelY = SCREEN_CENTER.y - 0.134 - 0.022 + PANEL_H / 2
    const back = rbox(PANEL_W, PANEL_H, 0.009, 0.004, shell)
    back.position.set(0, panelY, -0.2215)
    g.add(back)
    const bulge = rbox(0.3, 0.17, 0.022, 0.02, shell, 5)
    bulge.position.set(0, panelY - 0.02, -0.236)
    g.add(bulge)
    // Front: black glass over the whole top area (micro-edge), white chin below.
    const glass = rbox(PANEL_W - 0.003, PANEL_H - 0.021, 0.002, 0.001, std(0x0b0c0d, { roughness: 0.12, metalness: 0.1 }))
    glass.position.set(0, panelY + 0.0105, -0.217)
    g.add(glass)
    const chin = new THREE.Mesh(
      new THREE.PlaneGeometry(0.06, 0.012),
      new THREE.MeshStandardMaterial({ map: hpLogoTexture(), transparent: true, roughness: 0.5 })
    )
    chin.position.set(0, panelY - PANEL_H / 2 + 0.011, -0.2168)
    g.add(chin)
    const led = new THREE.Mesh(new THREE.CircleGeometry(0.0012, 10), new THREE.MeshBasicMaterial({ color: 0xf2f2f2 }))
    led.position.set(0.22, panelY - PANEL_H / 2 + 0.008, -0.2168)
    g.add(led)

    // The hole: writes (0,0,0,0) so the CSS3D screen underneath shows through.
    const hole = new THREE.Mesh(
      new THREE.PlaneGeometry(SCREEN.w, SCREEN.h),
      new THREE.MeshBasicMaterial({ color: 0x000000, opacity: 0, transparent: false, blending: THREE.NoBlending })
    )
    hole.position.copy(SCREEN_CENTER)
    g.add(hole)
    this.scene.add(g)
    this.hotspots.push({ id: 'monitor', root: g })

    this.cssScreen = new CSS3DObject(this.screenElement)
    this.cssScreen.position.copy(SCREEN_CENTER)
    this.cssScreen.scale.setScalar(SCREEN.w / SCREEN_PX.w)
    this.scene.add(this.cssScreen)
  }

  /** MacBook Air (M1, 2020): the wedge — 16.1 mm at the hinge, 4.1 mm at the front. */
  private buildLaptop() {
    const g = new THREE.Group()
    const alu = std(0xc3c6ca, { metalness: 0.65, roughness: 0.28 })
    const stand = rbox(0.24, 0.008, 0.21, 0.003, alu)
    stand.position.set(0, 0.8, 0)
    stand.rotation.x = 0.3
    g.add(stand)
    const leg = rbox(0.2, 0.085, 0.008, 0.003, alu)
    leg.position.set(0, 0.77, -0.09)
    g.add(leg)

    const W = 0.304
    const D = 0.212
    const profile = new THREE.Shape()
    profile.moveTo(-D / 2, 0)
    profile.lineTo(D / 2, 0)
    profile.lineTo(D / 2, 0.0161)
    profile.lineTo(-D / 2 + 0.004, 0.0041)
    profile.quadraticCurveTo(-D / 2, 0.0041, -D / 2, 0.002)
    profile.lineTo(-D / 2, 0)
    const wedge = new THREE.ExtrudeGeometry(profile, {
      depth: W - 0.01,
      bevelEnabled: true,
      bevelSize: 0.005,
      bevelThickness: 0.005,
      bevelSegments: 4,
      curveSegments: 6,
    })
    wedge.translate(0, 0, -(W - 0.01) / 2)
    wedge.rotateY(Math.PI / 2)
    const bodyG = new THREE.Group()
    bodyG.position.set(0, 0.806, 0)
    bodyG.rotation.x = 0.3
    const body = shadowed(new THREE.Mesh(wedge, alu))
    bodyG.add(body)
    // Top deck (the wedge's upper face): black keys and the big trackpad.
    const deck = new THREE.Group()
    const slope = Math.atan2(0.0161 - 0.0041, D)
    deck.rotation.x = slope
    deck.position.set(0, 0.0101, 0)
    const keyMat = std(0x16171a, { roughness: 0.6 })
    const keys = new THREE.InstancedMesh(new RoundedBoxGeometry(0.0155, 0.0015, 0.0145, 1, 0.002), keyMat, 14 * 5 + 6)
    let k = 0
    const m = new THREE.Matrix4()
    for (let r = 0; r < 5; r++)
      for (let c = 0; c < 14; c++) {
        m.makeTranslation(-0.128 + c * 0.0197, 0.0012, -0.078 + r * 0.0185)
        keys.setMatrixAt(k++, m)
      }
    for (let c = 0; c < 6; c++) {
      m.makeTranslation(-0.128 + c * 0.0197 + (c > 2 ? 0.07 : 0), 0.0012, -0.097)
      keys.setMatrixAt(k++, m)
    }
    deck.add(keys)
    const pad = rbox(0.12, 0.0008, 0.075, 0.004, std(0xb9bdc1, { metalness: 0.4, roughness: 0.35 }))
    pad.position.set(0, 0.0004, 0.06)
    deck.add(pad)
    bodyG.add(deck)
    // Lid: thin, black bezel, no notch.
    const lid = new THREE.Group()
    lid.position.set(0, 0.0161, -D / 2 + 0.004)
    lid.rotation.x = -0.55 - slope
    const lidShell = rbox(W, 0.2, 0.0041, 0.004, alu)
    lidShell.position.set(0, 0.1, -0.002)
    lid.add(lidShell)
    const bezel = new THREE.Mesh(new THREE.PlaneGeometry(W - 0.006, 0.194), std(0x0a0a0b, { roughness: 0.15 }))
    bezel.position.set(0, 0.1, 0.0002)
    lid.add(bezel)
    this.laptopScreen = std(0x000000, { emissive: 0xffffff, emissiveMap: laptopWallpaper(), emissiveIntensity: 0.85, roughness: 0.12 })
    const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.286, 0.179), this.laptopScreen)
    scr.position.set(0, 0.102, 0.0004)
    lid.add(scr)
    bodyG.add(lid)
    g.add(bodyG)
    g.position.set(0.44, 0, -0.1)
    g.rotation.y = -0.4
    this.scene.add(g)
    this.hotspots.push({ id: 'laptop', root: g })
  }

  /** Royal Kludge R65: 65% layout with the volume knob top-right, cream caps with green and red accents. */
  private buildKeyboard() {
    const g = new THREE.Group()
    const U = 0.019
    g.add(rbox(0.322, 0.024, 0.11, 0.008, std(0xece6d8, { roughness: 0.5 })))
    const plate = rbox(0.308, 0.002, 0.097, 0.002, std(0xd9d2c2, { roughness: 0.7 }))
    plate.position.y = 0.012
    g.add(plate)
    type K = [code: string, width: number]
    const row = (...keys: (string | K)[]) => keys.map((k) => (typeof k === 'string' ? ([k, 1] as K) : k))
    const letters = (s: string) => [...s].map((c) => `Key${c}`)
    const LAYOUT: K[][] = [
      row('Escape', ...['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].map((d) => `Digit${d}`), 'Minus', 'Equal', ['Backspace', 2], ['Knob', 1]),
      row(['Tab', 1.5], ...letters('QWERTYUIOP'), 'BracketLeft', 'BracketRight', ['Backslash', 1.5], 'Delete'),
      row(['CapsLock', 1.75], ...letters('ASDFGHJKL'), 'Semicolon', 'Quote', ['Enter', 2.25], 'PageUp'),
      row(['ShiftLeft', 2.25], ...letters('ZXCVBNM'), 'Comma', 'Period', 'Slash', ['ShiftRight', 1.75], 'ArrowUp', 'PageDown'),
      row(['ControlLeft', 1.25], ['MetaLeft', 1.25], ['AltLeft', 1.25], ['Space', 6.25], 'AltRight', 'Fn', 'ControlRight', 'ArrowLeft', 'ArrowDown', 'ArrowRight'),
    ]
    const cream = std(0xf4efe2, { roughness: 0.55 })
    const green = std(0x4d8059, { roughness: 0.55 })
    const red = std(0xa9444c, { roughness: 0.55 })
    const RED = new Set(['Escape', 'Enter'])
    const ALPHA = /^(Key|Digit)|^(Minus|Equal|BracketLeft|BracketRight|Semicolon|Quote|Comma|Period|Slash|Space)$/
    const geos = new Map<number, THREE.BufferGeometry>()
    LAYOUT.forEach((keys, r) => {
      let x = -8 * U
      for (const [code, w] of keys) {
        const cx = x + (w * U) / 2
        x += w * U
        const z = -0.038 + r * U
        if (code === 'Knob') {
          const knob = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(0.0085, 0.009, 0.013, 36), std(0x3a3c40, { metalness: 0.75, roughness: 0.32, flatShading: true })))
          knob.position.set(cx, 0.019, z)
          g.add(knob)
          this.knob = knob
          continue
        }
        if (!geos.has(w)) geos.set(w, new RoundedBoxGeometry(w * U - 0.0026, 0.0095, U - 0.0026, 2, 0.0026))
        const key = shadowed(new THREE.Mesh(geos.get(w)!, RED.has(code) ? red : ALPHA.test(code) ? cream : green))
        key.position.set(cx, 0.0175, z)
        g.add(key)
        this.keyMeshes.set(code, key)
      }
    })
    g.position.set(-0.03, 0.764, 0.11)
    this.scene.add(g)
    this.hotspots.push({ id: 'keyboard', root: g })
    this.buildMouse()
  }

  /** Rapoo MT760L: right-handed ergonomic mouse with a thumb rest and side wheel. */
  private buildMouse() {
    const geo = new THREE.SphereGeometry(1, 48, 32)
    const p = geo.attributes.position
    for (let i = 0; i < p.count; i++) {
      let x = p.getX(i)
      let y = p.getY(i)
      const z = p.getZ(i) // +z points at the user (palm end)
      if (y < 0) y *= 0.12 // flat underside
      const palm = (z + 1) / 2 // 0 at the nose, 1 at the palm
      y *= 0.75 + 0.35 * palm // taller at the back
      x -= y * 0.28 // top leans left, like the real shell
      if (x < -0.35 && y < 0.35) x -= (0.35 - y) * 0.45 * (0.4 + palm * 0.6) // thumb rest flare
      p.setXYZ(i, x * 0.036, y * 0.042, z * 0.06)
    }
    geo.computeVertexNormals()
    const mouse = new THREE.Group()
    mouse.add(shadowed(new THREE.Mesh(geo, std(0x1b1c1f, { roughness: 0.5 }))))
    const wheel = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.007, 24), std(0x6d7176, { metalness: 0.8, roughness: 0.3 })))
    wheel.rotation.z = Math.PI / 2
    wheel.position.set(-0.004, 0.034, -0.03)
    mouse.add(wheel)
    const thumbWheel = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.005, 20), std(0x5a5e63, { metalness: 0.7, roughness: 0.35 })))
    thumbWheel.position.set(-0.041, 0.018, -0.005)
    mouse.add(thumbWheel)
    for (const dz of [0.01, 0.024]) {
      const b = rbox(0.004, 0.006, 0.011, 0.002, std(0x2a2c30, { roughness: 0.4 }))
      b.position.set(-0.04, 0.025, dz)
      b.rotation.z = 0.3
      mouse.add(b)
    }
    mouse.position.set(0.3, 0.756, 0.12)
    mouse.rotation.y = 0.12
    this.mouseObj = mouse
    this.scene.add(mouse)
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.3, 0.757, 0.06),
      new THREE.Vector3(0.26, 0.756, -0.02),
      new THREE.Vector3(0.1, 0.756, -0.12),
      new THREE.Vector3(0.02, 0.756, -0.24),
    ])
    this.scene.add(shadowed(new THREE.Mesh(new THREE.TubeGeometry(curve, 40, 0.0022, 6), std(0x151515))))
  }

  private buildPlant() {
    const g = new THREE.Group()
    const coaster = cyl(0.058, 0.058, 0.008, std(0x9a6a45, { roughness: 0.6 }))
    coaster.position.y = 0.754
    g.add(coaster)
    const glass = new THREE.MeshPhysicalMaterial({
      color: 0xe6f2ec,
      roughness: 0.04,
      metalness: 0,
      transparent: true,
      opacity: 0.32,
      clearcoat: 1,
      depthWrite: false,
    })
    const body = new THREE.Mesh(
      new THREE.LatheGeometry(
        [
          new THREE.Vector2(0.0, 0),
          new THREE.Vector2(0.038, 0.002),
          new THREE.Vector2(0.041, 0.02),
          new THREE.Vector2(0.041, 0.13),
          new THREE.Vector2(0.03, 0.16),
          new THREE.Vector2(0.014, 0.18),
          new THREE.Vector2(0.014, 0.215),
        ],
        32
      ),
      glass
    )
    body.position.y = 0.758
    g.add(body)
    const water = cyl(0.036, 0.036, 0.09, std(0xbfdcd2, { transparent: true, opacity: 0.35, roughness: 0.1 }))
    water.position.y = 0.806
    g.add(water)

    const vines = new THREE.Group()
    const stemMat = std(0x5f8a3e, { roughness: 0.6 })
    const leafMats = [
      std(0x3f7d34, { side: THREE.DoubleSide, roughness: 0.45 }),
      std(0x5c9a3f, { side: THREE.DoubleSide, roughness: 0.45 }),
      std(0x7fae4c, { side: THREE.DoubleSide, roughness: 0.45 }),
    ]
    const r = rng(8)
    const vineDefs: [number, number, number][] = [
      [0.4, 0.2, 1],
      [2.4, 0.16, 0.8],
      [4.3, 0.22, 1.1],
      [1.4, 0.12, 0.6],
    ]
    for (const [a, reach, lift] of vineDefs) {
      const dir = new THREE.Vector3(Math.cos(a), 0, Math.sin(a))
      const pts = [
        new THREE.Vector3(0, 0.95, 0),
        new THREE.Vector3(0, 1.02 + 0.03 * lift, 0).addScaledVector(dir, reach * 0.3),
        new THREE.Vector3(0, 1.04 + 0.05 * lift, 0).addScaledVector(dir, reach * 0.65),
        new THREE.Vector3(0, 0.99 + 0.05 * lift, 0).addScaledVector(dir, reach),
      ]
      const curve = new THREE.CatmullRomCurve3(pts)
      vines.add(shadowed(new THREE.Mesh(new THREE.TubeGeometry(curve, 24, 0.0018, 5), stemMat)))
      const n = 5 + Math.round(reach * 20)
      for (let k = 1; k <= n; k++) {
        const t = k / (n + 0.5)
        const leaf = new THREE.Mesh(leafGeometry(0.03 + r() * 0.018), leafMats[Math.floor(r() * 3)])
        leaf.castShadow = true
        leaf.position.copy(curve.getPoint(t))
        const side = k % 2 ? 1 : -1
        leaf.rotation.set(-0.9 + r() * 0.6, a + side * 1.2 + r() * 0.3, side * 0.4)
        vines.add(leaf)
      }
    }
    g.add(vines)
    g.position.set(-0.43, 0, -0.18)
    this.plant = vines
    this.scene.add(g)
    this.hotspots.push({ id: 'plant', root: g })
  }

  private buildCabinet() {
    const g = new THREE.Group()
    const gloss = std(0x151517, { roughness: 0.22, metalness: 0.05 })
    const body = rbox(0.46, 1.0, 0.42, 0.012, gloss)
    body.position.y = 0.5
    g.add(body)
    const handleMat = std(0xc9ccd0, { metalness: 0.8, roughness: 0.25 })
    const drawers: [number, number, number, number][] = [
      [-0.113, 0.85, 0.2, 0.2],
      [0.113, 0.85, 0.2, 0.2],
      [0, 0.61, 0.43, 0.22],
      [0, 0.37, 0.43, 0.22],
      [0, 0.13, 0.43, 0.2],
    ]
    drawers.forEach(([x, y, w, h], i) => {
      const d = rbox(w, h, 0.012, 0.006, std(0xffffff, { map: drawerTexture(20 + i), roughness: 0.2 }))
      d.position.set(x, y, 0.214)
      g.add(d)
      const handle = rbox(w * 0.36, 0.012, 0.016, 0.005, handleMat)
      handle.position.set(x, y + h / 2 - 0.03, 0.226)
      g.add(handle)
    })
    // Books and bottles on top.
    const books = [0xe8c7cf, 0xf1e4cb, 0xd46e7e, 0xf6f2ea]
    books.forEach((c, i) => {
      const b = rbox(0.19, 0.024, 0.14, 0.004, std(c, { roughness: 0.8 }))
      b.position.set(-0.07, 1.013 + i * 0.024, -0.05)
      b.rotation.y = i % 2 ? 0.06 : -0.05
      g.add(b)
    })
    const bottles = [0x2d6fb5, 0xf1f1f1, 0xb4282e]
    bottles.forEach((c, i) => {
      const h = 0.11 + (i % 2) * 0.05
      const b = cyl(0.019, 0.021, h, std(c, { roughness: 0.3 }), 18)
      b.position.set(0.1 + i * 0.045, 1 + h / 2, 0.1)
      g.add(b)
      const cap = cyl(0.009, 0.009, 0.02, std(0x222222), 12)
      cap.position.set(0.1 + i * 0.045, 1 + h + 0.01, 0.1)
      g.add(cap)
    })
    const pot = cyl(0.045, 0.036, 0.075, std(0xeadfce, { roughness: 0.5 }))
    pot.position.set(-0.15, 1.04, 0.11)
    g.add(pot)
    const leafMat = std(0x4f8a3e, { side: THREE.DoubleSide })
    const r = rng(3)
    for (let i = 0; i < 9; i++) {
      const leaf = new THREE.Mesh(leafGeometry(0.035 + r() * 0.015), leafMat)
      leaf.castShadow = true
      leaf.position.set(-0.15, 1.08, 0.11)
      leaf.rotation.set(-0.5 - r() * 0.6, (i / 9) * Math.PI * 2, 0)
      g.add(leaf)
    }
    g.position.set(-0.9, 0, -0.08)
    this.scene.add(g)
  }

  private buildLamp() {
    const lamp = new THREE.Group()
    const white = std(0xf5f4f0, { roughness: 0.35 })
    const base = cyl(0.065, 0.07, 0.018, white, 32)
    base.position.y = 0.009
    lamp.add(base)
    const arm = (from: THREE.Vector3, to: THREE.Vector3) => {
      const len = from.distanceTo(to)
      const m = cyl(0.0065, 0.0065, len, white, 12)
      m.position.copy(from).lerp(to, 0.5)
      m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), to.clone().sub(from).normalize())
      lamp.add(m)
      const joint = shadowed(new THREE.Mesh(new THREE.SphereGeometry(0.011, 12, 8), white))
      joint.position.copy(to)
      lamp.add(joint)
    }
    const p0 = new THREE.Vector3(0, 0.018, 0)
    const p1 = new THREE.Vector3(-0.03, 0.3, 0)
    const p2 = new THREE.Vector3(0.2, 0.42, 0)
    arm(p0, p1)
    arm(p1, p2)
    const head = shadowed(
      new THREE.Mesh(
        new THREE.LatheGeometry(
          [new THREE.Vector2(0.012, 0), new THREE.Vector2(0.03, 0.02), new THREE.Vector2(0.06, 0.07), new THREE.Vector2(0.062, 0.075)],
          32
        ),
        std(0xf1f0ec, { side: THREE.DoubleSide, roughness: 0.4 })
      )
    )
    head.position.copy(p2)
    head.rotation.z = 2.3
    lamp.add(head)
    this.lampBulb = std(0xfff6e0, { emissive: 0xffe3aa, emissiveIntensity: 3 })
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.018, 14, 10), this.lampBulb)
    bulb.position.copy(p2).add(new THREE.Vector3(0.035, -0.035, 0))
    lamp.add(bulb)
    this.lampLight = new THREE.PointLight(0xffd6a0, 0.9, 2.2, 1.5)
    this.lampLight.position.copy(bulb.position).add(new THREE.Vector3(0.02, -0.03, 0))
    lamp.add(this.lampLight)
    lamp.position.set(-0.84, 1.0, -0.1)
    lamp.rotation.y = -0.25
    this.scene.add(lamp)
    this.hotspots.push({ id: 'lamp', root: lamp })
  }

  private buildChair() {
    const chair = new THREE.Group()
    const blue = std(0x2451b3, { roughness: 0.42 })
    const seat = rbox(0.42, 0.03, 0.4, 0.014, blue)
    seat.position.y = 0.45
    chair.add(seat)
    // Curved backrest: a bent slab.
    const bg = new RoundedBoxGeometry(0.4, 0.26, 0.022, 3, 0.01)
    const p = bg.attributes.position
    for (let i = 0; i < p.count; i++) p.setZ(i, p.getZ(i) + p.getX(i) ** 2 * 1.1)
    bg.computeVertexNormals()
    const back = shadowed(new THREE.Mesh(bg, blue))
    back.position.set(0, 0.73, 0.2)
    back.rotation.x = -0.12
    chair.add(back)
    const metal = std(0x8b9097, { metalness: 0.7, roughness: 0.35 })
    for (const sx of [-1, 1]) {
      const post = cyl(0.009, 0.009, 0.3, metal, 10)
      post.position.set(sx * 0.17, 0.6, 0.19)
      chair.add(post)
      for (const sz of [-1, 1]) {
        const leg = cyl(0.01, 0.012, 0.45, metal, 10)
        leg.position.set(sx * 0.18, 0.225, sz * 0.17)
        chair.add(leg)
      }
    }
    const pivot = new THREE.Group()
    pivot.add(chair)
    pivot.position.set(0.12, 0, 0.62)
    pivot.rotation.y = 0.35
    this.chair = pivot
    this.scene.add(pivot)
    this.hotspots.push({ id: 'chair', root: pivot })
  }

  private buildShadows() {
    const t = contactShadowTexture()
    const blob = (w: number, d: number, x: number, z: number, o = 1) => {
      const m = new THREE.Mesh(
        new THREE.PlaneGeometry(w, d),
        new THREE.MeshBasicMaterial({ map: t, transparent: true, depthWrite: false, opacity: o })
      )
      m.rotation.x = -Math.PI / 2
      m.position.set(x, 0.001, z)
      this.scene.add(m)
    }
    blob(1.9, 1.2, 0, 0)
    blob(0.8, 0.75, -0.9, -0.08)
    blob(0.7, 0.7, 0.12, 0.62, 0.7)
  }

  private buildLights() {
    this.scene.add(new THREE.HemisphereLight(0xffffff, 0x8a8580, 0.35))
    const key = new THREE.DirectionalLight(0xfff7ee, 2.1)
    key.position.set(1.6, 3.6, 2.4)
    key.castShadow = true
    key.shadow.mapSize.set(2048, 2048)
    const s = key.shadow.camera
    s.left = -1.6
    s.right = 1.6
    s.top = 1.6
    s.bottom = -1.2
    s.near = 1
    s.far = 9
    key.shadow.bias = -0.0003
    key.shadow.normalBias = 0.015
    key.shadow.radius = 6
    this.scene.add(key)
    const rim = new THREE.DirectionalLight(0xdfe8ff, 0.6)
    rim.position.set(-2.5, 2, -2)
    this.scene.add(rim)
    const glow = new THREE.PointLight(0xa8d8d0, 0.35, 0.9, 2)
    glow.position.copy(SCREEN_CENTER).add(new THREE.Vector3(0, -0.08, 0.14))
    this.scene.add(glow)
  }

  /* ------------------------------------------------------------ camera */

  private fitDistance(w: number, h: number, pad: number) {
    const fov = THREE.MathUtils.degToRad(this.camera.fov)
    const dh = h / 2 / Math.tan(fov / 2)
    const dw = w / 2 / (Math.tan(fov / 2) * this.camera.aspect)
    return Math.max(dh, dw) * pad
  }

  private orbitPos(t: number) {
    const a = this.orbitAngle + (this.reduced ? 0 : Math.sin(t * 0.11) * 0.45)
    const r = this.fitDistance(2.4, 1.5, this.camera.aspect < 1 ? 1.25 : 1.9)
    return new THREE.Vector3(TARGET.x + Math.sin(a) * r, TARGET.y + r * 0.42, TARGET.z + Math.cos(a) * r)
  }

  private deskPos() {
    const portrait = this.camera.aspect < 1
    const d = this.fitDistance(portrait ? 0.9 : 1.25, 0.62, 1)
    return DESK_LOOK.clone().add(new THREE.Vector3(0, portrait ? 0.5 : 0.34, 1).normalize().multiplyScalar(d))
  }

  private screenPos() {
    return SCREEN_CENTER.clone().add(new THREE.Vector3(0, 0, this.fitDistance(SCREEN.w, SCREEN.h, 1.1)))
  }

  private moveTo(to: () => [THREE.Vector3, THREE.Vector3], dur: number, done?: () => void) {
    if (this.reduced) dur = 0.001
    this.tween = { from: [this.camera.position.clone(), this.look.clone()], to, t: 0, dur, done }
  }

  setReducedMotion(r: boolean) {
    this.reduced = r
  }

  get currentMode() {
    return this.mode
  }

  /** Loader finished: the diorama slowly turns in the void. */
  showOrbit() {
    this.look.copy(TARGET)
    this.setMode('orbit')
  }

  toDesk() {
    if (this.mode === 'desk' || this.mode === 'travel') return
    const from = this.mode
    this.setMode('travel')
    this.onTravel()
    this.moveTo(() => [this.deskPos(), DESK_LOOK], from === 'screen' ? 1.1 : 1.9, () => this.setMode('desk'))
  }

  toOrbit() {
    if (this.mode !== 'desk') return
    this.setMode('travel')
    this.onTravel()
    this.moveTo(() => [this.orbitPos(this.clock.elapsedTime), TARGET], 1.9, () => this.setMode('orbit'))
  }

  zoomIn() {
    if (this.mode === 'screen' || this.mode === 'zooming' || this.mode === 'loading') return
    const far = this.mode === 'orbit'
    this.setMode('zooming')
    this.onHover(null, 0, 0)
    this.onTravel()
    this.moveTo(() => [this.screenPos(), SCREEN_CENTER], far ? 2 : 1.3, () => this.setMode('screen'))
  }

  zoomOut() {
    if (this.mode !== 'screen') return
    this.toDesk()
  }

  private setMode(m: Mode) {
    this.mode = m
    // Only the screen (CSS3D, underneath) takes pointer input while zoomed in.
    this.renderer.domElement.style.pointerEvents = m === 'screen' ? 'none' : 'auto'
    this.renderer.domElement.style.cursor = m === 'orbit' ? 'pointer' : 'default'
    this.onModeChange(m)
  }

  /** A real key was pressed: press the same keycap on the 3D R65. */
  pressKey(code: string) {
    const key = this.keyMeshes.get(code) ?? this.keyMeshes.get(code.replace('Right', 'Left'))
    if (key) this.keyPress.set(key, 1)
    if (code === 'AudioVolumeUp' || code === 'AudioVolumeDown') this.knob.rotation.y += code.endsWith('Up') ? -0.4 : 0.4
  }

  /* ------------------------------------------------------------ input */

  private hit(): Hotspot | null {
    this.raycaster.setFromCamera(this.pointer, this.camera)
    let best: { id: Hotspot; d: number } | null = null
    for (const h of this.hotspots) {
      const i = this.raycaster.intersectObject(h.root, true)[0]
      if (i && (!best || i.distance < best.d)) best = { id: h.id, d: i.distance }
    }
    return best?.id ?? null
  }

  private hovered: Hotspot | null = null
  private onPointerMove = (e: PointerEvent) => {
    const r = this.renderer.domElement.getBoundingClientRect()
    this.pointer.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
    if (this.mode !== 'desk') return
    const h = this.hit()
    if (h !== this.hovered) {
      this.hovered = h
      this.renderer.domElement.style.cursor = h ? 'pointer' : 'default'
    }
    this.onHover(h, e.clientX, e.clientY)
  }

  private onPointerDown = (e: PointerEvent) => {
    this.downAt = { x: e.clientX, y: e.clientY }
  }

  private onPointerUp = (e: PointerEvent) => {
    if (!this.downAt || Math.hypot(e.clientX - this.downAt.x, e.clientY - this.downAt.y) > 6) return
    this.downAt = null
    this.onPointerMove(e)
    if (this.mode === 'orbit') return this.toDesk()
    if (this.mode !== 'desk') return
    const h = this.hit()
    if (h) this.activate(h)
    else this.toOrbit()
  }

  // While zoomed in, drifting off the screen for a moment steps back to the desk.
  private offScreenSince = 0
  private onWindowPointer = (e: PointerEvent) => {
    if (this.mode !== 'screen') {
      this.offScreenSince = 0
      return
    }
    // Hover-away only makes sense with a real mouse (not touch or pen).
    if (e.buttons || e.pointerType !== 'mouse' || this.flatScreen) return
    const r = this.screenElement.getBoundingClientRect()
    const m = 6
    const inside = e.clientX > r.left - m && e.clientX < r.right + m && e.clientY > r.top - m && e.clientY < r.bottom + m
    if (inside) this.offScreenSince = 0
    else if (!this.offScreenSince) this.offScreenSince = performance.now()
  }

  activate(h: Hotspot) {
    switch (h) {
      case 'monitor':
        this.zoomIn()
        break
      case 'lamp':
        this.lampOn = !this.lampOn
        this.lampLight.intensity = this.lampOn ? 0.9 : 0
        this.lampBulb.emissiveIntensity = this.lampOn ? 3 : 0
        break
      case 'plant':
        this.plantWiggle = 1
        break
      case 'keyboard':
        // Types "fahad" on the keycaps.
        ;['KeyF', 'KeyA', 'KeyH', 'KeyA', 'KeyD'].forEach((c, k) => this.keyPress.set(this.keyMeshes.get(c)!, 1 + k * 0.35))
        this.knob.rotation.y -= 1.2
        break
      case 'laptop':
        this.laptopOn = !this.laptopOn
        this.laptopScreen.emissiveIntensity = this.laptopOn ? 0.8 : 0
        break
      case 'chair':
        this.chairSpin = 1
        break
    }
  }

  private onResize = () => {
    const { clientWidth: w, clientHeight: h } = this.host
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(w, h)
    this.css.setSize(w, h)
    if (this.mode === 'screen') this.camera.position.copy(this.screenPos())
    if (this.mode === 'desk') this.camera.position.copy(this.deskPos())
  }

  /* ------------------------------------------------------------ loop */

  start() {
    const tick = () => {
      this.raf = requestAnimationFrame(tick)
      const raw = this.clock.getDelta()
      const dt = Math.min(raw, 0.05)
      const t = this.clock.elapsedTime
      this.smooth.lerp(this.pointer.x > 5 ? new THREE.Vector2() : this.pointer, 1 - Math.exp(-dt * 4))

      if (this.tween) {
        const tw = this.tween
        tw.t = Math.min(1, tw.t + Math.min(raw, 0.2) / tw.dur)
        const k = ease(tw.t)
        const [pos, look] = tw.to()
        this.camera.position.lerpVectors(tw.from[0], pos, k)
        this.look.lerpVectors(tw.from[1], look, k)
        if (tw.t >= 1) {
          this.tween = null
          tw.done?.()
        }
      } else if (this.mode === 'orbit' || this.mode === 'loading') {
        const p = this.orbitPos(t)
        p.y += this.smooth.y * 0.15
        this.camera.position.lerp(p, 1 - Math.exp(-dt * 2))
      } else if (this.mode === 'desk' && !this.reduced) {
        const p = this.deskPos().add(new THREE.Vector3(this.smooth.x * 0.07, this.smooth.y * 0.035, 0))
        this.camera.position.lerp(p, 1 - Math.exp(-dt * 3))
      } else if (this.mode === 'screen' && this.offScreenSince && performance.now() - this.offScreenSince > 450) {
        this.offScreenSince = 0
        this.zoomOut()
      }
      this.camera.lookAt(this.look)

      if (this.plantWiggle > 0) {
        this.plantWiggle = Math.max(0, this.plantWiggle - dt * 0.7)
        this.plant.rotation.y = Math.sin(t * 16) * 0.1 * this.plantWiggle
        this.plant.rotation.z = Math.cos(t * 12) * 0.04 * this.plantWiggle
      }
      if (this.chairSpin > 0) {
        this.chairSpin = Math.max(0, this.chairSpin - dt * 0.45)
        this.chair.rotation.y += dt * 9 * ease(this.chairSpin)
      }
      for (const [key, left] of this.keyPress) {
        const next = left - dt * 6
        const depth = next > 0 && next < 1 ? Math.sin(next * Math.PI) * 0.004 : 0
        key.position.y = 0.0175 - depth
        if (next <= 0) this.keyPress.delete(key)
        else this.keyPress.set(key, next)
      }
      if (this.mode === 'screen') {
        // The 3D mouse follows the real one, a little.
        this.mouseObj.position.x = 0.3 + this.smooth.x * 0.02
        this.mouseObj.position.z = 0.12 - this.smooth.y * 0.015
      }

      this.renderer.render(this.scene, this.camera)
      this.css.render(this.scene, this.camera)
    }
    this.raf = requestAnimationFrame(tick)
  }

  dispose() {
    cancelAnimationFrame(this.raf)
    window.removeEventListener('resize', this.onResize)
    window.removeEventListener('pointermove', this.onWindowPointer)
    const el = this.renderer.domElement
    el.removeEventListener('pointermove', this.onPointerMove)
    el.removeEventListener('pointerdown', this.onPointerDown)
    el.removeEventListener('pointerup', this.onPointerUp)
    this.scene.traverse((o) => {
      const m = o as THREE.Mesh
      m.geometry?.dispose()
      const mats = Array.isArray(m.material) ? m.material : m.material ? [m.material] : []
      mats.forEach((x) => x.dispose())
    })
    this.renderer.dispose()
    this.host.innerHTML = ''
  }
}
