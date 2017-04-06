var w = require('common/global');
var css = require('about.scss');

var $ = require('jquery');
var Vue = require('vue');
var FormValidator = require('vue-form-validator');

new Vue({
  el: '#mount-point',
  data: {
    rules: {
      name: {
        required: true
      }
    },

    messages: {
      name: {
        required: '用户名是必须的'
      }
    },

    submitHandler: function(form) {
      $[form.method](form.action, function(data) {
        console.log(data);
      });
    }
  },

  components: {
    'form-validator': FormValidator
  }
});
