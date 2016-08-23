var $ = require('jquery');

$(function() {
  var validator = $('.index-signup > form').validate({
    submitHandler: function(form) {
      $.post($(form).attr('action'), $(form).serializeObject(), function(data) {
        if (!data.error) {
          location = data.location;
        } else {
          validator.showErrors(data.errors);
        }
      })
    },

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
