/**
 * login for the whole site, e.g. nav bar
 */

var $ = require('jquery');

$(function() {
  $('.profile-index').on('mouseenter', function() {
    $('.profile-dropdown').fadeIn();
  });
});
