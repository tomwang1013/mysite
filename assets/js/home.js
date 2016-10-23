var $ = require('jquery');

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
