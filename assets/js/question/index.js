var $ = require('jquery');
var y = require('common/global');
var Vue = require('vue');
var PopupOverlay = require('common/popup_overlay.vue');
var css = require('question/list.scss');

$('.js-del-question').each(function() {
  var delUrl = this.dataset.link;
  var poMount = new Vue({
    el: this.nextElementSibling,

    components: {
      'popup-overlay': PopupOverlay
    },

    methods: {
      onOk: function() {
        $.post(delUrl, function(data) {
          location.replace(data.location);
        });
      }
    }
  });

  $(this).click(function() {
    poMount.$refs.po.isShow = true;
  });
});
