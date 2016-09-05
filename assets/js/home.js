var $ = require('jquery');

$(function() {
  var validator = $('.index-signup > form').validate({
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
