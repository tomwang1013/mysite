var $ = require('jquery');
var y = require('common/del_answer');
var z = require('common/serialize_object');
var p = require('common/jq_val_wrapper');
var w = require('common/main_nav');
var x = require('common/popup_overlay');

var css = require('answers.scss');

$(function() {
  // 提交解答验证
  $('.js-new-answer-fm, .js-edit-answer-fm').each(function() {
    $(this).validate({
      rules: {
        content: {
          required: true,
          ta_minlength: 10
        }
      },

      messages: {
        content: {
          required: '解答不能为空',
          ta_minlength: $.validator.format("解答应至少包含 {0} 个字符")
        }
      },

      errorPlacement: function(error, element) {
        error.insertAfter($(':submit'));
      }
    });
  });

  // 企业给解答评分
  var updScoreUrl;
  $('.js-re-score, .js-to-score').popupOverlay({
    beforePopup: function() {
      var a = this.closest('.js-list-answer');
      updScoreUrl = '/question/' + a.data('qid') + '/answer/' + a.data('aid') + '/update_score'
    },

    okCallback: function() {
      $.post(updScoreUrl, $('#score, #comment').serializeObject(), function(data) {
        location.reload();
      });
    },

    afterPopup: function() {
      var a = this.closest('.js-list-answer');
      $('#score').focus().val(a.data('score'));
      $('#comment').val(a.data('comment'));
    }
  });
});
