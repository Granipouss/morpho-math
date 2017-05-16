<template lang="html">
  <canvas ref="canvas"></canvas>
</template>

<script>
// Adds ctx.getTransform() - returns an SVGMatrix
// Adds ctx.transformedPoint(x,y) - returns an SVGPoint
function trackTransforms (ctx) {
  let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  let xform = svg.createSVGMatrix()
  ctx.getTransform = () => xform

  let savedTransforms = []
  let save = ctx.save
  ctx.save = () => {
    savedTransforms.push(xform.translate(0, 0))
    return save.call(ctx)
  }

  let restore = ctx.restore
  ctx.restore = () => {
    xform = savedTransforms.pop()
    return restore.call(ctx)
  }

  let scale = ctx.scale
  ctx.scale = (sx, sy) => {
    xform = xform.scaleNonUniform(sx, sy)
    return scale.call(ctx, sx, sy)
  }

  let rotate = ctx.rotate
  ctx.rotate = (radians) => {
    xform = xform.rotate(radians * 180 / Math.PI)
    return rotate.call(ctx, radians)
  }

  let translate = ctx.translate
  ctx.translate = (dx, dy) => {
    xform = xform.translate(dx, dy)
    return translate.call(ctx, dx, dy)
  }

  let transform = ctx.transform
  ctx.transform = (a, b, c, d, e, f) => {
    let m2 = svg.createSVGMatrix()
    m2.a = a
    m2.b = b
    m2.c = c
    m2.d = d
    m2.e = e
    m2.f = f
    xform = xform.multiply(m2)
    return transform.call(ctx, a, b, c, d, e, f)
  }

  let setTransform = ctx.setTransform
  ctx.setTransform = (a, b, c, d, e, f) => {
    xform.a = a
    xform.b = b
    xform.c = c
    xform.d = d
    xform.e = e
    xform.f = f
    return setTransform.call(ctx, a, b, c, d, e, f)
  }

  let pt = svg.createSVGPoint()
  ctx.transformedPoint = (x, y) => {
    pt.x = x
    pt.y = y
    return pt.matrixTransform(xform.inverse())
  }
}

export default {
  props: ['render'],
  mounted () {
    trackTransforms(this.context)

    let scaleFactor = 1.1
    let zoom = (clicks) => {
      let pt = this.context.transformedPoint(lastX, lastY)
      this.context.translate(pt.x, pt.y)
      let factor = Math.pow(scaleFactor, clicks)
      this.context.scale(factor, factor)
      this.context.translate(-pt.x, -pt.y)
      this.refresh()
    }
    let handleScroll = (evt) => {
      var delta = evt.wheelDelta ? evt.wheelDelta / 40 : evt.detail ? -evt.detail : 0
      if (delta) zoom(delta)
      return evt.preventDefault() && false
    }

    let lastX = this.canvas.width / 2
    let lastY = this.canvas.height / 2
    let dragStart, dragged
    this.canvas.addEventListener('mousedown', (evt) => {
      document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none'
      lastX = evt.offsetX || (evt.pageX - this.canvas.offsetLeft)
      lastY = evt.offsetY || (evt.pageY - this.canvas.offsetTop)
      dragStart = this.context.transformedPoint(lastX, lastY)
      dragged = false
    }, false)
    this.canvas.addEventListener('mousemove', (evt) => {
      lastX = evt.offsetX || (evt.pageX - this.canvas.offsetLeft)
      lastY = evt.offsetY || (evt.pageY - this.canvas.offsetTop)
      dragged = true
      if (dragStart) {
        let pt = this.context.transformedPoint(lastX, lastY)
        this.context.translate(pt.x - dragStart.x, pt.y - dragStart.y)
        this.refresh()
      }
    }, false)
    this.canvas.addEventListener('mouseup', (evt) => {
      dragStart = null
      if (!dragged) zoom(evt.shiftKey ? -1 : 1)
    }, false)
    this.canvas.addEventListener('DOMMouseScroll', handleScroll, false)
    this.canvas.addEventListener('mousewheel', handleScroll, false)

    this.refresh()
  },
  computed: {
    canvas () { return this.$refs.canvas },
    context () { return this.canvas ? this.canvas.getContext('2d') : null }
  },
  methods: {
    refresh () {
      // Clear the entire canvas
      let p1 = this.context.transformedPoint(0, 0)
      let p2 = this.context.transformedPoint(this.canvas.width, this.canvas.height)
      this.context.clearRect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y)
      this.context.save()
      this.context.setTransform(1, 0, 0, 1, 0, 0)
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.context.restore()
      this.context.mozImageSmoothingEnabled = false
      this.context.webkitImageSmoothingEnabled = false
      this.context.msImageSmoothingEnabled = false
      this.context.imageSmoothingEnabled = false
      // Redraw
      this.render(this.canvas, this.context)
    }
  }
}
</script>

<style media="screen">
canvas, img {
  image-rendering: optimizeSpeed;
  image-rendering: -moz-crisp-edges;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: optimize-contrast;
  image-rendering: pixelated;
  -ms-interpolation-mode: nearest-neighbor;

  image-rendering: -moz-crisp-edges;
  image-rendering: -moz-crisp-edges;
  image-rendering: -o-crisp-edges;
  image-rendering: -webkit-optimize-contrast;
  -ms-interpolation-mode: nearest-neighbor;
}
</style>
