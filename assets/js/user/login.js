require('common/global');
require('user/login.scss');

import Vue from 'vue'
import FV  from 'vue-form-validator'

// 登陆
new Vue({
  el: '.c-login-box',

  data: {
    rules: {
      email: 'required',
      password: 'required'
    },

    messages: {
      email: 'email不能为空',
      password: '密码不能为空'
    }
  },

  components: {
    'form-validator': FV
  }
});
