/**
 * login for the whole site, e.g. nav bar
 */

var $ = require('jquery');

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
