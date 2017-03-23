var Vue = require('vue');
var Cookies = require('js-cookie');
var z = require('common/global');

var pi = new Vue({
  el: '#profile-mount',

  data: {
    pageName: getPageName(),
    userInfo: Cookies.getJSON('_ppinfo')
  },

  components: {
    'left-nav': require('profile/left_nav.vue'),
    user_info:  require('profile/user_info.vue'),
    jobs:       require('profile/jobs.vue'),
    message:    require('profile/message.vue'),
    account:    require('profile/account.vue')
  },

  methods: {
  }
});

function getPageName() {
  if (window.location.pathname.length > 9) {
    return window.location.pathname.slice(9);
  } else {
    return 'user_info';
  }
}

window.addEventListener('popstate', function(evt) {
  pi.pageName = getPageName();
});
