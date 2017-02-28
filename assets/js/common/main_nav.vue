<template lang='pug'>
  .c-header__inner.u-content
    a.u-larger-font.u-bold-text.c-header__inner__site-logo(href='/') 实习网

    template(v-if='userInfo')
      template(v-if='userInfo.type == 0')
        a.c-header__inner__link(href='/questions') 解决问题
        a.c-header__inner__link(href='/jobs') 找实习岗位
      a.c-header__inner__link(href='/jobs/new' v-else) 发布实习岗位
    template(v-else)
      a.c-header__inner__link(href='/questions') 解决问题
      a.c-header__inner__link(href='/jobs') 找实习岗位
      span.c-header__inner__sep
      a.c-header__inner__link(href='/jobs/new') 发布实习岗位

    span.c-header__inner__right
      template(v-if='userInfo')
        a.c-msg-notify(href='/profile/message')
          span(class='c-msg-notify__icon fa fa-bell' v-bind:class="{ 'has-msg': hasMsg }")
          span.c-msg-notify__tip.u-small-font.u-round-border {{msgHint}}
        span.c-profile-bar
          a.u-inline-block(href='/profile' v-on:mouseenter='popupProfileMenu')
            img.c-profile-bar__avatar(v-bind:src='userInfo.avatar')
            span.c-profile-bar__caret(class='fa fa-caret-down')
          ul.c-profile-bar__pop-menu.u-nav-list.u-small-font(v-show='showProfileMenu'
                                                             v-bind:mouseenter='keepProfileMenu'
                                                             v-bind:mouseleave='hideProfileMenu')
            li.c-profile-bar__pop-menu__item {{userInfo.name}}, 你好
            li.c-profile-bar__pop-menu__item
              a(href='/profile/user_info') 基本信息
            li.c-profile-bar__pop-menu__item
              a(href='/profile/jobs') 职位信息
            li.c-profile-bar__pop-menu__item
              a(href='/profile/account') 账号与密码
            li.c-profile-bar__pop-menu__item
              a(href='/logout') 退出
      template(v-else)
        a(href='/login' class='o-btn o-btn-normal u-fir-span') 登陆
        a(href='/signup' class='o-btn o-btn-primary') 注册
</template>

<script>
  /**
   * login for the whole site, e.g. nav bar
   */

  var $ = require('jquery');
  var Cookies = require('js-cookie');

  module.exports = {
    data: function() {
      return {
        userInfo: Cookies.getJSON('_ppinfo'),
        showProfileMenu: false,
        dropdownTimer: null,
        hasMsg: false
      };
    },

    computed: {
      msgHint: function() {
        if (this.hasMsg) {
          return '你有未读消息';
        } else {
          return '你暂时没有未读消息';
        }
      }
    },

    methods: {
      popupProfileMenu: function(evt) {
        var me = this;

        this.showProfileMenu = true;
        this.dropdownTimer = setTimeout(function() {
          me.showProfileMenu = false;
        }, 1000);
      },

      keepProfileMenu: function(evt) {
        if (this.dropdownTimer) {
          clearTimeout(this.dropdownTimer);
          this.dropdownTimer = null;
        }
      },

      hideProfileMenu: function(evt) {
        this.showProfileMenu = false;
      }
    },

    mounted: function() {
      var me = this;

      $.get('/profile/message_status', function(data) {
        me.hasMsg = data.has_msg;
      });
    }
  };
</script>

<style lang="sass" src='partials/modules/_main_nav.scss'></style>
