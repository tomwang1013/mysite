var $ = require('jquery');

$('button.apply-job').click(function() {
  var me = $(this);

  $.post('/jobs/apply', {
    job_id: me.parent().data('jobId')
  }, function(data) {
    alert(data.message);
  });
});
