import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Recipes from './views/Recipes'
import Ingredients from "./views/Ingredients";
import Categories from "./views/Categories";
import CreateRecipe from "./components/CreateRecipe";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import AuthGuard from "./auth-guard";

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path:'/',
      component: Home,
      name: 'Home'
    },
    {
      path:'/recipes',
      component:  Recipes,
      name: 'Recipes',
      beforeEnter: AuthGuard
    },
    {
      path:'/ingredients',
      component:  Ingredients,
      name: 'Ingredients',
    },
    {
      path:'/categories',
      component:  Categories,
      name: 'Categories',
    },
    {
      path:'/createrecipe',
      component:  CreateRecipe,
      name: 'CreateRecipe',
      // beforeEnter: AuthGuard
    },
    {
      path:'/signin',
      component: SignIn,
      name: 'SignIn'
    },
    {
      path:'/signup',
      component:  SignUp,
      name: 'SignUp'
    },
    {
      path: "*",
      redirect: {
        name: 'Home'
      }
    }
  ]
})
