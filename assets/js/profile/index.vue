<template>
<div class='u-flex'>
  <left-nav :page-name='pageName' :user-type='userInfo.type'/>
  <component class='c-uc-right-content' v-bind:is="pageName">
  </component>
</div>
</template>

<script>
  var Cookies = require('js-cookie');

  module.exports = {
    data: function() {
      return {
        userInfo: Cookies.getJSON('_ppinfo'),
        pageName: window.location.pathname.slice(9)
      };
    },

    components: {
      user_info: require('profile/user_info.vue'),
      jobs:      require('profile/jobs.vue'),
      message:   require('profile/message.vue'),
      account:   require('profile/account.vue'),
    }
  };
</script>

<style lang="sass">
.c-uc-right-content {
  flex: 6;
  padding: 15px 20px;
  border: 1px solid #ccc;
  border-left:none;
}
</style>
