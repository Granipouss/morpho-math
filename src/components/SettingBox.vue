<template lang="html">
  <div class="box is-warning">
    <bin-matrix></bin-matrix>

    <hr>

    <h4 class="label has-text-centered">Threshold</h4>
    <div class="field is-horizontal">
      <div class="field-label">
        <label>{{ threshold }}</label>
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control">
            <input class="input" type="range" min="0" max="255" v-model="threshold">
          </div>
        </div>
      </div>
    </div>

    <hr>

    <h4 class="label has-text-centered">Settings</h4>
    <div class="field is-horizontal">
      <div class="field-label is-small">
        <label class="label">Connexity</label>
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control">
            <label class="radio is-small" v-for="c in [4, 8]">
              <input type="radio" name="member" v-model="connexity" :value="c"> {{ c }}
            </label>
          </div>
        </div>
      </div>
    </div>
    <div class="field is-horizontal">
      <div class="field-label is-small">
        <label class="label">Wrap&nbsp;Mode</label>
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control">
            <div class="select is-fullwidth is-small">
              <select v-model="wrapMode">
                <option :value="0">Repeat</option>
                <option :value="1">Null</option>
                <option :value="2">Geodesic</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BinMatrix from 'components/BinMatrix.vue'

function makeParam (name) {
  return {
    get () { return this.$store.state.parameters[name] },
    set (value) { this.$store.commit('setParam', { name, value }) }
  }
}
export default {
  components: { BinMatrix },
  computed: {
    connexity: makeParam('connexity'),
    threshold: makeParam('threshold'),
    wrapMode: makeParam('wrapMode')
  }
}
</script>

<style lang="css">
</style>
