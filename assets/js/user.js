var $   = require('jquery');
var w   = require('common/global');

var Vue = require('vue');
var PL  = require('mycomps/lib/components/popup_list.vue');
var PT  = require('mycomps/lib/components/popup_tabs.vue');
var FV  = require('vue-form-validator');

var css = require('user.scss');

// 大学选择
if ($('#university-field').length) {
  var uv = new Vue({
    el: '#university-field',

    components: {
      'popup-list': PL
    }
  });
}

// 专业选择
if ($('.o-pt-mount').length) {
  var ptVm = new Vue({
    data: {
      initLables: window.ms.labels,
      initItems:  window.ms.data
    },
    el: '.o-pt-mount',
    components: {
      'popup-tabs': PT
    }
  });
}

// 用户注册第一步
new Vue({
  el: '.u-flex',

  data: {
    rules: {
      name: {
        required: true,
        remote: '/signup/is_valid_name'
      },

      email: {
        required: true,
        remote: '/signup/is_valid_email'
      },

      password: {
        required: true
      }
    },

    messages: {
      name: {
        required: '用户名不能为空'
      },

      email: {
        required: 'email不能为空',
      },

      password: {
        required: '密码不能为空'
      }
    }
  },

  components: {
    'form-validator': FV
  }
});

// 用户注册第二步
new Vue({
  el: '.u-flex',

  data: {
    rules: {
      // 学生
      university: 'required',
      major:      'required',
      careerPlan: {
        required: true,
        ta_minlength: 20
      },

      // 公司
      url: {
        required: true,
        url: true
      },
      business: 'required',
      scale:    'required',
      maturity: 'required',
      desc: {
        required: true,
        ta_minlength: 30
      }
    },

    messages: {
      // 学生
      university: '请选择学校',
      major:      '请选择专业',
      careerPlan: {
        required: '职业规划不能为空',
        ta_minlength: "职业规划应至少包含 {0} 个字符"
      },

      // 公司
      url: {
        required: '请指定公司主页',
        url: 'url格式错误'
      },
      business: '请选择所属行业',
      scale:    '请选择企业规模',
      maturity: '请选择企业成熟度',
      desc: {
        required: '公司介绍不能为空',
        ta_minlength: "公司介绍应至少包含 {0} 个字符"
      }
    }
  },

  components: {
    'form-validator': FV
  }
});

// 登陆
new Vue({
  el: '.c-login-box',

  data: {
    rules: {
      email: 'required',
      password: 'required'
    },

    messages: {
      email: 'email不能为空',
      password: '密码不能为空'
    }
  },

  components: {
    'form-validator': FV
  }
});
