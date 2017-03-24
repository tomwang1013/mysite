<template lang='pug'>
div
  template(v-if='userType == 0')
    // 学生信息
    .o-fm-grp
      label(for='university') 学校名称：
      popup-list(
        field-name='university'
        ori-field-val=user.university
        v-bind:field-class="['o-fm-ctl']"
        items-init-url='/universities'
        v-on:change='onChange')
      change-btns(v-bind:is-show="btnStates['university']" v-on:save='onSave' v-on:cancel='onCancel')

    .o-fm-grp
      label(for='major') 专业：
      popup-tabs(
        field-name='major'
        field-class='o-fm-ctl'
        v-on:change='onChange'
        init-item=user.major
        v-bind:init-lables='initLables'
        v-bind:init-items='initItems')
      change-btns(v-bind:is-show="btnStates['major']" v-on:save='onSave' v-on:cancel='onCancel')

    .o-fm-grp
      label(for='entryDate') 入学年份：
      select(name='entryDate' id='entryDate' class='o-fm-ctl' v-on:change="onChange('entryDate')" v-model="values['entryDate']")
        each ed in entryDates
          option(value=ed)= ed
      change-btns(v-bind:is-show="btnStates['entryDate']" v-on:save='onSave' v-on:cancel='onCancel')

    .o-fm-grp
      label(for='careerPlan') 职业规划：
      textarea(name='careerPlan' id='careerPlan' class='js-rich-editor' v-model="values['careerPlan']")
      change-btns(v-bind:is-show="btnStates['careerPlan']" v-on:save='onSave' v-on:cancel='onCancel')

    .o-fm-grp
      label(for='zuopin') 课外作品：
      textarea(name='zuopin' id='zuopin' class='js-rich-editor' v-model="values['zuopin']")
      change-btns(v-bind:is-show="btnStates['zuopin']")
      .o-fm-ctl-hint.
        可以提供简单描述及相关的链接，让公司可以通过链接查看详细说明，如：<br/>
        大三下学期和几个同学一起尝试给电冰箱开发智能控制app，通过app可以查看和控制冰箱的基本状态，如温度，湿度等，
        相关的创作过程和成果在：http://github.com/xxxxx/xxx_app.git

  template(v-else)
    // 公司信息
    .o-fm-grp
      label(for='url') 公司主页：
      input(type='url' name='url' id='url' class='o-fm-ctl js-change-field' v-model="values['url']")
      change-btns(v-bind:is-show="btnStates['url']" v-on:save='onSave' v-on:cancel='onCancel')

    .o-fm-grp
      label(for='business') 所属行业：
      select(name='business' id='business' class='o-fm-ctl js-change-field' v-model="values['business']")
        option(value='') 请选择行业
        each b in businesses
          option(value=b)= b
      change-btns(v-bind:is-show="btnStates['business']" v-on:save='onSave' v-on:cancel='onCancel')

    .o-fm-grp
      label(for='scale') 规模：
      select(name='scale' id='scale' class='o-fm-ctl js-change-field' v-model="values['scale']")
        option(value='') 请选择企业规模
        each s,i in scales
          option(value=i)= s
      change-btns(v-bind:is-show="btnStates['scale']" v-on:save='onSave' v-on:cancel='onCancel')

    .o-fm-grp
      label(for='maturity' class='label label-input') 成熟度：
      select(name='maturity' id='maturity' class='o-fm-ctl js-change-field' v-model="values['maturity']")
        option(value='') 请选择企业成熟度
        each m,i in maturities
          option(value=i)= m
      change-btns(v-bind:is-show="btnStates['maturity']" v-on:save='onSave' v-on:cancel='onCancel')

    .o-fm-grp
      label(for='desc' class='label label-input') 介绍：
      textarea(name='desc' id='desc' class='js-rich-editor js-change-field' v-model="values['desc']")
      change-btns(v-bind:is-show="btnStates['desc']" v-on:save='onSave' v-on:cancel='onCancel')
</template>

<script>
  module.exports = {
    name: 'profile-user-info',

    data: function() {
      return {
        user: {},
        btnStates: {},
        oriValues: {},
        values: {}
      };
    },

    components: {
      'popup-list':   require('mycomps/lib/components/popup_list.vue'),
      'popup-tabs':   require('mycomps/lib/components/popup_tabs.vue'),
      'change-btns':  require('./change_btns.vue')
    },

    props: {
      userType: {
        type: Number,
        required: true
      }
    },

    methods: {
      onChange: function(oriValue, value, fieldName) {
        if (value !== undefined) {
          // popup-list && popup-tabs
          this.btnStates[fieldName] = oriValue != value;
        } else {
          // normal field
          this.btnStates[oriValue] = oriValue != value;
        }
      },

      onRichEditorChange: function() {
      }

      onSave: function() {
      },

      onCancel: function() {
      }
    }
  };
</script>

<style lang="sass" src='partials/user_info.scss'></style>
