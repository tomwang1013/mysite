var w   = require('common/global');
var Vue = require('vue');
var FA  = require('mycomps/lib/components/fa_rating.vue');
var FV  = require('vue-form-validator');

var css = require('answer/new_edit.scss');

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
