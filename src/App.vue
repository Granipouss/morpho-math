<template>
  <main class="main">
    <div class="container">
      <div class="heading">
        <br>
        <h1 class="title">MorphoMath</h1>
        <h2 class="subtitle">
          A quick online introduction to Mathematical Morphology
        </h2>
      </div>
    </div>

    <image-upload></image-upload>

    <section class="hero is-light is-medium" v-if="$store.getters.initialized">
      <div class="container">
        <div class="columns">
          <div class="column is-10">
            <image-list v-if="$store.getters.initialized"></image-list>
          </div>

          <div class="column">
            <setting-box></setting-box>
          </div>
        </div>
      </div>
    </section>

    <action-list v-if="$store.getters.initialized"></action-list>
    <code-runner v-if="$store.getters.initialized"></code-runner>

    <footer class="footer">
      <div class="container">
        <div class="content has-text-centered">
          <p>
            <strong>MorphoMath</strong> by <a href="https://github.com/Granipouss">Granipouss</a>. The source code is licensed
            <a href="http://opensource.org/licenses/mit-license.php">MIT</a>.
          </p>
          <p>
            <a class="button is-light" href="https://github.com/Granipouss/morpho-math">
              <span class="icon">
                <i class="fa fa-github"></i>
              </span>
              <span>Github Repo</span>
            </a>
          </p>
        </div>
      </div>
    </footer>
  </main>
</template>

<script>
import ImageUpload from 'components/ImageUpload.vue'
import ImageList from 'components/ImageList.vue'
import SettingBox from 'components/SettingBox.vue'
import ActionList from 'components/ActionList.vue'
import CodeRunner from 'components/CodeRunner.vue'

export default {
  name: 'app',
  components: { ActionList, ImageList, ImageUpload, SettingBox, CodeRunner }
}
</script>

<style lang="scss">
@import "~bulma/sass/utilities/_all";

html { background: $white-ter; }
body { background: $white; }

.heading .title {
  font-variant: small-caps;
  text-transform: none;
}

.hero { padding: $size-4 0 }

.pull-right { justify-content: flex-end; }

.radio.is-small {
  font-size: 0.75rem;
  padding-top: 0.375em;

  input[type='radio'] { height: 0.65rem; }
}

input[type='range'] {
  $trackH: 4px;

  cursor: pointer;
  box-shadow: none;
  border: solid 0 transparent;
  height: $trackH;
  padding: 0;
  margin: (24px - $trackH) / 2 0px;
  background: linear-gradient(90deg, $black-ter, $white-ter);
}
</style>
