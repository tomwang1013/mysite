var $ = require('jquery');

$(document).ready(function() {
  $('#university').popupTabs(window.us);
  $('#major').popupTabs(window.ms);

  var validator = $('form.signup').validate({
    submitHandler: function(form) {
      $.post(form.action, $(form).serializeObject(), function(data) {
        if (data.error) {
          validator.showErrors(data.errors);
        } else {
          location = data.location;
        }
      });

      return false;
    },

    errorPlacement: function(error, element) {
      error.insertBefore(element);
    },

    rules: {
    }
  });
});
