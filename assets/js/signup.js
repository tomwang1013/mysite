var $ = require('jquery');

$(document).ready(function() {
  $('form.signup').validate({
    submitHandler: function(form) {
      $.post(form.action, $(form).serializeObject(), function(data) {
        if (data.error) {
          alert(error.message);
        } else {
          location = data.location;
        }
      });
    },

    rules:  {
      email:      {
        required: true,
        email:    true
      },
      password:   {
        required: true,
        pattern:  /([\d]+\S*[a-zA-Z]+\S*)|([a-zA-Z]+\S*\d+\S*)/
      },
      name:       'required',
      university: 'required',
      major:      'required',
      entryDate:  'required',
      url:        {
        required: true,
        url:      true
      },
      desc:       'required'
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
      name: '请输入用户名',
      university: '请选择就读院校',
      major:      '请选择就读专业',
      entryDate:  '请输入入学年月',
      url:        {
        required: '请输入公司网址',
        url:      'url格式不对'
      },
      desc:       '请输入公司介绍'
    }
  });

  $(':radio[name=user_type]').change(function() {
    $('fieldset.student, fieldset.company').toggle();
  });
});
