import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import store from "../store";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    redirect: { name: "Dashboard" },
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },

  {
    path: "/accounts",
    name: "Accounts",
    component: () => import("../views/Accounts.vue"),
    meta: {
      requiresAuth: true,
    },
  },

  {
    path: "/category",
    name: "Category",
    component: () => import("../views/Category.vue"),
    meta: {
      requiresAuth: true,
    },
  },

  {
    path: "/dashboard",
    name: "Dashboard",
    component: () => import("../views/Dashboard.vue"),
    meta: {
      requiresAuth: true,
    },
  },

  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue"),
  },

  {
    path: "/login-admin",
    name: "LoginAdmin",
    component: () => import("../views/LoginAdmin.vue"),
  },

  {
    path: "/logout",
    name: "Logout",
    component: () => import("../views/Logout.vue"),
  },

  {
    path: "/signup",
    name: "Signup",
    component: () => import("../views/Signup.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, _from, next) => {
  const loggedIn = store.getters["auth/isLoggedIn"];

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (loggedIn) {
      next();
    } else {
      next("/login");
    }
  } else {
    next();
  }
});

export default router;
