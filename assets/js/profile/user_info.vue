<template lang='pug'>
  template(v-if='userType == 0')
    // 学生信息
    .o-fm-grp
      label(for='university') 学校名称：
      popup-list(
        field-name='university'
        ori-field-val=user.university-field
        v-bind:field-class="['o-fm-ctl']"
        items-init-url='/universities'
        v-on:change='onChange'
        ref='pl')
      change-btns(v-bind:is-show="")

    .o-fm-grp
      label(for='major') 专业：
      popup-tabs(
        field-name='major'
        field-class='o-fm-ctl'
        ref='pt'
        v-on:change='onChange'
        init-item=user.major
        v-bind:init-lables='initLables'
        v-bind:init-items='initItems')
      +buttons

    .o-fm-grp
      label(for='entryDate') 入学年份：
      select(name='entryDate' id='entryDate' class='o-fm-ctl' data-ori-value=user.entryDate value=user.entryDate)
        each ed in entryDates
          option(value=ed, selected=ed == user.entryDate)= ed
      +buttons

    .o-fm-grp
      label(for='careerPlan') 职业规划：
      textarea(name='careerPlan' id='careerPlan' class='js-rich-editor' data-ori-value=user.careerPlan)= user.careerPlan
      +buttons

    .o-fm-grp
      label(for='zuopin') 课外作品：
      textarea(name='zuopin' id='zuopin' class='js-rich-editor' data-ori-value=user.zuopin)= user.zuopin
      +buttons
      .o-fm-ctl-hint.
        可以提供简单描述及相关的链接，让公司可以通过链接查看详细说明，如：<br/>
        大三下学期和几个同学一起尝试给电冰箱开发智能控制app，通过app可以查看和控制冰箱的基本状态，如温度，湿度等，
        相关的创作过程和成果在：http://github.com/xxxxx/xxx_app.git
  template(v-else)
    // 公司信息
    .o-fm-grp
      label(for='url') 公司主页：
      input(type='url' name='url' id='url' class='o-fm-ctl js-change-field' data-ori-value=user.url value=user.url)
      +buttons

    .o-fm-grp
      label(for='business') 所属行业：
      select(name='business' id='business' class='o-fm-ctl js-change-field' data-ori-value=user.business value=user.business)
        option(value='') 请选择行业
        each b in businesses
          option(value=b selected=b == user.business)= b
      +buttons

    .o-fm-grp
      label(for='scale') 规模：
      select(name='scale' id='scale' class='o-fm-ctl js-change-field' data-ori-value=user.scale value=user.scale)
        option(value='') 请选择企业规模
        each s,i in scales
          option(value=i selected=i == user.scale)= s
      +buttons

    .o-fm-grp
      label(for='maturity' class='label label-input') 成熟度：
      select(name='maturity' id='maturity' class='o-fm-ctl js-change-field' data-ori-value=user.maturity value=user.maturity)
        option(value='') 请选择企业成熟度
        each m,i in maturities
          option(value=i selected=i == user.maturity)= m
      +buttons

    .o-fm-grp
      label(for='desc' class='label label-input') 介绍：
      textarea(name='desc' id='desc' class='js-rich-editor js-change-field' data-ori-value=user.desc)= user.desc
      +buttons
</template>

<script>
  module.exports = {
    name: 'profile-user-info',

    data: function() {
      return {
        user: {}
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
      onChange: function(oriValue, value) {
      }
    }
  };
</script>

<style lang="sass" src='partials/user_info.scss'></style>
