<template lang="html">
  <div class="card" :class="cardStyle">
    <div class="card-image" @click="select">
      <figure class="image is-square">
        <canvas-plus ref="canvas" :render="render" height="320" width="320"></canvas-plus>
      </figure>
    </div>
    <!-- <div class="card-content" @click="select">
      <div class="content">
        <div v-if="snapshot.id < 0" class="has-text-centered">
          Original
        </div>
        <div v-else class="has-text-centered">
          Snapshot {{ snapshot.id }}
        </div>
      </div>
    </div> -->
    <footer class="card-footer">
      <a @click="makeSnapshot" class="card-footer-item">Duplicate</a>
      <a @click="select" class="card-footer-item">Select</a>
      <a v-if="num >= 0" @click="deleteSnapshot" class="card-footer-item">Delete</a>
    </footer>
  </div>
</template>

<script>
import CanvasPlus from './CanvasPlus.vue'
import { fullData } from 'lib/morpho-utils'

export default {
  props: ['snapshot', 'num'],
  components: { CanvasPlus },
  data () {
    return { img: document.createElement('img') }
  },
  mounted () { this.refresh() },
  computed: {
    canvas () { return this.$refs.canvas },
    cardStyle () {
      let style = []
      if (this.$store.state.images.selected[0] === this.num) style.push('select-1')
      if (this.$store.state.images.selected[1] === this.num) style.push('select-2')
      return style
    }
  },
  watch: {
    snapshot () { this.refresh() }
  },
  methods: {
    render (canvas, context) {
      context.drawImage(this.img, (canvas.width - this.img.width) / 2, (canvas.height - this.img.height) / 2)
    },
    refresh () {
      let canvas = document.createElement('canvas')
      let { width, height } = this.$store.state.images
      canvas.width = width
      canvas.height = height
      let idata = canvas.getContext('2d').createImageData(width, height)
      idata.data.set(fullData(this.snapshot))
      canvas.getContext('2d').putImageData(idata, 0, 0)
      this.img.src = canvas.toDataURL('image/png')
      this.img.onload = () => this.canvas.refresh()
    },
    makeSnapshot () { this.$store.commit('makeSnapshot', this.num) },
    deleteSnapshot () { this.$store.commit('deleteSnapshot', this.num) },
    select (e) { this.$store.commit('select', { id: this.num, secondary: e.shiftKey }) }
  }
}
</script>

<style lang="scss">
@import "~bulma/sass/utilities/_all";

.image.is-square canvas {
  position: absolute;
  bottom: 0; top: 0;
  left: 0; right: 0;
  height: 100%;
  width: 100%;

  $patternSize: 20px;
  $patternColor1: white;
  $patternColor2: transparentize(#333, 0.8);
  background-color: $patternColor1;
  background-image:
    linear-gradient(45deg, $patternColor2 25%, transparent 25%, transparent 75%, $patternColor2 75%, $patternColor2),
    linear-gradient(45deg, $patternColor2 25%, transparent 25%, transparent 75%, $patternColor2 75%, $patternColor2);
  background-size: $patternSize $patternSize;
  background-position: 0 0, $patternSize / 2 $patternSize / 2;
}

.card-content {
  box-shadow: 0 2px 4px -2px #999 inset;
}

.select-2 {
  box-shadow: 0 0 5px 1px $primary;
}

.select-1 {
  border: 1px solid $primary;

  .card-footer {
    background: transparentize($primary, 0.75);
  }

  .card-content {
    background: transparentize($primary, 0.75);
    font-weight: bold;
  }
}
</style>
