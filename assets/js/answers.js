var $ = require('jquery');
var y = require('common/del_answer');
var z = require('common/serialize_object');
var p = require('common/jq_val_wrapper');
var w = require('common/global');

var Vue = require('vue');
var PO  = require('mycomps/lib/components/popup_overlay.vue');
var FA  = require('mycomps/lib/components/fa_rating.vue');

var css = require('answers.scss');

$(function() {
  // 提交解答验证
  $('.js-answer-ne-fm').each(function() {
    $(this).validate({
      rules: {
        content: {
          required: true,
          ta_minlength: 10
        }
      },

      messages: {
        content: {
          required: '解答不能为空',
          ta_minlength: $.validator.format("解答应至少包含 {0} 个字符")
        }
      },

      errorPlacement: function(error, element) {
        error.insertAfter($(':submit'));
      }
    });
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

  new Vue({
    el: '.c-detail-question__foot',
    components: {
      'fa-rating': FA
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
});
