/**
 * The build manual. Parts are the ones in the author's photo; the wiring is a
 * standard way to connect them (tank steering, one BTS7960 per side), written
 * as a teaching reconstruction rather than a schematic of the original bot.
 */
import type { PartId } from './parts'

export type Slot = { id: string; part: PartId; x: number; y: number; label: string; flip?: boolean }
export type Terminal = { id: string; slot: string; x: number; y: number; label: string }
export type Wire = { a: string; b: string; color: string }

export const BOARD = { w: 800, h: 540 }
export const CHASSIS = { x: 130, y: 55, w: 540, h: 430 }

export const SLOTS: Slot[] = [
  { id: 'm-fl', part: 'motor', x: 208, y: 130, label: 'Front-left motor' },
  { id: 'm-fr', part: 'motor', x: 592, y: 130, label: 'Front-right motor', flip: true },
  { id: 'm-rl', part: 'motor', x: 208, y: 410, label: 'Rear-left motor' },
  { id: 'm-rr', part: 'motor', x: 592, y: 410, label: 'Rear-right motor', flip: true },
  { id: 'w-fl', part: 'wheel', x: 110, y: 130, label: 'Front-left wheel' },
  { id: 'w-fr', part: 'wheel', x: 690, y: 130, label: 'Front-right wheel' },
  { id: 'w-rl', part: 'wheel', x: 110, y: 410, label: 'Rear-left wheel' },
  { id: 'w-rr', part: 'wheel', x: 690, y: 410, label: 'Rear-right wheel' },
  { id: 'drv-l', part: 'driver', x: 245, y: 270, label: 'Left driver' },
  { id: 'drv-r', part: 'driver', x: 555, y: 270, label: 'Right driver' },
  { id: 'bat', part: 'battery', x: 400, y: 412, label: 'Battery bay' },
  { id: 'buck', part: 'buck', x: 400, y: 305, label: 'Buck converter' },
  { id: 'ard', part: 'arduino', x: 400, y: 190, label: 'Arduino' },
  { id: 'bt', part: 'bluetooth', x: 400, y: 92, label: 'Bluetooth module' },
]

export const TERMINALS: Terminal[] = [
  { id: 'm-fl.pwr', slot: 'm-fl', x: 266, y: 130, label: 'motor leads' },
  { id: 'm-rl.pwr', slot: 'm-rl', x: 266, y: 410, label: 'motor leads' },
  { id: 'm-fr.pwr', slot: 'm-fr', x: 534, y: 130, label: 'motor leads' },
  { id: 'm-rr.pwr', slot: 'm-rr', x: 534, y: 410, label: 'motor leads' },
  { id: 'drv-l.out', slot: 'drv-l', x: 245, y: 216, label: 'M+ / M−' },
  { id: 'drv-r.out', slot: 'drv-r', x: 555, y: 216, label: 'M+ / M−' },
  { id: 'drv-l.bat', slot: 'drv-l', x: 245, y: 325, label: 'B+ / B−' },
  { id: 'drv-r.bat', slot: 'drv-r', x: 555, y: 325, label: 'B+ / B−' },
  { id: 'drv-l.pwm', slot: 'drv-l', x: 300, y: 262, label: 'RPWM / LPWM' },
  { id: 'drv-r.pwm', slot: 'drv-r', x: 500, y: 262, label: 'RPWM / LPWM' },
  { id: 'bat.out', slot: 'bat', x: 400, y: 362, label: '11.1 V' },
  { id: 'buck.in', slot: 'buck', x: 432, y: 330, label: 'IN' },
  { id: 'buck.out', slot: 'buck', x: 368, y: 280, label: 'OUT 5 V' },
  { id: 'ard.5v', slot: 'ard', x: 370, y: 245, label: '5V' },
  { id: 'ard.d56', slot: 'ard', x: 325, y: 200, label: 'D5 / D6' },
  { id: 'ard.d910', slot: 'ard', x: 475, y: 200, label: 'D9 / D10' },
  { id: 'ard.serial', slot: 'ard', x: 430, y: 135, label: 'RX / TX' },
  { id: 'bt.serial', slot: 'bt', x: 430, y: 110, label: 'TX / RX' },
]

export type Step =
  | { kind: 'action'; id: 'charge' | 'upload' | 'power'; title: string; text: string; why?: string; button: string }
  | { kind: 'place'; title: string; text: string; why?: string; slots: string[] }
  | { kind: 'wire'; title: string; text: string; why?: string; wires: Wire[]; hint: string }

const RED = '#d9443a'
const YEL = '#f2c14e'
const BLU = '#3a86c8'

