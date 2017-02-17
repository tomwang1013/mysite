var $ = require('jquery');
var x = require('common/jq_val_wrapper');
var y = require('common/main_nav');
var Cookies = require('js-cookie');

var z = require('home.scss');

$(function() {
  var userInfo = Cookies.getJSON('_ppinfo');

  if (userInfo) {
    if (userInfo.type == 0) {
      location = '/jobs';
    } else {
      location = '/profile/jobs';
    }
  }

  $('.js-home-signup-form').validate({
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

    errorPlacement: function(error, element) {
      error.insertAfter(element);
    }
  });
});
