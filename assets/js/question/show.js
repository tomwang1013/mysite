var $ = require('jquery');

require('../common/del_answer');

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
