/**
 * The desk — a procedural 3D model of the author's real desk (monitor,
 * MacBook on a stand, green/red/cream keyboard, world-map desk mat, floral
 * tablecloth, lamp, money plant in a bottle, butterfly cabinet, pink poster).
 *
 * Rendering: WebGL for the room, CSS3DRenderer for the monitor's screen (a
 * live DOM "OS"). The screen mesh punches a transparent hole in the WebGL
 * canvas so the DOM underneath shows through, and anything in front of the
 * monitor still occludes it correctly.
 */
import * as THREE from 'three'
import { CSS3DObject, CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer.js'
import {
  cabinetTexture,
  curtainTexture,
  deskMatTexture,
  floorTexture,
  posterTexture,
  tableclothTexture,
  wallTexture,
} from './textures'

export const SCREEN_PX = { w: 1280, h: 740 }
const SCREEN = { w: 0.58, h: 0.335 }
const SCREEN_CENTER = new THREE.Vector3(0, 1.075, -0.277)

const IDLE = { pos: new THREE.Vector3(0.62, 1.34, 1.3), look: new THREE.Vector3(-0.05, 0.98, -0.22) }
const INTRO = { pos: new THREE.Vector3(0.35, 1.75, 3.0), look: new THREE.Vector3(-0.2, 1, -0.2) }

export type Hotspot = 'monitor' | 'lamp' | 'plant' | 'keyboard' | 'laptop' | 'poster'
export const HOTSPOT_LABEL: Record<Hotspot, string> = {
  monitor: 'Use the computer',
  lamp: 'Toggle the lamp',
  plant: 'Money plant',
  keyboard: 'Mechanical keyboard',
  laptop: 'MacBook — Poridhi work machine',
  poster: 'Poster',
}

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)

function std(color: THREE.ColorRepresentation, extra: Partial<THREE.MeshStandardMaterialParameters> = {}) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.7, metalness: 0, ...extra })
}
function box(w: number, h: number, d: number, mat: THREE.Material) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat)
  m.castShadow = true
  m.receiveShadow = true
  return m
}
function cyl(rt: number, rb: number, h: number, mat: THREE.Material, seg = 24) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat)
  m.castShadow = true
  m.receiveShadow = true
  return m
}

export class DeskScene {
  readonly renderer: THREE.WebGLRenderer
  readonly css: CSS3DRenderer
  readonly scene = new THREE.Scene()
  readonly camera: THREE.PerspectiveCamera
  private hotspots: { id: Hotspot; root: THREE.Object3D }[] = []
  private raycaster = new THREE.Raycaster()
  private pointer = new THREE.Vector2(9, 9)
  private mouse = new THREE.Vector2(0, 0) // -1..1, for parallax
  private look = IDLE.look.clone()
  private tween: { from: [THREE.Vector3, THREE.Vector3]; to: [THREE.Vector3, THREE.Vector3]; t: number; dur: number; done?: () => void } | null = null
  private mode: 'intro' | 'idle' | 'zooming' | 'screen' = 'intro'
  private lampLight!: THREE.PointLight
  private lampBulb!: THREE.MeshStandardMaterial
  private lampOn = true
  private plant!: THREE.Group
  private plantWiggle = 0
  private keys!: THREE.InstancedMesh
  private keyBase: THREE.Matrix4[] = []
  private keyPress = new Map<number, number>()
  private laptopScreen!: THREE.MeshStandardMaterial
  private laptopOn = true
  private clock = new THREE.Clock()
  private raf = 0
  private reduced = false
  onHover: (h: Hotspot | null) => void = () => {}
  onModeChange: (m: 'intro' | 'idle' | 'zooming' | 'screen') => void = () => {}

