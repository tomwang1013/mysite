var $ = require('jquery');
var _ = require('lodash');

$(document).ready(function() {
  $('#university').popupList({ remoteUrl: '/universities' });
  $('#major').popupTabs(window.ms);

  // normal input value change
  function checkEditState() {
    handleDataChange($(this).val(), $(this).data('oriValue'), $(this));
  }

  // rich editor state change
  function checkRichEditState(evt) {
    var newData = evt.editor.getData();
    var oldData = evt.editor.element.getAttribute('data-ori-value');
    handleDataChange(newData, oldData, $('#' + evt.editor.name));
  }

  function handleDataChange(newData, oldData, field) {
    if (newData != oldData) {
      field.siblings('.operations').show();
    } else {
      field.siblings('.operations').hide();
    }
  }

  $('#desc, #url').keyup(checkEditState);
  $('#university, #major, select').change(checkEditState);
  $('.rich-editor').each(function(idx, ele) {
    CKEDITOR.replace(ele.id).on('change', checkRichEditState);
  });

  $('.user-info .form-group button:first-of-type').click(function() {
    var parent  = $(this).parent();
    var field   = parent.siblings('.change-field');
    var fname   = field.attr('name');
    var data    = {};

    if (field.hasClass('rich-editor')) {
      data[fname] = CKEDITOR.instances[fname].getData()
    } else {
      data[fname] = field.val();
    }

    $.post('/profile/change_user_info', data, function() {
      parent.hide();
      field.attr('data-ori-value', data[fname]);
      field.val(data[fname]);
    });
  });

  $('.user-info .form-group button:last-of-type').click(function() {
    var parent = $(this).parent();
    var field  = parent.siblings('.change-field');
    var fname  = field.attr('name');

    field.val(field.attr('data-ori-value'));

    if (field.hasClass('rich-editor')) {
      CKEDITOR.instances[fname].setData(field.attr('data-ori-value'))
    }

    parent.hide();
  });

  /*
   * avatar upload
   * select through file dialog or drag & drop
   */
  // disable default image drag action
  $('img, .crop-edge').on('dragstart', false);
  $('form.cropDlg').submit(function(e) {
    $.post($(this).attr('action'), $(this).serializeObject(), function(data) {
      $('.current-avatar').attr('src', data.url + '?' + new Date().getTime());
      $('.cropDlg').hide();
      $('.overlay').hide();
    });

    return false;
  });

  function uploadAvatar(file) {
    if (!file) return;

    var formData = new FormData();

    formData.append('avatar', file);

    $.ajax({
      type:         'POST',
      url:          '/profile/change_avatar',
      data:         formData,
      processData:  false,
      contentType:  false,
      success:      function(data) {
        if (!data.error) {
          cropImageAndSave(data.url, data.size);
        }
      }
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

  function drawCropArea() {
    var edgeWidth = $('.left-edge').outerWidth();
    var cornerWidth = $('.tl-corner').outerWidth();

    $('input[name="x"]').val(cropArea.left);
    $('input[name="y"]').val(cropArea.top);
    $('input[name="width"]').val(cropArea.width);
    $('input[name="height"]').val(cropArea.height);

    $('.cropArea').css(cropArea);
    $('.crop-img').css({
      'margin-left': -cropArea.left,
      'margin-top':  -cropArea.top
    });

    $('.left-edge').css(_.omit(cropArea, 'width'));
    $('.top-edge').css(_.omit(cropArea, 'height'));
    $('.right-edge').css({
      left:   cropArea.left + cropArea.width - edgeWidth,
      top:    cropArea.top,
      height: cropArea.height
    });
    $('.bottom-edge').css({
      left:   cropArea.left,
      top:    cropArea.top + cropArea.height - edgeWidth,
      width:  cropArea.width,
    });
    $('.move-area').css({
      left:   cropArea.left + edgeWidth,
      top:    cropArea.top + edgeWidth,
      width:  cropArea.width - 2 * edgeWidth,
      height: cropArea.height - 2 * edgeWidth
    });
    //$('.corner').css({
      //width:  edgeWidth,
      //height: edgeWidth
    //});
    $('.tl-corner').css({
      left: cropArea.left,
      top:  cropArea.top,
    });
    $('.tm-corner').css({
      left: cropArea.left + (cropArea.width - cornerWidth) / 2,
      top:  cropArea.top,
    });
    $('.tr-corner').css({
      left: cropArea.left + cropArea.width - cornerWidth,
      top:  cropArea.top,
    });
    $('.lm-corner').css({
      left: cropArea.left,
      top:  cropArea.top + (cropArea.height - cornerWidth) / 2,
    });
    $('.rm-corner').css({
      left: cropArea.left + cropArea.width - cornerWidth,
      top:  cropArea.top + (cropArea.height - cornerWidth) / 2,
    });
    $('.bl-corner').css({
      left: cropArea.left,
      top:  cropArea.top + cropArea.height - cornerWidth,
    });
    $('.bm-corner').css({
      left: cropArea.left + (cropArea.width - cornerWidth) / 2,
      top:  cropArea.top + cropArea.height - cornerWidth,
    });
    $('.br-corner').css({
      left: cropArea.left + cropArea.width - cornerWidth,
      top:  cropArea.top + cropArea.height - cornerWidth,
    });
  }

  // handle mouse event to refresh crop area
  function handleMouse() {
    var target = null;
    var oriPos = { left: 0, top: 0 };

    $('.crop-edge').mousedown(function(e) {
      target = $(this);
      oriPos.left = e.pageX;
      oriPos.top = e.pageY;

      // keep the cursor shape during the crop process
      $('.crop-container').css('cursor', target.css('cursor'));
      $('.crop-edge').each(function() {
        $(this).data('defCursor', $(this).css('cursor'));
      });
      $('.crop-edge').css('cursor', target.css('cursor'));
    });

    $('.crop-container').mousemove(function(e) {
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

    $('.crop-container').on('mouseup mouseleave', function(e) {
      if (target) {
        $(this).css('cursor', 'default');

        // restore the cursor
        $('.crop-edge').each(function() {
          $(this).css('cursor', $(this).data('defCursor'));
        });
        target = null;
      }
    });
  }

  // adjust the crop area when user drag edge
  function adjustCropArea(target, offset) {
    var mindx, maxdx, mindy, maxdy;
    var lx, rx, th, bh;
    var dd, mindd, maxdd;
    var edgeWidth = $('.left-edge').outerWidth();

    lx = cropArea.left;
    rx = originSize.width - lx - cropArea.width;
    th = cropArea.top;
    bh = originSize.height - th - cropArea.height;

    if (target.is('.left-edge,.lm-corner')) {
      mindx = -Math.min(lx, th);
      maxdx = cropArea.width - 2 * edgeWidth;

      if (offset.dx < mindx) offset.dx = mindx;
      if (offset.dx > maxdx) offset.dx = maxdx;

      cropArea.left   += offset.dx;
      cropArea.top    += offset.dx;
      cropArea.width  -= offset.dx;
      cropArea.height -= offset.dx;
    } else if (target.is('.top-edge,.tm-corner')) {
      mindy = -Math.min(th, rx);
      maxdy = cropArea.height - 2 * edgeWidth;

      if (offset.dy < mindy) offset.dy = mindy;
      if (offset.dy > maxdy) offset.dy = maxdy;

      cropArea.top    += offset.dy;
      cropArea.width  -= offset.dy;
      cropArea.height -= offset.dy;
    } else if (target.is('.right-edge,.rm-corner')) {
      mindx = -(cropArea.width - 2 * edgeWidth);
      maxdx = Math.min(bh, rx);

      if (offset.dx < mindx) offset.dx = mindx;
      if (offset.dx > maxdx) offset.dx = maxdx;

      cropArea.width  += offset.dx;
      cropArea.height += offset.dx;
    } else if (target.is('.bottom-edge,.bm-corner')) {
      mindy = -(cropArea.height - 2 * edgeWidth);
      maxdy = Math.min(lx, bh);

      if (offset.dy < mindy) offset.dy = mindy;
      if (offset.dy > maxdy) offset.dy = maxdy;

      cropArea.left   -= offset.dy;
      cropArea.width  += offset.dy;
      cropArea.height += offset.dy;
    } else if (target.is('.tl-corner')) {
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
    } else if (target.is('.tr-corner')) {
      if (offset.dx * offset.dy > 0) return;

      dd    = (offset.dx > 0) ? Math.min(offset.dx, -offset.dy) : Math.max(offset.dx, -offset.dy);
      mindd = -(cropArea.width - 2 * edgeWidth)
      maxdd = Math.min(th, rx);

      if (dd < mindd) dd = mindd;
      if (dd > maxdd) dd = maxdd;

      cropArea.top    -= dd;
      cropArea.width  += dd;
      cropArea.height += dd;
    } else if (target.is('.br-corner')) {
      if (offset.dx * offset.dy < 0) return;

      dd    = (offset.dx > 0) ? Math.min(offset.dx, offset.dy) : Math.max(offset.dx, offset.dy);
      mindd = -(cropArea.width - 2 * edgeWidth)
      maxdd = Math.min(bh, rx);

      if (dd < mindd) dd = mindd;
      if (dd > maxdd) dd = maxdd;

      cropArea.width  += dd;
      cropArea.height += dd;
    } else if (target.is('.bl-corner')) {
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

  function cropImageAndSave(imgToCrop, size) {
    var docHeight = $(document).height();
    var docWeight = $(document).width();
    var cropDlgWidth = $('.cropDlg').width();
    var ow = size.width;
    var oh = size.height;

    originSize = size;
    initCropArea(ow, oh);

    $('.crop-container').css({ width: ow, height: oh });
    $('.origin-img').attr('src', imgToCrop);
    $('.crop-img').attr('src', imgToCrop);
    $('input[name="origin_img_path"]').val(imgToCrop);

    $('.overlay').show();
    $('.cropDlg').css({
      left: (docWeight - cropDlgWidth) / 2
    }).show();

    drawCropArea();
  }

  $('.close').click(function() {
    $('.overlay').hide();
    $('.cropDlg').hide();
  });

  // file dialog select upload
  $('#avatar').change(function() {
    uploadAvatar(this.files[0]);
  });

  handleMouse();
});
