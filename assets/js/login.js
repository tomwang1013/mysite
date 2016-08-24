var $ = require('jquery');

$(document).ready(function() {
  var validator = $('form.login').validate({
    submitHandler: function(form) {
      var me = this;

      $.post(form.action, $(form).serializeObject(), function(data) {
        if (data.error) {
          validator.showErrors(data.errors);
        } else {
          location = data.location;
        }
      });

      return false;
    }
  });
});
