var $ = require('jquery');

$(function() {
  CKEDITOR.replace('content');

  $('.to-score').click(function() {
    $(this).hide();
    $('.score-comment').show();
  });
});
