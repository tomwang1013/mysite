require('common/global');
require('common/del_answer');
require('common/del_question');
require('question/show.scss');

import Vue from 'vue'
import FA  from 'mycomps/lib/components/fa_rating.vue'

new Vue({
  el: '.c-detail-question__foot',
  components: {
    'fa-rating': FA
  }
});