export const STEPS: Step[] = [
  {
    kind: 'action',
    id: 'charge',
    title: 'Charge the battery',
    text: 'Plug the 3S LiPo into the B3 charger. It fills all three cells evenly.',
    why: 'A LiPo with unbalanced cells loses power fast, or worse, swells.',
    button: 'Plug in the charger',
  },
  {
    kind: 'place',
    title: 'Mount the motors',
    text: 'Bolt a DC motor to each corner of the plywood chassis with its L-bracket. Shafts point outwards.',
    slots: ['m-fl', 'm-fr', 'm-rl', 'm-rr'],
  },
  {
    kind: 'place',
    title: 'Fit the wheels',
    text: 'Push a wheel onto each motor shaft.',
    why: 'Four driven wheels means more grip when two bots shove each other.',
    slots: ['w-fl', 'w-fr', 'w-rl', 'w-rr'],
  },
  {
    kind: 'place',
    title: 'Add the motor drivers',
    text: 'One BTS7960 per side. The Arduino cannot power motors directly; the drivers switch the battery’s current for it.',
    slots: ['drv-l', 'drv-r'],
  },
  {
    kind: 'wire',
    title: 'Wire the motors',
    text: 'Connect both left motors to the left driver’s output, and both right motors to the right one. Click a terminal, then the terminal it goes to.',
    why: 'This is tank steering: spin the sides at different speeds and the bot turns.',
    hint: 'Left motors go to the left driver, right motors to the right driver.',
    wires: [
      { a: 'm-fl.pwr', b: 'drv-l.out', color: RED },
      { a: 'm-rl.pwr', b: 'drv-l.out', color: RED },
      { a: 'm-fr.pwr', b: 'drv-r.out', color: RED },
      { a: 'm-rr.pwr', b: 'drv-r.out', color: RED },
    ],
  },
  {
    kind: 'place',
    title: 'Power: battery and buck converter',
    text: 'Seat the LiPo in the battery bay, and the LM2596 buck converter above it.',
    slots: ['bat', 'buck'],
  },
  {
    kind: 'wire',
    title: 'Wire the power',
    text: 'The battery feeds both drivers directly, and the buck converter.',
    why: 'Motors want the full 11.1 V. The electronics want a clean 5 V; the buck converter makes it.',
    hint: 'Power comes from the battery: battery → left driver, battery → right driver, battery → buck IN.',
    wires: [
      { a: 'bat.out', b: 'drv-l.bat', color: RED },
      { a: 'bat.out', b: 'drv-r.bat', color: RED },
      { a: 'bat.out', b: 'buck.in', color: RED },
    ],
  },
  {
    kind: 'place',
    title: 'The brain and the radio',
    text: 'Place the Arduino Uno in the middle and the HC-05 Bluetooth module at the front.',
    slots: ['ard', 'bt'],
  },
  {
    kind: 'wire',
    title: 'Wire the signals',
    text: 'Buck OUT to the Arduino’s 5V. Two PWM pins to each driver. The HC-05 to the Arduino’s serial pins.',
    why: 'PWM pins switch on and off very fast; the driver turns that into motor speed. TX on one side goes to RX on the other.',
    hint: 'Buck OUT → 5V · D5/D6 → left driver · D9/D10 → right driver · HC-05 → RX/TX.',
    wires: [
      { a: 'buck.out', b: 'ard.5v', color: RED },
      { a: 'ard.d56', b: 'drv-l.pwm', color: YEL },
      { a: 'ard.d910', b: 'drv-r.pwm', color: YEL },
      { a: 'bt.serial', b: 'ard.serial', color: BLU },
    ],
  },
  {
    kind: 'action',
    id: 'upload',
    title: 'Upload the sketch',
    text: 'The phone sends one letter over Bluetooth. The Arduino turns it into two wheel speeds.',
    button: 'Upload to the Uno',
  },
  {
    kind: 'action',
    id: 'power',
    title: 'Close the box and power on',
    text: 'Put the plywood lid on, plug in the battery, pair your phone.',
    button: 'Power on',
  },
]

export const SKETCH = `void loop() {
  if (Serial.available()) {
    char c = Serial.read();   // from the phone, over Bluetooth
    if (c == 'F') drive( 200,  200);   // forward
    if (c == 'B') drive(-200, -200);   // back
    if (c == 'L') drive(-150,  150);   // spin left
    if (c == 'R') drive( 150, -150);   // spin right
    if (c == 'S') drive(   0,    0);   // stop
  }
}`

export const wireKey = (a: string, b: string) => [a, b].sort().join('|')
