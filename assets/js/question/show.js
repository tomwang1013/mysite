require('common/global');
require('common/del_answer');
require('common/del_question');
require('question/show.scss');

var Vue = require('vue');
var FA  = require('mycomps/lib/components/fa_rating.vue');

new Vue({
  el: '.c-detail-question__foot',
  components: {
    'fa-rating': FA
  }
});
