require('common/global');
import Vue from 'vue'
import FA  from 'mycomps/lib/components/fa_rating.vue'
import FV  from 'vue-form-validator'

require('answer/new_edit.scss');

new Vue({
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
