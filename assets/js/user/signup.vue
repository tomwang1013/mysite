<template lang='pug'>
div
  .c-signup-progress
    .c-signup-progress__step(
      v-for="(title, idx) in ['创建账号', '完善基本资料', '注册完毕']"
      v-bind:class="{'is-active': step == idx}") {{title}}

  component(v-bind:is='currentView')

</template>

<script>
  var Cookies = require('js-cookie');

  module.exports = {
    name: 'signup-view',

    data: {
      return {
        step: this.originStep,
        signupAccount: Cookies.getJSON('signupAccount')
      };
    },

    props: {
      originStep: {
        type: Number,
        default: 1
      }
    },

    computed: {
      currentView: function() {
        if (this.step != 2) {
          return 'step' + step;
        } else {
          if (this.signupAccount.userType == 0) {
            return 'stu_step2';
          } else {
            return 'cmp_step2';
          }
        }
      }
    },

    components: {
      step1: require('./signup_step1.vue');
      stu_step2: require('./signup_stu_step2.vue');
      cmp_step2: require('./signup_cmp_step2.vue');
      step3: require('./signup_step3.vue');
    }
  };
</script>
