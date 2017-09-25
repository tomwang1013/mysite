require('common/global');
let Cookies = require('js-cookie');
import Vue from 'vue'
import FV  from 'vue-form-validator'

require('home.scss');

let userInfo = Cookies.getJSON('_ppinfo');

if (userInfo) {
  if (userInfo.type === 0) {
    location = '/jobs';
  } else {
    location = '/profile/jobs';
  }
}

new Vue({
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
