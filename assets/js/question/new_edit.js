var $ = require('jquery');
var x = require('common/jq_val_wrapper');
var y = require('jquery-bar-rating');
var z = require('common/input_labels');
var w = require('common/main_nav');

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
  $('.js-ques-n-e-fm').validate({
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
