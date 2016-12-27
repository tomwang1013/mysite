var $ = require('jquery');

$(function() {
  // 企业给解答评分
  $('.a-to-score, .a-re-score').click(function() {
    var a = $(this).closest('.answer');

    $('.overlay').show();
    $('.overlay-content').show();

    $('.set-score').attr('action',
                         '/question/' + a.data('qid') +
                           '/answer/' + a.data('aid') + '/update_score');
    $('#score').focus().val(a.data('score'));
    $('#comment').val(a.data('comment'));
    return false;
  });

  $('.set-score .cancel').click(function() {
    $('.overlay').hide();
    $('.overlay-content').hide();
  });

  $('.set-score').submit(function() {
    var form = $(this);

    $.post(form.attr('action'), form.serializeObject(), function(data) {
      location.reload();
    });

    return false;
  });

  // 学生删除解答
  $('.del-answer').click(function() {
    if (confirm('确定要删除此解答吗？')) {
      $.post($(this).data('link'), {
        job_id: $(this).data('jobId')
      }, function(data) {
        location.replace(data.location);
      });
    }
  });
});
