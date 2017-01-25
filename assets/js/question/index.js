var $ = require('jquery');
var x = require('common/popup_overlay');
var y = require('common/main_nav');

$(function() {
  $('.js-del-question').popupOverlay({
    okCallback: function(me) {
      $.post(me.data('link'), function(data) {
        location.replace(data.location);
      });
    }
  });
});
