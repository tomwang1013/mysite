var $ = require('jquery');
var x = require('common/jq_val_wrapper');
var y = require('jquery-bar-rating');
var w = require('common/main_nav');

var Vue = require('vue');
var InputLabels = require('common/input_labels.vue');

var css = require('question/new_edit.scss');

$(function() {
  new Vue({
    el: '#labels-wrapper',
    components: {
      'input-labels': InputLabels
    }
    //render: function(createElement) {
      //return createElement(InputLabels, {
        //props: {
          //inputId: 'labels',
          //searchUrl: '/qlabels/search',
          //addUrl: '/qlabels'
        //}
      //});
    //}
  });

  $('#level').barrating({
    theme: 'fontawesome-stars',
    showSelectedRating: false
  });

  // question创建修改表单验证
  $('.js-ques-n-e-fm').validate({
    rules: {
      title:    'required',
      tag:      'required',
      labels:   'required',
      content:  {
        required: true,
        ta_minlength: 20
      }
    },

    messages: {
      title:    '请给一个标题吧',
      tag:      '请指定问题所属分类',
      labels:   '请至少指定一个标签',
      content:  {
        required: '忘记填问题内容了',
        ta_minlength: $.validator.format("题目内容应至少包含 {0} 个字符")
      }
    }
  });
});
