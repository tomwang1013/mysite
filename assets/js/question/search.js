var y = require('common/global');
var css = require('question/list.scss');
var $ = require('jquery');

var Vue = require('vue');
var SS  = require('common/search_suggestion.vue');
var FA  = require('common/fa_rating.vue');

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
