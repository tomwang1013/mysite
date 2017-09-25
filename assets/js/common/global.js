import $ from 'jquery'
import Vue from 'vue'
import MainNav from './main_nav.vue'
require('common/serialize_object');
import FV from 'vue-form-validator'

FV.addValidationMethod('ta_minlength', function(element, minlen) {
  return UE.getEditor(element.name).getContentLength(true) >= minlen;
});

FV.setDefaultProps({
  submitHandler: function(validator, form) {
    let args = $(form).serializeObject();

    $.post(form.action, args, function(data) {
      if (data.error) {
        validator.showErrors(data.errors);
      } else {
        window.location = data.location;
      }
    }, 'json');
  }
});

// 初始化textarea富文本编辑器
$('textarea.u-rich-editor').each(function(idx, ele) {
  UE.getEditor(ele.name);
});

new Vue({
  el: '.c-header',
  components: {
    'main-nav': MainNav
  }
});

// 由mongo时间格式2017-03-28T06:50:23.415Z得到本地时间格式
String.prototype.toLocalTime = function() {
  let dt = new Date(this);
  let y = dt.getFullYear();
  let M = dt.getMonth() + 1;
  let d = dt.getDate();
  let h = dt.getHours();
  let m = dt.getMinutes();
  let s = dt.getSeconds();

  let date = [y, M < 10 ? '0' + M : M, d < 10 ? '0' + d : d].join('-');
  let time = [h < 10 ? '0' + h : h, m < 10 ? '0' + m : m, s < 10 ? '0' + s : s].join(':');


  return [date, time].join(' ');
};
