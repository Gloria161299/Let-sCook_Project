import Vue from "vue";
import App from "./App.vue";
import VueMaterial from "vue-material";
import VueRouter from "vue-router";

import "vue-material/dist/vue-material.min.css";
import "vue-material/dist/theme/default.css";

import DataService from "./dataservice";

import Login from "./pages/Login";
import FoodsList from "./pages/FoodsList";
import Detail from "./pages/Detail";
import Comments from "./pages/Comments";
import Saved from "./pages/Saved";
import Category from "./pages/Category";
import MealPlan from "./pages/MealPlan";

Vue.use(VueMaterial);
Vue.use(VueRouter);

Vue.config.productionTip = false;

const router = new VueRouter({
  mode: "history",
  routes: [
    { name: "Login", path: "/login", component: Login },
    { name: "FoodsList", path: "/foodslist", component: FoodsList },
    { name: "Detail", path: "/food/:id", component: Detail },
    { name: "Comments", path: "/mycomments", component: Comments },
    { name: "Saved", path: "/bookmarked", component: Saved },
    { name: "Category", path: "/category/:tag", component: Category },
    { name: "MealPlan", path: "/mealPlan", component: MealPlan },
    { name: "home", path: "/", redirect: "/foodslist" } //percorso base che ti riporta alla home, ovvero foodslist
  ]
});

router.beforeEach((to, from, next) => {
  //ci permette di capire se l'utente è nella pagina di login o meno,
  //nel caso in cui non fosse nella pagina di Login non gli è permesso navigare
  if (to.name !== "Login" && !DataService.isAuthenticated()) {
    //se l'utente sta navigando in qualsiasi pagina diversa dal login e non è autenticato allora
    next({ name: "Login" }); //dobbiamo andare al Login
  } else {
    next();
  }
});

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
