// 修改用户基本信息
var $ = require('jquery');
var _ = require('lodash');
var x = require('common/popup_list');
var y = require('common/popup_tabs');
var z = require('common/global');
var w = require('common/jq_val_wrapper');

var css = require('profile/user_info.scss');

$(document).ready(function() {
  $('#university').popupList({ remoteUrl: '/universities' });
  $('#major').popupTabs(window.ms);

  // normal input value change
  function checkEditState() {
    handleDataChange($(this).val(), $(this).data('oriValue'), $(this));
  }

  // rich editor state change
  function checkRichEditState() {
    var newData = this.getContent();
    var oldData = this.textarea.getAttribute('data-ori-value');
    handleDataChange(newData, oldData, $('#' + this.textarea.name));
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
  $('textarea.js-rich-editor').each(function(idx, ele) {
    UE.getEditor(ele.name).addListener('contentChange', checkRichEditState);
  });

  // 保存按钮
  $('.js-save').click(function() {
    var parent  = $(this).parent();
    var field   = parent.siblings('textarea.js-change-field');
    var fname   = field.attr('name');
    var data    = {};

    if (field.hasClass('js-rich-editor')) {
      data[fname] = UE.getEditor(field.attr('name')).getContent()
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
    var field  = parent.siblings('textarea.js-change-field');

    field.val(field.attr('data-ori-value'));

    if (field.hasClass('js-rich-editor')) {
      UE.getEditor(field.attr('name')).setContent(field.attr('data-ori-value') || '')
    }

    parent.hide();
    field.prev('label.input-error').remove();
  });
});
