<template lang='pug'>
  form-validator(method='post', action='/signup_step2', class='c-signup-step-fm', v-bind='validationInfo' v-bind:setup-rules-on-mounted='false' ref='fv')
    // 学生信息
    .o-fm-grp
      label(for='university') 学校名称：
      popup-list(
        field-name='university'
        v-if='constants.universities.length > 0'
        v-bind:field-class="['o-fm-ctl']"
        v-bind:init-items='constants.universities')

    .o-fm-grp
      label(for='major') 专业：
      popup-tabs(
        field-name='major'
        field-class='o-fm-ctl'
        v-if='constants.majors.labels.length > 0'
        v-bind:init-lables='constants.majors.labels'
        v-bind:init-items='constants.majors.data')

    .o-fm-grp
      label(for='entryDate') 入学年份：
      select(name='entryDate', id='entryDate', class='o-fm-ctl')
        option(v-for='ed in constants.entryDates' v-bind:value='ed') {{ed}} 

    .o-fm-grp
      label(for='careerPlan') 职业规划：
      textarea(name='careerPlan', id='careerPlan', class='u-rich-editor')
      .o-fm-ctl-hint.
        职业规划有助于企业更加了解你，也是自己对未来职业的一个规划。简单来说就是你毕业之后想做什么，有什么目标，具体的行动计划等等

    .o-fm-grp
      label(for='zuopin') 课外作品：
      textarea(name='zuopin', id='zuopin', class='u-rich-editor')
      .o-fm-ctl-hint.
        课外作品是大学时期很重要的实践活动，也是很重要的加分项，建议去做并写上
        可以提供简单描述及相关的链接，让公司可以通过链接查看详细说明，如：<br/>
        大三下学期和几个同学一起尝试给电冰箱开发智能控制app，通过app可以查看和控制冰箱的基本状态，如温度，湿度等，相关的创作过程和成果在：http://github.com/xxxxx/xxx_app.git
    .o-fm-grp
      input(type='submit', value='保 存' class='o-btn o-btn-primary')
</template>

<script>
  import PL  from 'mycomps/lib/components/popup_list.vue'
  import PT  from 'mycomps/lib/components/popup_tabs.vue'
  import FV  from 'vue-form-validator'
  let Cookies = require('js-cookie');
  let $   = require('jquery');
  let _   = require('lodash');

  export default {
    name: 'signup-student-step2',

    data: function() {
      return {
        constants: {
          universities: [],
          majors: { labels: [], data: {} },
          entryDates: [],
        },
        validationInfo: {
          rules: {
            // 学生
            university: 'required',
            major:      'required',
            careerPlan: {
              required: true,
              ta_minlength: 20
            },
          },

          messages: {
            // 学生
            university: '请选择学校',
            major:      '请选择专业',
            careerPlan: {
              required: '职业规划不能为空',
              ta_minlength: "职业规划应至少包含 {0} 个字符"
            },
          },

          submitHandler: function(validator, form) {
            let args = $(form).serializeObject();

            $.post(form.action, _.merge(args, Cookies.getJSON('signupAccount')), function(data) {
              if (data.error) {
                validator.showErrors(data.errors);
              } else {
                window.location = data.location;
              }
            }, 'json');
          }
        }
      };
    },

    components: {
      'popup-list': PL,
      'popup-tabs': PT,
      'form-validator': FV
    },

    created: function() {
      let me = this;

      $.get('//api.51shixi.net/std_consts', function(data) {
        me.constants = data;
        me.$nextTick(function() {
          me.$refs.fv.setupRules()
        });
      })
    },

    mounted: function() {
      UE.getEditor('careerPlan');
      UE.getEditor('zuopin');
    }
  };
</script>
