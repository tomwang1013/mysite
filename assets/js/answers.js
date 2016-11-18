var $ = require('jquery');

$(function() {
  $('.to-score, .re-score').click(function() {
    $(this).hide();
    $('.score-comment').show();
    $('#score').focus().val($('#score').val());
    return false;
  });
});
