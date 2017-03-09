var $ = require('jquery');
var y = require('common/global');
var Vue = require('vue');
var PopupOverlay = require('common/popup_overlay.vue');
var css = require('question/list.scss');

$(function() {
  $('.js-del-question').click(function() {
    var me = $(this);

    var poVm = new Vue({
      el: me.next(),

      render: function(h) {
        return h(PopupOverlay, {
          on: {
            ok: this.onOk
          }
        }, [
          h('span', { attrs: { slot: 'body' }}, '删除后无法恢复，确定要删除这个问题吗？')
        ]);
      },


      methods: {
        onOk: function() {
          $.post(me.data('link'), function(data) {
            location.replace(data.location);
          });
        }
      }

    });
  });
});
