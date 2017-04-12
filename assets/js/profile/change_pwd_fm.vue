<template lang='pug'>
  form-validator(method='post' action='/profile/change_password' class='c-uc-acc-chg' v-bind='$data')
    .o-fm-grp
      label(for='old_pwd') 旧密码：
      input(type='password', name='old_pwd', id='old_pwd', class='o-fm-ctl')

    .o-fm-grp
      label(for='new_pwd') 新密码：
      input(type='password', name='new_pwd', id='new_pwd', class='o-fm-ctl')

    .o-fm-grp
      label(for='c_new_pwd') 确认新密码：
      input(type='password', name='c_new_pwd', id='c_new_pwd', class='o-fm-ctl')

    .o-fm-grp
      input(type='submit', value='更新密码' class='o-btn o-btn-primary u-fir-span')
      span.u-bold-text.u-success-result(v-show='success') 密码修改成功
</template>

<script>
  var $ = require('jquery');
  var FV  = require('vue-form-validator');

  module.exports = {
    data: function() {
      return {
        success: false,
        rules: {
          old_pwd: 'required',
          new_pwd: 'required',
          c_new_pwd: { equalTo: '#new_pwd' }
        },

        messages: {
          old_pwd: '请输入旧密码',
          new_pwd: '请输入新密码',
          c_new_pwd: { equalTo: '新密码2次输入不一致' }
        },

        submitHandler: function(form) {
          var validator = this;
          var args = $(form).serializeObject();

          $.post(form.action, args, function(data) {
            if (data.error) {
              validator.success = false;
              validator.showErrors(data.errors);
            } else {
              validator.success = true;
            }
          }, 'json');
        }
      };
    },

    components: {
      'form-validator': FV
    }
  };
  </script>
