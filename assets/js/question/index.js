require('common/global');
require('common/del_question');
require('question/list.scss');

var $ = require('jquery');
var Vue = require('vue');
var FA  = require('common/fa_rating.vue');

$('.c-ques-list-item__head').each(function() {
  new Vue({
    el: this,
    components: {
      'fa-rating': FA
    }
  });
});
