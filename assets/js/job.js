var $ = require('jquery');

$('button.apply-job').click(function() {
  var me = $(this);

  $.post('/jobs/apply', {
    job_id: me.closest('tr').data('jobId')
  }, function(data) {
    alert(data.message);
  });
});
