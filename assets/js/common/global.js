var Vue = require('vue');
var MainNav = require('common/main_nav.vue');

new Vue({
  el: '.c-header',
  components: {
    'main-nav': MainNav
  }
});
