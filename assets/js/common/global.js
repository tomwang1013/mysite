var Vue = require('vue');
var MainNav = require('./main_nav.vue');

new Vue({
  el: '.c-header',
  components: {
    'main-nav': MainNav
  }
});
