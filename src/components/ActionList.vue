<template lang="html">
  <section class="hero is-primary">
    <div class="container">
      <p class="field has-text-centered">
        <a v-for="action in list" class="button is-primary" @click.prevent="doAction(action.type)">
          <span v-if="action.icon" class="icon">
            <i :class="'fa fa-' + action.icon"></i>
          </span>
          <span v-if="action.label">{{ action.label }}</span>
        </a>
      </p>
    </div>
  </section>
</template>

<script>
import config from 'src/config'

export default {
  data () {
    return { list: config.actionList }
  },
  methods: {
    doAction (type) { this.$store.commit('action', { type }) }
  }
}
</script>

<style lang="css">
.button {
  margin: 0 2px;
}
</style>
