var $ = require('jquery');

$('.profile-right :button').click(function() {
  var inp = $(this).prev();
  var readonly = inp.prop('readonly');

  if (readonly) { inp.removeClass('noneditable').prop('readonly', false).focus();
    $(this).val('保存');
  } else {
    var param = {};
    param[inp.attr('name')] = inp.val();

    $('./profile/change_user_info', { attrName: inp.attr('name'), value: inp.val() }, function(data) {
      if (data.error) {
      } else {
      }
    });
  }
});
