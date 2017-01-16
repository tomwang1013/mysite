var $ = require('jquery');
var x = require('common/jq_val_wrapper');
var y = require('common/main_nav');

$(function() {
  $('.index-signup').validate({
    rules: {
      name: {
        remote: '/signup/is_valid_name'
      },

      email: {
        remote: '/signup/is_valid_email'
      },
    }
  });
});
