var $ = require('jquery');
var Vue = require('vue');
var MainNav = require('./main_nav.vue');
var x = require('common/serialize_object');
var FV  = require('vue-form-validator');

FV.addValidationMethod('ta_minlength', function(element, minlen) {
  return UE.getEditor(element.name).getContentLength(true) >= minlen;
});

FV.setDefaultProps({
  submitHandler: function(form) {
    var validator = this;
    var args = $(form).serializeObject();

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
  var dt = new Date(this);
  var y = dt.getFullYear();
  var M = dt.getMonth() + 1;
  var d = dt.getDate();
  var h = dt.getHours();
  var m = dt.getMinutes();
  var s = dt.getSeconds();

  var date = [y, M < 10 ? '0' + M : M, d < 10 ? '0' + d : d].join('-');
  var time = [h < 10 ? '0' + h : h, m < 10 ? '0' + m : m, s < 10 ? '0' + s : s].join(':');


  return [date, time].join(' ');
};
