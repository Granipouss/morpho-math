import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import config from 'src/config'
import * as Morpho from 'lib/morpho'
import { code, makeArray } from 'lib/utils'
import { reduceData, makeMatrix, onUpdate } from 'lib/morpho-utils'

const set = Vue.set

// = BASE ==========
const getSnapById = (state, id) => id < 0 ? state.original : state.snapshots[id]
const images = {
  state: {
    mode: -1,
    width: 0,
    height: 0,
    original: [],
    snapshots: [],
    selected: [0, -1]
  },
  mutations: {
    loadData (state, { colors, alpha, imageData }) {
      state.width = imageData.width
      state.height = imageData.height
      let data = imageData.data
      state.mode = (colors ? 2 : 0) + (alpha ? 1 : 0)
      data = reduceData(data, state.mode)
      state.original = data
      state.snapshots = [Morpho.clone(data)]
    },
    makeSnapshot (state, id) {
      state.snapshots.push(Morpho.clone(getSnapById(state, id)))
    },
    deleteSnapshot ({ snapshots }, id) {
      snapshots.splice(id, 1)
    },
    select ({ selected }, { id, secondary }) {
      if (id < 0) secondary = true
      set(selected, secondary ? 1 : 0, id)
    },
    action (state, { type }) {
      let A = getSnapById(state, state.selected[0])
      let B = getSnapById(state, state.selected[1])
      if (!A || !B) return
      set(state.snapshots, state.selected[0], Morpho[type](A, B))
    },
    setData ({ snapshots }, { i, value }) {
      set(snapshots, i, value)
    }
  },
  actions: {
    importImageUrl ({ commit }, { colors, alpha, url }) {
      let img = document.createElement('img')
      img.onload = () => {
        let canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        canvas.getContext('2d').drawImage(img, 0, 0)
        let imageData = canvas.getContext('2d').getImageData(0, 0, img.width, img.height)
        commit('loadData', { colors, alpha, imageData })
      }
      img.setAttribute('src', url)
    }
  },
  getters: {
    initialized: state => state.mode >= 0
  }
}

// = PARAMS ==========
const parameters = {
  state: {
    structElement: makeMatrix(config.matrixLength, (x, y) => (x * x) + (y * y) < 2 ? 1 : 0),
    threshold: 128,
    connexity: 4,
    wrapMode: 0,
    scriptVars: makeArray(config.script.nbVars + 1, i => 0)
  },
  mutations: {
    changeStructElement ({ structElement }, { x, y, value }) { structElement[code(x, y)] = value | 0 },
    changeScriptVars (state, { n, value }) { state.scriptVars[n] = value | 0 },
    setParam (state, { name, value }) { set(state, name, value | 0) }
  }
}

const store = new Vuex.Store({
  modules: { images, parameters },
  getters: {
    scriptEnv: state => {
      return {
        img: [state.images.original, ...state.images.snapshots],
        index: state.images.selected.map(i => i + 1),
        structElement: state.parameters.structElement,
        connexity: state.parameters.connexity,
        wrapMode: state.parameters.wrapMode,
        param: state.parameters.scriptVars,
        height: state.images.height,
        width: state.images.width
      }
    }
  }
})

store.watch(state => onUpdate(state))

export default store
