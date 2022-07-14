import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import axios from "axios";
import VueAxios from "vue-axios";
import ElementUI from "element-ui";
import "./assets/iconfont/iconfont.css";
import "element-ui/lib/theme-chalk/index.css";

import "./filter";
import VueLazyload from "vue-lazyload";
Vue.config.productionTip = false;

Vue.use(ElementUI);
Vue.use(VueAxios, axios);

Vue.use(VueLazyload, {
  preLoad: 1.9,
  error: require("./assets/img/error.jpg"),
  loading: require("./assets/img/loading.gif"),
  attempt: 3,
});

new Vue({
  router,
  store,
  render: (h) => h(App),
  created() {
    this.$store.dispatch("getCusIP");
  },
}).$mount("#app");
