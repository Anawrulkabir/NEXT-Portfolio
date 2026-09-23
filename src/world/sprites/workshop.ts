/** Workshop props — original pixel sprites (§05.2 Zone 1, §13.2). */
import { sprite } from '../pixel'

const bot = {
  o: '#2b2d29',
  r: '#c9663a',
  R: '#e08a5a',
  m: '#8a9199',
  M: '#b7bec4',
  w: '#1b1d1a',
  W: '#6a6e68',
  y: '#e0a23c',
  c: '#6fb7b9',
}

const botBody = [
  '........c...........',
  '........o...........',
  '...ooooooooooo......',
  '..orrrrrrrrrrro.oo..',
  '..orRRRRRRRRRro.oMo.',
  '..orrryrrrrrrroooMo.',
  '..orrrrrrrrrrro.oMo.',
  '..ommmmmmmmmmmo.oMo.',
  '..ooooooooooooo.oo..',
  '...owwwo...owwwo....',
]

/** Remote-controlled soccer bot, facing right, pusher plate at the front. */
export const soccerBotSprite = sprite(
  bot,
  [
    ...botBody,
    '..owWWWwo.owWWWwo...',
    '..owWWWwo.owWWWwo...',
    '...owwwo...owwwo....',
    '....ooo.....ooo.....',
  ],
  [
    ...botBody,
    '..owWwWwo.owWwWwo...',
    '..owwWwwo.owwWwwo...',
    '...owwwo...owwwo....',
    '....ooo.....ooo.....',
  ]
)

/** Workbench with a motor, a battery and a controller board. */
export const workbenchSprite = sprite(
  {
    o: '#2b2418',
    t: '#8a6a45',
    T: '#a8845a',
    d: '#6b5238',
    g: '#8a9199',
    G: '#b7bec4',
    k: '#2f3330',
    y: '#e0a23c',
    p: '#3f6b45',
    c: '#6fb7b9',
    r: '#b5523a',
  },
  [
    '........................................',
    '........................................',
    '........................................',
    '....oggggo..............................',
    '...oGGGGGGo.....okkkko..................',
    '...ogggggggo....okykko.....oyo.oco......',
    '...oddddddo.....okkkkorrrrropppppppppo..',
    '....oooooo......oooooo.....ooooooooooo..',
    'oTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTo',
    'otttttttttttttttttttttttttttttttttttttto',
    'oddddddddddddddddddddddddddddddddddddddo',
    '..otdo............................otdo..',
    '..otdo............................otdo..',
    '..otdo............................otdo..',
    '..otdo............................otdo..',
    '..otdo............................otdo..',
    '..oTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTo..',
    '..otdo............................otdo..',
    '..otdo............................otdo..',
    '..otdo............................otdo..',
    '..otdo............................otdo..',
    '..oooo............................oooo..',
  ]
)

/** Signpost with a green pennant (no university logo — §05.2). */
export const signpostSprite = sprite(
  { o: '#2b2418', t: '#8a6a45', T: '#a8845a', d: '#6b5238', F: '#6a9a5a', f: '#4f7a4a' },
  [
    '.......oo.......',
    '.......otFFFFF..',
    '.......otFFFf...',
    '.......otFf.....',
    '.......ot.......',
    '.......ot.......',
    '..oooooooooooo..',
    '..oTTTTTTTTTTo..',
    '..otttttttttto..',
    '..otddddddddto..',
    '..otttttttttto..',
    '..otddddddddto..',
    '..otttttttttto..',
    '..oooooooooooo..',
    '.......ot.......',
    '.......ot.......',
    '.......ot.......',
    '.......ot.......',
    '.......ot.......',
    '.......ot.......',
    '.......ot.......',
    '.......ot.......',
    '.......ot.......',
    '.......ot.......',
    '.......ot.......',
    '.......ot.......',
    '.......ot.......',
    '.......ot.......',
    '......oddo......',
    '.....oddddo.....',
  ]
)
