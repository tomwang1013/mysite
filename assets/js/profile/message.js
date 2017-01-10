var $ = require('jquery');
var _ = require('lodash');

$(document).ready(function() {
  // message handler
  $('.message .title a').click(function() {
    if ($(this).hasClass('read')) {
      return false;
    }

    var msgId = this.dataset.msgId;
    var me = this;

    $.post('/profile/message/set_read', { msg_id: msgId }, function() {
      location = me.href;
    }, 'json');

    return false;
  });

  $('.message .operation a').click(function() {
    var msgId = this.dataset.msgId;
    var me = $(this);

    $.post('/profile/message/set_read', { msg_id: msgId }, function() {
      me.parent().parent().find('.title a').addClass('read');
      me.replaceWith('已读');
    }, 'json');
  });
});
