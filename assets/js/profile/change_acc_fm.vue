<template lang='pug'>
  form-validator(method='post' action='/profile/change_account' class='c-uc-acc-chg' v-bind='validationInfo')
    .o-fm-grp
      label(for='name') 用户名：
      input(type='text', name='name', id='name', class='o-fm-ctl', v-model='userInfo.name')

    .o-fm-grp
      label(for='email') Email：
      input(type='email', name='email', id='email', class='o-fm-ctl', v-model='userInfo.email')

    .o-fm-grp
      label(for='phone') 电话：
      input(type='text', name='phone', id='phone', class='o-fm-ctl', v-model='userInfo.phone')

    .o-fm-grp
      input(type='submit', value='更新账号信息' class='o-btn o-btn-primary u-fir-span')
      span.u-bold-text.u-success-result(v-show='success') 账号修改成功
</template>

<script>
  let $ = require('jquery');
  import FV from 'vue-form-validator'

  export default {
    data: function() {
      return {
        success: false,

        validationInfo: {
          rules: {
            name: 'required',
            email: 'required'
          },

          messages: {
            name: '用户名不能为空',
            email: 'Email不能为空'
          },

          submitHandler: (function(validator, form) {
            let args = $(form).serializeObject();
            let me = this;

            $.post(form.action, args, function(data) {
              if (data.error) {
                me.success = false;
                validator.showErrors(data.errors);
              } else {
                me.success = true;
              }
            }, 'json');
          }).bind(this)
        },

        userInfo: this.user
      };
    },

    props: {
      user: {
        type: Object,
        required: true
      }
    },

    components: {
      'form-validator': FV
    }
  };
  </script>
