var $ = require('jquery');
var w = require('common/global');

var Vue = require('vue');
var PO  = require('mycomps/lib/components/popup_overlay.vue');

var css = require('answer/index.scss');

// 企业给解答评分
var poMount = new Vue({
  el: $('.o-overlay-mount').get(0),

  data: {
    score: 0,
    comment: '',
    updScoreUrl: ''
  },

  components: { 'popup-overlay': PO },

  methods: {
    onOk: function() {
      $.post(this.updScoreUrl,
             this.$data,
             function(data) {
               location.reload();
             });
    }
  }
});

$('.js-re-score, .js-to-score').click(function() {
  $('.o-overlay-mount').show();
  var a = $(this).closest('.js-list-answer');
  poMount.$refs.po.isShow = true;
  poMount.updScoreUrl = '/question/' + a.data('qid') + '/answer/' +
    a.data('aid') + '/update_score';
  poMount.score = a.data('score');
  poMount.comment = a.data('comment');
});

