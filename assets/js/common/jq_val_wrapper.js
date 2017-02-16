var $ = require('jquery');
var x = require('common/serialize_object');
var y = require('jquery-validation');

$(function() {
  // 初始化textarea富文本编辑器
  $('textarea.js-rich-editor').each(function(idx, ele) {
    UE.getEditor(ele.name);
  });
});

// ueditor textarea文本长度最小化验证
$.validator.addMethod('ta_minlength', function(value, element, minlen) {
  return this.optional(element) ||
    UE.getEditor(element.name).getContentLength(true) >= minlen;
}, "至少需要 {0} 个字符");

$.validator.setDefaults({
  // 发生错误时错误信息和对应input的class名称
  errorClass: 'u-input-error',

  // 要忽略的表单元素选择器
  ignore: '.ignore',

  // 错误信息的摆放
  errorPlacement: function(error, element) {
    error.insertAfter($("label[for='" + element.attr('name') + "']"));
  },

  // 验证通过后的表单submit事件处理函数
  submitHandler: function(form) {
    var validator = this;
    var args = $(form).serializeObject();

    // check ckeditor textarea of this form
    $(form).find('textarea.js-rich-editor').each(function(i, ele) {
      args[ele.name] = UE.getEditor(ele.name).getContent();
    });

    $.post(form.action, args, function(data) {
      if (data.error) {
        validator.showErrors(data.errors);
      } else {
        location = data.location;
      }
    }, 'json');
  }
});
