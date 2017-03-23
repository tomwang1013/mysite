var Vue = require('vue');
var Signup = require('./signup.vue');

new Vue({
  el: '#signup-view',
  render: function(h) {
    return h(Signup);
  }
});
