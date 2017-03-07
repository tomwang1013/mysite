var y = require('common/global');
var Vue = require('vue');
var SearchSugg = require('common/search_suggestion.vue');
var css = require('question/list.scss');

new Vue({
  el: '#company-name-field',
  components: {
    'search-sugg': SearchSugg
  }
});
