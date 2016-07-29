var $ = require('jquery');

$(document).ready(function() {
  $('form.signup1').validate({
    submitHandler: function(form) {
      var me = this;

      $.post(form.action, $(form).serializeObject(), function(data) {
        if (data.error) {
          if (data.errors) me.showErrors(data.errors);
          else alert(data.message);
        } else {
          location = data.location;
        }
      });
    },

    rules: {
      email: {
        required: true,
        email:    true
      },
      password: {
        required: true,
        pattern:  /([\d]+\S*[a-zA-Z]+\S*)|([a-zA-Z]+\S*\d+\S*)/
      },
      name: 'required'
    },

    messages: {
      email:  {
        required: '请输入邮箱地址',
        email:    '邮箱格式不对'
      },
      password: {
        required: '请输入密码',
        pattern:  '密码格式不对'
      },
      name: '请输入用户名'
    }
  });
});
