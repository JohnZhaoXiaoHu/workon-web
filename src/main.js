// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import ElementUI from 'element-ui';
import VueResource from 'vue-resource';
import './styles/reset.css';
import './styles/base.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'element-ui/lib/theme-default/index.css';
import 'sweetalert/dist/sweetalert.min.js';
import 'sweetalert/dist/sweetalert.css';

import App from './App';
import store from './store';
import router from './router';
import loginCheck from './loginCheck.js';

Vue.use(ElementUI);
Vue.use(VueResource);
Vue.config.productionTip = false;
Vue.config.performance = true;

// 定义Event Bus
var eventBus = new Vue({});
Object.defineProperty(Vue.prototype, '$eventBus', {
  get () {
    return this.$root.eventBus;
  }
});

new Vue({
  el: '#app',
  data: function(){
  	return {
  		eventBus: eventBus, // Event Bus
  	}
  },
  router,
  store,
  template: '<App/>',
  created () {
  	// 检查登录状态
  	loginCheck.checkState();
  },
  components: { App }
});

