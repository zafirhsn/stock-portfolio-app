import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    token: '',
    user: {
      name: '',
      email: '',
      cash: '',
      transactions: [],
      portfolio: []
    },
    symbols: [],
    ohlc: {}
  }
})
