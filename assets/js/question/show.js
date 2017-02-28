var $ = require('jquery');
var x = require('common/popup_overlay');
var y = require('common/del_answer');
var z = require('common/global');

var css = require('question/show.scss');

$(function() {
  // 公司删除问题
  $('.js-del-question').popupOverlay({
    okCallback: function(event) {
      var btn = event.data;

      $.post(btn.data('link'), function(data) {
        location.replace(data.location);
      });
    }
  });
});
