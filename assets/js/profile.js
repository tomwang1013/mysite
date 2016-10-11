var $ = require('jquery');
var _ = require('lodash');

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

  /*
   * avatar upload
   * select through file dialog or drag & drop
   */
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
          uploadTarget.classList.remove('wantdrop');
          uploading = false;
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

    console.log('initial cropArea: ', cropArea);
  }

  function drawCropArea() {
    $('input[name="x"]').val(cropArea.left);
    $('input[name="y"]').val(cropArea.top);
    $('input[name="width"]').val(cropArea.width);
    $('input[name="height"]').val(cropArea.height);

    $('.cropArea').css(cropArea);
    $('.crop-img').css({
      'margin-left': -cropArea.left,
      'margin-top': -cropArea.top
    });

    $('.left-edge').css(_.omit(cropArea, 'width'));
    $('.top-edge').css(_.omit(cropArea, 'height'));
    $('.right-edge').css({
      left: cropArea.left + cropArea.width - 2,
      top:  cropArea.top,
      width: 2,
      height: cropArea.height
    });
    $('.bottom-edge').css({
      left: cropArea.left,
      top:  cropArea.top + cropArea.height - 2,
      width: cropArea.width,
      height: 2
    });
    $('.move-area').css({
      left: cropArea.left + 2,
      top:  cropArea.top + 2,
      width: cropArea.width - 4,
      height: cropArea.height - 4
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

      console.log('mousedown: ', target.attr('class'), oriPos);
    });

    $('.crop-edge').mousemove(function(e) {
      if (target) {
        var offset = {
          dx: e.pageX - oriPos.left,
          dy: e.pageY - oriPos.top
        };

        console.log('mousemove: ', target.attr('class'), offset);

        adjustCropArea(target, offset);
      }
    });

    $('.crop-edge').bind('mouseup mouseleave', function(e) {
      console.log('mouseup: ', target && target.attr('class'));
      target = null;
    });
  }

  // adjust the crop area when user drag edge
  function adjustCropArea(target, offset) {
    var mindx, maxdx, mindy, maxdy;

    console.log('before crop, cropArea: ', cropArea);

    if (target.is('.left-edge')) {
      mindx = -cropArea.left;
      maxdx = cropArea.width - 4;

      if (offset.dx < mindx) offset.dx = mindx;
      if (offset.dx > maxdx) offset.dx = maxdx;

      cropArea.left   += offset.dx;
      cropArea.width  -= offset.dx;
      cropArea.height -= offset.dx;
    } else if (target.is('.top-edge')) {
      mindy = -cropArea.top;
      maxdy = cropArea.height - 4;

      if (offset.dy < mindy) offset.dy = mindy;
      if (offset.dy > maxdy) offset.dy = maxdy;

      cropArea.top    += offset.dy;
      cropArea.width  -= offset.dy;
      cropArea.height -= offset.dy;
    } else if (target.is('.right-edge')) {
      mindx = -(cropArea.width - 4);
      maxdx = originSize.width - cropArea.left - cropArea.width;

      if (offset.dx < mindx) offset.dx = mindx;
      if (offset.dx > maxdx) offset.dx = maxdx;

      cropArea.top    -= offset.dx;
      cropArea.width  += offset.dx;
      cropArea.height += offset.dx;
    } else if (target.is('.bottom-edge')) {
      mindy = -(cropArea.height - 4);
      maxdy = originSize.height - cropArea.top - cropArea.height;

      if (offset.dy < mindy) offset.dy = mindy;
      if (offset.dy > maxdy) offset.dy = maxdy;

      cropArea.left   -= offset.dy;
      cropArea.width  += offset.dy;
      cropArea.height += offset.dy;
    } else {
      mindx = -cropArea.left;
      maxdx = originSize.width - cropArea.left - cropArea.width;
      mindy = -cropArea.top;
      maxdy = originSize.height - cropArea.top - cropArea.height;

      if (offset.dx < mindx) offset.dx = mindx;
      if (offset.dx > maxdx) offset.dx = maxdx;
      if (offset.dy < mindy) offset.dy = mindy;
      if (offset.dy > maxdy) offset.dy = maxdy;

      cropArea.left += offset.dx;
      cropArea.top  += offset.dy;
    }

    console.log('mindx: ', mindx, 'maxdx: ', maxdx, 'mindy: ', mindy, 'maxdy: ', maxdy,
                'dx: ', offset.dx, 'dy: ', offset.dy);
    console.log('after crop, cropArea: ', cropArea);

    drawCropArea();
  }

  function cropImageAndSave(imgToCrop, size) {
    var docHeight = $(document).height();
    var docWeight = $(document).width();
    var cropDlgWeight = $('.cropDlg').width();
    var ow = size.width;
    var oh = size.height;

    originSize = size;

    $('.crop-container').css({ width: ow, height: oh });
    $('.origin-img').attr('src', imgToCrop);
    $('.crop-img').attr('src', imgToCrop);
    $('input[name="origin_img_path"]').val(imgToCrop);

    initCropArea(ow, oh);
    drawCropArea();

    $('.overlay').show();
    $('.cropDlg').css({
      left: (docWeight - cropDlgWeight) / 2
    }).show();

    handleMouse();
  }

  $('.close').click(function() {
    $('.overlay').hide();
    $('.cropDlg').hide();
  });

  // file dialog select upload
  $('#avatar').change(function() {
    uploadAvatar(this.files[0]);
  });

  // drop & drag to upload image
  var uploadTarget = document.getElementsByClassName('avatar')[0]; 
  var uploading = false;

  uploadTarget.ondragenter = function(e) {
    if (uploading) return;

    var types = e.dataTransfer.types;
    if (types && ((types.contains && types.contains('files')) ||
                  (types.indexOf  && types.indexOf('files') !== -1))) {
      uploadTarget.classList.add('wantdrop');
      return false;
    }
  };
  uploadTarget.ondragover = function(e) {
    if (!uploading) {
      uploadTarget.classList.add('wantdrop');
      return false;
    }
  }
  uploadTarget.ondragleave = function(e) {
    uploadTarget.classList.remove('wantdrop');
  }
  uploadTarget.ondrop = function(e) {
    if (uploading) return false;

    var files = e.dataTransfer.files;
    if (files && files.length) {
      uploading = true;
      uploadAvatar(files[0]);
      return false;
    }
  }
});
