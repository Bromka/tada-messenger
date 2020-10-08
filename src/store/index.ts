import Vue from 'vue'
import Vuex from 'vuex'
import server from './server'
import Room from "@/models/Room";

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    server
  },
  actions:{
  },
  mutations: {
    setName(state, val){
      console.log(val)
      state.name = val;
    }
  },
  state: {
    name: "John Doe"
  },
  getters: {
    name(state){
      return state.name
    }

  }
})
