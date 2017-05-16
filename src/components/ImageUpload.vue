<template lang="html">
  <section class="hero is-success">
    <div class="container">
      <div class="columns">
        <div class="column is-6">
          <input type="file" id="file" hidden @change="onFile" />
          <label for="file" class="button is-success is-inverted is-outlined">
            <span class="icon">
              <i class="fa fa-upload"></i>
            </span>
            <span>&nbsp; Choose a file</span>
          </label>
        </div>

        <div class="column is-6">
          <div class="field has-addons is-pulled-right">
            <p class="control">
              <a class="button is-success is-inverted" :class="colors ? '' : 'is-outlined'" @click="colors = !colors">
                <span class="icon is-small">
                  <i v-if="colors" class="fa fa-check"></i>
                  <i v-else class="fa fa-times"></i>
                </span>
                <span>Colors</span>
              </a>
            </p>
            <p class="control">
              <a class="button is-success is-inverted" :class="alpha ? '' : 'is-outlined'" @click="alpha = !alpha">
                <span class="icon is-small">
                  <i v-if="alpha" class="fa fa-check"></i>
                  <i v-else class="fa fa-times"></i>
                </span>
                <span>Alpha</span>
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data () {
    return { colors: false, alpha: false }
  },
  methods: {
    onFile (e) {
      if (!e.target.files[0]) return
      /* global FileReader */
      let reader = new FileReader()
      reader.onloadend = () => this.$store.dispatch('importImageUrl', {
        url: reader.result,
        colors: this.colors,
        alpha: this.alpha
      })
      reader.readAsDataURL(e.target.files[0])
    }
  }
}
</script>

<style lang="scss">
.field.has-addons .button {
  margin: 0;
}
</style>
