var $   = require('jquery');
var Vue = require('vue');
var PO  = require('mycomps/lib/components/popup_overlay.vue');

$('.js-del-question').each(function() {
  var delUrl = this.dataset.link;
  var poMount = new Vue({
    el: this.nextElementSibling,

    components: { 'popup-overlay': PO },

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
