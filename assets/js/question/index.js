var $ = require('jquery');

$(function() {
  $('.del-question').popupOverlay({
    okCallback: function(me) {
      $.post(me.data('link'), function(data) {
        location.replace(data.location);
      });
    }
  });
});
