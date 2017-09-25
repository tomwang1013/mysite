let $ = require('jquery');
require('common/global');

import Vue from 'vue'
import PO  from 'mycomps/lib/components/popup_overlay.vue'

require('answer/index.scss');

// 企业给解答评分
let poMount = new Vue({
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
  let a = $(this).closest('.js-list-answer');
  poMount.$refs.po.isShow = true;
  poMount.updScoreUrl = '/question/' + a.data('qid') + '/answer/' +
    a.data('aid') + '/update_score';
  poMount.score = a.data('score');
  poMount.comment = a.data('comment');
});

