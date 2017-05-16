<template lang="html">
  <section class="hero is-warning">
      <div class="container">
        <div class="columns">

          <div class="column">
            <h5 class="title is-5 is-warning has-text-centered is-bold">Guide</h5>
            <p class="is-warning is-small guide" v-html="config.guide"></p>
          </div>

          <div class="column">
            <h5 class="title is-5 is-warning has-text-centered is-bold">Scripts</h5>
            <div class="field">
              <p class="control">
                <textarea class="textarea is-small" v-model="script" rows="15"></textarea>
              </p>
            </div>
            <br>
            <div class="field field-centered is-grouped">
              <p class="control">
                <button @click.prevent="ExecScript" class="button is-warning is-inverted">Execute</button>
              </p>
              <p class="control">
                <button @click.prevent="clearScript" class="button is-warning is-link">Clear</button>
              </p>
            </div>
          </div>

          <div class="column">
            <h5 class="title is-5 is-warning has-text-centered is-bold">Parameters</h5>
            <div class="field is-horizontal" v-for="i in config.nbVars">
              <div class="field-label is-small">
                <label>Param&nbsp;{{ i }}</label>
              </div>
              <div class="field-body">
                <div class="field">
                  <div class="control">
                    <input class="input is-small" type="number" :value="vars[i]" @input="changeScriptVars(i, $event)">
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
  </section>
</template>

<script>
import config from 'src/config'
import * as Morpho from 'lib/morpho'
import VM from 'vm'

export default {
  data () {
    return { config: config.script, script: '' }
  },
  computed: {
    vars () { return this.$store.state.parameters.scriptVars }
  },
  methods: {
    changeScriptVars (n, e) { this.$store.commit('changeScriptVars', { n, value: e.target.value }) },
    clearScript () { this.script = '' },
    ExecScript () {
      const sandbox = VM.createContext(Object.assign({}, this.$store.getters.scriptEnv, Morpho))
      VM.runInContext(this.script, sandbox)
      // console.log(sandbox);
      for (let i = 1; i < sandbox.img.length; i++) {
        this.$store.commit('setData', { i: i - 1, value: sandbox.img[i] })
      }
    }
  }
}
</script>

<style lang="css">
.is-bold { font-weight: 500; }

.guide {
  font-size: 0.75rem;
  text-align: justify;
  text-justify: inter-word;
}

.textarea { height: auto; }

.field.is-grouped.field-centered { justify-content: center; }
</style>
