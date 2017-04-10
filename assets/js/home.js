var y = require('common/global');
var Cookies = require('js-cookie');
var Vue = require('vue');
var FV  = require('vue-form-validator');

var z = require('home.scss');

var userInfo = Cookies.getJSON('_ppinfo');

if (userInfo) {
  if (userInfo.type == 0) {
    location = '/jobs';
  } else {
    location = '/profile/jobs';
  }
}

var validator = new Vue({
  el: '.c-home-welcome',

  data: {
    rules: {
      name: {
        required: true,
        remote: '/signup/is_valid_name'
      },

      email: {
        required: true,
        remote: '/signup/is_valid_email'
      },

      password: {
        required: true
      }
    },

    messages: {
      name: {
        required: '用户名不能为空'
      },

      email: {
        required: 'email不能为空',
      },

      password: {
        required: '密码不能为空'
      }
    },

    errorPlacement: 'after_field'
  },

  components: {
    'form-validator': FV
  }
});
