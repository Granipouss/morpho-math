import { Id, Id2, makeArray, unite, max, min } from 'lib/utils'
import {
  indexOf,
  getParam,
  perChannel,
  perPixel,
  loopOnPixel,
  listMatCoords,
  listImgCoords,
  distanceMap,
  getNeighbours
} from 'lib/morpho-utils'

// Binary Operators
export const nul = (A) => A.map(a => 0)
export const one = (A) => A.map(a => 255)
export const inv = (A) => A.map(a => 255 - a)
export const cln = (A) => A.map(Id)
export const add = unite((a, b) => a + b)
export const sub = unite((a, b) => a - b)
export const sup = unite((a, b) => max(a, b))
export const inf = unite((a, b) => min(a, b))
export const xor = unite((a, b) => a - b ? 0 : 255)
export const dif = unite((a, b) => 128 + (a - b) / 2)

// Copy Tools
export const clone = (A) => cln(A)
export const copy = (_, B) => cln(B)

// Simple
export const mask = (A, B) => perChannel(A, B, Id, Id2)
export const inverse = (A) => perChannel(A, A, inv, Id)
export const flatten = (A) => perChannel(A, A, Id, one)
export const diff = (A, B) => perChannel(A, B, dif, inf)

// Color change
export const rgb2gray = (A) => perPixel(A, A, ([r, g, b, a]) => [...makeArray(3, () => (r + g + b) / 3), a])
export const r2gray = (A) => perPixel(A, A, ([r, g, b, a]) => [r, r, r, a])
export const g2gray = (A) => perPixel(A, A, ([r, g, b, a]) => [g, g, g, a])
export const b2gray = (A) => perPixel(A, A, ([r, g, b, a]) => [b, b, b, a])
export const a2gray = (A) => perPixel(A, A, ([r, g, b, a]) => [a, a, a, 255])
export const gray2a = (A) => perPixel(A, A, ([r, g, b, a]) => [255, 255, 255, (r + g + b) / 3])

export const threshold = (A) => perPixel(A, A, ([r, g, b, a]) => (r + g + b) / 3 > getParam('threshold') ? [255, 255, 255, a] : [0, 0, 0, a])

// export const print = (A) => { console.log(pixelize(A)); return A }

// Mathematical morphology
export const morpho = (A, structElement, f, dVal) => {
  return loopOnPixel(A, (x, y, i) => {
    let vals = []
    for (let [u, v] of listMatCoords()) {
      if (structElement.get(u, v) === 1) vals.push(A.get(x + u, y + v))
      if (structElement.get(u, v) === 2) vals.push(255 - A.get(x + u, y + v))
    }
    return f(vals)
  })
}
export const dilation = (A) => perChannel(A, A, A => morpho(A, getParam('structElement'), max, 0), Id)
export const erosion = (A) => perChannel(A, A, A => morpho(A, getParam('structElement'), min, 255), Id)

export const open = (A) => dilation(erosion(A))
export const close = (A) => erosion(dilation(A))

export const distance = (A) => perChannel(flatten(threshold(A)), A, A => {
  let M = distanceMap(A)
  let m = max(...M)
  return new Uint8ClampedArray(M.map(a => 255 * a / m))
}, Id)

export const reconstruct = (A, B) => perChannel(A, B, (A, B) => {
  let C = flatten(threshold(B))
  let route = listImgCoords()
  let q = []
  let iter = 1e8
  for (let p of route) if (C[p[2]]) q.push(p[2])
  while (q.length && iter--) {
    let i = q.shift()
    let [x, y] = route[i]
    if (A.get(x, y)) C[i] = 255
    for (let [sx, sy] of getNeighbours(x, y)) {
      if (A.get(sx, sy) && !C[indexOf(sx, sy)]) q.push(indexOf(sx, sy))
    }
  }
  return inf(C, A)
}, Id)
