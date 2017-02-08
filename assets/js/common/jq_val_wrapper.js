var $ = require('jquery');
var x = require('common/serialize_object');
var y = require('jquery-validation');

$(function() {
  // for validation on submit
  $('.js-rich-editor').each(function(idx, ele) {
    UE.getEditor(ele.id).addListener('contentChange', function() {
      this.sync();
    });
  });
});

$.validator.setDefaults({
  errorClass: 'u-input-error',
  ignore: '.ignore',
  errorPlacement: function(error, element) {
    error.insertBefore(element);
  },
  submitHandler: function(form) {
    var validator = this;
    var args = $(form).serializeObject();

    // check ckeditor textarea of this form
    $(form).find('.js-rich-editor').each(function(i, ele) {
      args[ele.name] = UE.getEditor[ele.id].getContent();
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
