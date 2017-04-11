var w   = require('common/global');
var Vue = require('vue');
var FV  = require('vue-form-validator');

var css = require('user/login.scss');

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
