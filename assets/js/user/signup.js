require('common/global');
import Vue from 'vue'
import Signup from './signup.vue'
let qs = require('qs');

function originStep() {
  if (window.location.search) {
    let params = qs.parse(window.location.search.slice(1));

    return params.step ? parseInt(params.step) : 1;
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
