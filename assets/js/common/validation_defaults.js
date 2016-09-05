var $ = require('jquery');

$.validator.setDefaults({
  errorClass: 'input-error',
  validClass: 'input-valid',
  submitHandler: function(form) {
    var validator = this;

    $.post(form.action, $(form).serializeObject(), function(data) {
      if (data.error) {
        validator.showErrors(data.errors);
      } else {
        location = data.location;
      }
    });
  }
});
