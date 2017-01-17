var $ = require('jquery');
var x = require('jquery-validation');
var y = require('jquery-bar-rating');

$(function() {
  $('#labels').labelIt({
    searchUrl:  '/qlabels/search',
    addUrl:     '/qlabels'
  });

  $('#level').barrating({
    theme: 'fontawesome-stars',
    showSelectedRating: false
  });

  // question创建修改表单验证
  $('form.q-new, form.q-edit').validate({
    rules: {
      title: 'required',
      tag: 'required',
      labels: 'required',
      content: 'required',
    },

    messages: {
      title: '请给一个标题吧',
      tag: '请指定问题所属分类',
      labels: '请至少指定一个标签',
      content: '忘记填问题内容了'
    }
  });
});
