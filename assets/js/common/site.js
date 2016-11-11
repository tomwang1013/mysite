/**
 * login for the whole site, e.g. nav bar
 */

var $ = require('jquery');

$(function() {
  var dropdownTimer;

  $('.profile-index').on('mouseenter', function() {
    $('.profile-dropdown').fadeIn();
    dropdownTimer = setTimeout(function() {
      $('.profile-dropdown').fadeOut();
    }, 1000);
  });

  $('.profile-dropdown').on('mouseenter', function() {
    if (dropdownTimer) {
      clearTimeout(dropdownTimer);
      dropdownTimer = null;
    }
  });

  $('.profile-dropdown').on('mouseleave', function() {
    $(this).fadeOut();
  });
});
