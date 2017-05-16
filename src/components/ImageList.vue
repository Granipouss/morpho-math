<template lang="html">
  <div class="columns is-multiline">
    <div class="column is-one-quarter">
      <image-view :num="-1" :snapshot="images.original"></image-view>
    </div>

    <div class="column is-one-quarter" v-for="(snap, n) of images.snapshots">
      <image-view :num="n" :snapshot="snap"></image-view>
    </div>
  </div>
</template>

<script>
import ImageView from 'components/ImageView.vue'

export default {
  components: { ImageView },
  computed: {
    images () { return this.$store.state.images }
  }
}
</script>

<style lang="css">
</style>
