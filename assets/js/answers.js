var $ = require('jquery');

$(function() {
  $('.to-score').click(function() {
    $(this).hide();
    $('.score-comment').show();
    return false;
  });

  $('.re-score').click(function() {
    $(this).hide();
    $('.score-comment').show();
    $('#score').focus();
    return false;
  });
});
