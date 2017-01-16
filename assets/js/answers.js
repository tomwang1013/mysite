var $ = require('jquery');
var x = require('common/popup_overlay');
var y = require('common/del_answer');
var z = require('common/serialize_object');
var w = require('common/main_nav');

$(function() {
  // 企业给解答评分
  var updScoreUrl;
  $('.a-to-score, .a-re-score').popupOverlay({
    beforePopup: function() {
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
});
