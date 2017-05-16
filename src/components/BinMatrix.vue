<template lang="html">
  <div class="">
    <div class="square">
      <div class="matrix">
        <div v-for="y in values" class="line">
          <div v-for="x in values" @click="onClick(x, y, $event)" :class="'tile y' + y + ' x' + x + ' value' + matrix[code(x, y)]"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { code, makeArray } from 'lib/utils'
import config from '../config'

export default {
  data () {
    return { len: config.matrixLength }
  },
  methods: {
    code,
    onClick (x, y, e) {
      let value = (this.matrix[code(x, y)] + (e.shiftKey ? 2 : 1)) % (e.shiftKey ? 3 : 2)
      this.$store.commit('changeStructElement', { x, y, value })
      // if (e.shiftKey) {
      //   this.$set(this.matrix, code(x, y), (this.matrix[code(x, y)] + 2) % 3)
      // } else {
      //   this.$set(this.matrix, code(x, y), (this.matrix[code(x, y)] + 1) % 2)
      // }
    }
  },
  computed: {
    values () { return makeArray(2 * this.len + 1, i => i - this.len) },
    matrix () { return this.$store.state.parameters.structElement }
  }
}
</script>

<style lang="scss">
@import "~bulma/sass/utilities/_all";

.square {
  padding-top: 100%;
  display: block;
  position: relative;

  & > div {
    position: absolute;
    bottom: 0;
    top: 0;
    left: 0;
    right: 0;
    height: 100%;
    width: 100%;
  }
}

.matrix {
  display: flex;
  flex-direction: column;

  .line {
    display: flex;
    flex-grow: 1;

    .tile {
      margin: 1px 1px 0 0;
      background: $white-bis;

      &.x0, &.y0 { background: $white-ter; }
      &.x0.y0 { background: $grey-lighter; }

      &.value1 { background: $blue !important; }
      &.value2 { background: $yellow !important; }
    }
  }
}
</style>
