var $ = require('jquery');

$(function() {
  $('.a-to-score, .a-re-score').click(function() {
    $('.overlay').show();
    $('.overlay-content').show();
    $('#score').focus().val($('#score').val());
    return false;
  });

  $('.set-score .cancel').click(function() {
    $('.overlay').hide();
    $('.overlay-content').hide();
  });

  $('.del-answer').click(function() {
    if (confirm('确定要删除此解答吗？')) {
      $.post($(this).data('link'), {
        job_id: $(this).data('jobId')
      }, function(data) {
        location.replace(data.location);
      });
    }
  });

  $('.set-score').submit(function() {
    var form = $(this);

    $.post(form.attr('action'), form.serializeObject(), function(data) {
      location.reload();
    });

    return false;
  });
});
