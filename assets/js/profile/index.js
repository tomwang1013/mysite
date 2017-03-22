var Vue = require('vue');
var ProfileIndex = require('profile/index.vue');

new Vue({
  el: '#profile-mount',
  render: function(h) { return h(ProfileIndex); }
});
