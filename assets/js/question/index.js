var $ = require('jquery');
//var x = require('common/popup_overlay');
var Vue = require('vue');
var PopupOverlay = require('common/popup_overlay.vue');
var y = require('common/global');

var css = require('question/list.scss');

$(function() {

  $('.js-del-question').click(function() {
    var me = this;
    var poVm = new Vue({
      el: me.next(),

      components: {
        'popup-overlay': PopupOverlay
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
