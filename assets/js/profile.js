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
      target = this;
      offset.left = e.pageX;
      offset.top = e.pageY;
    });

    $('.crop-edge').mousemove(function(e) {
      if (target) {
        var offset = {
          dx: e.pageX - oriPos.left,
          dy: e.pageY - oriPos.top
        };

        adjustCropArea(offset);
      }
    });

    $('.crop-edge').mouseup(function(e) {
      target = null;
    });
  }

  // adjust the crop area when user drag edge
  function adjustCropArea(offset) {
    // TODO recalculate the crop area dimension
    cropArea.left += offset.dx;
    cropArea.top  += offset.dy;



    drawCropArea();
  }

  function cropImageAndSave(imgToCrop, size) {
    var docHeight = $(document).height();
    var docWeight = $(document).width();
    var cropDlgWeight = $('.cropDlg').width();
    var ow = size.width;
    var oh = size.height;

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
