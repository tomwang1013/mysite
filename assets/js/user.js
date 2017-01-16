var $ = require('jquery');
var x = require('common/jq_val_wrapper');
var y = require('common/popup_list');
var z = require('common/popup_tabs');
var w = require('common/main_nav');

$(document).ready(function() {
  $('#university').popupList({ remoteUrl: '/universities' });
  $('#major').popupTabs(window.ms);

  // 用户注册第一步
  $('form#signup-step1').validate({
    rules: {
      name: {
        remote: '/signup/is_valid_name'
      },

      email: {
        remote: '/signup/is_valid_email'
      },
    }
  });

  // 用户注册第二步
  $('form#signup-step2').validate();
  $('form.login').validate();
});
