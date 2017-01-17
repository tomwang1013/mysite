var $ = require('jquery');
var x = require('jquery-validation');

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
