var $ = require('jquery');
var x = require('common/jq_val_wrapper');
var y = require('common/popup_list');
var z = require('common/popup_tabs');
var w = require('common/global');

var css = require('user.scss');

$(document).ready(function() {
  // 大学选择
  $('#university').popupList({remoteUrl: '/universities' });

  // 专业选择
  $('#major').popupTabs(window.ms);

  // 用户注册第一步
  $('#signup-step1').validate({
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
  });

  // 用户注册第二步
  $('#signup-step2').validate({
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
        ta_minlength: 20
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
        ta_minlength: $.validator.format("公司介绍应至少包含 {0} 个字符")
      }
    }
  });

  // 登陆
  $('.js-login-fm').validate({
    rules: {
      email: 'required',
      password: 'required'
    },

    messages: {
      email: 'email不能为空',
      password: '密码不能为空'
    }
  });
});
