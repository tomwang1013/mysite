<template lang='pug'>
  form-validator(method='post', action='/signup_step1', class='c-signup-step-fm', v-bind='$data')
    .o-fm-grp
      label(for='name') 用户名：
      input(type='text', name='name', id='name', class='o-fm-ctl', autofocus)

    .o-fm-grp
      label(for='email') Email：
      input(type='email', name='email', id='email', class='o-fm-ctl')

    .o-fm-grp
      label(for='password') 密码：
      input(type='password', name='password', id='password', class='o-fm-ctl')

    label 身份：
    .o-fm-grp
      input.o-hidden-radio(type='radio', id='user-type-student', name='userType', value=0, checked)
      label.o-fm-ctl.is-radio-label(for='user-type-student') 学生
      input.o-hidden-radio(type='radio', id='user-type-company', name='userType', value=1)
      label.o-fm-ctl.is-radio-label(for='user-type-company') 公司

    .o-fm-grp
      input(type='submit', value='下一步' class='o-btn o-btn-primary' style={width: '100%'})

  .c-signup-step-comments.round-border
    h2 在这里，你将：
    .c-signup-step-comment
      strong 更快找到实习机会：
      | 这里的职位是专门为理工科实习生准备的，更注重学生的基本素质及个人潜力，你可以直接根据个人专业和兴趣寻找合适的实习岗位
    .c-signup-step-comment
      strong 更好学习专业知识：
      | 每个实习岗位都有深入的在线测试，通过测试你能知道自己哪些地方有欠缺，哪些地方需要提高，从而为未来赢得这类岗位打下坚实基础
    .c-signup-step-comment
      strong 快速锁定优秀毕业生：
      | 作为企业，你可以根据职位要求及公司对人才的期望提前发布测试问题，通过对学生答题的考察，加上进一步的面试，可以高效准确地判断学生各方面的素质，从而快速锁定优秀毕业生
</template>

<script>
  var Vue = require('vue');
  var FV  = require('vue-form-validator');

  module.exports = {
    name: 'signup-step1',
    data: function() {
      return {
        rules: {
          name: {
            required: true,
            remote: '/signup/is_valid_name'
          },

          email: {
            required: true,
            remote: '/signup/is_valid_email'
          },

          password: {
            required: true
          }
        },

        messages: {
          name: {
            required: '用户名不能为空'
          },

          email: {
            required: 'email不能为空',
          },

          password: {
            required: '密码不能为空'
          }
        }
      }
    },
    components: {
      'form-validator': FV
    }
  };
</script>
