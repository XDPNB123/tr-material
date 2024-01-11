import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/login.vue"),
  },
  {
    path: "/changePassword",
    name: "ChangePassword",
    component: () => import("../views/change-password.vue"),
  },
  {
    path: "/index",
    name: "Index",
    component: () => import("../views/Index.vue"),
  },
  {
    path: "/approve",
    name: "Approve",
    component: () => import("../views/approve.vue"),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
