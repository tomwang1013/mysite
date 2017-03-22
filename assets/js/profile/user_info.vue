<template lang='pug'>
div
  template(v-if='userType == 0')
    // 学生信息
    .o-fm-grp
      label(for='university') 学校名称：
      label.input-error(v-show="errors['university']") {{ errors['university'] }}
      popup-list(
        field-name='university'
        ref='university'
        v-bind:ori-field-val="oriValues['university']"
        v-bind:field-class="['o-fm-ctl']"
        init-items='constants.universities'
        v-on:change='onChange')
      change-btns(v-bind:is-show="btnStates['university']" v-on:save='onSave' v-on:cancel='onCancel' rel-field-name='university')

    .o-fm-grp
      label(for='major') 专业：
      label.input-error(v-show="errors['major']") {{ errors['major'] }}
      popup-tabs(
        field-name='major'
        ref='major'
        field-class='o-fm-ctl'
        v-on:change='onChange'
        v-bind:init-item="oriValues['major']"
        v-bind:init-lables='constants.majors.labels'
        v-bind:init-items='constants.majors.data')
      change-btns(v-bind:is-show="btnStates['major']" v-on:save='onSave' v-on:cancel='onCancel' rel-field-name='major')

    .o-fm-grp
      label(for='entryDate') 入学年份：
      label.input-error(v-show="errors['entryDate']") {{ errors['entryDate'] }}
      select(name='entryDate' id='entryDate' class='o-fm-ctl' v-on:change="onChange('entryDate')" v-model="values['entryDate']")
        option(v-for='ed in constants.entryDates') {{ ed }}
      change-btns(v-bind:is-show="btnStates['entryDate']" v-on:save='onSave' v-on:cancel='onCancel' rel-field-name='entryDate')

    .o-fm-grp
      label(for='careerPlan') 职业规划：
      label.input-error(v-show="errors['careerPlan']") {{ errors['careerPlan'] }}
      textarea(name='careerPlan' id='careerPlan' v-model="values['careerPlan']")
      change-btns(v-bind:is-show="btnStates['careerPlan']" v-on:save='onSave' v-on:cancel='onCancel' rel-field-name='careerPlan')

    .o-fm-grp
      label(for='zuopin') 课外作品：
      label.input-error(v-show="errors['zuopin']") {{ errors['zuopin'] }}
      textarea(name='zuopin' id='zuopin' v-model="values['zuopin']")
      change-btns(v-bind:is-show="btnStates['zuopin']" v-on:save='onSave' v-on:cancel='onCancel' rel-field-name='zuopin')
      .o-fm-ctl-hint.
        可以提供简单描述及相关的链接，让公司可以通过链接查看详细说明，如：<br/>
        大三下学期和几个同学一起尝试给电冰箱开发智能控制app，通过app可以查看和控制冰箱的基本状态，如温度，湿度等，
        相关的创作过程和成果在：http://github.com/xxxxx/xxx_app.git

  template(v-else)
    // 公司信息
    .o-fm-grp
      label(for='url') 公司主页：
      label.input-error(v-show="errors['url']") {{ errors['url'] }}
      input(type='url' name='url' id='url' class='o-fm-ctl' v-on:input="onChange('url')" v-model="values['url']")
      change-btns(v-bind:is-show="btnStates['url']" v-on:save='onSave' v-on:cancel='onCancel' rel-field-name='url')

    .o-fm-grp
      label(for='business') 所属行业：
      label.input-error(v-show="errors['business']") {{ errors['business'] }}
      select(name='business' id='business' class='o-fm-ctl' v-on:change="onChange('business')" v-model="values['business']")
        option(value='') 请选择行业
        option(v-for='b in constants.businesses')= b
      change-btns(v-bind:is-show="btnStates['business']" v-on:save='onSave' v-on:cancel='onCancel' rel-field-name='business')

    .o-fm-grp
      label(for='scale') 规模：
      label.input-error(v-show="errors['scale']") {{ errors['scale'] }}
      select(name='scale' id='scale' class='o-fm-ctl' v-on:change="onChange('scale')" v-model="values['scale']")
        option(value='') 请选择企业规模
        option(v-for='(s,i) in constants.scales' value=i)= s
      change-btns(v-bind:is-show="btnStates['scale']" v-on:save='onSave' v-on:cancel='onCancel' rel-field-name='scale')

    .o-fm-grp
      label(for='maturity' class='label label-input') 成熟度：
      label.input-error(v-show="errors['maturity']") {{ errors['maturity'] }}
      select(name='maturity' id='maturity' class='o-fm-ctl' v-on:change="onChange('maturity')" v-model="values['maturity']")
        option(value='') 请选择企业成熟度
        option(v-for='(m,i) in constants.maturities' value=i)= m
      change-btns(v-bind:is-show="btnStates['maturity']" v-on:save='onSave' v-on:cancel='onCancel' rel-field-name='maturity')

    .o-fm-grp
      label(for='desc' class='label label-input') 介绍：
      label.input-error(v-show="errors['desc']") {{ errors['desc'] }}
      textarea(name='desc' id='desc' v-model="values['desc']")
      change-btns(v-bind:is-show="btnStates['desc']" v-on:save='onSave' v-on:cancel='onCancel' rel-field-name='desc')
