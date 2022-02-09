import Vue from "vue";
import Vuex from "vuex";
import auth from "./modules/auth";
import services from "./modules/services";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    auth,
    services,
  },
  plugins: [createPersistedState()],
});
