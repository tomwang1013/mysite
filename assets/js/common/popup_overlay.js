'use strict'

var $ = require('jquery');

/**
 * popup overlay when click it
 * options:
 *  beforePopup: some work before popup
 *  afterPopup:  some work after popup
 *  okCallback:  callback when click ok button
 */
$.fn.popupOverlay = function(options) {
  var me              = $(this);
  var overlayEmpty    = $('.overlay');
  var overlayContent  = $('.overlay-content');

  // get the corrent position of the popup dialog
  var vw        = $(window).width();
  var vh        = $(window).height();
  var dlgWidth  = overlayContent.outerWidth();
  var dlgHeight = overlayContent.outerHeight();

  overlayContent.css({
    top:  (vh - dlgHeight) / 2,
    left: (vw - dlgWidth) / 2
  });

  // popup overlay when click it
  me.click(function() {
    if (options.beforePopup) {
      options.beforePopup.call(me);
    }

    showOverlay();

    if (options.afterPopup) {
      options.afterPopup.call(me);
    }
  });

  // 点击对话框外面的浮层是关闭对话框及浮层
  overlayEmpty.click(function() {
    hideOverlay();
  });

  // 弹出浮层
  function showOverlay() {
    overlayEmpty.show();
    overlayContent.show();
  }

  // 关闭浮层
  function hideOverlay() {
    overlayEmpty.hide();
    overlayContent.hide();
  }

  // 取消
  $('.ol-cancel').click(function() {
    hideOverlay();
  });

  // 确定
  $('.ol-ok').click(options.okCallback);
}
