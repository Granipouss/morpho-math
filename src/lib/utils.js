export const findByID = (list, id) => list.find(a => a.id === id)
export const findByName = (list, name) => list.find(a => a.name === name)

// Identity
export const Id = a => a
export const Idn = (n) => () => arguments[n]
export const Id2 = Idn(2)
export const Id3 = Idn(3)

export const makeArray = (n, f = Id) => Array.apply(null, Array(n.length ? n.length : n)).map((_, i) => f(i))
// export const makeIArray = (n, f = Id) => new Uint8ClampedArray(makeArray(n, f))
export const makeIArray = (n, f = Id) => {
  let arr = new Uint8ClampedArray(n)
  for (let i = 0; i < arr.length; i++) arr[i] = f(i)
  return arr
}

export const unite = (f) => (A, B) => A.map((_, i) => f(A[i], B[i]))

export const uniq = (arr) => arr.filter((item, pos) => arr.indexOf(item) === pos)

// Coords coding
export const code = (...args) => args.join('.')
export const decode = c => c.split('.').map(n => n | 0)

export const randInt = n => (n * Math.random()) | 0

export const max = (...args) => Array.isArray(args[0]) ? Math.max(...args[0]) : Math.max(...args)
export const min = (...args) => Array.isArray(args[0]) ? Math.min(...args[0]) : Math.min(...args)
export const clamp = (n, a, b) => max(a, min(n, b))

export const sum = (A) => A.reduce((s, v) => v + s, 0)
