var $ = require('jquery');

$.validator.setDefaults({
  errorClass: 'input-error',
  validClass: 'input-valid',
  submitHandler: function(form) {
    var validator = this;
    var args = $(form).serializeObject();

    // check ckeditor textarea of this form
    $(form).find('.rich-editor').each(function(i, ele) {
      args[ele.name] = CKEDITOR.instances[ele.name].getData();
    });

    $.post(form.action, args, function(data) {
      if (data.error) {
        validator.showErrors(data.errors);
      } else {
        location = data.location;
      }
    });
  }
});
