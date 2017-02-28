var $ = require('jquery');
var _ = require('lodash');
var x = require('common/global');

var css = require('profile/message.scss');

$(document).ready(function() {
  // message handler
  $('.js-msg-link').click(function() {
    if ($(this).hasClass('is-read')) {
      return false;
    }

    var msgId = this.dataset.msgId;
    var me = this;

    $.post('/profile/message/set_read', { msg_id: msgId }, function() {
      location = me.href;
    }, 'json');

    return false;
  });

  $('.js-set-read').click(function() {
    var msgId = this.dataset.msgId;
    var me = $(this);

    $.post('/profile/message/set_read', { msg_id: msgId }, function() {
      me.parent().parent().find('.js-msg-link').addClass('is-read');
      me.replaceWith('已读');
    }, 'json');
  });
});
