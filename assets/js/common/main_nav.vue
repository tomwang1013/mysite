template(lang='pug')
  .c-header__inner.u-content
    a.u-larger-font.u-bold-text.c-header__inner__site-logo(href='/') 实习网

    template(v-if='userInfo')
      <template v-if='userInfo.type == 0'>
        a.c-header__inner__link(href='/questions') 解决问题
        a.c-header__inner__link(href='/jobs') 找实习岗位
      a.c-header__inner__link(href='/jobs/new' v-else) 发布实习岗位
    template(v-else)
      a.c-header__inner__link(href='/questions') 解决问题
      a.c-header__inner__link(href='/jobs') 找实习岗位
      span.c-header__inner__sep
      a.c-header__inner__link(href='/jobs/new') 发布实习岗位

    span.c-header__inner__right
      if cu
        a.c-msg-notify.js-msg-notify(href='/profile/message')
          span(class='c-msg-notify__icon fa fa-bell')
          span.c-msg-notify__tip.u-small-font.u-round-border.js-msg-tip 你有未读消息
        span.c-profile-bar
          a.u-inline-block.js-show-menu(href='/profile')
            img.c-profile-bar__avatar(src=cu.avatar)
            span.c-profile-bar__caret(class='fa fa-caret-down')
          ul.c-profile-bar__pop-menu.u-nav-list.u-small-font.js-profile-dropdown
            li.c-profile-bar__pop-menu__item #{cu.name}, 你好
            li.c-profile-bar__pop-menu__item
              a(href='/profile/user_info') 基本信息
            li.c-profile-bar__pop-menu__item
              a(href='/profile/jobs') 职位信息
            li.c-profile-bar__pop-menu__item
              a(href='/profile/account') 账号与密码
            li.c-profile-bar__pop-menu__item
              a(href='/logout') 退出
      else
        a(href='/login' class='o-btn o-btn-normal u-fir-span') 登陆
        a(href='/signup' class='o-btn o-btn-primary') 注册

<script>
  /**
   * login for the whole site, e.g. nav bar
   */

  var $ = require('jquery');
  var Cookies = require('js-cookie');

  module.exports = {
    data: function() {
      return {
        userInfo: Cookies.getJSON('_ppinfo')
      }
    }
  };

  $(function() {
    // header
    var dropdownTimer;

    $('.js-show-menu').on('mouseenter', function() {
      $('.js-profile-dropdown').fadeIn();
      dropdownTimer = setTimeout(function() {
        $('.js-profile-dropdown').fadeOut();
      }, 1000);
    });

    $('.js-profile-dropdown').on('mouseenter', function() {
      if (dropdownTimer) {
        clearTimeout(dropdownTimer);
        dropdownTimer = null;
      }
    });

    $('.js-profile-dropdown').on('mouseleave', function() {
      $(this).fadeOut();
    });

    // check if has unread message
    $.get('/profile/message_status', function(data) {
      if (data.has_msg) {
        $('.js-msg-notify').addClass('has-msg');
        $('.js-msg-tip').text('你有未读消息');
      } else {
        $('.js-msg-notify').removeClass('has-msg');
        $('.js-msg-tip').text('你暂时没有未读消息');
      }
    });
  });
</script>

<style lang="sass" src='partials/modules/_main_nav.scss'></style>
