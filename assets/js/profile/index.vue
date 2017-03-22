<template>
  <left-nav/>
  <component v-bind:is="rightContent">
  </component>
</template>

<script>
  var routes = {
    user_info: require('profile/user_info.vue'),
    account:   require('profile/account'),
    message:   require('profile/message'),
    jobs:      require('profile/jobs')
  };

  module.exports = {
    data: function() {
      return {
        rightContent: window.location.pathname.slice(9)
      };
    }
  };
</script>

<style lang="sass"></style>
