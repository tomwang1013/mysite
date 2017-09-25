require('common/global');
require('question/list.scss');

import $   from 'jquery'
import Vue from 'vue'
import SS  from 'mycomps/lib/components/search_suggestion.vue'
import FA  from 'mycomps/lib/components/fa_rating.vue'

new Vue({
  el: '#company-name-field',
  components: {
    'search-sugg': SS
  }
});

$('.c-ques-list-item__head').each(function() {
  new Vue({
    el: this,
    components: {
      'fa-rating': FA
    }
  });
});
