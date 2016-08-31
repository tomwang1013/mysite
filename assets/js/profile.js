var $ = require('jquery');

$(document).ready(function() {
  $('#university').popupTabs(window.us);
  $('#major').popupTabs(window.ms);

  function checkEditState() {
    var me = $(this);
    if (me.val() != me.data('oriValue')) {
      me.nextAll().show();
    } else {
      me.nextAll().hide();
    }
  }

  $('.user-info textarea, #url').keyup(checkEditState);
  $('#university, #major, select').change(checkEditState);

  $('.user-info .form-group button:first-of-type').click(function() {
    var me    = $(this);
    var field = me.prev();
    var data  = {};

    data[field.attr('name')] = field.val();

    $.post('/profile/change_user_info', data, function() {
      me.hide();
      me.next().hide();
    });
  });

  $('.user-info .form-group button:last-of-type').click(function() {
    var field = $(this).siblings('input, textarea, select');
    field.val(field.data('oriValue'));
    $(this).hide();
    $(this).prev().hide();
  });
});
