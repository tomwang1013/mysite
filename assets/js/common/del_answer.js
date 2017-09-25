let $ = require('jquery');
import Vue from 'vue'
import PO  from 'mycomps/lib/components/popup_overlay.vue'

$('.js-del-answer').each(function() {
  let delUrl = this.dataset.link;
  let jobId  = this.dataset.jobId;

  let poMount = new Vue({
    el: this.nextElementSibling,

    data: {
      delUrl: delUrl,
      jobId:  jobId
    },

    components: { 'popup-overlay': PO },

    methods: {
      onOk: function() {
        $.post(this.delUrl, { job_id: this.jobId }, function(data) {
          location.replace(data.location);
        });
      }
    }
  });

  $(this).click(function() {
    poMount.$refs.po.isShow = true;
  });
});
