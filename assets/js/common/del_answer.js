var $ = require('jquery');
var y = require('common/popup_overlay');

$('.js-del-answer').popupOverlay({
  okCallback: function(event) {
    var btn = event.data;

    $.post(btn.data('link'), {
      job_id: btn.data('jobId')
    }, function(data) {
      location.replace(data.location);
    });
  }
});
