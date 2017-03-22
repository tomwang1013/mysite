<template lang='pug'>
  .u-flex
    ul.c-uc-left-nav.u-small-font.u-nav-list
      li
        a.c-uc-left-nav__item(href='/profile/user_info' class={'is-active': pos == 'user_info'}) 基本信息
      li
        if currentUser.type == 0
          a.c-uc-left-nav__item(href='/profile/jobs' class={'is-active': pos == 'jobs'}) 申请的职位
        else
          a.c-uc-left-nav__item(href='/profile/jobs' class={'is-active': pos == 'jobs'}) 发布的职位
      li
        a.c-uc-left-nav__item(href='/profile/message' class={'is-active': pos == 'message'}) 消息中心
      li
        a.c-uc-left-nav__item(href='/profile/account' class={'is-active': pos == 'account'}) 账号与密码
</template>

<script>
</script>

<style lang="sass"></style>
