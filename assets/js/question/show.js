var $ = require('jquery');

$(function() {
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
