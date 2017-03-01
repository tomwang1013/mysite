// 修改用户基本信息
var $ = require('jquery');
var _ = require('lodash');
var PopupList = require('common/popup_list.vue');
var Vue = require('vue');
var y = require('common/popup_tabs');
var z = require('common/global');
var w = require('common/jq_val_wrapper');

var css = require('profile/user_info.scss');

$(document).ready(function() {
  var uv = new Vue({
    el: '#university-field',

    components: {
      'popup-list': PopupList
    },

    methods:  {
      onChange: function(oriValue, value) {
        handleDataChange(oriValue, value, $(this.$refs.pl.$el));
      }
    }
  });

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
  $('#url').on('input', checkEditState);
  $('#major, select').change(checkEditState);
  $('textarea.js-rich-editor').each(function(idx, ele) {
    UE.getEditor(ele.name).addListener('contentChange', checkRichEditState);
  });

  // 保存按钮
  $('.js-save').click(function() {
    var parent  = $(this).parent();
    var field   = parent.prev();
    var fname   = field.attr('name');
    var data    = {};

    if (field.hasClass('js-rich-editor')) {
      data[fname] = UE.getEditor(field.attr('name')).getContent()
    } else if (field.hasClass('o-pl-wrapper')) {
      data[uv.$refs.pl.fieldName] = uv.$refs.pl.value;
    } else {
      data[fname] = field.val();
    }

    $.post('/profile/change_user_info', data, function(result) {
      if (result.error) {
        field.before("<label class='input-error'>" + result.errors[field.attr('id')] + "<label>");
        if (!field.hasClass('o-pl-wrapper')) {
          field.focus().val(data[fname]);
        }
      } else {
        parent.hide();
        field.prev('label.input-error').remove();

        if (field.hasClass('o-pl-wrapper')) {
          uv.$refs.pl.oriValue = uv.$refs.pl.value;
        } else {
          field.attr('data-ori-value', data[fname]).val(data[fname]);
        }
      }
    });
  });

  // 取消按钮
  $('.js-cancel').click(function() {
    var parent = $(this).parent();
    var field  = parent.prev();

    if (field.hasClass('js-rich-editor')) {
      UE.getEditor(field.attr('name')).setContent(field.attr('data-ori-value') || '')
    } else if (field.hasClass('o-pl-wrapper')) {
      uv.$refs.pl.value = uv.$refs.pl.oriValue;
    } else {
      field.val(field.attr('data-ori-value'));
    }

    parent.hide();
    field.prev('label.input-error').remove();
  });
});
