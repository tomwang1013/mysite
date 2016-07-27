var $ = require('jquery');

$(document).ready(function() {
  $('form.login').validate({
    submitHandler: function(form) {
      var me = this;

      $.post(form.action, $(form).serializeObject(), function(data) {
        if (data.error) {
          // TODO should display error message below the form
          alert(data.message);
        } else {
          location = data.location;
        }
      });
    },

    invalidHandler: function(event, validator) {
      var errors = validator.numberOfInvalids();
      if (errors) {
        var message = errors == 1
          ? 'You missed 1 field. It has been highlighted'
          : 'You missed ' + errors + ' fields. They have been highlighted';
        alert(message);
      } else {
        alert('valid');
      }
    },

    rules: {
      name:     { required: true },
      password: { required: true }
    },

    messages: {
      name:     { required: '请输入用户名或邮箱' },
      password: { required: '请输入密码' }
    },

    debug: true
  });
});
