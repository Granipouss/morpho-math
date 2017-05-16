// import store from 'src/store'
import config from 'src/config'
import { inf, one } from 'lib/morpho'
import { makeArray, makeIArray, clamp, sum, code, min } from 'lib/utils'

// = Get Params =====

let W, H
let params

export const onUpdate = ({ images, parameters }) => {
  H = images.height
  W = images.width
  params = parameters
  params.colorMode = images.mode
}

export const getParam = (name) => params[name]

export const getColorMode = () => params['colorMode']
export const hasAlpha = () => getColorMode() % 2 === 1
export const hasColors = () => getColorMode() > 1
export const nbChannels = () => 1 + getColorMode()

export const getChannel = (A, n, d = 1 + params['colorMode']) => A.filter((_, i) => i % d === n)

// = Channels =====

export const polarizeFull = (A, n = 4) => makeArray(n, i => getChannel(A, i, n))
export const depolarizeFull = (C, n = 4) => makeIArray(n * C[0].length, i => C[i % n][(i / n) | 0])

export const polarize = (A) => polarizeFull(A, nbChannels())
export const depolarize = (C) => depolarizeFull(C, nbChannels())

export const perChannel = (A, B, f, g = inf) => {
  let cA = polarize(A)
  let cB = polarize(B)
  switch (getColorMode()) {
    case 0: return f(A, B)  // W
    case 1: return depolarize([f(cA[0], cB[0]), g(cA[1], cB[1])]) // WA
    case 2: return depolarize([f(cA[0], cB[0]), f(cA[1], cB[1]), f(cA[2], cB[2])]) // RGB
    case 3: return depolarize([f(cA[0], cB[0]), f(cA[1], cB[1]), f(cA[2], cB[2]), g(cA[3], cB[3])]) // RGBA
  }
}

export const reduceData = (D, mode) => {
  let [R, G, B, A] = polarizeFull(D)
  let W = makeIArray(A, i => (R[i] + G[i] + B[i]) / 3)
  switch (mode) {
    case 0: return W  // W
    case 1: return depolarizeFull([W, A], 2) // WA
    case 2: return depolarizeFull([R, G, B], 3) // RGB
    case 3: return D // RGBA
  }
}

export const getAllChannels = (D) => {
  let C = polarize(D)
  switch (getColorMode()) {
    case 0: return [C[0], C[0], C[0], one(C[0])] // W
    case 1: return [C[0], C[0], C[0], C[1]] // WA
    case 2: return [C[0], C[1], C[2], one(C[0])] // RGB
    case 3: return [C[0], C[1], C[2], C[3]] // RGBA
  }
}

export const fullData = (D) => depolarizeFull(getAllChannels(D))

// = Pixels =====

export const pixelize = (D) => {
  let [R, G, B, A] = getAllChannels(D)
  return makeArray(A.length, i => [R[i], G[i], B[i], A[i]])
}

export const depixelize = (P) => new Uint8ClampedArray([].concat(...P))

export const perPixel = (A, B, f) => {
  let pA = pixelize(A)
  let pB = pixelize(B)
  return reduceData(depixelize(makeArray(A.length, i => f(pA[i], pB[i], i))), getColorMode())
}

// = Matrices =====

export const makeMatrix = (len, f) => {
  let mat = {
    get (x, y) {
      if (x * x >= len * len) return 0
      if (y * y >= len * len) return 0
      return this[code(x, y)]
    }
  }
  let values = makeArray(2 * len + 1, i => i - len)
  for (let x of values) for (let y of values) mat[code(x, y)] = (x * x) + (y * y) < 2 ? 1 : 0
  return mat
}

export const listMatCoords = (l = -1) => {
  if (l < 0) l = config.matrixLength
  let l2 = 2 * l + 1
  return makeArray(l2 * l2, i => [(i % l2) - l, ((i / l2) | 0) - l, i])
}

// =====

export const listImgCoords = () => makeArray(W * H, i => [i % W, (i / W) | 0, i])

export const indexOf = (x, y, mode = -1) => {
  let c = (x, y) => x + y * W
  if (mode < 0) mode = params.wrapMode
  switch (mode) {
    case 0: // wrap
      x = (x + W) % W
      y = (y + H) % H
      return c(x, y)
    case 1: // null
      if (x < 0 || W <= x) return 0
      if (y < 0 || H <= y) return 0
      return c(x, y)
    case 2: // geodesic
      x = clamp(0, x, W - 1)
      y = clamp(0, y, H - 1)
      return c(x, y)
  }
}

Uint8ClampedArray.prototype.get = function (x, y) { return this[indexOf(x, y)] }

export const loopOnPixel = (A, f) => {
  let B = new Uint8ClampedArray(A)
  for (let [x, y, i] of listImgCoords()) B[i] = f(x, y, i, B)
  return B
}

export const convolve = (A, M, f = sum) => {
  return loopOnPixel(A, (x, y, i) => {
    let vals = []
    for (let [u, v] of listMatCoords()) {
      vals.push(A.get(x + u, y + v) * M.get(u, v))
    }
    return f(vals)
  })
}

export const getScanners = (x, y) => params.connexity === 8
  ? [[x - 1, y - 1], [x, y - 1], [x + 1, y - 1], [x - 1, y]]
  : [[x - 1, y], [x, y - 1]]
export const getBackScanners = (x, y) => params.connexity === 8
  ? [[x + 1, y + 1], [x, y + 1], [x - 1, y + 1], [x + 1, y]]
  : [[x + 1, y], [x, y + 1]]
export const getNeighbours = (x, y) => [].concat(getScanners(x, y), getBackScanners(x, y))

export const distanceMap = (A) => {
  let infinity = 1e8
  let B = makeArray(A, i => A[i] ? infinity : 0)
  let route = listImgCoords()
  for (let [x, y, i] of route) {
    if (B[i]) B[i] = min(...getScanners(x, y).map(([sx, sy]) => 1 + B[indexOf(sx, sy)]))
  }
  route.reverse()
  for (let [x, y, i] of route) {
    if (B[i]) B[i] = min(B[i], ...getBackScanners(x, y).map(([sx, sy]) => 1 + B[indexOf(sx, sy)]))
  }
  return B
}
