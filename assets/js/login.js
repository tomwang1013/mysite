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

    rules: {
      name:     'required',
      password: 'required'
    },

    messages: {
      name:     { required: '请输入用户名或邮箱' },
      password: { required: '请输入密码' }
    },

    debug: true
  });
});
