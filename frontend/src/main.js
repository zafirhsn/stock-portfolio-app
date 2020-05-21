import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import VueResource from 'vue-resource'
import VueRouter from 'vue-router';
import {store} from './store/store'

Vue.config.productionTip = false

Vue.use(VueResource);
Vue.use(VueRouter);


new Vue({
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
