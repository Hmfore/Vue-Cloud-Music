import Vue from "vue";
import VueRouter from "vue-router";
import routes from "./routes";
import store from "../store/index";
Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});
router.beforeEach((to, from, next) => {
  console.log(to, from);
  if (to.meta.check === true) {
    if (store.state.isLogin === true) next();
    else {
      Vue.prototype.$message.error("需要登录");
      next("/login");
    }
  } else {
    next();
  }
});
router.afterEach((to) => {
  if (to.meta.title) {
    document.title = to.meta.title;
  } else {
    document.title = "NetEasyMusic";
  }
});

export default router;
