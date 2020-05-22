import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const store = new Vuex.Store({
  token: '',
  state: {
    name: '',
    email: '',
    cash: '',
    transactions: {},
    portfolio: {}
  },
  symbols: []

})