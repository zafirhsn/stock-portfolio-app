import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import VueResource from 'vue-resource'
import VueRouter from 'vue-router';
import {store} from './store/store'
import {routes} from './routes';

Vue.config.productionTip = false

Vue.use(VueResource);
Vue.use(VueRouter);

const router = new  VueRouter({
  routes,
  mode: 'history'
})

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
