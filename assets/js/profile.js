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

  $('.user-info textarea').keyup(checkEditState);
  $('#university, #major, #entryDate').change(checkEditState);

  $('.user-info .form-group button:first-of-type').click(function() {
  });

  $('.user-info .form-group button:last-of-type').click(function() {
  });
});
