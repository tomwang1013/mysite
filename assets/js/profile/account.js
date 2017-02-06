var $ = require('jquery');
var _ = require('lodash');
var x = require('common/jq_val_wrapper');
var y = require('common/serialize_object');
var z = require('common/main_nav');
var w = require('common/popup_overlay');

var css = require('profile/account.scss');

function submitAvaHander() {
  var cropDlg = $('.js-crop-dlg');

  cropDlg.on('submit', false);

  $.post(cropDlg.attr('action'), cropDlg.serializeObject(), function(data) {
    var newUrl = data.url + '?' + new Date().getTime();
    $('.js-cur-ava').attr('src', newUrl);
    $('.js-show-menu > img').attr('src', newUrl);
  });

  return false;
}

// 用户选择图片后开始上传
function uploadAvatar(file) {
  if (!file) return;

  var formData = new FormData();

  formData.append('avatar', file);

  $('.js-upload-btn > label').text('上传中，请稍等...');
  $('.js-upload-btn > input').prop('disabled', true);

  $.ajax({
    type:         'POST',
    url:          '/profile/change_avatar',
    data:         formData,
    processData:  false,
    contentType:  false,
    success:      function(data) {
      $('.js-upload-btn > label').text('上传头像');
      $('.js-upload-btn > input').prop('disabled', false);

      if (!data.error) {
        cropImageAndSave(data.url, data.size);
        $('<button type="button"/>').popupOverlay({
          okCallback: submitAvaHander
        }).trigger('click');
      }
    }
  });
}

// 展示裁减悬浮框
function cropImageAndSave(imgToCrop, size) {
  var ow = size.width;
  var oh = size.height;

  originSize = size;
  initCropArea(ow, oh);

  $('.js-ava-crop-area').css({ width: ow, height: oh });
  $('.js-origin-img').attr('src', imgToCrop);
  $('.js-ret-img').attr('src', imgToCrop);
  $('input[name="origin_img_path"]').val(imgToCrop);

  drawCropArea();
}

// 裁减区域重绘
function drawCropArea() {
  var edgeWidth = $('.js-left-edge').outerWidth();
  var cornerWidth = $('.js-tl-corner').outerWidth();

  $('input[name="x"]').val(cropArea.left);
  $('input[name="y"]').val(cropArea.top);
  $('input[name="width"]').val(cropArea.width);
  $('input[name="height"]').val(cropArea.height);

  $('.js-crop-area').css(cropArea);
  $('.js-ret-img').css({
    'margin-left': -cropArea.left,
    'margin-top':  -cropArea.top
  });

  $('.js-left-edge').css(_.omit(cropArea, 'width'));
  $('.js-top-edge').css(_.omit(cropArea, 'height'));
  $('.js-right-edge').css({
    left:   cropArea.left + cropArea.width - edgeWidth,
    top:    cropArea.top,
    height: cropArea.height
  });
  $('.js-bottom-edge').css({
    left:   cropArea.left,
    top:    cropArea.top + cropArea.height - edgeWidth,
    width:  cropArea.width,
  });
  $('.js-move-area').css({
    left:   cropArea.left + edgeWidth,
    top:    cropArea.top + edgeWidth,
    width:  cropArea.width - 2 * edgeWidth,
    height: cropArea.height - 2 * edgeWidth
  });
  $('.js-tl-corner').css({
    left: cropArea.left,
    top:  cropArea.top,
  });
  $('.js-tm-corner').css({
    left: cropArea.left + (cropArea.width - cornerWidth) / 2,
    top:  cropArea.top,
  });
  $('.js-tr-corner').css({
    left: cropArea.left + cropArea.width - cornerWidth,
    top:  cropArea.top,
  });
  $('.js-lm-corner').css({
    left: cropArea.left,
    top:  cropArea.top + (cropArea.height - cornerWidth) / 2,
  });
  $('.js-rm-corner').css({
    left: cropArea.left + cropArea.width - cornerWidth,
    top:  cropArea.top + (cropArea.height - cornerWidth) / 2,
  });
  $('.js-bl-corner').css({
    left: cropArea.left,
    top:  cropArea.top + cropArea.height - cornerWidth,
  });
  $('.js-bm-corner').css({
    left: cropArea.left + (cropArea.width - cornerWidth) / 2,
    top:  cropArea.top + cropArea.height - cornerWidth,
  });
  $('.js-br-corner').css({
    left: cropArea.left + cropArea.width - cornerWidth,
    top:  cropArea.top + cropArea.height - cornerWidth,
  });
}

