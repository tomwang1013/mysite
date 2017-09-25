import Vue from 'vue'
import VueRouter from 'vue-router'
let Cookies = require('js-cookie');
require('common/global');

Vue.use(VueRouter);

let routes = [
  { path: '/profile',           component: require('profile/user_info.vue') },
  { path: '/profile/user_info', component: require('profile/user_info.vue') },
  { path: '/profile/jobs',      component: require('profile/jobs.vue') },
  { path: '/profile/message',   component: require('profile/message.vue') },
  { path: '/profile/account',   component: require('profile/account.vue') },
];

new Vue({
  el: '#profile-mount',

  data: {
    userInfo: Cookies.getJSON('_ppinfo')
  },

  router: new VueRouter({
    mode: 'history',
    routes: routes,
  }),

  components: {
    'left-nav': require('profile/left_nav.vue'),
  }
});
