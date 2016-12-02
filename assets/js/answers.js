var $ = require('jquery');

$(function() {
  $('.to-score, .re-score').click(function() {
    $(this).hide();
    $('.score-comment').show();
    $('#score').focus().val($('#score').val());
    return false;
  });

  $('.del-answer').click(function() {
    $.post($(this).data('link'), {
      job_id: $(this).data('jobId')
    }, function(data) {
      location = data.location;
    });
  });
});