// crop image and save or discard
var cropArea;
var originSize;

function initCropArea(ow, oh) {
  cropArea = { left: 0, top: 0, width: 0, height: 0 };

  if (ow <= oh) {
    cropArea.top = (oh - ow) / 2;
    cropArea.width = cropArea.height = ow;
  } else {
    cropArea.left = (ow - oh) / 2;
    cropArea.width = cropArea.height = oh;
  }
}

// handle mouse event to refresh crop area
function handleMouse() {
  var target = null;
  var oriPos = { left: 0, top: 0 };

  $('.js-crop-edge').mousedown(function(e) {
    target = $(this);
    oriPos.left = e.pageX;
    oriPos.top = e.pageY;

    // keep the cursor shape during the crop process
    $('.js-ava-crop-area').css('cursor', target.css('cursor'));
    $('.js-crop-edge').each(function() {
      $(this).data('defCursor', $(this).css('cursor'));
    });
    $('.js-crop-edge').css('cursor', target.css('cursor'));
  });

  $('.js-ava-crop-area').mousemove(function(e) {
    if (target) {
      var offset = {
        dx: e.pageX - oriPos.left,
        dy: e.pageY - oriPos.top
      };

      if (offset.dx || offset.dy) {
        adjustCropArea(target, offset);
        oriPos.left = e.pageX;
        oriPos.top  = e.pageY;
      }
    }
  });

  $('.js-ava-crop-area').on('mouseup mouseleave', function(e) {
    if (target) {
      $(this).css('cursor', 'default');

      // restore the cursor
      $('.js-crop-edge').each(function() {
        $(this).css('cursor', $(this).data('defCursor'));
      });
      target = null;
    }
  });
}

