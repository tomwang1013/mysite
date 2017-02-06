// 修改用户基本信息
var $ = require('jquery');
var _ = require('lodash');
var x = require('common/popup_list');
var y = require('common/popup_tabs');
var z = require('common/main_nav');

var css = require('profile/user_info.scss');

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
      field.siblings('.js-change-btns').show();
    } else {
      field.siblings('.js-change-btns').hide();
    }
  }

  // 触发修改按钮展示
  $('#url').keyup(checkEditState);
  $('#university, #major, select').change(checkEditState);
  Object.keys(CKEDITOR.instances).forEach(function(editorName) {
    CKEDITOR.instances[editorName].on('change', checkRichEditState);
  });

  // 保存按钮
  $('.js-save').click(function() {
    var parent  = $(this).parent();
    var field   = parent.siblings('.js-change-field');
    var fname   = field.attr('name');
    var data    = {};

    if (field.hasClass('js-rich-editor')) {
      data[fname] = CKEDITOR.instances[fname].getData()
    } else {
      data[fname] = field.val();
    }

    $.post('/profile/change_user_info', data, function(result) {
      if (result.error) {
        // save failed
        field.before("<label class='input-error'>" + result.errors[field.attr('id')] + "<label>");
        field.focus().val(data[fname]);
      } else {
        parent.hide();
        field.prev('label.input-error').remove();
        field.attr('data-ori-value', data[fname]).val(data[fname]);
      }
    });
  });

  // 取消按钮
  $('.js-cancel').click(function() {
    var parent = $(this).parent();
    var field  = parent.siblings('.js-change-field');
    var fname  = field.attr('name');

    field.val(field.attr('data-ori-value'));

    if (field.hasClass('js-rich-editor')) {
      CKEDITOR.instances[fname].setData(field.attr('data-ori-value'))
    }

    parent.hide();
    field.prev('label.input-error').remove();
  });
});
