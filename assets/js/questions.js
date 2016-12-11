var $ = require('jquery');

$(function() {
  $('.del-question').click(function() {
    var me = $(this);

    if (window.confirm('确定要删除这个题目吗？')) {
      $.post(me.data('url'), { deleted: 1 }, function(data) {
        me.closest('.question').remove();
      }, 'json');
    }
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

  $('#labels').labelIt({
    initLabels: ['ruby', 'python']
  });
});
