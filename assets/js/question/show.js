var $ = require('jquery');

$(function() {
  // 学生删除解答
  $('.del-answer').popupOverlay({
    okCallback: function(me) {
      $.post(me.data('link'), {
        job_id: me.data('jobId')
      }, function(data) {
        location.replace(data.location);
      });
    }
  });

  // 公司删除问题
  $('.del-question').popupOverlay({
    okCallback: function(me) {
      $.post(me.data('link'), function(data) {
        location.replace(data.location);
      });
    }
  });
});
