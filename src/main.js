import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import Vuetify from 'vuetify'
import axios from 'axios'
import * as firebase from 'firebase'
import './registerServiceWorker'

Vue.use(Vuetify);

Vue.config.productionTip = false;

axios.defaults.baseURL = 'http://localhost:3000/api';
axios.defaults.headers.common['Accepts'] = 'application/json';

new Vue({
  router,
  store,
  render: h => h(App),
  created () {
    var firebaseConfig = {
      apiKey: "AIzaSyBAkZEKxgZ9tK0kb1Uq9PG6Bgr0Ws5mbo8",
      authDomain: "koch-pwa-db.firebaseapp.com",
      databaseURL: "https://koch-pwa-db.firebaseio.com",
      projectId: "koch-pwa-db",
      storageBucket: "koch-pwa-db.appspot.com",
      messagingSenderId: "160686824759",
      appId: "1:160686824759:web:996b53989ef2de0f"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    firebase.auth().onAuthStateChanged((user) => {
      if(user) {
        this.$store.dispatch('autoSignIn', user)
      }
    })
  }
}).$mount('#app');
