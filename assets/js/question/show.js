var $ = require('jquery');
var x = require('common/popup_overlay');
var y = require('common/del_answer');
var z = require('common/main_nav');

$(function() {
  // 公司删除问题
  $('.del-question').popupOverlay({
    okCallback: function(event) {
      var btn = event.data;

      $.post(btn.data('link'), function(data) {
        location.replace(data.location);
      });
    }
  });
});