  constructor(
    private host: HTMLElement,
    screenElement: HTMLElement
  ) {
    const { clientWidth: w, clientHeight: h } = host
    this.camera = new THREE.PerspectiveCamera(40, w / h, 0.05, 50)
    this.camera.position.copy(INTRO.pos)
    this.camera.lookAt(INTRO.look)

    this.css = new CSS3DRenderer()
    this.css.setSize(w, h)
    Object.assign(this.css.domElement.style, { position: 'absolute', inset: '0' })
    host.appendChild(this.css.domElement)

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setSize(w, h)
    this.renderer.setClearColor(0x000000, 0)
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.05
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    Object.assign(this.renderer.domElement.style, { position: 'absolute', inset: '0' })
    host.appendChild(this.renderer.domElement)

    this.buildRoom()
    this.buildDesk()
    this.buildMonitor(screenElement)
    this.buildLaptop()
    this.buildKeyboard()
    this.buildDeskProps()
    this.buildCabinet()
    this.buildLights()

    const el = this.renderer.domElement
    el.addEventListener('pointermove', this.onPointerMove)
    el.addEventListener('click', this.onClick)
    window.addEventListener('resize', this.onResize)
  }

  /* ------------------------------------------------------------ build */

  private buildRoom() {
    const wall = std(0xffffff, { map: wallTexture(), roughness: 0.95 })
    const back = new THREE.Mesh(new THREE.PlaneGeometry(6, 3.2), wall)
    back.position.set(0, 1.6, -0.46)
    back.receiveShadow = true
    this.scene.add(back)

    const right = new THREE.Mesh(new THREE.PlaneGeometry(4, 3.2), wall)
    right.position.set(1.15, 1.6, 1.4)
    right.rotation.y = -Math.PI / 2
    right.receiveShadow = true
    this.scene.add(right)

    const left = new THREE.Mesh(new THREE.PlaneGeometry(4, 3.2), wall)
    left.position.set(-1.9, 1.6, 1.4)
    left.rotation.y = Math.PI / 2
    left.receiveShadow = true
    this.scene.add(left)

    const floor = new THREE.Mesh(new THREE.PlaneGeometry(8, 8), std(0xffffff, { map: floorTexture(), roughness: 0.6 }))
    floor.rotation.x = -Math.PI / 2
    floor.receiveShadow = true
    this.scene.add(floor)

    // Sheer curtain along the right wall, gently folded.
    const cg = new THREE.PlaneGeometry(1.5, 2.6, 40, 1)
    const p = cg.attributes.position
    for (let i = 0; i < p.count; i++) p.setZ(i, Math.sin(p.getX(i) * 22) * 0.025)
    cg.computeVertexNormals()
    const curtain = new THREE.Mesh(
      cg,
      std(0xffffff, { map: curtainTexture(), transparent: true, opacity: 0.92, side: THREE.DoubleSide, roughness: 1 })
    )
    curtain.position.set(1.1, 1.35, 0.3)
    curtain.rotation.y = -Math.PI / 2
    curtain.receiveShadow = true
    this.scene.add(curtain)

    // Wooden doorframe on the far left, and the green wall plaque top-right.
    const wood = std(0x8a6a45, { roughness: 0.6 })
    const frame = box(0.06, 2.1, 0.08, wood)
    frame.position.set(-1.55, 1.05, -0.42)
    this.scene.add(frame)
    const plaque = box(0.14, 0.2, 0.02, std(0x24302a))
    plaque.position.set(0.92, 2.15, -0.44)
    this.scene.add(plaque)
    const dots = box(0.05, 0.12, 0.005, std(0x6a9a5a, { emissive: 0x1a2a1a }))
    dots.position.set(0.92, 2.15, -0.428)
    this.scene.add(dots)
  }

  private buildDesk() {
    const cloth = std(0xffffff, { map: tableclothTexture(4), roughness: 0.95 })
    const top = box(1.5, 0.04, 0.74, cloth)
    top.position.set(0, 0.73, -0.08)
    this.scene.add(top)
    // Ruffled skirt: front and sides, wavy.
    const skirt = (w: number) => {
      const g = new THREE.PlaneGeometry(w, 0.72, Math.round(w * 60), 1)
      const pos = g.attributes.position
      for (let i = 0; i < pos.count; i++) pos.setZ(i, Math.sin(pos.getX(i) * 55) * 0.012 * (pos.getY(i) < 0 ? 1.4 : 0.4))
      g.computeVertexNormals()
      const t = tableclothTexture(2)
      const m = new THREE.Mesh(g, std(0xffffff, { map: t, side: THREE.DoubleSide, roughness: 1 }))
      m.castShadow = true
      m.receiveShadow = true
      return m
    }
    const front = skirt(1.52)
    front.position.set(0, 0.36, 0.3)
    this.scene.add(front)
    for (const sx of [-1, 1]) {
      const side = skirt(0.76)
      side.position.set(sx * 0.76, 0.36, -0.08)
      side.rotation.y = Math.PI / 2
      this.scene.add(side)
    }
    // World-map desk mat.
    const mat = box(0.95, 0.004, 0.37, std(0xffffff, { map: deskMatTexture(), roughness: 0.9 }))
    mat.position.set(0.1, 0.752, 0.08)
    this.scene.add(mat)
  }

