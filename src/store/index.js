import Vue from 'vue'
export default {
  state: {
    appName: 'vue-lab',
  },
  getters: {
    appName: state => state.appName,
  },
  mutations: {
    SET_APP_NAME(state, name) {
      state.appName = name;
    },
  },
  actions: {
    setAppName({
      commit
    }, name) {
      commit('SET_APP_NAME', name)
    }
  }
}