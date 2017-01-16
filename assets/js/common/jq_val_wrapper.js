var $ = require('jquery');
var x = require('common/serialize_object');
var y = require('jquery-validation');

$(function() {
  // for validation on submit
  $('.rich-editor').each(function(idx, ele) {
    CKEDITOR.replace(ele.id).on('change', function(evt) {
      evt.editor.updateElement();
    });
  });
});

$.validator.setDefaults({
  errorClass: 'input-error',
  ignore: '.ignore',
  errorPlacement: function(error, element) {
    error.insertBefore(element);
  },
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
    }, 'json');
  }
});