  private buildMonitor(screenElement: HTMLElement) {
    const g = new THREE.Group()
    const silver = std(0xd6d8da, { metalness: 0.6, roughness: 0.35 })
    const base = box(0.22, 0.012, 0.16, silver)
    base.position.set(0, 0.756, -0.3)
    g.add(base)
    const neck = box(0.035, 0.2, 0.02, silver)
    neck.position.set(0, 0.86, -0.34)
    g.add(neck)
    const panel = box(0.6, 0.36, 0.022, std(0xe8e9ea, { roughness: 0.4 }))
    panel.position.set(0, 1.075, -0.29)
    g.add(panel)
    const bezel = box(0.59, 0.35, 0.004, std(0x0b0c0e, { roughness: 0.2 }))
    bezel.position.set(0, 1.078, -0.2805)
    g.add(bezel)

    // The hole: writes transparent pixels so the CSS3D screen shows through.
    const hole = new THREE.Mesh(
      new THREE.PlaneGeometry(SCREEN.w, SCREEN.h),
      new THREE.MeshBasicMaterial({ color: 0x000000, opacity: 0, transparent: false, blending: THREE.NoBlending })
    )
    hole.position.copy(SCREEN_CENTER)
    g.add(hole)
    this.scene.add(g)
    this.hotspots.push({ id: 'monitor', root: g })

    const obj = new CSS3DObject(screenElement)
    obj.position.copy(SCREEN_CENTER)
    obj.scale.setScalar(SCREEN.w / SCREEN_PX.w)
    this.scene.add(obj)
  }

