let $   = require('jquery');
import Vue from 'vue'
import PO  from 'mycomps/lib/components/popup_overlay.vue'

$('.js-del-question').each(function() {
  let delUrl = this.dataset.link;
  let poMount = new Vue({
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
