var $ = require('jquery');

$(function() {
  // 企业给解答评分
  var updScoreUrl;
  $('.a-to-score, .a-re-score').popupOverlay({
    beforePopup: function(me) {
      var a = this.closest('.answer');
      updScoreUrl = '/question/' + a.data('qid') + '/answer/' + a.data('aid') + '/update_score'
    },

    okCallback: function() {
      $.post(updScoreUrl, $('#score, #comment').serializeObject(), function(data) {
        location.reload();
      });
    },

    afterPopup: function() {
      var a = this.closest('.answer');
      $('#score').focus().val(a.data('score'));
      $('#comment').val(a.data('comment'));
    }
  });

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
});
