var Vue = require('vue');

var pi = new Vue({
  el: '#profile-mount',

  data: {
    pageName: this.getPageName(),
    userInfo: Cookies.getJSON('_ppinfo')
  },

  components: {
    user_info: require('profile/user_info.vue'),
    jobs:      require('profile/jobs.vue'),
    message:   require('profile/message.vue'),
    account:   require('profile/account.vue')
  },

  methods: {
    getPageName: function() {
      if (window.location.pathname.length > 9) {
        return window.location.pathname.slice(9);
      } else {
        return 'user_info';
      }
    }
  }
});

window.addEventListener('popstate', function(evt) {
  pi.pageName = pi.getPageName();
});
