/** Workshop ground tiles, 16×16 (§13.2). */
import type { Grid, Palette } from '../pixel'

export const groundPalette: Palette = {
  L: '#6a9a5a',
  G: '#4f7a4a',
  g: '#3e6339',
  D: '#6b5238',
  d: '#574230',
  b: '#7d6244',
}

export const grassTile: Grid = [
  '..L....L...L..L.',
  '.LG...LGL.LG.LGL',
  'LGGL.LGGGLGGLGGG',
  'GGGGLGGGGGGGGGGG',
  'GGgGGGGGgGGGGgGG',
  'GgGGgGGgGGgGGGgG',
  'gGgDgGgGgDgGgGgD',
  'DgDDDgDDbDDgDDDD',
  'DDbDDDDDDDDDbDDD',
  'DDDDDdDDDbDDDDDd',
  'DbDDDDDDDDDDDbDD',
  'DDDdDDbDDDDdDDDD',
  'DDDDDDDDDDbDDDDD',
  'DdDDbDDDDDDDDDdD',
  'DDDDDDDdDDDDbDDD',
  'DDbDDDDDDDDDDDDD',
]

export const dirtTile: Grid = [
  'DDDDDdDDDDDDbDDD',
  'DbDDDDDDDdDDDDDD',
  'DDDDDDbDDDDDDDdD',
  'DDdDDDDDDDbDDDDD',
  'DDDDDDDDdDDDDDDD',
  'DDDbDDDDDDDDDbDD',
  'dDDDDDdDDDDDDDDD',
  'DDDDDDDDDbDDDdDD',
  'DDbDDDDDDDDDDDDD',
  'DDDDDdDDDDDDbDDD',
  'DDDDDDDDDDdDDDDD',
  'DdDDbDDDDDDDDDDD',
  'DDDDDDDDbDDDDdDD',
  'DDDdDDDDDDDDDDDD',
  'DDDDDDbDDDDdDDDD',
  'dDDDDDDDDDDDDDbD',
]
