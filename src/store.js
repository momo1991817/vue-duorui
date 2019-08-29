import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    deleteCollection: {
      id: '',
      index: '',
      flag: false
    },
  },
  mutations: {
    deleteCollection(state, obj) {
      this.state.deleteCollection.id = obj.id;
      this.state.deleteCollection.index = obj.index;
      this.state.deleteCollection.flag = obj.flag;
    },
  },
  actions: {

  }
})
