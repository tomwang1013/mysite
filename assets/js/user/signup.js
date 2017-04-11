var Vue = require('vue');
var Signup = require('./signup.vue');
var qs = require('qs');

function originStep() {
  if (window.location.search) {
    var params = qs.parse(window.location.search.slice(1));

    return params.step || 1;
  } else {
    return 1;
  }
}

new Vue({
  el: '#signup-view',
  render: function(h) {
    return h(Signup, {
      props: {
        originStep: originStep()
      }
    });
  }
});
