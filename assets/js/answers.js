var $ = require('jquery');
var y = require('common/del_answer');
var w = require('common/global');

var Vue = require('vue');
var PO  = require('mycomps/lib/components/popup_overlay.vue');
var FA  = require('mycomps/lib/components/fa_rating.vue');
var FV  = require('vue-form-validator');

var css = require('answers.scss');

var validator = new Vue({
  el: '#main-content',

  data: {
    rules: {
      content: {
        required: true,
        ta_minlength: 10
      }
    },

    messages: {
      content: {
        required: '解答不能为空',
        ta_minlength: "解答应至少包含 {0} 个字符"
      }
    },

    errorPlacement: 'after_field'
  },

  components: {
    'form-validator': FV,
    'fa-rating': FA
  }
});

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
