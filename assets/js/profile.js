var $ = require('jquery');

$('.profile-right :button').click(function() {
  var inp = $(this).prev();
  var hint = $(this).next();
  var readonly = inp.prop('readonly');

  if (readonly) { inp.removeClass('noneditable').prop('readonly', false).focus();
    // 点击修改
    $(this).val('保存');
  } else {
    // 点击保存
    $.post('./profile/change_user_info', {
      attrName: inp.attr('name'),
      value:    inp.val()
    }, function(data) {
      if (data.error) {
        hint.addClass('hint-error').text(data.message).show();
        inp.focus();
      } else {
        inp.addClass('noneditable').prop('readonly', true);
        hint.addClass('hint-ok').text('保存成功').fadeOut();
        $(this).val('修改');
      }
    });
  }
});