</template>

<script>
  var $ = require('jquery');
  var _ = require('lodash');

  module.exports = {
    name: 'profile-user-info',

    data: function() {
      return {
        btnStates: {},
        oriValues: {},
        values: {},
        constants: {},
        errors: {}
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
          this.oriValues[fieldName] = oriValue;
          this.values[fieldName] = value;
          this.btnStates[oriValue] = oriValue != value;
        } else {
          // other field
          var fieldName = oriValue;
          this.btnStates[fieldName] = this.oriValues[fieldName] != this.values[fieldName];
        }
      },

      onSave: function(relFieldName) {
        var me = this;
        var data = {};

        data[relFieldName] = this.values[relFieldName];

        $.post('/profile/change_user_info', data, function(result) {
          if (result.error) {
            me.errors[relFieldName] = result.errors[relFieldName];
            return;
          }

          me.btnStates[relFieldName] = false;
          me.errors[relFieldName] = null;

          var vm = me.$refs[relFieldName];

          if (vm) {
            vm.oriValue = vm.value;
          } else {
            me.oriValues[relFieldName] = me.values[relFieldName];
          }
        });
      },

      onCancel: function(relFieldName) {
        this.btnStates[relFieldName] = false;
        this.errors[relFieldName] = null;

        var editor = window.UE.getEditor(relFieldName);
        var vm = me.$refs[relFieldName];

        if (editor) {
          editor.setContent(oriValues[relFieldName] || '')
        } else if (vm) {
          vm.value = vm.oriValue;
        } else {
          me.values[relFieldName] = me.oriValues[relFieldName];
        }
      }
    },

    mounted: function() {
      var editors = document.getElementsByTagName('textarea');
      var me = this;

      for (var i = 0; i < editors.length; i++) {
        var editorName = editors[i].name;
        window.UE.getEditor(editorName).addListener('contentChange', function() {
          me.values[editorName] = this.getContent();
          me.onChange(editorName);
        });
      }
    },

    created: function() {
      var me = this;
      var constantsAjax;

      if (this.userType == 0) {
        constantsAjax = $.get('//api.51shixi.net/std_consts');
      } else {
        constantsAjax = $.get('//api.51shixi.net/cmp_consts');
      }

      var userAjax = $.get('//api.51shixi.net/nc/user_info');

      $.when(constantsAjax, userAjax).done(function(consts, user) {
        me.constants = consts;
        _.assign(me.oriValues, user);
        _.assign(me.values, user);
      }).fail(function(err) {
        // TODO
      });
    }
  };
</script>

<style lang="sass" src='profile/user_info.scss'></style>