// adjust the crop area and redraw it when user drag edge
function adjustCropArea(target, offset) {
  var mindx, maxdx, mindy, maxdy;
  var lx, rx, th, bh;
  var dd, mindd, maxdd;
  var edgeWidth = $('.js-left-edge').outerWidth();

  lx = cropArea.left;
  rx = originSize.width - lx - cropArea.width;
  th = cropArea.top;
  bh = originSize.height - th - cropArea.height;

  if (target.is('.js-left-edge,.js-lm-corner')) {
    mindx = -Math.min(lx, th);
    maxdx = cropArea.width - 2 * edgeWidth;

    if (offset.dx < mindx) offset.dx = mindx;
    if (offset.dx > maxdx) offset.dx = maxdx;

    cropArea.left   += offset.dx;
    cropArea.top    += offset.dx;
    cropArea.width  -= offset.dx;
    cropArea.height -= offset.dx;
  } else if (target.is('.js-top-edge,.js-tm-corner')) {
    mindy = -Math.min(th, rx);
    maxdy = cropArea.height - 2 * edgeWidth;

    if (offset.dy < mindy) offset.dy = mindy;
    if (offset.dy > maxdy) offset.dy = maxdy;

    cropArea.top    += offset.dy;
    cropArea.width  -= offset.dy;
    cropArea.height -= offset.dy;
  } else if (target.is('.js-right-edge,.js-rm-corner')) {
    mindx = -(cropArea.width - 2 * edgeWidth);
    maxdx = Math.min(bh, rx);

    if (offset.dx < mindx) offset.dx = mindx;
    if (offset.dx > maxdx) offset.dx = maxdx;

    cropArea.width  += offset.dx;
    cropArea.height += offset.dx;
  } else if (target.is('.js-bottom-edge,.js-bm-corner')) {
    mindy = -(cropArea.height - 2 * edgeWidth);
    maxdy = Math.min(lx, bh);

    if (offset.dy < mindy) offset.dy = mindy;
    if (offset.dy > maxdy) offset.dy = maxdy;

    cropArea.left   -= offset.dy;
    cropArea.width  += offset.dy;
    cropArea.height += offset.dy;
  } else if (target.is('.js-tl-corner')) {
    if (offset.dx * offset.dy < 0) return;

    dd    = (offset.dx > 0) ? Math.min(offset.dx, offset.dy) : Math.max(offset.dx, offset.dy);
    mindd = -Math.min(lx, th);
    maxdd = cropArea.width - 2 * edgeWidth;

    if (dd < mindd) dd = mindd;
    if (dd > maxdd) dd = maxdd;

    cropArea.left   += dd;
    cropArea.top    += dd;
    cropArea.width  -= dd;
    cropArea.height -= dd;
  } else if (target.is('.js-tr-corner')) {
    if (offset.dx * offset.dy > 0) return;

    dd    = (offset.dx > 0) ? Math.min(offset.dx, -offset.dy) : Math.max(offset.dx, -offset.dy);
    mindd = -(cropArea.width - 2 * edgeWidth)
    maxdd = Math.min(th, rx);

    if (dd < mindd) dd = mindd;
    if (dd > maxdd) dd = maxdd;

    cropArea.top    -= dd;
    cropArea.width  += dd;
    cropArea.height += dd;
  } else if (target.is('.js-br-corner')) {
    if (offset.dx * offset.dy < 0) return;

    dd    = (offset.dx > 0) ? Math.min(offset.dx, offset.dy) : Math.max(offset.dx, offset.dy);
    mindd = -(cropArea.width - 2 * edgeWidth)
    maxdd = Math.min(bh, rx);

    if (dd < mindd) dd = mindd;
    if (dd > maxdd) dd = maxdd;

    cropArea.width  += dd;
    cropArea.height += dd;
  } else if (target.is('.js-bl-corner')) {
    if (offset.dx * offset.dy > 0) return;

    dd    = (offset.dx > 0) ? Math.min(offset.dx, -offset.dy) : Math.max(offset.dx, -offset.dy);
    mindd = -Math.min(lx, bh);
    maxdd = cropArea.width - 2 * edgeWidth;

    if (dd < mindd) dd = mindd;
    if (dd > maxdd) dd = maxdd;

    cropArea.left   += dd;
    cropArea.width  -= dd;
    cropArea.height -= dd;
  } else {
    mindx = -lx;
    maxdx = rx;
    mindy = -th;
    maxdy = bh;

    if (offset.dx < mindx) offset.dx = mindx;
    if (offset.dx > maxdx) offset.dx = maxdx;
    if (offset.dy < mindy) offset.dy = mindy;
    if (offset.dy > maxdy) offset.dy = maxdy;

    cropArea.left += offset.dx;
    cropArea.top  += offset.dy;
  }

  drawCropArea();
}

// fake button to trigger overlay dialog

$(document).ready(function() {
  /*
   * avatar upload
   * select through file dialog
   */

  // disable default image drag action
  $('img, .js-crop-edge').on('dragstart', false);

  // file dialog select upload
  $('#avatar').change(function() {
    uploadAvatar(this.files[0]);
  });

  handleMouse();

  /**
   * 更改账号与密码
   */
  $('.js-account-edit').validate({
    rules: {
      name: 'required',
      email: 'required'
    },

    messages: {
      name: '用户名不能为空',
      email: 'Email不能为空'
    },

    submitHandler: function(form) {
      var validator = this;
      var args = $(form).serializeObject();

      $.post(form.action, args, function(data) {
        if (data.error) {
          validator.showErrors(data.errors);
        } else {
          $(form).find('.js-result-hint').text('账号修改成功').show().fadeOut(3000);
        }
      }, 'json');
    }
  });

  $('.js-password-edit').validate({
    rules: {
      old_pwd: 'required',
      new_pwd: 'required',
      c_new_pwd: { equalTo: '#new_pwd' }
    },

    messages: {
      old_pwd: '请输入旧密码',
      new_pwd: '请输入新密码',
      c_new_pwd: { equalTo: '新密码2次输入不一致' }
    },

    submitHandler: function(form) {
      var validator = this;
      var args = $(form).serializeObject();

      $.post(form.action, args, function(data) {
        if (data.error) {
          validator.showErrors(data.errors);
        } else {
          $(form).find('.js-result-hint').text('密码修改成功').show().fadeOut(3000);
        }
      }, 'json');
    }
  });
});
