let $ = require('jquery');
require('common/global');
require('job/show.scss');
import Vue from 'vue'
import PO  from 'mycomps/lib/components/popup_overlay.vue'

// apply job at job detail
$('.js-to-apply').click(function() {
  let me = $(this);

  $.post('/jobs/apply', {
    job_id: me.data('jobId')
  }, function(data) {
    if (!data.error) {
      me.parent().replaceWith(
        "<div class='u-bold-text'>" +
        "<span class='u-unknown-result'>已申请，审核中...</span>" +
        "</div>");
    } else {
      location = data.location || '/';
    }
  });
});


// 删除职位
let delJobBtn = $('.js-del-job');
let poMount = new Vue({
  el: delJobBtn.next().get(0),

  components: { 'popup-overlay': PO },

  methods: {
    onOk: function() {
      $.post(delJobBtn.data('link'), function(data) {
        location.replace(data.location);
      });
    }
  }
});

delJobBtn.click(function() {
  poMount.$refs.po.isShow = true;
});
