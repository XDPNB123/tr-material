import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";
import vuetify from "./plugins/vuetify";
import VueClipboard from "vue-clipboard2";

Vue.use(VueClipboard);
Vue.config.productionTip = false;
Vue.prototype.$axios = axios;

// 设置统一的axios请求路径，path 是关键字，如果使用 path1、path2，会导致赋值失败，从而使用 axios 的默认请求地址，也就是本机的 ip + port
axios.defaults.baseURL = JSON.parse(sessionStorage.getItem("server_url")).path;

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
