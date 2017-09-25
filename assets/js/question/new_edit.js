require('jquery');
require('common/global');
require('question/new_edit.scss');

import Vue from 'vue'
import IL  from 'mycomps/lib/components/input_labels.vue'
import FA  from 'mycomps/lib/components/fa_rating.vue'
import FV  from 'vue-form-validator'

// question创建修改表单验证
new Vue({
  el: '.c-ques-n-e',

  data: {
    rules: {
      title:    'required',
      tag:      'required',
      labels:   'required',
      content:  {
        required: true,
        ta_minlength: 20
      }
    },

    messages: {
      title:    '请给一个标题吧',
      tag:      '请指定问题所属分类',
      labels:   '请至少指定一个标签',
      content:  {
        required: '忘记填问题内容了',
        ta_minlength: "题目内容应至少包含 {0} 个字符"
      }
    }
  },

  components: {
    'form-validator': FV,
    'input-labels': IL,
    'fa-rating': FA
  }
});