  private buildLaptop() {
    const g = new THREE.Group()
    const alu = std(0xbfc3c7, { metalness: 0.7, roughness: 0.3 })
    // Stand: two angled plates.
    const stand = box(0.24, 0.01, 0.2, alu)
    stand.position.set(0, 0.8, 0)
    stand.rotation.x = 0.35
    g.add(stand)
    const leg = box(0.2, 0.08, 0.01, alu)
    leg.position.set(0, 0.77, -0.09)
    g.add(leg)
    const bodyG = new THREE.Group()
    bodyG.position.set(0, 0.812, 0)
    bodyG.rotation.x = 0.35
    const body = box(0.3, 0.012, 0.21, alu)
    bodyG.add(body)
    const keys = box(0.26, 0.002, 0.1, std(0x222428))
    keys.position.set(0, 0.007, -0.02)
    bodyG.add(keys)
    const lid = new THREE.Group()
    lid.position.set(0, 0.006, -0.105)
    lid.rotation.x = -0.6
    const lidShell = box(0.3, 0.2, 0.008, alu)
    lidShell.position.set(0, 0.1, -0.004)
    lid.add(lidShell)
    this.laptopScreen = std(0x16323a, { emissive: 0x2c6e78, emissiveIntensity: 0.9, roughness: 0.2 })
    const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.27, 0.175), this.laptopScreen)
    scr.position.set(0, 0.1, 0.001)
    lid.add(scr)
    bodyG.add(lid)
    g.add(bodyG)
    g.position.set(0.55, 0, -0.2)
    g.rotation.y = -0.35
    this.scene.add(g)
    this.hotspots.push({ id: 'laptop', root: g })
  }

  private buildKeyboard() {
    const g = new THREE.Group()
    const baseMat = std(0xe9e4d6, { roughness: 0.6 })
    const base = box(0.33, 0.022, 0.115, baseMat)
    g.add(base)
    const cols = 15
    const rows = 5
    const n = cols * rows
    this.keys = new THREE.InstancedMesh(new THREE.BoxGeometry(0.0185, 0.012, 0.0185), std(0xffffff, { roughness: 0.5 }), n)
    this.keys.castShadow = true
    const cream = new THREE.Color(0xf1ecdf)
    const green = new THREE.Color(0x3d7a4e)
    const red = new THREE.Color(0x9b2c34)
    let i = 0
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++) {
        const m = new THREE.Matrix4().makeTranslation(-0.147 + c * 0.021, 0.017, -0.044 + r * 0.021)
        this.keys.setMatrixAt(i, m)
        this.keyBase.push(m.clone())
        const accent = c === 0 || c === cols - 1 || (r === rows - 1 && (c < 3 || c > cols - 4))
        const color = r === rows - 1 && c > 4 && c < 10 ? red : accent ? green : cream
        this.keys.setColorAt(i, color)
        i++
      }
    g.add(this.keys)
    g.position.set(0.02, 0.765, 0.08)
    this.scene.add(g)
    this.hotspots.push({ id: 'keyboard', root: g })

    const mouse = new THREE.Mesh(new THREE.SphereGeometry(0.03, 20, 12), std(0x1a1b1e, { roughness: 0.4 }))
    mouse.scale.set(1, 0.45, 1.6)
    mouse.position.set(0.36, 0.765, 0.09)
    mouse.castShadow = true
    this.scene.add(mouse)
    // Cable to the hub.
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.36, 0.758, 0.04),
      new THREE.Vector3(0.3, 0.756, -0.05),
      new THREE.Vector3(0.12, 0.756, -0.15),
      new THREE.Vector3(0.02, 0.756, -0.25),
    ])
    const cable = new THREE.Mesh(new THREE.TubeGeometry(curve, 30, 0.003, 6), std(0x111111))
    this.scene.add(cable)
  }

  private buildDeskProps() {
    // Money plant in a glass bottle, on a wooden coaster.
    const plant = new THREE.Group()
    const coaster = cyl(0.06, 0.06, 0.008, std(0x8a5a3a))
    coaster.position.y = 0.754
    plant.add(coaster)
    const glass = new THREE.MeshPhysicalMaterial({
      color: 0xdfeee8,
      transmission: 0.9,
      roughness: 0.05,
      thickness: 0.01,
      transparent: true,
      opacity: 0.45,
    })
    const bottle = cyl(0.035, 0.045, 0.16, glass)
    bottle.position.y = 0.84
    plant.add(bottle)
    const neck = cyl(0.015, 0.03, 0.05, glass)
    neck.position.y = 0.945
    plant.add(neck)
    const leafMat = std(0x3f7d3a, { roughness: 0.5, side: THREE.DoubleSide })
    const leafGeo = new THREE.SphereGeometry(0.03, 12, 8)
    const stems = new THREE.Group()
    for (let i = 0; i < 9; i++) {
      const leaf = new THREE.Mesh(leafGeo, leafMat)
      leaf.scale.set(1, 0.22, 1.35)
      const a = (i / 9) * Math.PI * 2
      const h = 0.99 + (i % 3) * 0.045
      leaf.position.set(Math.cos(a) * 0.05, h, Math.sin(a) * 0.05)
      leaf.rotation.set(0.5 * Math.sin(a), a, 0.3)
      leaf.castShadow = true
      stems.add(leaf)
    }
    plant.add(stems)
    plant.position.set(-0.43, 0, -0.3)
    this.plant = stems
    this.scene.add(plant)
    this.hotspots.push({ id: 'plant', root: plant })

    // USB hub and a phone stand.
    const hub = box(0.12, 0.012, 0.035, std(0x6b6f74, { metalness: 0.5, roughness: 0.4 }))
    hub.position.set(0.12, 0.757, -0.2)
    this.scene.add(hub)
    const phone = box(0.06, 0.1, 0.006, std(0x3b3f42, { metalness: 0.4 }))
    phone.position.set(-0.3, 0.8, -0.05)
    phone.rotation.x = -0.25
    this.scene.add(phone)

    // Pink poster on the wall.
    const poster = new THREE.Group()
    const frame = box(0.3, 0.39, 0.015, std(0x111111))
    poster.add(frame)
    const art = new THREE.Mesh(new THREE.PlaneGeometry(0.26, 0.35), std(0xffffff, { map: posterTexture(), roughness: 0.8 }))
    art.position.z = 0.008
    poster.add(art)
    poster.position.set(-0.5, 1.55, -0.45)
    this.scene.add(poster)
    this.hotspots.push({ id: 'poster', root: poster })

    // Blue plastic chair, pushed back from the desk.
    const chair = new THREE.Group()
    const blue = std(0x1d4fb8, { roughness: 0.55 })
    const seat = box(0.44, 0.03, 0.42, blue)
    seat.position.y = 0.46
    chair.add(seat)
    const backGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.34, 32, 1, true, -0.75, 1.5)
    const back = new THREE.Mesh(backGeo, std(0x1d4fb8, { roughness: 0.55, side: THREE.DoubleSide }))
    back.castShadow = true
    back.position.set(0, 0.68, -0.06)
    chair.add(back)
    for (const [x, z] of [[-0.19, -0.18], [0.19, -0.18], [-0.19, 0.18], [0.19, 0.18]]) {
      const leg = cyl(0.012, 0.014, 0.46, blue, 8)
      leg.position.set(x, 0.23, z)
      chair.add(leg)
    }
    chair.position.set(0.1, 0, 0.82)
    chair.rotation.y = 0.15
    this.scene.add(chair)
  }

  private buildCabinet() {
    const g = new THREE.Group()
    const gloss = std(0x141416, { roughness: 0.25, metalness: 0.1 })
    const body = box(0.52, 1.28, 0.46, gloss)
    body.position.y = 0.64
    g.add(body)
    const front = cabinetTexture()
    const drawers: [number, number, number][] = [
      [-0.125, 1.13, 0.23],
      [0.125, 1.13, 0.23],
      [0, 0.87, 0.48],
      [0, 0.6, 0.48],
      [0, 0.33, 0.48],
    ]
    drawers.forEach(([x, y, w], i) => {
      const d = box(w, 0.24, 0.012, std(0xffffff, { map: front, roughness: 0.25 }))
      d.position.set(x, y, 0.236)
      if (i > 1) d.scale.y = 1.05
      g.add(d)
      const handle = box(w * 0.4, 0.015, 0.02, gloss)
      handle.position.set(x, y + 0.1, 0.25)
      g.add(handle)
    })
    // Things on top: books, bottles, a potted plant, and the white desk lamp.
    const books = ['#e7c6cf', '#f1e3c8', '#d66a7a', '#f4f1ea', '#e9a8b8']
    books.forEach((c, i) => {
      const b = box(0.2, 0.022, 0.15, std(c))
      b.position.set(0.02, 1.291 + i * 0.022, -0.02)
      b.rotation.y = (i % 2 ? 0.05 : -0.04)
      g.add(b)
    })
    const bottleColors = [0x2c6fb6, 0xf1f1f1, 0x1d1d1d, 0xb4242a, 0xe9e9e9]
    bottleColors.forEach((c, i) => {
      const b = cyl(0.02, 0.022, 0.1 + (i % 3) * 0.04, std(c, { roughness: 0.3 }), 12)
      b.position.set(-0.2 + i * 0.045, 1.33 + (i % 3) * 0.02, 0.1)
      g.add(b)
    })
    const pot = cyl(0.045, 0.035, 0.08, std(0xe7dccb, { roughness: 0.5 }))
    pot.position.set(-0.08, 1.32, 0.1)
    g.add(pot)
    for (let i = 0; i < 6; i++) {
      const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.028, 10, 6), std(0x3f7d3a))
      leaf.scale.set(1, 0.25, 1.3)
      leaf.position.set(-0.08 + Math.cos(i) * 0.04, 1.39 + (i % 3) * 0.03, 0.1 + Math.sin(i) * 0.04)
      leaf.rotation.set(0.4, i, 0.3)
      g.add(leaf)
    }

    // Lamp
    const lamp = new THREE.Group()
    const white = std(0xf4f4f2, { roughness: 0.35 })
    const lbase = cyl(0.07, 0.075, 0.02, white)
    lbase.position.y = 1.29
    lamp.add(lbase)
    const arm1 = cyl(0.008, 0.008, 0.3, white, 10)
    arm1.position.set(0, 1.44, 0)
    arm1.rotation.z = 0.12
    lamp.add(arm1)
    const arm2 = cyl(0.008, 0.008, 0.22, white, 10)
    arm2.position.set(0.06, 1.62, 0)
    arm2.rotation.z = -0.9
    lamp.add(arm2)
    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.065, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2),
      std(0xdcdcdc, { side: THREE.DoubleSide, roughness: 0.4 })
    )
    head.position.set(0.16, 1.66, 0)
    head.rotation.z = -2.4
    head.castShadow = true
    lamp.add(head)
    this.lampBulb = std(0xfff4d8, { emissive: 0xffe2a8, emissiveIntensity: 2 })
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.02, 12, 8), this.lampBulb)
    bulb.position.set(0.175, 1.645, 0)
    lamp.add(bulb)
    this.lampLight = new THREE.PointLight(0xffd9a0, 2.2, 3, 1.6)
    this.lampLight.position.set(0.2, 1.6, 0.05)
    this.lampLight.castShadow = true
    this.lampLight.shadow.mapSize.set(512, 512)
    lamp.add(this.lampLight)
    lamp.position.set(0.12, 0, -0.1)
    g.add(lamp)

    g.position.set(-1.07, 0, -0.2)
    this.scene.add(g)
    this.hotspots.push({ id: 'lamp', root: lamp })
  }

  private buildLights() {
    this.scene.add(new THREE.HemisphereLight(0xfff6e6, 0x5a5248, 0.9))
    const sun = new THREE.DirectionalLight(0xfff1dc, 1.6)
    sun.position.set(-2.5, 3.2, 2.2)
    sun.castShadow = true
    sun.shadow.mapSize.set(2048, 2048)
    sun.shadow.camera.left = -2
    sun.shadow.camera.right = 2
    sun.shadow.camera.top = 2
    sun.shadow.camera.bottom = -1
    sun.shadow.bias = -0.0004
    sun.shadow.radius = 4
    this.scene.add(sun)
    // Soft cyan spill from the monitor onto the desk.
    const glow = new THREE.PointLight(0x9fd4e0, 0.6, 1.2, 2)
    glow.position.copy(SCREEN_CENTER).add(new THREE.Vector3(0, -0.05, 0.15))
    this.scene.add(glow)
  }

  /* ------------------------------------------------------------ camera */

  private moveTo(pos: THREE.Vector3, look: THREE.Vector3, dur: number, done?: () => void) {
    if (this.reduced) dur = 0.001
    this.tween = { from: [this.camera.position.clone(), this.look.clone()], to: [pos.clone(), look.clone()], t: 0, dur, done }
  }

  private screenView() {
    const fov = THREE.MathUtils.degToRad(this.camera.fov)
    const dh = SCREEN.h / 2 / Math.tan(fov / 2)
    const dw = SCREEN.w / 2 / (Math.tan(fov / 2) * this.camera.aspect)
    const d = Math.max(dh, dw) * 1.04
    return SCREEN_CENTER.clone().add(new THREE.Vector3(0, 0, d))
  }

  setReducedMotion(r: boolean) {
    this.reduced = r
  }

  /** Boot finished: fly from the doorway to the desk. */
  enter() {
    this.moveTo(IDLE.pos, IDLE.look, 2.4, () => this.setMode('idle'))
  }

  zoomIn() {
    if (this.mode === 'screen' || this.mode === 'zooming') return
    this.setMode('zooming')
    this.onHover(null)
    this.moveTo(this.screenView(), SCREEN_CENTER, 1.4, () => this.setMode('screen'))
  }

  zoomOut() {
    if (this.mode !== 'screen') return
    this.setMode('zooming')
    this.moveTo(IDLE.pos, IDLE.look, 1.2, () => this.setMode('idle'))
  }

  private setMode(m: typeof this.mode) {
    this.mode = m
    // Only the screen (CSS3D, underneath) takes pointer input while zoomed in.
    this.renderer.domElement.style.pointerEvents = m === 'screen' ? 'none' : 'auto'
    this.onModeChange(m)
  }

  /* ------------------------------------------------------------ input */

  private hit(): Hotspot | null {
    this.raycaster.setFromCamera(this.pointer, this.camera)
    for (const h of this.hotspots) {
      if (this.raycaster.intersectObject(h.root, true).length) return h.id
    }
    return null
  }

  private hovered: Hotspot | null = null
  private onPointerMove = (e: PointerEvent) => {
    const r = this.renderer.domElement.getBoundingClientRect()
    this.pointer.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
    this.mouse.copy(this.pointer)
    if (this.mode !== 'idle') return
    const h = this.hit()
    if (h !== this.hovered) {
      this.hovered = h
      this.renderer.domElement.style.cursor = h ? 'pointer' : 'default'
      this.onHover(h)
    }
  }

  private onClick = () => {
    if (this.mode !== 'idle') return
    const h = this.hit()
    if (h) this.activate(h)
  }

  activate(h: Hotspot) {
    switch (h) {
      case 'monitor':
        this.zoomIn()
        break
      case 'lamp':
        this.lampOn = !this.lampOn
        this.lampLight.intensity = this.lampOn ? 2.2 : 0
        this.lampBulb.emissiveIntensity = this.lampOn ? 2 : 0
        break
      case 'plant':
        this.plantWiggle = 1
        break
      case 'keyboard':
        for (let k = 0; k < 6; k++) this.keyPress.set(Math.floor(Math.random() * this.keyBase.length), 1 + k * 0.15)
        break
      case 'laptop':
        this.laptopOn = !this.laptopOn
        this.laptopScreen.emissiveIntensity = this.laptopOn ? 0.9 : 0
        break
      case 'poster':
        break
    }
  }

  private onResize = () => {
    const { clientWidth: w, clientHeight: h } = this.host
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(w, h)
    this.css.setSize(w, h)
    if (this.mode === 'screen') this.camera.position.copy(this.screenView())
  }

  /* ------------------------------------------------------------ loop */

  start() {
    const tick = () => {
      this.raf = requestAnimationFrame(tick)
      const raw = this.clock.getDelta()
      const dt = Math.min(raw, 0.05)
      const t = this.clock.elapsedTime

      if (this.tween) {
        const tw = this.tween
        tw.t = Math.min(1, tw.t + Math.min(raw, 0.2) / tw.dur)
        const k = ease(tw.t)
        this.camera.position.lerpVectors(tw.from[0], tw.to[0], k)
        this.look.lerpVectors(tw.from[1], tw.to[1], k)
        if (tw.t >= 1) {
          this.tween = null
          tw.done?.()
        }
      } else if (this.mode === 'idle' && !this.reduced) {
        // Gentle parallax toward the pointer, plus a slow breathing sway.
        const target = IDLE.pos
          .clone()
          .add(new THREE.Vector3(this.mouse.x * 0.18 + Math.sin(t * 0.25) * 0.03, this.mouse.y * 0.08, 0))
        this.camera.position.lerp(target, 1 - Math.exp(-dt * 3))
      }
      this.camera.lookAt(this.look)

      if (this.plantWiggle > 0) {
        this.plantWiggle = Math.max(0, this.plantWiggle - dt * 0.8)
        this.plant.rotation.y = Math.sin(t * 18) * 0.12 * this.plantWiggle
        this.plant.rotation.z = Math.cos(t * 14) * 0.05 * this.plantWiggle
      }
      if (this.keyPress.size) {
        for (const [i, left] of this.keyPress) {
          const next = left - dt * 4
          const depth = next > 0 && next < 1 ? Math.sin(next * Math.PI) * 0.006 : 0
          const m = this.keyBase[i].clone().multiply(new THREE.Matrix4().makeTranslation(0, -depth, 0))
          this.keys.setMatrixAt(i, m)
          if (next <= 0) this.keyPress.delete(i)
          else this.keyPress.set(i, next)
        }
        this.keys.instanceMatrix.needsUpdate = true
      }

      this.renderer.render(this.scene, this.camera)
      this.css.render(this.scene, this.camera)
    }
    this.raf = requestAnimationFrame(tick)
  }

  dispose() {
    cancelAnimationFrame(this.raf)
    window.removeEventListener('resize', this.onResize)
    this.renderer.domElement.removeEventListener('pointermove', this.onPointerMove)
    this.renderer.domElement.removeEventListener('click', this.onClick)
    this.renderer.dispose()
    this.host.innerHTML = ''
  }
}
