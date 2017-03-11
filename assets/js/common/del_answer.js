var $ = require('jquery');
var Vue = require('vue');
var PO  = require('mycomps/lib/components/popup_overlay.vue');

var delAnsBtn = $('.js-del-answer');
var poMount = new Vue({
  el: delAnsBtn.next().get(0),

  data: {
    delUrl: '',
    jobId: ''
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

delAnsBtn.click(function() {
  poMount.$refs.po.isShow = true;
  poMount.delUrl = delAnsBtn.data('link');
  poMount.jobId = delAnsBtn.data('jobId');
});
