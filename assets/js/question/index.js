require('common/global');
require('common/del_question');
require('question/list.scss');

let $ = require('jquery');
import Vue from 'vue'
import FA  from 'mycomps/lib/components/fa_rating.vue'

$('.c-ques-list-item__head').each(function() {
  new Vue({
    el: this,
    components: {
      'fa-rating': FA
    }
  });
});
