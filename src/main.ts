import Vue from 'vue'
import App from './App.vue'
import store from './store'
import date from '@/filters/date'
import Vuelidate from 'vuelidate'

Vue.use(Vuelidate)
Vue.filter('date', date)

import 'materialize-css/dist/js/materialize.min'

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
