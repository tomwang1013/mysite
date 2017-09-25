<template lang='pug'>
div
  .c-signup-progress
    .c-signup-progress__step(
      v-for="(title, idx) in ['创建账号', '完善基本资料', '注册完毕']"
      v-bind:class="{'is-active': step == idx + 1}") {{title}}

  component(v-bind:is='currentView')
</template>

<script>
  let Cookies = require('js-cookie');
  import step1 from './signup_step1.vue'
  import stu_step2 from './signup_stu_step2.vue'
  import cmp_step2 from './signup_cmp_step2.vue'
  import step3 from './signup_step3.vue'

  export default {
    name: 'signup-view',

    data: function() {
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
        if (this.step !== 2) {
          return 'step' + this.step;
        } else {
          if (this.signupAccount.userType === 0) {
            return 'stu_step2';
          } else {
            return 'cmp_step2';
          }
        }
      }
    },

    components: {
      step1,
      stu_step2,
      cmp_step2,
      step3
    }
  };
</script>

<style lang='scss' src='user/signup.scss'></style>
