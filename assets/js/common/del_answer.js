var $   = require('jquery');
var Vue = require('vue');
var PO  = require('mycomps/lib/components/popup_overlay.vue');

$('.js-del-answer').each(function() {
  var delUrl = this.dataset.link;
  var jobId  = this.dataset.jobId;

  var poMount = new Vue({
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
